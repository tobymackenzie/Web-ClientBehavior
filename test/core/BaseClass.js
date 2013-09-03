/* global define, QUnit, test */
(function(_globals, _factory){
	if(typeof define === 'function' && define.amd){
		define(['tmlib/core/__', 'tmlib/core/BaseClass'], _factory);
	}else{
		var __ = _globals.__;
		_factory(__, __.core.deps);
	}
}(this, function(__){
	/*
	Currently just making sure tests still passes when tmclasses.BaseClass is ported into tmlib.  Using tests from when tmclasses wasn't separate.
	*/
	//--name module
	QUnit.module('tmlib.core.BaseClass');

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
	test('direct call init', function(assert){
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
	test('::create() init', function(assert){
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
	test('inited flags', function(assert){
		//==initial setup
		var _instance = new __.core.BaseClass();

		//==tests
		assert.ok(
			_instance.isInited
			,'instance should be flagged as isInited'
		);
		assert.ok(
			_instance.hasInited
			,'instance should be flagged as hasInited'
		);
		_instance.deInit();
		assert.ok(
			!_instance.isInited
			,'instance should no longer be flagged as isInited after a deInit()'
		);
		assert.ok(
			_instance.hasInited
			,'instance should still be flagged as hasInited after a deInit()'
		);
	});
}));
