__.core.Functions = {
	/*=====
	==configuraiton
	=====*/
	'configuration': {
		'duckPunchKey': '__original'
	}
	/*=====
	==Library functions
	=====*/
	/*
	Function: contains
	In support browsers, determines if a function contains a given string / matches a given regex.  Useful to see if a certain variable is used or function is called, particularly for checking if a child class calls a parent class's method.  For unsupported browsers, always returns true to allow them to function (may change this behavior in the future.)

	Parameters:
		argFunction(Function): the function to examine
		argContains(RegExp|String): the string content to search the function for
	*/
	,contains:
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
	Duck punch a function with a wrapper, ie create a function that runs the wrapper with the original function available inside.  Two types are available, since we cannot close into an already existing function.  One unshifts the original function into the first parameter for the wrapper.  Wrapper must shift off first argument as original function to be able to apply to said function.  The other attaches the original function as a key on the 'this' context, then restores whatever was at that key before.

	Parameters:
		argFunction(Function): Function to wrap
		argWrapper(Function): Function to wrap with.  Must call wrapped function by appropriate means from within.
		argOptions(map):
			autoApply(Boolean): Will wrap argFunction in a wrapper that applies first argument so argWrapper can just call this.__base or arguments[0] directly rather than applying.  The scope of 'this' only works on 'this' type.  For 'arguments', 'this' will be 'window'.
			key(String): key for attaching to 'this' when using the 'this' type
			type(String):
				this: attach argFunction to the 'this' context used on invocation, using the key specified by the 'key' option.  Will be restored to its original value after invocation
				argument(default): pass argFunction in as first argument, followed by all other arguments.  Can then shift argFunction into variable to have access to it, and arguments will then be shifted into position

	Example:
		'argument' type:
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
		'this' type
			(start code)
			original = function(argOne, argTwo){
				console.log('original: ' + argOne + ', ' + argTwo);
			}
			wrapper = function(argOne, argTwo){
				console.log('wrapper pre: ' + argOne + ', ' + argTwo);
				this.__original.apply(this, arguments);
				console.log('wrapper post: ' + argOne + ', ' + argTwo);
			}
			newFunction = __.core.Functions.duckPunch(original, wrapper, {type: 'this'});
			newFunction('one', 'two');
			(end code)
	Performance:
		The 'this' type is a bit slower than the 'arguments' type. So is the 'autoApply' option.  See http://jsperf.com/duck-punching-variants
	*/
	,'duckPunch': function(argFunction, argWrapper, argOptions){
		var argOptions = argOptions || {};
		argOptions.autoApply = argOptions.autoApply || false;
		var originalFunction =
			(argOptions.autoApply)
			? function(argArguments){
				return argFunction.apply(this, argArguments);
			}
			: argFunction
		;
		switch(argOptions.type || null){
			case 'this':
				var argKey = argOptions.key || this.configuration.duckPunchKey;
				return function(){
					var originalValue = this[argKey] || undefined;
					this[argKey] = originalFunction;
					var fnReturn = argWrapper.apply(this, arguments);
					if(originalValue === undefined){
						delete this[argKey];
					}else{
						this[argKey] = originalValue;
					}
					return fnReturn;
				}
			break;
			default:
				return function(){
					Array.prototype.unshift.call(arguments, originalFunction)
					return argWrapper.apply(this, arguments);
				}
			break;
		}
	}
};
