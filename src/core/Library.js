define(['./deps', './mergeInto', './__'], function(__deps, __mergeInto, __tmlib){
	var __undefined = __deps.undefined;

	/*
	Class: Library
	Simple object type to hold a collection of related methods and possibly attributes
	Parameters: (helper method run to extend the library)
	*/
	var __Library = function Library(){
		if(!(this instanceof __Library)){
			return new __Library(_properties);
		}else{
			var _args = arguments;

			//--attach this to __ helper so it will have access to it even if methods are invoked directly
			this.__._this = this;

			//--attach passed in properties
			this.__.apply(this, _args);
		}
	}
	var __helper = function(){
		var _args = arguments
		var _arg0 = _args[0];
		var _return = null;
		switch(typeof _arg0){
			case 'object':
				__helper.extend.apply(this, _args);
			break;
			default:
				switch(typeof __helper[_arg0]){
					case 'function':
						_Array.prototype.shift.call(_args);
						_return = __helper[_arg0].apply(this, _args);
					break;
					case 'undefined':
						_return = _Namespace.prototype.__.apply(this, _args);
					break;
					default:
						_return = __helper[_arg0];
					break;
				}
			break;
		}
		return _return;
	};
	__mergeInto(__helper, {
		extend: function(){
			var _args = arguments
			var _arg0 = _args[0];
			var _i;
			var _this = this._this || this
			switch(typeof _arg0){
				case 'object':
					var _argsLength = _args.length;
					for(_i = 0; _i < _argsLength; ++_i){
						__mergeInto(_this, _args[_i]);
					}
				break;
				case 'string':
					_this[_arg0] = _args[1] || __undefined;
				break;
			}
			return _this;
		}
	});
	__Library.prototype.__ = __helper;

	//--add to tmlib and export
	__tmlib.__('.core', {'Library': __Library});
	return __Library;
});
