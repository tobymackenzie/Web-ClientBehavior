/*
Class: Range
Represents a range of numbers.
*/
define(['tmclasses/tmclasses', 'tmclasses/BaseClass'], function(tmclasses, BaseClass){
	var __this = tmclasses.create({
		parent: BaseClass
		,properties: {
			/*
			Property: increment
			Amount to increment by when moving through values.  Defaults to 1, which would be integers if `min` and `max` are integers.
			*/
			increment: 1
			,max: undefined
			,min: undefined
		}
	});
	return __this;
});
