define(function(__require){
	var __classes = __require('./classes');
	var __tmlib = __require('./TMLib');

	/*
	Class: BaseClass
	Class to be used as parent for most other classes.  Provides the default behavior of accepting a map as the first parameter of the constructor and merging each key into the resulting instance object.
	*/
	var __BaseClass = __classes.create({
		/*
		Function: init
		Parameters:
			options(map): receives a key value map of properties to add or apply to instance being created.
		*/
		'init': function(_options){
			_options = _options || {};
			//--set value of members from arguments
			for(var _key in _options){
				if(_options.hasOwnProperty(_key)){
					this.__directSet(_key, _options[_key]);
				}
			}
		}
		,'properties': {
			/*
			Method: __directSet
			Directly set a property, without invoking any sort of set helper functions
			*/
			'__directSet': function(_key, _value){
				this[_key] = _value;
			}
		}
	});

	//--add to tmlib and export
	__tmlib.__('.core', {'BaseClass': __BaseClass});
	return __BaseClass;
});
