/* global define */
define(['./deps', './Namespace', './TMLib'], function(__deps, __Namespace, __TMLib){
	//--instantiate
	var __tmlib = new __TMLib();

	//---properly namespace previously created items into tmlib
	__tmlib.__('.core', {
		deps: __deps
		,Namespace: __Namespace
		,TMLib: __TMLib
	});

	return __tmlib;
});
