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
		__.core.Objects.mergeInto
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
		function lcClass(){
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
						lcParent.apply(this, arguments);
					break;
					//--all other possibilities cause nothing to happen
				}
			}
		}

		//--create prototype from parent
		var lcPrototype = this.createPrototype(lcParent);

		//--merge statics into class
		//---must explicitely merge in parent statics, since this is a new 'class'
		lcClass = __.core.Objects.mergeInto(lcClass, lcParent);
		//---now merge with overwrite the passed in statics
		if(typeof argOptions.statics == 'object'){
			lcClass = __.core.Objects.mergeInto(lcClass, argOptions.statics);
		}

		//--add properties to object
		var lcProperties =
			(typeof argOptions.properties == 'object')
			? argOptions.properties
			: {}
		;
		//---add init method to properties if it exists
		if(typeof argOptions.init != 'undefined'){
			lcProperties.init = argOptions.init;
		}
		//--duck punch overridden methods to have access to parent class.  This has a noticable performance penalty, so if you need increased performance, call/apply with the prototype of the parent class directly
		for(var name in lcProperties){
			if(
				//--only override if function is in both parent and child classes
				typeof lcProperties[name] == 'function'
				&& typeof lcPrototype[name] == 'function'
				//--only override if function actually calls the parent
				&& __.core.Functions.contains(lcProperties[name], '\\b' + this.configuration.overriddenParentKey + '(\\(|\\.apply|\\.call)\\b')
			){
				lcProperties[name] = __.core.Functions.duckPunch(
					lcPrototype[name]
					,lcProperties[name]
					,{
						autoApply: this.configuration.autoApplyForFunctionInheritance
						,key: this.configuration.overriddenParentKey
						,name: name
						,type: 'this'
					}
				);
			}
		}
		//---merge properties into prototype
		lcPrototype = __.core.Objects.mergeInto(lcPrototype, lcProperties);

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
	Function: pluginize
	Converts any class/object into a jQuery (or potentially other type of) plugin.
	Parameters:
		argOptions(map):
			class(Function): Class to instantiate for use as plugin.  Used if each jQuery object will have its own instance of the class, in place of the 'object' option
			mapToThis(String): string will be key used for passing jQuery object's 'this' to object's constructor
			object(Object): Object to use for plugin.  Used if one object instance is shared among all jQuery instances, in place of the 'class' option
	*/
	,'pluginize': function(argOptions){
		var type = argOptions.type || 'jQuery';
		switch(type){
			case 'jQuery':
				var jQuery = argOptions.jQuery || window.jQuery;
				var options = {
					'mapToThis': 'elements'
				};
				jQuery.extend(options, argOptions);
				var handler = function(){
					if(typeof handler.instance == 'undefined' || typeof arguments[0] == 'undefined'){
						switch(typeof options.mapToThis){
							case 'string':
								if(typeof arguments[0] != 'object'){
									arguments[0] = {};
								}
								arguments[0][options.mapToThis] = this;
							break;
							case 'number':
								arguments[options.mapToThis] = this;
							break;
							default:
								throw new Error('Pluginize does not support a "mapToThis" type of ' + typeof options.mapToThis);
						}
						if(typeof options.object == 'object'){
							handler.instance = options.object;
						}else{
							handler.instance = new options['class'](
								arguments[0]
								,arguments[1]
								,arguments[2]
								,arguments[3]
								,arguments[4]
								,arguments[5]
								,arguments[6]
								,arguments[7]
								,arguments[8]
								,arguments[9]
							);
						}
					}else if(typeof arguments[0] == 'string'){
						//--shift off first argument as name of function
						var propertyName = Array.prototype.shift.call(arguments);
						if(typeof handler.instance[propertyName] == 'function'){
							return handler.instance[propertyName].apply(handler.instance, arguments);
						}else{
							return handler.instance[propertyName];
						}
					}else{
						throw new Error('Must pass name of function to call for plugin.');
					}
				}
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
