test('core.Classes.create', function(){
	//==initial setup
	//--create parent class
	var parentClass = __.core.Classes.create({
		'parent': Object
		,'init': function(){
			this.propertyFromParentClassInit = 'woo';
		}
		,properties: {
			'parentClassProperty1': 'foo'
			,'parentClassProperty2': 'bar'
		}
	});
	//--create instance of parent class
	var parentClassInstance = new parentClass();
	//--create child class
	var childClass = __.core.Classes.create({
		'parent': parentClass
		,'init': function(){
			this.__base(arguments);
			this.propertyFromChildClassInit = 'woo';
		}
		,'properties': {
			'childClassProperty1': 'boo'
			,'childClassProperty2': 'far'
			,'parentClassProperty2': 'overriddenBar'
		}
	});
	//--create instance of child class
	var childClassInstance = new childClass();
	//==test
	//--properties
	//---parent
	assert.ok(parentClassInstance.parentClassProperty1, 'parentClassInstance.parentClassProperty1 should be set');
	assert.equal(parentClassInstance.parentClassProperty1, 'foo', 'parentClassInstance.parentClassProperty1 should match prototype');
	assert.equal(parentClassInstance.parentClassProperty2, 'bar', 'parentClassInstance.parentClassProperty2 should match prototype');
	//---child
	assert.equal(childClassInstance.parentClassProperty1, 'foo', 'childClassInstance.parentClassProperty1 should match parent prototype');
	assert.equal(childClassInstance.parentClassProperty2, 'overriddenBar', 'childClassInstance.parentClassProperty2 should match subclass prototype');
	assert.equal(childClassInstance.childClassProperty1, 'boo', 'childClassInstance.childClassProperty1 should match subclass prototype');
	//---prototype change
	parentClass.prototype.parentClassProperty1 = 'newFoo';
	assert.equal(childClassInstance.parentClassProperty1, 'newFoo', 'childClassInstance.parentClassProperty1 should match modified parent prototype');

	//--instanceof
	//---parent
	assert.ok(parentClassInstance instanceof parentClass, 'parentClassInstance should be instance of parentClass');
	assert.ok(!(parentClassInstance instanceof childClass));
	//---child
	assert.ok(childClassInstance instanceof childClass, 'childClassInstance should be instance of parentClass');
	assert.ok(childClassInstance instanceof parentClass, 'childClassInstance should be instance of parentClass');

	//--init
	//---parent
	assert.ok(typeof parentClassInstance.propertyFromParentClassInit != 'undefined', 'parentClassInstance should have property propertyFromParentClassInit');
	assert.ok(typeof parentClassInstance.propertyFromChildClassInit == 'undefined', 'parentClassInstance should not have property propertyFromChildClassInit');
	assert.ok(typeof childClassInstance.propertyFromParentClassInit != 'undefined', 'childClassInstance should have property propertyFromParentClassInit via duck punching');
	assert.ok(typeof childClassInstance.propertyFromChildClassInit != 'undefined', 'childClassInstance should have property propertyFromChildClassInit');

	//--prototype
	//---child
	assert.equal(typeof childClass.prototype.propertyFromParentClassInit, 'undefined', 'childClassInstance should not have propertyFromParentClassInit from parent init function');

});
test('core.Classes.pluginize', function(){
	//==initial setup
	//--create testClass
	var testClass = function(argOptions){
		this.elements = null;
		jQuery.extend(this, argOptions);
	}
	testClass.prototype.getElementCount = function(){
		return this.elements.length;
	}

	//--pluginize class
	__.core.Classes.pluginize({
		'class': testClass
		,'name': 'testPlugin'
	});

	//--get test jQuery instance
	var jQueryInstance = jQuery('body');

	//--store reference to first-run version of plugin function
	var firstRunPluginFunction = jQueryInstance.testPlugin;

	//--instantiate class in both pluginized and non-pluginize versions
	var instanceOptions = {
		testProperty: 'testValue'
	};
	//---plugin
	jQueryInstance.testPlugin(instanceOptions);
	//---non-plugin
	var nonPluginInstance = new testClass(
		jQuery.extend({}, instanceOptions, {elements: jQueryInstance})
	);

	//==tests
	//--ensure plugin function is unchanged (tests exist only because it was replaced before)
	assert.strictEqual(jQueryInstance.testPlugin, firstRunPluginFunction, 'plugin function should be the same on subsequent runs');
	assert.strictEqual(firstRunPluginFunction, jQuery.fn.testPlugin, 'pluginize should not replace prototypes plugin handler when replacing instances handler');

	//--test function calls
	assert.equal(
		jQueryInstance.testPlugin('getElementCount')
		,nonPluginInstance.getElementCount()
		,'pluginized and non-pluginized version of "getElementCount" function should return same value'
	);

	//--test parameters for instantiation
	assert.equal(
		jQueryInstance.testPlugin('testProperty')
		,nonPluginInstance.testProperty
		,'pluginized and non-pluginized instances should have the same value for "testProperty" property'
	);
});

/*=====
==Classes
=====*/
test('core.Classes.BaseClass', function(){
	//==initial setup
	var myInstance = new __.core.Classes.BaseClass({
		'instanceProperty1': 'value1'
		,'instanceProperty2': 'value2'
		,'instanceMethod1': function(){
			return 'foo';
		}
	});
	//==tests
	//--test property initialization
	assert.ok(typeof myInstance == 'object', 'myInstance should be an object');
	assert.equal(myInstance.instanceProperty1, 'value1', 'myInstance should have a property "instanceProperty1" with value "value1');
	assert.equal(myInstance.instanceProperty2, 'value2', 'myInstance should have a property "instanceProperty2" with value "value2');
	assert.ok(typeof myInstance.instanceMethod1 == 'function', 'myInstance should have a property "instanceMethod1" that is a function');
	assert.equal(myInstance.instanceMethod1(), 'foo', 'myInstance.instanceMethod1() should return the string "foo"');
});
