/*
Function: _core_mergeInto

Merge all keys from all other objects into first object, preferring keys of objects to the farthest right.

Paramaters:
	_object(Object): object to merge other paramaters into
	any number of objects to merge into first, preferring keys of objects to the right over keys to the left

Returns:
	Modified object

See Also:
	<merge>
*/
var _core_mergeInto = function(){
	var _object = arguments[0];
	for(var _keyArg = 1; _keyArg < arguments.length; ++_keyArg){
		for(var _argKey in arguments[_keyArg]){
			if(arguments[_keyArg].hasOwnProperty(_argKey)){
				_object[_argKey] = arguments[_keyArg][_argKey];
			}
		}
	}
	return _object;
}

/*
Function: _core_namespace
Create a namespace from a string as a function to which keys can be added or which can be called for namespace related functionality (see _core_namespace.handler).  The namespace will be scoped into the provided scope, and can optionally be extended.
Parameters:
	_namespace(String): string representation of namespace, with _core_namespace.seperator as a seperator of namespace identifiers.
	_scope: base scope to attach namespace to, defaults to globals
	_extend: object to extend namespace with
Return:
	(Function): newly created namespace function
*/
var _core_namespace = function(_namespace, _scope, _extend){
	//--_scope defaults to _deps_globals
	if(!_scope){
		_scope = _deps_globals;
	}
	//--start our current scope as _scope
	var _currentScope = _scope;
	//--only act if _namespace is a string
	if(typeof _namespace == 'string'){
		var i, _identifier, _identifierKey;
		//--split _namespace into identifiers on separator
		var _identifiers = _namespace.split(_core_namespace.separator);
		//--go through all identifiers
		for(i = 0; i < _identifiers.length; ++i){
			_identifierKey = _identifiers[i];
			//--if current key is not defined, define it
			if(!_currentScope[_identifierKey]){
				//--key will be a new function, defined in a scoping function so it can hold a reference to itself
				_identifier = (function(){
					var _localPiece = function(){
						//--call handler with the namespace as 'this'
						return _core_namespace.handler.apply(_localPiece, arguments);
					}
					return _localPiece;
				})();
// 				_identifier.name = _identifierKey;
				_currentScope[_identifierKey] = _identifier;
			}
			//--set current scope to new scope
			_currentScope = _currentScope[_identifierKey];
		}
	}
	if(_extend){
		if(_extend instanceof _js_Array){
			for(i = 0; i < _extend.length; ++i){
				_core_namespace(_extend[i], _currentScope);
			}
		}else{
			_core_mergeInto(_currentScope, _extend);
		}
	}
	return _currentScope;
}
_core_namespace.separator = '.';
_core_namespace.handler = function(){
	var args = arguments;
	//--if no arguments, return an array of keys
	if(args.length == 0){
		var _key;
		var _keys = [];
		for(_key in this){
			_keys.push(_key);
		}
		return _keys;
	}else{
		switch(typeof args[0]){
			case 'string':
				var _extend = args[1] || false;
				return _core_namespace(args[0], this, _extend)
			break;
			case 'object':
				return _core_mergeInto(this, args[0]);
			break;
			default:
console.log('handler undefined', args);
			break;
		}
	}
}

var _originals_tmlib = _deps_globals.tmlib || _js_undefined;
var _tmlib = _core_namespace('tmlib', _deps_globals, ['classes', 'class', 'lib']);
