__.core.Functions = {
	/*
	Duck punch a function with a wrapper, ie create a function that runs the wrapper with the original funciton available inside.  Unshifts the original function into the first parameter for the wrapper, since we cannot close into an already existing function.  Wrapper must shift off first argument as original function to be able to apply to said function.

	Example:
		(start code)
		original = function(argOne, argTwo){
		    console.log('original: ' + argOne + ', ' + argTwo);
		}

		wrapper = function(argOne, argTwo){
			//--take advantage of a nifty aspect of shifting arguments: names arguments adjust to the new 'arguments' object.  Noted @ http://blog.boyet.com/blog/javascriptlessons/javascript-using-the-shift-method-on-the-arguments-array/
		    var originalFunction = Array.prototype.shift.call(arguments);
		    console.log('wrapper pre: ' + argOne + ', ' + argTwo);
		    originalFunction.apply(this, arguments);
		    console.log('wrapper post: ' + argOne + ', ' + argTwo);
		}

		newFunction = __.core.Functions.duckPunch(original, wrapper);

		newFunction('one', 'two');
		(end code)
	*/
	'duckPunch': function(argFunction, argWrapper){
	    return function(){
	        Array.prototype.unshift.call(arguments, argFunction)
	        argWrapper.apply(this, arguments);
	    }
	}
};
