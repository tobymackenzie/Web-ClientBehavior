/*
Basic functions for working with javascript objects
*/
__.core.Objects = {
	/*
	Function: addProperties
	Add properties to an object.
	Parameters:
		argObject(Object): Object to add properties to
		argProperties(Map): Map of named properties with values to add to object
	*/
	'addProperties': function(argObject, argProperties){
		for(var key in argProperties){
			if(argProperties.hasOwnProperty(key)){
				this.addProperty(argObject, key, argProperties[key]);
			}
		}
	}
	/*
	Function: addProperty
	Add a property to an object.
	Parameters:
		argObject(Object): Object to add properties to
		argName(String): Name of property, key in object
		argProperty(mixed): Property definition/value
	*/
	,'addProperty': function(argObject, argName, argProperty){
		if(typeof argProperty == 'object'){
			//--unimplemented
		}else{
			argObject[argName] = argProperty;
		}
	}
	/*
	Function: getLength

	Gets the number of keys an object has, as if it were an array.  Was __.lib.getObjectLength

	Parameters:
		argObject(object): object to check 'length' of
		argDoCountInherited(boolean): count inherited properties if true, otherwise just hasOwnProperty properties
	*/
	,'getLength': function(argObject, argDoCountInherited){
		if(argDoCountInherited === undefined) argDoCountInherited = false;
		var length = 0;
		for(var key in argObject){
			if(argObject.hasOwnProperty(key) || argDoCountInherited)
				++length;
		}
		return length;
	}

	/*
	Function: hasKey

	Determine if object/array has at least one of given key(s).    Uses 'hasOwnProperty', so keys must be object's own property (may want to change this for dealing with inheritance).  Was __.lib.hasKey

	Parameters:
		argNeedles(String|Array): string key or array of keys to ensure exist
		argHaystack(Array|Object): object to look for key(s) in

	Dependencies:
		__.lib.each (should remove for efficiency)
		__.lib.isArray (could do typoef)
	*/
	,'hasKey': function(argNeedles, argHaystack){
		var lclHaystack = argHaystack;
		if(!__.lib.isArray(argNeedles)){
			argNeedles = [argNeedles];
		}
		__.lib.each(argNeedles, function(argValue, argKey){
			if(lclHaystack.hasOwnProperty(argValue))
				return true;
		});
		return false;
	}

	/*
	Function: hasKeys

	Determine if object/array has given key(s).  Uses 'hasOwnProperty', so keys must be object's own property (may want to change this for dealing with inheritance).  Was __.lib.hasKeys

	Parameters:
		argNeedles(String|Array): string key or array of keys to ensure exist
		argHaystack(Array|Object): object to look for key(s) in

	Dependencies:
		__.lib.each (should remove for efficiency)
		__.lib.isArray (could do typoef)
	*/
	,'hasKeys': function(argNeedles, argHaystack){
		var lclHaystack = argHaystack;
		var lclHas = true;
		if(!__.lib.isArray(argNeedles)){
			argNeedles = [argNeedles];
		}
		__.lib.each(argNeedles, function(argValue, argKey){
			if(!(lclHas && lclHaystack.hasOwnProperty(argValue)))
				lclHas = false;
		});
		return lclHas;
	}

	/*
	Function: merge

	Merge all keys from all passed in objects into a new object, preferring keys to the right.

	Paramaters:
		any number of objects to merge into a new object, with properties from objects to the right overriding those to the left.  Was __.lib.merge

	Returns:
		new object with all keys of all passed in objects

	Sources:
		http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically

	See Also:
		<mergeInto>
	*/
	,'merge': function(){
		var lcObject = {};
		for(var keyArg = 0; keyArg < arguments.length; ++keyArg){
			for(var argKey in arguments[keyArg]){
				if(arguments[keyArg].hasOwnProperty(argKey)){
					lcObject[argKey] = arguments[keyArg][argKey];
				}
			}
		}
		return lcObject;
	}

	/*
	Function: mergeInto

	Merge all keys from all other objects into first object, preferring keys of objects to the farthest right.

	Paramaters:
		lcObject(Object): object to merge other paramaters into
		any number of objects to merge into first, preferring keys of objects to the right over keys to the left

	Returns:
		Modified object

	See Also:
		<merge>
	*/
	,'mergeInto': function(){
		var lcObject = arguments[0];
		for(var keyArg = 1; keyArg < arguments.length; ++keyArg){
			for(var argKey in arguments[keyArg]){
				if(arguments[keyArg].hasOwnProperty(argKey)){
					lcObject[argKey] = arguments[keyArg][argKey];
				}
			}
		}
		return lcObject;
	}
};
