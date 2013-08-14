(function(_globals, _factory){
	if(typeof define === 'function' && define.amd){
		define(['tmlib/core/__', 'tmlib/core/deps', 'tmlib/core/classes', 'tmlib/core/BaseClass'], _factory);
	}else{
		var __ = _globals.__;
		_factory(__, __.core.deps);
	}
}(this, function(__, __deps){
	//--get requirements
	var __jQuery = __deps.jQuery;

	//--name module
	QUnit.module('tmlib.core.classes');

	//--define tests
	test('create', function(assert){
		//==initial setup
		//--create parent class
		var parentClass = __.core.classes.create({
			parent: Object
			,init: function(){
				this.propertyFromParentClassInit = 'woo';
			}
			,properties: {
				parentClassProperty1: 'foo'
				,parentClassProperty2: 'bar'
			}
		});
		//--create instance of parent class
		var parentClassInstance = new parentClass();
		//--create child class
		var childClass = __.core.classes.create({
			parent: parentClass
			,init: function(){
				this.__base(arguments);
				this.propertyFromChildClassInit = 'woo';
			}
			,'properties': {
				childClassProperty1: 'boo'
				,childClassProperty2: 'far'
				,parentClassProperty2: 'overriddenBar'
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
		assert.equal(childClassInstance.propertyFromParentClassInit, 'woo', 'childClassInstance should have proper property propertyFromParentClassInit value');
		assert.ok(typeof childClassInstance.propertyFromChildClassInit != 'undefined', 'childClassInstance should have property propertyFromChildClassInit');

		//--prototype
		//---child
		assert.equal(typeof childClass.prototype.propertyFromParentClassInit, 'undefined', 'childClassInstance should not have propertyFromParentClassInit from parent init function');


		//==mixins init
		var mixinMixinA = {
			properties: {
				propertyC: 'mmAvalueC'
			}
		};
		var mixinMixinB = {
			properties: {
				propertyD: 'mmBvalueD'
			}
		}
		var mixinMixinC = {
			properties: {
				propertyD: 'mmCvalueD'
			}
			,postMixins: [
				mixinMixinB
			]
		};
		var preMixinA = {
			properties: {
				propertyA: 'pAvalueA'
				,propertyB: 'pAvalueB'
			}
		};
		var preMixinB = {
			properties: {
				propertyB: 'pBvalueB'
				,propertyC: 'pBvalueC'
			}
		};
		var mixinA = {
			properties: {
				propertyA: 'mAvalueA'
				,propertyC: 'mAvalueC'
				,propertyD: 'mAvalueD'
				,methodA: function(){ return 'from mixinA'; }
			}
		};
		var mixinB = {
			mixins: mixinMixinA
			,properties: {
				propertyE: 'mBvalueE'
				,propertyF: 'mBvalueF'
				,methodA: function(){ return 'from mixinB'; }
			}
		};
		var postMixinA = {
			mixins: mixinMixinC
			,properties: {
				methodB: function(){ return 'from postMixinA'; }
			}
			,nonPropertyA: 'nonProperty'
		};
		var postMixinB = {
			properties: {
				propertyG: 'pBvalueG'
			}
		};
		var containerClass = __.core.classes.create({
			preMixins: [
				preMixinA
				,preMixinB
			]
			,mixins: [
				mixinA
				,mixinB
			]
			,properties: {
				propertyC: 'valueC'
				,propertyE: 'valueE'
				,propertyG: 'valueG'
				,methodB: function(){ return 'from containerClass'; }
			}
			,postMixins: [
				postMixinA
				,postMixinB
			]
		});

		var myInstance = new containerClass();
		var otherInstance = new containerClass();

		//--tests
		//---prototype
		assert.strictEqual(myInstance.methodA, otherInstance.methodA, 'Mixed in properties should be part of classes prototype');

		//---overriding order
		assert.equal(myInstance.methodA(), 'from mixinB', 'Properties in later mixins in same array should override previous mixin properties');
		assert.equal(myInstance.propertyA, 'mAvalueA', 'Properties in mixins should override pre mixin properties');
		assert.equal(myInstance.propertyE, 'valueE', 'Properties in class should override mixin properties');
		assert.equal(myInstance.methodB(), 'from postMixinA', 'Properties in post mixins should override class properties');

		//---multilevel mixing in
		assert.equal(myInstance.propertyC, 'valueC', 'Nested mixins should still be included in proper order to the base mixin');
		assert.equal(myInstance.propertyD, 'mmBvalueD', 'mixinMixinB overrides mixinMixinC overrides mixinA overrides preMixinB');

		//---non properties
		assert.equal(typeof myInstance.nonPropertyA, 'undefined', 'Non properties should not be added to class.')
	});

	test('mixIn', function(assert){
		//==initial setup
		var targetClass = function(){};
		targetClass.originalStatic = 'originalValue';
		targetClass.staticToBeOverridden = 'originalValue';
		var targetObject = {
			originalProperty: 'originalValue'
			,propertyToBeOverridden: 'originalValue'
			,originalMethod: function(){ return this.originalProperty; }
			,methodToBeOverridden: function(){ return 2; }
		};
		var mixinDefinition = {
			properties: {
				mixinProperty: 'mixinValue'
				,propertyToBeOverridden: 'mixinValue'
				,mixinMethod: function(){ return this.mixinProperty; }
				,methodToBeOverridden: function(){ return 'two'; }
			}
			,statics: {
				mixinStatic: 'mixinValue'
				,staticToBeOverridden: 'mixinValue'
			}
		}

		__.core.classes.mixIn(mixinDefinition, targetObject, targetClass);
		//==tests
		//--properties
		assert.equal(
			targetObject.originalProperty
			,'originalValue'
			,'Non-overridden property should remain unchanged'
		);
		assert.equal(
			targetObject.originalMethod()
			,'originalValue'
			,'Non-overridden method should remain unchanged'
		);
		assert.equal(
			targetObject.mixinProperty
			,'mixinValue'
			,'Mixin property should be added'
		);
		assert.equal(
			targetObject.propertyToBeOverridden
			,'mixinValue'
			,'Overridden property should have mixin value'
		);
		assert.equal(
			targetObject.mixinMethod()
			,'mixinValue'
			,'Mixin method should be added'
		);
		assert.equal(
			targetObject.methodToBeOverridden()
			,'two'
			,'Overridden method should return mixin method result'
		);
		//--statics
		assert.equal(
			targetClass.originalStatic
			,'originalValue'
			,'Non-overridden static should remain unchanged'
		);
		assert.equal(
			targetClass.mixinStatic
			,'mixinValue'
			,'Mixin static should be added to parent class'
		);
		assert.equal(
			targetClass.staticToBeOverridden
			,'mixinValue'
			,'Overridden static should have overriding value'
		);
	});

	//---this test only works if jQuery exists
	if(__jQuery){
		test('pluginize', function(assert){
			//==initial setup
			//--create testClass
			var testClass = function(argOptions){
				this.elements = null;
				__.core.objects.mergeInto(this, argOptions);
			}
			testClass.prototype.getElementCount = function(){
				return this.elements.length;
			}

			//--pluginize class
			//---method
			var pluginizedMethod = __.core.classes.pluginize({
				Class: testClass
				,name: 'testPlugin'
				,type: 'method'
			});
			//---jQuery
			__.core.classes.pluginize({
				Class: testClass
				,name: 'testPlugin'
				,type: 'jQuery'
			});

			//--get object instances
			//---method
			var instanceWithMethod = document.getElementsByTagName('body');
			instanceWithMethod.testPlugin = pluginizedMethod;
			//---jQuery
			var jQueryInstance = __jQuery('body');

			//--store reference to first-run version of plugin function
			var firstRunPluginFunction = jQueryInstance.testPlugin;

			//--instantiate class in both pluginized versions and a non-pluginize version
			var instanceOptions = {
				testProperty: 'testValue'
			};
			//--method plugin
			instanceWithMethod.testPlugin(instanceOptions);
			//---jQuery plugin
			jQueryInstance.testPlugin(instanceOptions);
			//---non-plugin
			var nonPluginInstance = new testClass(
				__.core.objects.mergeInto({}, instanceOptions, {elements: jQueryInstance})
			);

			//==tests
			//--ensure plugin function is unchanged (tests exist only because it was replaced before)
			assert.strictEqual(jQueryInstance.testPlugin, firstRunPluginFunction, 'plugin function should be the same on subsequent runs');
			assert.strictEqual(firstRunPluginFunction, __jQuery.fn.testPlugin, 'pluginize should not replace prototypes plugin handler when replacing instances handler');

			//--test function calls
			assert.equal(
				instanceWithMethod.testPlugin('getElementCount')
				,nonPluginInstance.getElementCount()
				,'method pluginized and non-pluginized version of "getElementCount" function should return same value'
			);
			assert.equal(
				jQueryInstance.testPlugin('getElementCount')
				,nonPluginInstance.getElementCount()
				,'jQuery pluginized and non-pluginized version of "getElementCount" function should return same value'
			);

			//--test parameters for instantiation
			assert.equal(
				instanceWithMethod.testPlugin('testProperty')
				,nonPluginInstance.testProperty
				,'method pluginized and non-pluginized instances should have the same value for "testProperty" property'
			);
			assert.equal(
				jQueryInstance.testPlugin('testProperty')
				,nonPluginInstance.testProperty
				,'jQuery pluginized and non-pluginized instances should have the same value for "testProperty" property'
			);
		});
	}

	/*=====
	==Classes
	=====*/
	test('BaseClass', function(assert){
		//==initial setup
		var myInstance = new __.core.BaseClass({
			instanceProperty1: 'value1'
			,instanceProperty2: 'value2'
			,instanceMethod1: function(){
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
	test('BaseClass direct call', function(assert){
		//==initial setup
		var _instance = __.core.BaseClass({foo: 'foo', bar: 'bar'});
		//==tests
		assert.ok(
			_instance instanceof __.core.BaseClass
			,'created object should be instance of BaseClass'
		);
		assert.equal(_instance.foo, 'foo','arguments should be passed to init method');
		assert.equal(_instance.bar, 'bar','arguments should be passed to init method');
	});
	test('BaseClass:create()', function(assert){
		//==initial setup
		var _instance = __.core.BaseClass.create({foo: 'foo', bar: 'bar'});
		//==tests
		assert.ok(
			_instance instanceof __.core.BaseClass
			,'created object should be instance of BaseClass'
		);
		assert.equal(_instance.foo, 'foo','arguments should be passed to init method');
		assert.equal(_instance.bar, 'bar','arguments should be passed to init method');
	});
}));
