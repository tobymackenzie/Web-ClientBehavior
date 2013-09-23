/* global define, QUnit, test, window */
(function(_globals, _factory){
	if(typeof define === 'function' && define.amd){
		define(['tmlib/core/__', 'tmlib/core/functions'], _factory);
	}else{
		var __ = _globals.__;
		_factory(__, __.core.deps);
	}
}(this, function(__){
	//--name module
	QUnit.module('tmlib.core.functions');

	//--define tests
	test('clone', function(__assert){
		var _clone, _func, _functions, _key, _subKey;
		//==initial setup
		_functions = [
			{
				func: function(){ return 'anonymous function'; }
				,result: 'anonymous function'
				,string: 'function anonymous() {\n return \'anonymous function\'; \n}'
			}
			,{
				func: function Foo(){ return 'named function'; }
				,result: 'named function'
				,string: 'function anonymous() {\n return \'named function\'; \n}'
			}
			,{
				func: function Bar(){ var a = function(){ return 'function with internal function declaration'; }; return a(); }
				,result: 'function with internal function declaration'
				,string: 'function anonymous() {\n var a = function(){ return \'function with internal function declaration\'; }; return a(); \n}'
			}
			,{
				func: function Biz(a,$boo,_c){ return a + $boo + _c + 'function with parameters'; }
				,result: 'function with parameters'
				,string: 'function anonymous(a, $boo, _c) {\n return a + $boo + _c + \'function with parameters\'; \n}'
			}
		];
		//--properties
		_functions[0].func.a = 'a';
		_functions[0].func.b = 'b';
		_functions[1].func.b = 'b';

		//==tests
		for(_key in _functions){
			_func = _functions[_key].func;
			_clone = __.core.functions.clone(_func);
			__assert.equal(
				_clone.toString()
				,_functions[_key].string
				,'toString of clone ' + _key + ' should equal desired result'
			);
			__assert.equal(
				_clone()
				,_func()
				,'return of function ' + _key + ' should equal desired result'
			);
			for(_subKey in _func){
				__assert.equal(
					_func[_subKey]
					,_clone[_subKey]
					,'Properties of function and clone ' + _key + ' should be the same'
				);
			}
		}
	});
	test('contains', function(__assert){
		var _expect, _i, _item, _message, _stringsLength;

		//==initial setup
		var testFunction = function(argOne, argTwo){
			argOne = argOne + argTwo;
			return this.__base || undefined;
		};

		var strings = [
			{
				message: 'Arguments should be tested'
				,regex: /\bargOne\b/
				,string: 'argOne'
				,shouldBe: true
			}
			,{
				message: 'Function body should be tested'
				,regex: /\b__base\b/
				,string: '__base'
				,shouldBe: true
			}
			,{
				message: 'Non-existing string should not be found'
				,regex: /\bfoo\b/
				,string: 'foo'
				,shouldBe: false
			}
		];

		//==tests
		//--strings
		for(
			_i = 0, _stringsLength = strings.length;
			_i < _stringsLength;
			++_i
		){
			_item = strings[_i];
			if(_item.string || false){
				_expect = (typeof _item.shouldBe == 'boolean') ? _item.shouldBe : true;
				_message =
					'String test (' + _item.string + ')'
					+ (
						(_item.message || false)
						? ': ' + _item.message
						: ''
					)
				;
				__assert.equal(
					__.core.functions.contains(testFunction, _item.string)
					,_expect
					,_message
				);
			}
		}

		//--regex
		for(
			_i = 0, _stringsLength = strings.length;
			_i < _stringsLength;
			++_i
		){
			_item = strings[_i];
			if(_item.regex || false){
				_expect = (typeof _item.shouldBe == 'boolean') ? _item.shouldBe : true;
				_message =
					'Straight regex test (' + _item.string + ')'
					+ (
						(_item.message || false)
						? ': ' + _item.message
						: ''
					)
				;
				__assert.equal(
					__.core.functions.contains(testFunction, _item.regex)
					,_expect
					,_message
				);
			}
		}

		//--string regex
		for(
			_i = 0, _stringsLength = strings.length;
			_i < _stringsLength;
			++_i
		){
			_item = strings[_i];
			if(_item.string || false){
				_expect = (typeof _item.shouldBe == 'boolean') ? _item.shouldBe : true;
				_message =
					'String regex test (' + _item.string + ')'
					+ (
						(_item.message || false)
						? ': ' + _item.message
						: ''
					)
				;
				__assert.equal(
					__.core.functions.contains(testFunction, '\\b' + _item.string + '\\b')
					,_expect
					,_message
				);
			}
		}
	});
	test('duckPunch', function(__assert){
		//==initial setup
		//--store this for cleanup later
		var originalFromBase = window.fromBase || undefined;
		//--base context for checking changes
		var baseContext = {
			fromBase: false
			,fromWrapper: false
		};
		var resetBaseContext = function(){
			baseContext.fromBase = false;
			baseContext.fromWrapper = false;
		};

		//--base function to duck punch
		var baseFunction = function(argOne, argTwo){
			this.fromBase = true;
			return argOne + argTwo;
		};

		//--wrapper functions
		//---for value and context testing
		var _wrapperFunctionArgumentType = function(argOne){
			var originalFunction = Array.prototype.shift.call(arguments);
			this.fromWrapper = true;
			argOne += 10;
			return originalFunction.apply(this, arguments);
		};
		var _wrapperFunctionThisType = function(argOne){
			this.fromWrapper = true;
			argOne += 10;
			return this.__original.apply(this, arguments);
		};
		var _wrapperFunctionArgumentTypeAutoApply = function(argOne){
			var originalFunction = Array.prototype.shift.call(arguments);
			this.fromWrapper = true;
			argOne += 10;
			return originalFunction(arguments);
		};
		var __wrapperFunctionThisTypeAutoApply = function(argOne){
			this.fromWrapper = true;
			argOne += 10;
			return this.__original(arguments);
		};

		//--duck punch baseFunction
		//---for value and context testing
		var punchedArgumentTypeFunction = __.core.functions.duckPunch(baseFunction, _wrapperFunctionArgumentType);
		var punchedThisTypeFunction = __.core.functions.duckPunch(baseFunction, _wrapperFunctionThisType, {type: 'this'});
		var punchedArgumentTypeFunctionAutoApply = __.core.functions.duckPunch(baseFunction, _wrapperFunctionArgumentTypeAutoApply, {autoApply: true});
		var punchedThisTypeFunctionAutoApply = __.core.functions.duckPunch(baseFunction, __wrapperFunctionThisTypeAutoApply, {autoApply: true, type: 'this'});

		//--arguments to run through all runs of function
		var args = [10, 20];

		//==tests
		//--test context is making it through
		baseFunction.apply(baseContext, args);
		__assert.ok(baseContext.fromBase, 'baseContext.fromBase should be true when only baseFunction called');
		__assert.ok(!baseContext.fromWrapper, 'baseContext.fromWrapper should be false when only baseFunction called');
		resetBaseContext();

		punchedArgumentTypeFunction.apply(baseContext, args);
		__assert.ok(baseContext.fromBase, 'baseContext.fromBase should be true when punchedArgumentTypeFunction called');
		__assert.ok(baseContext.fromWrapper, 'baseContext.fromWrapper should be true when punchedArgumentTypeFunction called');
		resetBaseContext();

		punchedThisTypeFunction.apply(baseContext, args);
		__assert.ok(baseContext.fromBase, 'baseContext.fromBase should be true when punchedThisTypeFunction called');
		__assert.ok(baseContext.fromWrapper, 'baseContext.fromWrapper should be true when punchedThisTypeFunction called');
		resetBaseContext();

		//-# this test will not work for punchedArgumentTypeFunctionAutoApply because it does not properly handle 'this' in base function

		punchedThisTypeFunctionAutoApply.apply(baseContext, args);
		__assert.ok(baseContext.fromBase, 'baseContext.fromBase should be true when punchedThisTypeFunctionAutoApply called');
		__assert.ok(baseContext.fromWrapper, 'baseContext.fromWrapper should be true when punchedThisTypeFunctionAutoApply called');
		resetBaseContext();

		//--test values through all versions of function
		__assert.equal(
			baseFunction.apply(baseContext, args)
			,30
			,'baseFunction should return 30'
		);
		__assert.equal(
			punchedArgumentTypeFunction.apply(baseContext, args)
			,40
			,'punchedArgumentTypeFunction should return 40 (30 + 10)'
		);
		__assert.equal(
			punchedThisTypeFunction.apply(baseContext, args)
			,40
			,'punchedThisTypeFunction should return 40 (30 + 10)'
		);
		//-# this returns the correct result, but also sets a global variable, because 'this' is window
		__assert.equal(
			punchedArgumentTypeFunctionAutoApply.apply(baseContext, args)
			,40
			,'punchedArgumentsTypeFunctionAutoApply should return 40 (30 + 10)'
		);
		__assert.equal(
			punchedThisTypeFunctionAutoApply.apply(baseContext, args)
			,40
			,'punchedThisTypeFunctionAutoApply should return 40 (30 + 10)'
		);

		//--ensure baseContext key is reset from 'this' duck punch type
		//---should be reset to undefined since it wasn't before
		__assert.equal(
			baseContext[__.core.functions.config.duckPunchKey]
			,undefined
			, 'baseContext[' + __.core.functions.config.duckPunchKey + '] should be reset to original value of undefined'
		);
		//---now try when a value is set
		baseContext[__.core.functions.config.duckPunchKey] = 26;
		punchedThisTypeFunction.apply(baseContext, args);
		__assert.equal(
			baseContext[__.core.functions.config.duckPunchKey]
			,26
			, 'baseContext[' + __.core.functions.config.duckPunchKey + '] should be reset to original value of 26'
		);

		//==cleanup
		//-#because punchedArgumentTypeFunctionAutoApply is in the scope of window, fromBase gets set on window, so we must reset it
		if(originalFromBase === undefined){
			delete window.fromBase;
		}else{
			window.fromBase = originalFromBase;
		}
	});
}));
