/* global define */
define(['./deps'], function(__deps){
	var __Array = __deps.Array;
	var __Object = __deps.Object;

	//-@ http://www.shamasis.net/2011/08/infinite-ways-to-detect-array-in-javascript/
	var _isArray = (function(){
		//-- use native isArray() if available
		if (__Array.isArray) {
			return __Array.isArray;
		}

		//-- Retain references to variables for performance
		var toStringFn = __Object.prototype.toString;
		var _arrayToString = toStringFn.call([]);

		return function(_var){
			return toStringFn.call(_var) === _arrayToString;
		};
	})();
	return _isArray;
});
