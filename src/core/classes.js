/* global define */
define(['./deps', './functions', './Library', './mergeInto', './objects', './__'], function(__deps, __functions, __Library, __mergeInto, __objects, __tmlib){
	var __Array = __deps.Array;
	var __globals = __deps.globals;
	var __jQuery = __deps.jQuery;
	var __Object = __deps.Object;

	/*
	Library: classes
	Libary for creating and working with classes.
	*/
	var __classes = new __Library({
		/*=====
		==configuration
		=====*/
		'config': {
			//--using autoapply makes for a nicer interface, but also has a performance penalty
			'autoApplyForFunctionInheritance': true
			,'overriddenParentKey': '__base'
		}
		,'creationPlugins': {
			/*
			Function: addParentAccessToMethods

			Adds ability to call 'this.base(arguments)' from child class methods to access parent class methods of same name
			*/
			'addParentAccessToMethods': function(_options){
				var _parent = _options.parent;
				var _prototype = _options.prototype;
				_options = _options.options;
				var _properties =
					(typeof _options.properties == 'object')
					? __objects.merge(_options.properties)
					: {}
				;
				//--add init method to properties if it exists
				if(typeof _options.init != 'undefined'){
					_properties.init = _options.init;
				}
				//--duck punch overridden methods to have access to parent class.  This has a noticable performance penalty, so if you need increased performance, call/apply with the prototype of the parent class directly
				for(var _name in _properties){
					if(
						//--only override if function is in both parent and child classes
						typeof _prototype[_name] == 'function'
						&& typeof _parent.prototype[_name] == 'function'
						//--only override if function actually calls the parent
						&& __functions.contains(_prototype[_name], '\\b' + this.config.overriddenParentKey + '(\\(|\\.apply|\\.call)\\b')
					){
						_prototype[_name] = __functions.duckPunch(
							_parent.prototype[_name]
							,_prototype[_name]
							,{
								autoApply: this.config.autoApplyForFunctionInheritance
								,key: this.config.overriddenParentKey
								,name: _name
								,type: 'this'
							}
						);
					}
				}
			}
		}

		/*=====
		==Library functions
		=====*/
		/*
		Function: create
		Create a class.  Provides an abstraction to creating classes directly by creating functions and manipulating their prototypes.  Will become much more capable, though ideally this'll be designed to be minimal but extensible to support other functionality.  Eventually all non-library classes will be migrated to be created by this function.  Meant to replace __.class.define, though it may take some bits from it before it gets removed.

		Parameters:
			_options(map):
				init(Function|null): Function to run as constructor.  null prevents parent constructor from being run
				mixins(Array): Collection of class definitions to mix in properties of to class.  Mixed in before class properties, so that class properties will override mixin properties.
				name(String): A string name for the class.  Currently used only to assign to the window namespace, though will support any namespace and will use this for class meta data later.
				parent(Object|String): Object to extend.  If none is passed, will extend a base object or the built in object.
				preMixins(Array): Collection of class definitions to mix in properties of to class.  Mixed in before classes properties and before regular mixins.  Here primarily to match postMixins naming convention.
				postMixins(Array): Collection of class definitions to mix in properties of to class.  Mixed in after all other property definitions, and thus will override them.
				properties(map): Properties to add to object's prototype.  Currently added directly, but will eventually support per property configuration by passing a map.
				statics(map): Properties to add directly to class, to be called statically.

		Return:
			Function object, the constructor of the class, but representing the class itself.
		*/
		,'create': function(_options){
			if(typeof _options == 'undefined'){
				_options = {};
			}

			//--create base prototype inheriting from parent
			var _parent;
			switch(typeof _options.parent){
				case 'string':
					//-! should accomodate namespaces
					_parent = __globals[_options.parent];
				break;
				case 'function':
				case 'object':
					_parent = _options.parent;
				break;
				default:
					if(typeof __tmlib.core.BaseClass != 'undefined'){
						_parent = __tmlib.core.BaseClass;
					}else{
						_parent = __Object;
					}
				break;
			}

			//--create class/constructor
			var _class = this.createConstructor(_parent);

			//--create prototype from parent
			var _prototype = this.createPrototype(_parent);

			//--merge statics into class
			//---must explicitely merge in parent statics, since this is a new 'class'
			__mergeInto(_class, _parent);
			//---now merge with overwrite the passed in statics
			if(typeof _options.statics == 'object'){
				_class = __mergeInto(_class, _options.statics);
			}

			//--add properties to object
			this.mixIn(_options, _prototype, _class);
			if(typeof _options.init == 'function'){
				__objects.addProperty(_prototype, 'init', _options.init);
			}

			//--perform plugin functionality
			for(var _key in this.creationPlugins){
				if(this.creationPlugins.hasOwnProperty(_key)){
					this.creationPlugins[_key].call(this, {
						'class': _class
						,'parent': _parent
						,'prototype': _prototype
						,'options': _options
					});
				}
			}

			//--set class prototype
			_class.prototype = _prototype;

			//--replace constructor so it is as it should be
			_class.prototype.constructor = _class;

			//--set appropriate object name if provided
			if(_options.name){
				//-! should support namespaces
				__globals[_options.name] = _class;
			}
			return _class;
		}

		/*
		Function: createConstructor
		Creates default constructor function for class.  Done as separate function so that it can be overridable.
		Parameters:
			_parent(Class): 'class' (constructor) of parent class
		Return:
			Function to act as constructor of class
		*/
		,'createConstructor': function(_parent){
			return function _class(){
				//--don't run if creating prototype via this.createPrototype
				if(!__classes.__isCreatingPrototype){
					//--call defined constructor or parent constructor
					switch(typeof this.init){
						//--call class's init method, if it exists
						case 'function':
							this.init.apply(this, arguments);
						break;
						//--call parent's constructor (useful for non-tmlib classes)
						case 'undefined':
							_parent.apply(this, arguments);
						break;
						//--all other possibilities cause nothing to happen
					}
				}
			};
		}

		/*
		Function: createPrototype
		Create prototype of class by creating an instance.  Set __isCreatingPrototype to ensure the constructors of all functions created through Classes.create will not run

		Parameters:
			Class(Function): class to create prototype for

		Return:
			Object to serve as a prototype for another object that will properly inherit from the given class object.
		*/
		,'createPrototype': function(_Class){
			//--ensure parent constructor not run
			this.__isCreatingPrototype = true;
			//--create prototype with 'new' keyword so that classes using this prototype will be seen as instances of the class
			var _prototype = new _Class();
			//--ensure constructor will be run on future creations
			this.__isCreatingPrototype = false;

			return _prototype;
		}

		/*
		Function: mixIn
		Parameters:
			mixin(Array|Map): If an array of class definitions, run mixIn on each definition.  If a definition, mix this definition in to object/parent.
			object(Object): object to mix properties into
			parent(Function): function to mix statics into
		*/
		,'mixIn': function(_mixin, _object, _parent){
			var _i;
			var _key;
			var _mixinsLength;
			if(typeof _mixin == 'object'){
				//--if _mixin is an array, mix in all objects in array
				if(_mixin instanceof __Array){
					for(
						_i = 0, _mixinsLength = _mixin.length
						; _i < _mixinsLength
						; ++_i
					){
						this.mixIn(_mixin[_i], _object, _parent);
					}
				}else{
					//--mix in pre mixins
					if(typeof _mixin.preMixins == 'object'){
						this.mixIn(_mixin.preMixins, _object, _parent);
					}
					//--mix in mixins
					if(typeof _mixin.mixins == 'object'){
						this.mixIn(_mixin.mixins, _object, _parent);
					}
					//--mix in statics
					if(typeof _mixin.statics == 'object' && typeof _parent == 'function'){
						for(_key in _mixin.statics){
							if(_mixin.statics.hasOwnProperty(_key)){
								_parent[_key] = _mixin.statics[_key];
							}
						}
					}
					//--mix in properties
					if(typeof _mixin.properties == 'object'){
						for(_key in _mixin.properties){
							if(_mixin.properties.hasOwnProperty(_key)){
								_object[_key] = _mixin.properties[_key];
							}
						}
					}
					//--mix in postmixins
					if(typeof _mixin.postMixins == 'object'){
						this.mixIn(_mixin.postMixins, _object, _parent);
					}
				}
			}
		}

		/*
		Function: pluginize
		Converts any class/object into a function to be used by another class/object to give it an instance of the 'pluginized' class/object.  With the jQuery type, this function is added to the jQuery object, effectively making it a plugin.
		Parameters:
			options(map):
				class(Function): Class to instantiate for use as plugin.  Used if each containing object will have its own instance of the class, in place of the 'object' option
				mapToThis(String): string will be key used for passing containing object's 'this' to pluginized object's constructor
				object(Object): Object to use for plugin.  Used if one object instance is shared among all containing object instances, in place of the 'class' option
				type(String): name of the type of plugin to create.  default: method
					method: returns the pluganized method that can be added to any object/class
					jQuery: attaches the pluganized method to the jQuery object
		*/
		,'pluginize': function(_options){
			var _type = _options.type || 'method';
			_options = __mergeInto({
				'mapToThis': 'elements'
			}, _options);
			var _handler = function(){
				var _args = arguments; //-# enhancement for obfuscation to allow arguments to become a shorter variable, saving 128 bytes at time of commit
				if(typeof _handler.instance == 'undefined' || typeof _args[0] == 'undefined'){
					switch(typeof _options.mapToThis){
						case 'string':
							if(typeof _args[0] != 'object'){
								_args[0] = {};
							}
							_args[0][_options.mapToThis] = this;
						break;
						case 'number':
							_args[_options.mapToThis] = this;
						break;
						default:
							throw new Error('Pluginize does not support a "mapToThis" type of ' + typeof _options.mapToThis);
					}
					if(typeof _options.object == 'object'){
						_handler.instance = _options.object;
					}else{
						_handler.instance = new _options['class'](
							_args[0]
							,_args[1]
							,_args[2]
							,_args[3]
							,_args[4]
							,_args[5]
							,_args[6]
							,_args[7]
							,_args[8]
							,_args[9]
						);
					}
				}else if(typeof _args[0] == 'string'){
					//--shift off first argument as name of function
					var _propertyName = __Array.prototype.shift.call(_args);
					if(typeof _handler.instance[_propertyName] == 'function'){
						return _handler.instance[_propertyName].apply(_handler.instance, _args);
					}else{
						return _handler.instance[_propertyName];
					}
				}else{
					throw new Error('Must pass name of function to call for plugin.');
				}
			};
			switch(_type){
				case 'method':
					return _handler;
				//-# break;
				case 'jQuery':
					__jQuery.fn[_options.name] = _handler;
				break;
				default:
					throw new Error('Pluginize doesn\'t support type ' + _type);
				//-# break;
			}
		}
	});

	//--add to tmlib and export
	__tmlib.__('.core', {'classes': __classes});
	return __classes;
});
