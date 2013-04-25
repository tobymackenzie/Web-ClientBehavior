define(['./deps', './Library', './mergeInto', './__'], function(__deps, __Library, __mergeInto, __tmlib){
	var __Array = __deps.Array;
	var __undefined = __deps.undefined;

	/*
	Library: objects

	Library for working with javascript objects
	*/
	var __objects = new __Library({
		/*
		Function: addProperties

		Add properties to an object.

		Parameters:
			object(Object): Object to add properties to
			properties(Map): Map of named properties with values to add to object
		*/
		'addProperties': function(_object, _properties){
			for(var key in _properties){
				if(_properties.hasOwnProperty(key)){
					this.addProperty(_object, key, _properties[key]);
				}
			}
		}
		/*
		Function: addProperty

		Add a property to an object.

		Parameters:
			object(Object): Object to add properties to
			name(String): Name of property, key in object
			property(mixed): Property definition/value.  Keep in mind that, when setting properties on an object prototyp, setting an initial value to an object will cause it to be shared among all instances (eg adding an element to an array object property will affect that property for all instances.  If an object that has an 'init' property, will be added as a complex type with special functionality or options (not yet implemented).  Complex objects can have the follow properties:
				init(mixed): initial value for property
		*/
		,'addProperty': function(_object, _name, _property){
			if(typeof _property == 'object' && typeof _property.init != 'undefined'){
				_object[_name] = _property.init;
			}else{
				_object[_name] = _property;
			}
		}
		/*
		Function: getLength

		Gets the number of keys an object has, as if it were an array.  Was __.lib.getObjectLength

		Parameters:
			object(object): object to check 'length' of
			doCountInherited(boolean): count inherited properties if true, otherwise just hasOwnProperty properties
		*/
		,'getLength': function(_object, _doCountInherited){
			if(_doCountInherited === __undefined) _doCountInherited = false;
			var length = 0;
			for(var key in _object){
				if(_object.hasOwnProperty(key) || _doCountInherited)
					++length;
			}
			return length;
		}

		/*
		Function: hasKey

		Determine if object/array has at least one of given key(s).    Uses 'hasOwnProperty', so keys must be object's own property (may want to change this for dealing with inheritance).  Was __.lib.hasKey

		Parameters:
			needles(String|Array): string key or array of keys to ensure exist
			haystack(Array|Object): object to look for key(s) in

		Dependencies:
			__.lib.each (should remove for efficiency)
			__.lib.isArray (could do typoef)
		*/
		,'hasKey': function(_needles, _haystack){
			if(!__.lib.isArray(_needles)){
				_needles = [_needles];
			}
			__.lib.each(_needles, function(argValue, argKey){
				if(_haystack.hasOwnProperty(argValue))
					return true;
			});
			return false;
		}

		/*
		Function: hasKeys

		Determine if object/array has given key(s).  Uses 'hasOwnProperty', so keys must be object's own property (may want to change this for dealing with inheritance).  Was __.lib.hasKeys

		Parameters:
			needles(String|Array): string key or array of keys to ensure exist
			haystack(Array|Object): object to look for key(s) in

		Dependencies:
			__.lib.each (should remove for efficiency)
			__.lib.isArray (could do typoef)
		*/
		,'hasKeys': function(_needles, _haystack){
			var _has = true;
			if(!__.lib.isArray(_needles)){
				_needles = [_needles];
			}
			__.lib.each(_needles, function(argValue, argKey){
				if(!(_has && _haystack.hasOwnProperty(argValue)))
					_has = false;
			});
			return _has;
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
			var _args = arguments;
			var _object = {};
			__Array.prototype.unshift.call(_args, _object);

			return __mergeInto(_args);
		}

		/*
		Function: mergeInto

		Defined in 'core/mergeInto' because it is needed for many base objects.
		*/
		,'mergeInto': __mergeInto
	});

	//--add to tmlib and export
	__tmlib.__('.core', {'objects': __objects});
	return __objects;
});
