/* global define */
define(['./deps', './Library', './mergeInto', 'tmclasses/tmclasses', './__'], function(__deps, __Library, __mergeInto, __tmclasses, __tmlib){
	var __Array = __deps.Array;
	var __jQuery = __deps.jQuery;

	/*
	Library: classes
	Libary for creating and working with classes.
	*/
	var __classes = new __Library({
		/*=====
		==configuration
		=====*/
		/*---
		Attribute: config

		See tmclasses.config
		*/
		config: __tmclasses.config
		/*---
		Attribute: creationPlugins

		See tmclasses.creationPlugins()
		*/
		,creationPlugins: __tmclasses.creationPlugins

		/*=====
		==Library functions
		=====*/
		/*---
		Function: create

		See tmclasses.create
		*/
		,create: __tmclasses.create

		/*---
		Function: createConstructor

		See tmclasses.createConstructor()
		*/
		,createConstructor: __tmclasses.createConstructor

		/*---
		Function: createPrototype

		See tmclasses.createPrototype()
		*/
		,createPrototype: __tmclasses.createPrototype

		/*---
		Function: mixIn

		See tmclasses.mixIn
		*/
		,mixIn: __tmclasses.mixIn

		/*---
		Function: pluginize

		Converts any class/object into a function to be used by another class/object to give it an instance of the 'pluginized' class/object.  With the jQuery type, this function is added to the jQuery object, effectively making it a plugin.
		Parameters:
			options(map):
				Class(Function): Class to instantiate for use as plugin.  Used if each containing object will have its own instance of the class, in place of the 'object' option
				mapToThis(String): string will be key used for passing containing object's 'this' to pluginized object's constructor
				object(Object): Object to use for plugin.  Used if one object instance is shared among all containing object instances, in place of the 'Class' option
				type(String): name of the type of plugin to create.  default: method
					method: returns the pluganized method that can be added to any object/class
					jQuery: attaches the pluganized method to the jQuery object
		*/
		,pluginize: function(_options){
			var _type = _options.type || 'method';
			_options = __mergeInto({
				mapToThis: 'elements'
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
						_handler.instance = new _options.Class(
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
	__tmlib.__('.core', {classes: __classes});
	return __classes;
});
