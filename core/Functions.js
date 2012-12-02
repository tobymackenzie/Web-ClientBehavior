__.core.Functions = {
	/*
	Function: contains
	In support browsers, determines if a function contains a given string / matches a given regex.  Useful to see if a certain variable is used or function is called, particularly for checking if a child class calls a parent class's method.  For unsupported browsers, always returns true to allow them to function (may change this behavior in the future.)

	Parameters:
		argFunction(Function): the function to examine
		argContains(RegExp|String): the string content to search the function for
	*/
	contains:
		//--make sure functions can be tested
		(/xyz/.test(function(){xyz;}))
		? function(argFunction, argContains){
			if(!(argContains instanceof RegExp)){
				argContains = new RegExp(argContains, 'i');
			}
			return argContains.test(argFunction);
		}
		: function(){ return true; }

	/*
	Function: duckPunch
	Duck punch a function with a wrapper, ie create a function that runs the wrapper with the original function available inside.  Unshifts the original function into the first parameter for the wrapper, since we cannot close into an already existing function.  Wrapper must shift off first argument as original function to be able to apply to said function.

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
	,'duckPunch': function(argFunction, argWrapper){
	    return function(){
	        Array.prototype.unshift.call(arguments, argFunction)
	        return argWrapper.apply(this, arguments);
	    }
	}
};
