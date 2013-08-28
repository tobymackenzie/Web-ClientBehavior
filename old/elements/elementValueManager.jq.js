/*
Class: ElementValueManager
Provides uniform interface for getting and (setting) 'values' of an element (or collection of radio buttons), monitoring them for changes

Dependencies:
	tmlib
	jquery

Parameters:
	dataSourceValue(String): value of specified element attribute or data key
	elements(jQuery): element(s) this interface provides data for
	event(String): event to trigger on change
	type(String): type of source this class is, changes what to monitor.  Can be one of 'attribute', checked', 'data', or 'value'
Example:
	$(document).ready(function(){
		var elmValueManagerPrice = new __.classes.elementValueManager({element:elmThis, type: 'attribute', dataSourceValue: 'data-price'})
		var elmValueManagerQuantity = new __.classes.elementValueManager({element:elmThis.find('select'), type: 'value'})
	}

*/
/* global __ */

__.classes.ElementValueManager = __.core.Classes.create({
	'properties': {
		'type': 'value'
		,'dataSourceValue': null
		,'elements': null
		,'event': 'change'

		,getValue: function(){
			var _return = false;
			var _type = this.type;
			var _elements = (this.elements.length > 1)
				? this.elements.filter(':checked')
				: this.elements
			;
			if(_type.substr(0, 7) == 'checked'){
				var _newDataSource = _type.substr(7);
				if(_return){
					_type = (_newDataSource) ? _newDataSource : _type;
				}else{
					_type = false;
				}
			}
			switch(_type){
				case 'attribute':
					_return = _elements.attr(this.dataSourceValue);
				break;
				case 'data':
					_return = _elements.data(this.dataSourceValue);
				break;
				case 'value':
					_return = _elements.val();
				break;
			}
			return _return;
		}
		,on: function(){
			this.elements.on.apply(this.elements, arguments);
			return this;
		}
		,setValue: function(_value){
			var _type = this.type;
			var _elements = (this.elements.length > 1)
				? this.elements.filter(':checked')
				: this.elements
			;
			if(_type.substr(0, 7) == 'checked'){
				var _newDataSource = _type.substr(7);
				_elements.checked = true;
				if(_value != 'checked'){
					_type = (_newDataSource) ? _newDataSource : _type;
				}else{
					_type = false;
				}
			}else{
				if(_value == 'checked'){
					_elements.attr('checked', 'checked');
				}else{
					_elements.removeAttr('checked');
				}
			}
			if(this.elements.length > 1 && _type == 'value'){
				_elements = this.elements.filter('[value="' + _value + '"]');
				_elements.attr('checked', 'checked');
			}else{
				switch(_type){
					case 'attribute':
						_elements.attr(this.dataSourceValue, _value);
					break;
					case 'data':
						_elements.data(this.dataSourceValue, _value);
					break;
					case 'value':
						_elements.val(_value);
					break;
				}
			}

			//--trigger event for listeners
			_elements.trigger(this.event, {value: this.getValue(), manager: this});

			return this;
		}
		,val: function(){
			var _args = arguments;
			if(_args.length === 0){
				return this.getValue.apply(this, _args);
			}else{
				return this.setValue.apply(this, _args);
			}
		}
	}
});
