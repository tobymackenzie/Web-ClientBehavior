define(['./deps', './Namespace', './TMLib'], function(__deps, __Namespace, __TMLib){
	//--instantiate
	var __tmlib = new __TMLib();

	//---properly namespace Namespace into tmlib, since it is created before tmlib
	__tmlib.__('.core', {
		deps: __deps
		,Namespace: __Namespace
		,TMLib: __TMLib
	});

	return __tmlib;
});
