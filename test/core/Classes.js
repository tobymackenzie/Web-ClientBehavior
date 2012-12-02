test('core.Classes.create', function(){
	//==initial setup
	//--create parent class
	var parentClass = __.core.Classes.create({
	    'init': function(){
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
	    	this.propertyFromChildClassInit = 'woo';
	    }
	    ,'properties': {
	        'childClassProperty1': 'boo'
	        ,'childClassProperty2': 'far'
	        ,'parentClassProperty2': 'overriddenBar'
	    }
	});
	//--create instance of child class
	var childClassInstance = new childClass(/*{
		//-! for currently removed functionality
	    'instanceProperty1': 'ifoo'
	    ,'childClassProperty2': 'overriddenFar'
	}*/);

	//==test
	//--properties
	//---parent
	assert.ok(parentClassInstance.parentClassProperty1, 'parentClassInstance.parentClassProperty1 should be set');
	assert.equal(parentClassInstance.parentClassProperty1, 'foo', 'parentClassInstance.parentClassProperty1 should match prototype');
	assert.equal(parentClassInstance.parentClassProperty2, 'bar', 'parentClassInstance.parentClassProperty2 should match prototype');
	//---child	
	assert.equal(childClassInstance.parentClassProperty1, 'foo', 'childClassInstance.parentClassProperty1 should match parent prototype');
	assert.equal(childClassInstance.parentClassProperty2, 'overriddenBar', 'parentClassInstance.parentClassProperty2 should match subclass prototype');
	assert.equal(childClassInstance.childClassProperty1, 'boo', 'parentClassInstance.childClassProperty1 should match subclass prototype');
	//-! for currently removed functionality
	//assert.equal(childClassInstance.childClassProperty2, 'overriddenFar', 'parentClassInstance.childClassProperty2 should match instance value');
	//assert.equal(childClassInstance.childClassProperty2, 'overriddenFar', 'parentClassInstance.childClassProperty2 should match instance value');
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
	assert.ok(typeof childClassInstance.propertyFromParentClassInit == 'undefined', 'childClassInstance should not have property propertyFromParentClassInit');
	assert.ok(typeof childClassInstance.propertyFromChildClassInit != 'undefined', 'childClassInstance should have property propertyFromChildClassInit');
});