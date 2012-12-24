/*
Library: Classes
Basic functions for creating and working with classes.
*/
__.core.Classes = {
	/*=====
	==configuration
	=====*/
	'configuration': {
		//--using autoapply makes for a nicer interface, but also has a performance penalty
		'autoApplyForFunctionInheritance': true
		,'overriddenParentKey': '__base'
	}
	,'creationPlugins': {
		/*
		Function: addParentAccessToMethods
		Adds ability to call 'this.base(arguments)' from child class methods to access parent class methods of same name
		*/
		'addParentAccessToMethods': function(argOptions){
			var lcClass = argOptions['class'];
			var lcParent = argOptions['parent'];
			var lcPrototype = argOptions['prototype'];
			var lcOptions = argOptions['options'];
			var lcProperties =
				(typeof lcOptions.properties == 'object')
				? __.core.Objects.merge(lcOptions.properties)
				: {}
			;
			//--add init method to properties if it exists
			if(typeof lcOptions.init != 'undefined'){
				lcProperties.init = lcOptions.init;
			}
			//--duck punch overridden methods to have access to parent class.  This has a noticable performance penalty, so if you need increased performance, call/apply with the prototype of the parent class directly
			for(var name in lcProperties){
				if(
					//--only override if function is in both parent and child classes
					typeof lcPrototype[name] == 'function'
					&& typeof lcParent.prototype[name] == 'function'
					//--only override if function actually calls the parent
					&& __.core.Functions.contains(lcPrototype[name], '\\b' + this.configuration.overriddenParentKey + '(\\(|\\.apply|\\.call)\\b')
				){
					var duckPunchedFunction =
					lcPrototype[name] =
					__.core.Functions.duckPunch(
						lcParent.prototype[name]
						,lcPrototype[name]
						,{
							autoApply: this.configuration.autoApplyForFunctionInheritance
							,key: this.configuration.overriddenParentKey
							,name: name
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
		argOptions(map):
			init(Function|null): Function to run as constructor.  null prevents parent constructor from being run
			name(String): A string name for the class.  Currently used only to assign to the window namespace, though will support any namespace and will use this for class meta data later.
			parent(Object|String): Object to extend.  If none is passed, will extend a base object or the built in object.
			properties(map): Properties to add to object's prototype.  Currently added directly, but will eventually support per property configuration by passing a map.
			statics(map): Properties to add directly to class, to be called statically.

	Return:
		Function object, the constructor of the class, but representing the class itself.

	Dependencies:
		__.core.Functions
			.contains
			.duckPunch
		__.core.Objects
			.addProperties
			.addProperty
			.mergeInto
	*/
	,'create': function(argOptions){
		if(typeof argOptions == 'undefined') var argOptions = {};

		//--create base prototype inheriting from parent
		var lcParent;
		switch(typeof argOptions.parent){
			case 'string':
				//-! should accomodate namespaces
				lcParent = window[argOptions.parent];
			break;
			case 'function':
			case 'object':
				lcParent = argOptions.parent;
			break;
			default:
				if(typeof __.core.Classes.BaseClass != 'undefined'){
					lcParent = __.core.Classes.BaseClass;
				}else{
					lcParent = window.Object;
				}
			break;
		}

		//--create class/constructor
		var lcClass = this.createConstructor(lcParent);

		//--create prototype from parent
		var lcPrototype = this.createPrototype(lcParent);

		//--merge statics into class
		//---must explicitely merge in parent statics, since this is a new 'class'
		__.core.Objects.mergeInto(lcClass, lcParent);
		//---now merge with overwrite the passed in statics
		if(typeof argOptions.statics == 'object'){
			lcClass = __.core.Objects.mergeInto(lcClass, argOptions.statics);
		}

		//--add properties to object
		if(typeof argOptions.properties == 'object'){
			__.core.Objects.addProperties(lcPrototype, argOptions.properties);
		}
		if(typeof argOptions.init == 'function'){
			__.core.Objects.addProperty(lcPrototype, 'init', argOptions.init);
		}

		//--perform plugin functionality
		for(var key in this.creationPlugins){
			if(this.creationPlugins.hasOwnProperty(key)){
				this.creationPlugins[key].call(this, {
					'class': lcClass
					,'parent': lcParent
					,'prototype': lcPrototype
					,'options': argOptions
				});
			}
		}

		//--set class prototype
		lcClass.prototype = lcPrototype;

		//--replace constructor so it is as it should be
		lcClass.prototype.constructor = lcClass;

		//--set appropriate object name if provided
		if(argOptions.name){
			//-! should support namespaces
			window[argOptions.name] = lcClass;
		}
		return lcClass;
	}

	/*
	Function: createConstructor
	Creates default constructor function for class.  Done as separate function so that it can be overridable.
	Parameters:
		argParent(Class): 'class' (constructor) of parent class
	Return:
		Function to act as constructor of class
	*/
	,'createConstructor': function(argParent){
		return function lcClass(){
			//--don't run if creating prototype via this.createPrototype
			if(!__.core.Classes.__isCreatingPrototype){
				//--call defined constructor or parent constructor
				switch(typeof this.init){
					//--call class's init method, if it exists
					case 'function':
						this.init.apply(this, arguments);
					break;
					//--call parent's constructor (useful for non-tmlib classes)
					case 'undefined':
						argParent.apply(this, arguments);
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
		argClass(Function): class to create prototype for

	Return:
		Object to serve as a prototype for another object that will properly inherit from the given class object.
	*/
	,'createPrototype': function(argClass){
		//--ensure parent constructor not run
		this.__isCreatingPrototype = true;
		//--create prototype with 'new' keyword so that classes using this prototype will be seen as instances of the class
		var lcPrototype = new argClass();
		//--ensure constructor will be run on future creations
		this.__isCreatingPrototype = false;

		return lcPrototype;
	}

	/*
	Function: mixIn
	Parameters:
		argMixin(Array|Map): If an array of class definitions, run mixIn on each definition.  If a definition, mix this definition in to object/parent.
		argObject(Object): object to mix properties into
		argParent(Function): function to mix statics into
	*/
	,'mixIn': function(argMixin, argObject, argParent){
		if(typeof argMixin == 'object'){
			//--if argMixin is an array, mix in all objects in array
			if(argMixin instanceof Array){
				for(
					var i = 0, mixinsLength = argMixin.length
					; i < mixinsLength
					; ++i
				){
					this.mixIn(argMixin[i], argObject, argParent);
				}
			}else{
				//--mix in statics
				if(typeof argMixin.statics == 'object' && typeof argParent == 'function'){
					for(var key in argMixin.statics){
						if(argMixin.statics.hasOwnProperty(key)){
							argParent[key] = argMixin.statics[key];
						}
					}
				}
				//--mix in properties
				if(typeof argMixin.properties == 'object'){
					for(var key in argMixin.properties){
						if(argMixin.properties.hasOwnProperty(key)){
							argObject[key] = argMixin.properties[key];
						}
					}
				}
			}
		}
	}

	/*
	Function: pluginize
	Converts any class/object into a function to be used by another class/object to give it an instance of the 'pluginized' class/object.  With the jQuery type, this function is added to the jQuery object, effectively making it a plugin.
	Parameters:
		argOptions(map):
			class(Function): Class to instantiate for use as plugin.  Used if each containing object will have its own instance of the class, in place of the 'object' option
			mapToThis(String): string will be key used for passing containing object's 'this' to pluginized object's constructor
			object(Object): Object to use for plugin.  Used if one object instance is shared among all containing object instances, in place of the 'class' option
			type(String): name of the type of plugin to create.  default: method
				method: returns the pluganized method that can be added to any object/class
				jQuery: attaches the pluganized method to the jQuery object
	*/
	,'pluginize': function(argOptions){
		var type = argOptions.type || 'method';
		var jQuery = argOptions.jQuery || window.jQuery;
		var options = {
			'mapToThis': 'elements'
		};
		jQuery.extend(options, argOptions);
		var handler = function(){
			var lcArgs = arguments; //-# enhancement for obfuscation to allow arguments to become a shorter variable, saving 128 bytes at time of commit
			if(typeof handler.instance == 'undefined' || typeof lcArgs[0] == 'undefined'){
				switch(typeof options.mapToThis){
					case 'string':
						if(typeof lcArgs[0] != 'object'){
							lcArgs[0] = {};
						}
						lcArgs[0][options.mapToThis] = this;
					break;
					case 'number':
						lcArgs[options.mapToThis] = this;
					break;
					default:
						throw new Error('Pluginize does not support a "mapToThis" type of ' + typeof options.mapToThis);
				}
				if(typeof options.object == 'object'){
					handler.instance = options.object;
				}else{
					handler.instance = new options['class'](
						lcArgs[0]
						,lcArgs[1]
						,lcArgs[2]
						,lcArgs[3]
						,lcArgs[4]
						,lcArgs[5]
						,lcArgs[6]
						,lcArgs[7]
						,lcArgs[8]
						,lcArgs[9]
					);
				}
			}else if(typeof lcArgs[0] == 'string'){
				//--shift off first argument as name of function
				var propertyName = Array.prototype.shift.call(lcArgs);
				if(typeof handler.instance[propertyName] == 'function'){
					return handler.instance[propertyName].apply(handler.instance, lcArgs);
				}else{
					return handler.instance[propertyName];
				}
			}else{
				throw new Error('Must pass name of function to call for plugin.');
			}
		}
		switch(type){
			case 'method':
				return handler;
			break;
			case 'jQuery':
				jQuery.fn[options.name] = handler;
			break;
			default:
				throw new Error('Pluginize doesn\'t support type ' + type);
			break;
		}
	}
}

/*=====
==base classes
=====*/
/*
Class: BaseClass
Class to be used as parent for most other classes.  Provides the default behavior of accepting a map as the first parameter of the constructor and merging each key into the resulting instance object.
*/
__.core.Classes.BaseClass = __.core.Classes.create({
	/*
	Function: init
	Parameters:
		argOptions(map): receives a key value map of properties to add or apply to instance being created.
	*/
	'init': function(argOptions){
		var lcOptions = argOptions || {};
		//--set value of members from arguments
		for(var key in lcOptions){
			if(lcOptions.hasOwnProperty(key)){
				this.__setInitial(key, lcOptions[key]);
			}
		}
	}
	,'properties': {
		'__setInitial': function(argKey, argValue){
			this[argKey] = argValue;
		}
	}
})
