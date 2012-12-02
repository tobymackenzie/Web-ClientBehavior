test('core.Functions.contains', function(){
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
test('core.Functions.duckPunch', function(){
	//==initial setup
	//--base function to duck punch
	var baseFunction = function(argOne, argTwo){
		return argOne + argTwo;
	}

	//--wrapper functions of both types
	var wrapperFunctionArgumentType = function(argOne, argTwo){
		var originalFunction = Array.prototype.shift.call(arguments);
		argOne += 10;
		return baseFunction.apply(this, arguments);
	}
	var wrapperFunctionThisType = function(argOne, argTwo){
		argOne += 10;
		return this.__original.apply(this, arguments);
	}

	//--duck punch baseFunction
	var punchedArgumentTypeFunction = __.core.Functions.duckPunch(baseFunction, wrapperFunctionArgumentType);
	var punchedThisTypeFunction = __.core.Functions.duckPunch(baseFunction, wrapperFunctionThisType, {type: 'this'});

	//--arguments to run through all runs of function
	var args = [10, 20];

	//--grap duck punch key value so it can be reset on teardown
	var originalValueForDuckPunchKey = window[__.core.Functions.configuration.duckPunchKey] || undefined;

	//==tests
	//--test values through all three versions of function
	assert.equal(
		baseFunction.apply(window, args)
		,30
		,'baseFunction should return 30'
	);
	assert.equal(
		punchedArgumentTypeFunction.apply(window, args)
		,40
		,'punchedArgumentTypeFunction should return 40 (30 + 10)'
	);
	assert.equal(
		punchedThisTypeFunction.apply(window, args)
		,40
		,'punchedThisTypeFunction should return 40 (30 + 10)'
	);

	//--ensure window key is reset from 'this' duck punch type
	//---should be reset to undefined since it wasn't before
	assert.equal(
		window[__.core.Functions.configuration.duckPunchKey]
		,undefined
		, 'window[' + __.core.Functions.configuration.duckPunchKey + '] should be reset to original value of 26'
	);
	//---now try when a value is set
	window[__.core.Functions.configuration.duckPunchKey] = 26;
	punchedThisTypeFunction.apply(window, args)
	assert.equal(
		window[__.core.Functions.configuration.duckPunchKey]
		,26
		, 'window[' + __.core.Functions.configuration.duckPunchKey + '] should be reset to original value of 26'
	);

	//==teardown
	//--reset duck punch key
	window[__.core.Functions.configuration.duckPunchKey] = originalValueForDuckPunchKey;
});
