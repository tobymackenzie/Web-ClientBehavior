test('core.Functions.contains', function(assert){
	//==initial setup
	var testFunction = function(argOne, argTwo){
		var thisBase = this.__base || undefined;
	}

	var strings = [
		{
			'message': 'Arguments should be tested'
			,'regex': /\bargOne\b/
			,'string': 'argOne'
			,'shouldBe': true
		}
		,{
			'message': 'Function body should be tested'
			,'regex': /\b__base\b/
			,'string': '__base'
			,'shouldBe': true
		}
		,{
			'message': 'Non-existing string should not be found'
			,'regex': /\bfoo\b/
			,'string': 'foo'
			,'shouldBe': false
		}
	];

	//==tests
	//--strings
	for(
		var i = 0, stringsLength = strings.length
		; i < stringsLength
		; ++i
	){
		var lopItem = strings[i];
		if(lopItem.string || false){
			var expect = (typeof lopItem.shouldBe == 'boolean') ? lopItem.shouldBe : true;
			var message =
				'String test (' + lopItem.string + ')'
				+ (
					(lopItem.message || false)
					? ': ' + lopItem.message
					: ''
				)
			;
			assert.equal(
				__.core.Functions.contains(testFunction, lopItem.string)
				,expect
				,message
			);
		}
	}

	//--regex
	for(
		var i = 0, stringsLength = strings.length
		; i < stringsLength
		; ++i
	){
		var lopItem = strings[i];
		if(lopItem.regex || false){
			var expect = (typeof lopItem.shouldBe == 'boolean') ? lopItem.shouldBe : true;
			var message =
				'Straight regex test (' + lopItem.string + ')'
				+ (
					(lopItem.message || false)
					? ': ' + lopItem.message
					: ''
				)
			;
			assert.equal(
				__.core.Functions.contains(testFunction, lopItem.regex)
				,expect
				,message
			);
		}
	}

	//--string regex
	for(
		var i = 0, stringsLength = strings.length
		; i < stringsLength
		; ++i
	){
		var lopItem = strings[i];
		if(lopItem.string || false){
			var expect = (typeof lopItem.shouldBe == 'boolean') ? lopItem.shouldBe : true;
			var message =
				'String regex test (' + lopItem.string + ')'
				+ (
					(lopItem.message || false)
					? ': ' + lopItem.message
					: ''
				)
			;
			assert.equal(
				__.core.Functions.contains(testFunction, '\\b' + lopItem.string + '\\b')
				,expect
				,message
			);
		}
	}
});
test('core.Functions.duckPunch', function(assert){
	//==initial setup
	//--store this for cleanup later
	var originalFromBase = window.fromBase || undefined;
	//--base context for checking changes
	var baseContext = {
		fromBase: false
		,fromWrapper: false
	}
	var resetBaseContext = function(){
		baseContext.fromBase = false;
		baseContext.fromWrapper = false;
	}

	//--base function to duck punch
	var baseFunction = function(argOne, argTwo){
		this.fromBase = true;
		return argOne + argTwo;
	}

	//--wrapper functions
	//---for value and context testing
	var wrapperFunctionArgumentType = function(argOne, argTwo){
		var originalFunction = Array.prototype.shift.call(arguments);
		this.fromWrapper = true;
		argOne += 10;
		return originalFunction.apply(this, arguments);
	}
	var wrapperFunctionThisType = function(argOne, argTwo){
		this.fromWrapper = true;
		argOne += 10;
		return this.__original.apply(this, arguments);
	}
	var wrapperFunctionArgumentTypeAutoApply = function(argOne, argTwo){
		var originalFunction = Array.prototype.shift.call(arguments);
		this.fromWrapper = true;
		argOne += 10;
		return originalFunction(arguments);
	}
	var wrapperFunctionThisTypeAutoApply = function(argOne, argTwo){
		this.fromWrapper = true;
		argOne += 10;
		return this.__original(arguments);
	}

	//--duck punch baseFunction
	//---for value and context testing
	var punchedArgumentTypeFunction = __.core.Functions.duckPunch(baseFunction, wrapperFunctionArgumentType);
	var punchedThisTypeFunction = __.core.Functions.duckPunch(baseFunction, wrapperFunctionThisType, {type: 'this'});
	var punchedArgumentTypeFunctionAutoApply = __.core.Functions.duckPunch(baseFunction, wrapperFunctionArgumentTypeAutoApply, {autoApply: true});
	var punchedThisTypeFunctionAutoApply = __.core.Functions.duckPunch(baseFunction, wrapperFunctionThisTypeAutoApply, {autoApply: true, type: 'this'});

	//--arguments to run through all runs of function
	var args = [10, 20];

	//==tests
	//--test context is making it through
	baseFunction.apply(baseContext, args);
	assert.ok(baseContext.fromBase, 'baseContext.fromBase should be true when only baseFunction called');
	assert.ok(!baseContext.fromWrapper, 'baseContext.fromWrapper should be false when only baseFunction called');
	resetBaseContext();

	punchedArgumentTypeFunction.apply(baseContext, args);
	assert.ok(baseContext.fromBase, 'baseContext.fromBase should be true when punchedArgumentTypeFunction called');
	assert.ok(baseContext.fromWrapper, 'baseContext.fromWrapper should be true when punchedArgumentTypeFunction called');
	resetBaseContext();

	punchedThisTypeFunction.apply(baseContext, args);
	assert.ok(baseContext.fromBase, 'baseContext.fromBase should be true when punchedThisTypeFunction called');
	assert.ok(baseContext.fromWrapper, 'baseContext.fromWrapper should be true when punchedThisTypeFunction called');
	resetBaseContext();

	//-# this test will not work for punchedArgumentTypeFunctionAutoApply because it does not properly handle 'this' in base function

	punchedThisTypeFunctionAutoApply.apply(baseContext, args);
	assert.ok(baseContext.fromBase, 'baseContext.fromBase should be true when punchedThisTypeFunctionAutoApply called');
	assert.ok(baseContext.fromWrapper, 'baseContext.fromWrapper should be true when punchedThisTypeFunctionAutoApply called');
	resetBaseContext();

	//--test values through all versions of function
	assert.equal(
		baseFunction.apply(baseContext, args)
		,30
		,'baseFunction should return 30'
	);
	assert.equal(
		punchedArgumentTypeFunction.apply(baseContext, args)
		,40
		,'punchedArgumentTypeFunction should return 40 (30 + 10)'
	);
	assert.equal(
		punchedThisTypeFunction.apply(baseContext, args)
		,40
		,'punchedThisTypeFunction should return 40 (30 + 10)'
	);
	//-# this returns the correct result, but also sets a global variable, because 'this' is window
	assert.equal(
		punchedArgumentTypeFunctionAutoApply.apply(baseContext, args)
		,40
		,'punchedArgumentsTypeFunctionAutoApply should return 40 (30 + 10)'
	);
	assert.equal(
		punchedThisTypeFunctionAutoApply.apply(baseContext, args)
		,40
		,'punchedThisTypeFunctionAutoApply should return 40 (30 + 10)'
	);

	//--ensure baseContext key is reset from 'this' duck punch type
	//---should be reset to undefined since it wasn't before
	assert.equal(
		baseContext[__.core.Functions.configuration.duckPunchKey]
		,undefined
		, 'baseContext[' + __.core.Functions.configuration.duckPunchKey + '] should be reset to original value of undefined'
	);
	//---now try when a value is set
	baseContext[__.core.Functions.configuration.duckPunchKey] = 26;
	punchedThisTypeFunction.apply(baseContext, args)
	assert.equal(
		baseContext[__.core.Functions.configuration.duckPunchKey]
		,26
		, 'baseContext[' + __.core.Functions.configuration.duckPunchKey + '] should be reset to original value of 26'
	);

	//==cleanup
	//-#because punchedArgumentTypeFunctionAutoApply is in the scope of window, fromBase gets set on window, so we must reset it
	if(originalFromBase === undefined){
		delete window.fromBase;
	}else{
		window.fromBase = originalFromBase;
	}
});
