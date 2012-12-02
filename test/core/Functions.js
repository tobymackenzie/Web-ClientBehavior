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