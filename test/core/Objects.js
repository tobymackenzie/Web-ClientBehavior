test('core.Objects.addProperty', function(assert){
	//==initial setup
	var myObject = {
		initiallySetProperty: 'initiallySetValue'
	};
	//--add simple properties
	__.core.Objects.addProperty(myObject, 'addedStringProperty', 'addedValue');
	__.core.Objects.addProperty(myObject, 'addedNumericProperty', 1234);
	__.core.Objects.addProperty(myObject, 'addedFunctionProperty', function(){ return 'from added function property'; });
	__.core.Objects.addProperty(myObject, 'addedObjectProperty', {
		'subStringProperty': 'subValue'
		,'subNumericProperty': 5432
		,'subFunctionProperty': function(){ return 'from sub function property'; }
		,'subObjectProperty': { 'subSubProperty': 'subSubValue' }
	});

	//--add complex properties
	__.core.Objects.addProperty(myObject, 'addedComplexStringProperty', {'init': 'addedComplexValue'});
	__.core.Objects.addProperty(myObject, 'addedComplexNumericProperty', {'init': 4321});
	__.core.Objects.addProperty(myObject, 'addedComplexFunctionProperty', {'init': function(){ return 'from complex function property'; }});
	__.core.Objects.addProperty(myObject, 'addedComplexObjectProperty', {
		'init': {
			'complexSubProperty': 'complexSubValue'
		}
		,'unusedKey': 'unusedValue'
	});

	//==test
	assert.equal(myObject.initiallySetProperty, 'initiallySetValue', 'addProperty should not destroy existing values');
	assert.equal(myObject.addedStringProperty, 'addedValue', 'Simple string property should be set properly');
	assert.equal(myObject.addedNumericProperty, 1234, 'Simple numeric property should be set properly');
	assert.equal(myObject.addedFunctionProperty(), 'from added function property', 'Simple function property should be set properly');
	assert.equal(typeof myObject.addedObjectProperty, 'object', 'Simple object property should be set to an object');
	assert.equal(myObject.addedObjectProperty.subStringProperty, 'subValue', 'Simple object property\'s properties should be set properly');
	assert.equal(myObject.addedObjectProperty.subNumericProperty, 5432, 'Simple object property\'s properties should be set properly');
	assert.equal(myObject.addedObjectProperty.subFunctionProperty(), 'from sub function property', 'Simple object property\'s properties should be set properly');
	assert.equal(myObject.addedObjectProperty.subObjectProperty.subSubProperty, 'subSubValue', 'Simple object property\'s properties should be set properly');
	assert.equal(myObject.addedComplexStringProperty, 'addedComplexValue', 'Complex string property should be set properly');
	assert.equal(myObject.addedComplexNumericProperty, 4321, 'Complex numeric property should be set properly');
	assert.equal(myObject.addedComplexFunctionProperty(), 'from complex function property', 'Complex function property should be set properly');
	assert.equal(typeof myObject.addedComplexObjectProperty, 'object', 'Complex object property should have an object as a value');
	assert.equal(myObject.addedComplexObjectProperty.complexSubProperty, 'complexSubValue', 'Complex function property should be set properly');
});
