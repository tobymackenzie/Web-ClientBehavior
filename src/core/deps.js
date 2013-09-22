/* global define */
define(['module'], function(__module){
	//-@ http://stackoverflow.com/questions/9916073/how-to-load-bootstrapped-models-in-backbone-js-while-using-amd-require-js
	var __deps = __module.config();
	var __i;
	var __undefined;

	if(!__deps.globals){
		//--get global
		//-@ stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript#answer-3277192
		/* jshint -W061 */
		__deps.globals = Function('return this')();
	}

	//--js and other common global objects
	var __commonGlobalObjects = Array(
		//--tmlib
		'__' //--original global value, only here for noConflict
		,'tmlib' //--original global value, only here for noConflict

		//--browser
		// ,'alert'
		,'console'

		//--js
		,'Array'
		// ,'Math'
		,'Object'
		,'undefined'

		//--other libraries
		,'head'
		,'jQuery'
	);
	var __commonGlobalObjectsLength = __commonGlobalObjects.length;
	for(__i = 0; __i < __commonGlobalObjectsLength; ++__i){
		var _name = __commonGlobalObjects[__i];
		if(!__deps[_name]){
			__deps[_name] = __deps.globals[_name] || __undefined;
		}
	}
	return __deps;
});
