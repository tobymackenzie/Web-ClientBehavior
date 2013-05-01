/* global define */
define(['./__', './deps', './Library'], function(__tmlib, __deps, __Library){
	var __Array = __deps.Array;
	var __undefined = __deps.undefined;

	/*
	Library: functions
	Library for working with functions
	*/
	var __functions = new __Library({
		/*=====
		==configuraiton
		=====*/
		'configuration': {
			'argumentsRegex': /((?!=^|,)([\w\$_]))+/g
			,'duckPunchKey': '__original'
			,'functionRegex': /^function[\s]+[\w]*\(([\w\s,_\$]*)?\)\{(.*)\}$/
		}
		/*=====
		==Library functions
		=====*/
		/*
		Function: clone
		Clones a function.  Clone will have the same function body, but will lose name and lose scope of any closed over variables.
		*/
		,clone: function(_function){
			var _result;
			var _matches = _function.toString().match(this.configuration.functionRegex);
			if(_matches){
				if(_matches[1]){
					_result = _matches[1].match(this.configuration.argumentsRegex);
				}else{
					_result = [];
				}
				_result.push(_matches[2]);
			}else{
				_result = [];
			}
			var _clone = Function.apply(Function, _result);
			// if you want to grab existing parameters
			for(var _key in _function){
				_clone[_key] = _function[_key];
			}
			return _clone;
		}
		/*
		Function: contains
		In support browsers, determines if a function contains a given string / matches a given regex.  Useful to see if a certain variable is used or function is called, particularly for checking if a child class calls a parent class's method.  For unsupported browsers, always returns true to allow them to function (may change this behavior in the future.)

		Parameters:
			function(Function): the function to examine
			contains(RegExp|String): the string content to search the function for
		*/
		,contains:
			//--make sure functions can be tested
			(/define/.test(function(){define;}))
			? function(_function, _contains){
				if(!(_contains instanceof RegExp)){
					_contains = new RegExp(_contains, 'i');
				}
				return _contains.test(_function);
			}
			: function(){ return true; }

		/*
		Function: duckPunch
		Duck punch a function with a wrapper, ie create a function that runs the wrapper with the original function available inside.  Two types are available, since we cannot close into an already existing function.  One unshifts the original function into the first parameter for the wrapper.  Wrapper must shift off first argument as original function to be able to apply to said function.  The other attaches the original function as a key on the 'this' context, then restores whatever was at that key before.

		Parameters:
			function(Function): Function to wrap
			_wrapper(Function): Function to wrap with.  Must call wrapped function by appropriate means from within.
			_options(map):
				autoApply(Boolean): Will wrap _function in a wrapper that applies first argument so _wrapper can just call this.__base or arguments[0] directly rather than applying.  The scope of 'this' only works on 'this' type.  For 'arguments', 'this' will be '__deps.globals'.
				key(String): key for attaching to 'this' when using the 'this' type
				type(String):
					this: attach _function to the 'this' context used on invocation, using the key specified by the 'key' option.  Will be restored to its original value after invocation
					argument(default): pass _function in as first argument, followed by all other arguments.  Can then shift _function into variable to have access to it, and arguments will then be shifted into position

		Example:
			'argument' type:
				(start code)
				original = function(argOne, argTwo){
					console.log('original: ' + argOne + ', ' + argTwo);
				}
				wrapper = function(argOne, argTwo){
					//--take advantage of a nifty aspect of shifting arguments: names arguments adjust to the new 'arguments' object.  Noted @ http://blog.boyet.com/blog/javascriptlessons/javascript-using-the-shift-method-on-the-arguments-array/
					var _originalFunction = Array.prototype.shift.call(arguments);
					console.log('wrapper pre: ' + argOne + ', ' + argTwo);
					_originalFunction.apply(this, arguments);
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
		,'duckPunch': function(_function, _wrapper, _options){
			_options = _options || {};
			_options.autoApply = _options.autoApply || false;
			var _originalFunction =
				(_options.autoApply)
				? function(argArguments){
					return _function.apply(this, argArguments);
				}
				: _function
			;
			switch(_options.type || null){
				case 'this':
					var argKey = _options.key || this.configuration.duckPunchKey;
					return function(){
						var _originalValue = this[argKey] || __undefined;
						this[argKey] = _originalFunction;
						var _return = _wrapper.apply(this, arguments);
						if(_originalValue === __undefined){
							delete this[argKey];
						}else{
							this[argKey] = _originalValue;
						}
						return _return;
					};
				//-* break;
				default:
					return function(){
						__Array.prototype.unshift.call(arguments, _originalFunction);
						return _wrapper.apply(this, arguments);
					};
				//-* break;
			}
		}
	});

	//--add to tmlib and export
	__tmlib.__('.core', {'functions': __functions});
	return __functions;
});
