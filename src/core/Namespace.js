define(function(__require){
	var __deps = __require('./deps');
	var __mergeInto = __require('./mergeInto');

	var __globals = __deps.globals;

	/*
	Class: Namespace
	Class that will operate as generic namespace object that is able to extend itself.  If called directly
	*/
	var __Namespace = function Namespace(){
		var _args = arguments;
		//--check if this is being invoked as a constructor, which takes no arguments or will be a namespace and will not have a _this on the helper function defined
		var _isContructor = false;
		if(
			!_args.length
			|| (this instanceof __Namespace && typeof this.__._this === 'undefined')
		){
			_isContructor = true;
		}

		if(!_isContructor){
			if(_args.length){
				return __Namespace.namespace.apply(this, _args);
			}else{
				return new __Namespace();
			}
		}else{
			//--attach this to __ helper so it will have access to it even if methods are invoked directly
			this.__._this = this;
		}
	};
	__mergeInto(__Namespace, {
		helpers: {
			keys: function(){
				var _key;
				var _keys = [];
				for(_key in this){
					if(_key !== '__'){
						_keys.push(_key);
					}
				}
				return _keys;
			}
		}
		/*
		Method: namespace
		Create namespaces.
		Parameters: multiple parameter signatures.
				(): creates a new namespace.
				(namespace)
				(namespace, extend)
				(scope, namespace)
				(scope, extend)
				(scope, namespace, extend)
			extend(Map): map of key value pairs to merge into the namespace
			namespace(String): name of namespace.  can put 'Namespace.separator' between namespaces to create hierarchical namespaces
			scope(Object): object to append namespace
		*/
		,namespace: function(){
			var _args = arguments;
			var _i;
			var _namespace;
			var _extend;
			var _scope;

			//--determine arguments based on number of argumetns
			switch(_args.length){
				case 0:
					return new __Namespace();
				break;
				case 1:
					_namespace = _args[0];
				break;
				case 2:
					if(typeof _args[0] === 'string'){
						_namespace = _args[0];
						_extend = _args[1];
					}else{
						_scope = _args[0];
						if(typeof _args[1] === 'string'){
							_namespace = _args[1];
						}else{
							_extend = _args[1];
						}
					}
				break;
				case 3:
					_scope = _args[0];
					_namespace = _args[1];
					_extend = _args[2];
				break;
			}

			//--_scope defaults to __deps.globals
			if(!_scope){
				_scope = __globals;
			}

			//--start our current scope as _scope
			var _currentScope = _scope;
			var _i;

			if(typeof _namespace == 'string'){
				var _identifier, _identifierKey;
				//--split _namespace into identifiers on separator
				var _identifiers = _namespace.split(__Namespace.separator);
				//--go through all identifiers
				for(_i = 0; _i < _identifiers.length; ++_i){
					_identifierKey = _identifiers[_i];
					//--if current key is not defined, define it
					if(!_currentScope[_identifierKey]){
						_currentScope[_identifierKey] = new __Namespace();
					}
					//--set current scope to new scope
					_currentScope = _currentScope[_identifierKey];
				}
			}
			if(_extend){
				if(_extend instanceof Array){
					for(_i = 0; _i < _extend.length; ++_i){
						Namespace(_extend[_i], _currentScope);
					}
				}else{
					__mergeInto(_currentScope, _extend);
				}
			}
			return _currentScope;
		}
		,separator: '.'
	});
	__Namespace.prototype.__ = function(){
		var _args = arguments;
		//--if no arguments, return an array of keys
		if(_args.length == 0){
			return __Namespace.helpers.keys.apply(this);
		}else{
			var _arg0 = _args[0];
			switch(typeof _arg0){
				case 'string':
					if(_arg0.charAt(0) === __Namespace.separator){
						var _name = _arg0.substring(1);
						var _extend = _args[1] || null;
						return __Namespace(this, _name, _extend);
					}else if(typeof __Namespace.helpers[_arg0] == 'function'){
						_args.shift();
						return __Namespace.helpers.apply(this, _args);
					}else if(typeof __Namespace.helpers[_arg0] != 'undefined'){
						return __Namespace.helpers[_arg0];
					}else{
						throw 'Namespace: undefined method "' + _arg0 + '"';
					}
				break;
				case 'object':
					return __mergeInto(this, _arg0);
				break;
			}
		}
	};

	//--export directly only, since we can't reference tmlib yet
	return __Namespace;
});
