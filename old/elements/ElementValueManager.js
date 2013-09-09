/*
Class: ElementValueManager

Provides uniform interface for getting and (setting) 'values' of an element, monitoring them for changes

Dependencies:
	tmlib: addEventListeners, dispatchEvent

Parameters:
	dataSourceValue(String): value of specified element attribute or data key
	elements(Element): element(s) this interface provides data for
	event(String): event to trigger on change
	type(String): type of source this class is, changes what to monitor.  Can be one of 'attribute', checked', 'data', or 'value'
Example:
	$(document).ready(function(){
		var elmValueManagerPrice = new __.classes.elementValueManager({element:document.getElementById('myInput')})
	}

*/
/* global __ */
__.classes.ElementValueManager = __.core.Classes.create({
	'init': function(){
		this.__base(arguments);
	}
	,'properties': {
		'type': 'value'
		,'dataSourceValue': null
		,'elements': null
		,'event': 'change'

		,getValue: function(){
			var _return = false;
			var _type = this.type;
			if(_type.substr(0, 7) == 'checked'){
				var _newType = _type.substr(7);
				if(_return){
					_type = (_newType) ? _newType : _type;
				}else{
					_type = false;
				}
			}
			switch(_type){
				case 'attribute':
					_return = this.elements[this.dataSourceValue];
				break;
				case 'value':
					_return = this.elements.value;
				break;
			}
			return _return;
		}
		,on: function(_event, _callback, _bubble){
			__.lib.addListeners(this.elements, _event, function(){ _callback.apply(this, arguments); }, _bubble);
			return this;
		}
		,setValue: function(_value){
			var _type = this.type;
			if(_type.substr(0, 7) == 'checked'){
				this.elements.checked = true;
				if(_value != 'checked'){
					var _newType = _type.substr(7);
					_type = (_newType) ? _newType : _type;
				}else{
					_type = false;
				}
			}else{
				if(_value == 'checked'){
					this.elements.checked = true;
				}else{
					this.elements.checked = false;
				}
			}
			switch(_type){
				case 'attribute':
					this.elements[this.dataSourceValue] = _value;
				break;
				case 'value':
					this.elements.value = _value;
				break;
			}

			__.lib.dispatchEvent(this.elements, this.event);
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
