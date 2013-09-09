/*
Class: ElementValueManager

Provides uniform interface for getting and (setting) 'values' of an element, monitoring them for changes

Dependencies:
	tmlib
	xui
Parameters:
	dataSource(required string)
		[attribute] value of specified element attribute
		[checked] boolean checked or not checked value of input[checkbox] or input[radiobutton]
		[value] value of input, select, or textarea
Example:
	x$(window).load(function(){
		var elmValueManagerPrice = new __.classes.ElementValueManager({element:elmThis, dataSource: 'attribute', attribute: 'data-price'})
		var elmValueManagerQuantity = new __.classes.ElementValueManager({element:elmThis.find('select'), dataSource: 'value'})
	}
*/
/* global __ */

__.classes.ElementValueManager = function(_args){
		//--require attributes
		this.element = _args.element || null;
		if(!this.element){
			return false;
		}else if(this.element.length != 1){
			return false;
		}
		this.dataSource = _args.dataSource || null;
		if(!this.dataSource){
			return false;
		}

		//--optional attributes
		this.attribute = _args.attribute || null;
		this.event = _args.event || 'change';

		//--derived attributes
/*
		var _this = this;

		if(this.event){
			this.element.on(this.event, function(event){
				_this.fire('change', {value: _this.getValue, manager: _this});
			});
		}
*/
	};
	__.classes.ElementValueManager.prototype.getValue = function(){
		var fncReturn = false;
		switch(this.dataSource){
			case 'attribute':
				fncReturn = this.element.attr(this.attribute);
				break;
			case 'checked':
				fncReturn = ((this.element.has(':checked').length > 0)? true: false);
				break;
			case 'value':
				fncReturn = this.element[0].value; //-bug- waiting for the attr version of this to
				break;
		}

		return fncReturn;
	};
	__.classes.ElementValueManager.prototype.addChangeListener = function(argCallback){
		var _this = this;
		var fncCallback = argCallback;
		if(_this.event){
			_this.element.on(this.event, function(event){
				event.data = _this.getValue();
				fncCallback.call(_this, event);
			});
		}else{
			return false;
		}
	};
