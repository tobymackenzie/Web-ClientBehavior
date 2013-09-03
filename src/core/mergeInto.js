/* global define */
define(function(){
	/*
	Function: mergeInto

	Merge all keys from all other objects into first object, preferring keys of objects to the farthest right.  Currently duplicated in tmclasses.core.

	Paramaters:
		_object(Object): object to merge other paramaters into
		any number of objects to merge into first, preferring keys of objects to the right over keys to the left

	Returns:
		Modified object

	See Also:
		<merge>
	*/
	var __mergeInto = function mergeInto(){
		var _args = arguments;
		var _object = _args[0];
		for(var _keyArg = 1; _keyArg < _args.length; ++_keyArg){
			for(var _argKey in _args[_keyArg]){
				if(_args[_keyArg].hasOwnProperty(_argKey)){
					_object[_argKey] = _args[_keyArg][_argKey];
				}
			}
		}
		return _object;
	};
	return __mergeInto;
});
