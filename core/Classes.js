/*
Library: Classes
Basic functions for creating and working with classes.
*/
__.core.Classes = {
	/*
	Function: create
	Create a class.  Provides an abstraction to creating classes directly by creating functions and manipulating their prototypes.  Will become much more capable, though ideally this'll be designed to be minimal but extensible to support other functionality.  Eventually all non-library classes will be migrated to be created by this function.  Meant to replace __.class.define, though it may take some bits from it before it gets removed.

	Parameters:
		argOptions(map):
			init(Function): Function to run as constructor
			name(String): A string name for the class.  Currently used only to assign to the window namespace, though will support any namespace and will use this for class meta data later.
			parent(Object|String): Object to extend.  If none is passed, will extend a base object or the built in object.
			properties(map): Properties to add to object's prototype.  Currently added directly, but will eventually support per property configuration by passing a map.
			statics(map): Properties to add directly to class, to be called statically.

	Return:
		Function object, the constructor of the class, but representing the class itself.
	*/
	'create': function(argOptions){
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
				if(typeof __.classes.Object != 'undefined'){
					lcParent = __.classes.Object;
				}else{
					lcParent = window.Object;
				}
			break;
		}

		//--create class/constructor
		function lcClass(){
			//--don't run 
			if(!__.core.Classes.__isCreatingPrototype){
				//--call class's init method, if it exists
				if(this.init){
					this.init.apply(this, arguments);
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

		//--set prototypes init method, if it exists
		if(typeof argOptions.init == 'function'){
			lcPrototype.init = argOptions.init;
		}

		//--merge definition properties into prototype
		if(typeof argOptions.properties == 'object'){
			lcPrototype = __.core.Objects.mergeInto(lcPrototype, argOptions.properties);
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
}