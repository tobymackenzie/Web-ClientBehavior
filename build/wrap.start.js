/* global define */
(function(__factory){
	if(typeof define === 'function' && define.amd){
		define('tmlib', __factory);
	}else{
		var __ = __factory();
		var __globals = __.core.deps.globals;
		__globals.tmlib = __;
		__globals.__ = __;
	}
}(function(){
