/* global define */
define(['tmclasses/BaseClass', './__'], function(__BaseClass, __tmlib){
	/*
	Class: BaseClass

	See tmclasses.BaseClass.
	*/

	//--add to tmlib and export
	__tmlib.__('.core', {BaseClass: __BaseClass});
	return __BaseClass;
});
