
(function(_globals, _factory){
	if(typeof define === 'function' && define.amd){
		define(['tmlib/core/__', 'tmlib/core/objects'], _factory);
	}else{
		var __ = _globals.__;
		_factory(__, __.core.deps);
	}
}(this, function(__){
	//--define module
	QUnit.module('tmlib.core.objects');

	//--run tests
	test('addProperty', function(assert){
		//==initial setup
		var myObject = {
			initiallySetProperty: 'initiallySetValue'
		};
		//--add simple properties
		__.core.objects.addProperty(myObject, 'addedStringProperty', 'addedValue');
		__.core.objects.addProperty(myObject, 'addedNumericProperty', 1234);
		__.core.objects.addProperty(myObject, 'addedFunctionProperty', function(){ return 'from added function property'; });
		__.core.objects.addProperty(myObject, 'addedObjectProperty', {
			'subStringProperty': 'subValue'
			,'subNumericProperty': 5432
			,'subFunctionProperty': function(){ return 'from sub function property'; }
			,'subObjectProperty': { 'subSubProperty': 'subSubValue' }
		});

		//--add complex properties
		__.core.objects.addProperty(myObject, 'addedComplexStringProperty', {'init': 'addedComplexValue'});
		__.core.objects.addProperty(myObject, 'addedComplexNumericProperty', {'init': 4321});
		__.core.objects.addProperty(myObject, 'addedComplexFunctionProperty', {'init': function(){ return 'from complex function property'; }});
		__.core.objects.addProperty(myObject, 'addedComplexObjectProperty', {
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
}));
