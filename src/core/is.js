/*
Library: is
Functions to check if variables are a given thing.
*/
/* global define */
define([], function(){
	var __this = {
		numeric: function(_var){
			return !isNaN(_var - 0);
		}
	};
	return __this;
});
