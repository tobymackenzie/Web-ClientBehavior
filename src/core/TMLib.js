define(function(__require){
	var __deps = __require('./deps');
	var __mergeInto = __require('./mergeInto');
	var __Namespace = __require('./Namespace');

	var __Array = __deps.Array;
	var __globals = __deps.globals;

	/*
	Class: TMLib
	Container for all tmlib functionality
	*/
	var __TMLib = function TMLib(){
		if(!(this instanceof __TMLib)){
			return new __TMLib();
		}else{
			//--attach this to __ helper so it will have access to it even if methods are invoked directly
			this.__._this = this;
		}
	};

	//--create helper function and add methods to it
	/*
	Method: __
	Helper function for tmlib.  Will call any methods or return any values attached to _helper method, or pass arguments on to Namespace if none found.  If extending with '.' syntax, will namespace the TMLib prototype, otherwise will use the regular 'this'.
	*/
	var _helper = function(){
		var _args = arguments
		var _arg0 = _args[0];
		var _return = null;
		switch(typeof _helper[_arg0]){
			case 'function':
				__Array.prototype.shift.call(_args);
				_return = _helper[_arg0].apply(this, _args);
			break;
			case 'undefined':
				var _this = (_arg0 && _arg0.charAt(0) === __Namespace.separator)
					? __TMLib.prototype
					: this
				;
				_return = __Namespace.prototype.__.apply(_this, _args);
			break;
			default:
				_return = _helper[_arg0];
			break;
		}
		return _return;
	}

	//---add methods / values to helper
	__mergeInto(_helper, {
		/*
		Method: noConflict
		Restore global __ to original (pre library loaded) value.  Optionally restore tmlib to leave global namespace completely untouched
		Parameters:
			restoreTmlib(Boolean): Optionally restore tmlib to orignal value to leave global namespace completely untouched
		*/
		noConflict: function(_restoreTmlib){
			__globals.__ = __deps.__;
			if(_restoreTmlib){
				__globals.tmlib = __deps.tmlib;
			}
			return this._this || this;
		}
	});

	//---add helper method to TMLib
	__TMLib.prototype.__ = _helper;

	//--instantiate
	__tmlib = new __TMLib();

	//--export tmlib as both module and global
	__globals.tmlib = __tmlib;
	__globals.__ = __tmlib;

	//---properlty namespace Namespace into tmlib, since it is created before tmlib
	__tmlib.__('.core', {
		deps: __deps
		,Namespace: __Namespace
		,TMLib: __TMLib
	});
	return this.tmlib;
});
