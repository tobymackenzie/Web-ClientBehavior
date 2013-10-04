/*
Class: Form
Form widget for submitting form via ajax
*/
/* global __, jQuery */
__.classes.Form = __.core.Classes.create({
	init: function(){
		this.__base(arguments);
		if(typeof this.action !== 'undefined'){
			this.actionType = 'fixed';
		}
		if(typeof this.method !== 'undefined'){
			this.methodType = 'fixed';
		}
		__.mixins.Widget.properties.init.apply(this, arguments);
	}
	,mixins: [
		__.mixins.Widget
		,__.mixins.InitHandling
	]
	,properties: {
		action: null
		,actionType: 'deferred'
		,data: null
		,deinit: function(){
			this.setElements(undefined);
			__.mixins.InitHandling.properties.deinit.apply(this, arguments);
		}
		,inputSelector: 'input[name],select[name],textarea[name]'
		,method: 'post'
		,methodType: 'deferred'
		,onSend: null
		,onSubmit: function(_values, _event){
			var _this = this;
			if(_this.onSend){
				_this.onSend.call(this, _values, _event);
			}
			jQuery.ajax({
				url: this.action
				,data: jQuery.extend({}, this.data, _values)
				,type: this.method.toUpperCase()
				,success: function(_response){
					if(_this.onSuccess){
						_this.onSuccess(_response);
					}
				}
			});
		}
		,onSuccess: null
		,reset: function(){
			this.elements.each(function(){
				this.reset();
			});
		}
		,setElements: function(_elements){
			//--unbind for old elements if a jQuery instance
			if(this.elements && this.elements instanceof jQuery){
				this.elements.off('submit', this.submitHandler);
			}

			//--set new elements
			__.mixins.Widget.properties.setElements.call(this, _elements);

			if(_elements && _elements instanceof jQuery){
				//--bind
				this.elements.on('submit', jQuery.proxy(this.submitHandler, this));

				//--set action if needed
				if(this.actionType == 'deferred'){
					//--set object action to action of form element
					var _action = this.elements.attr('action');
					if(_action){
						this.action = _action;
					//--if empty form action, attempt to use url that was passed in for form location or current href
					}else{
						this.action = this.elementsUrl;
					}
				}

				//--set method if needed
				if(this.methodType == 'deferred'){
					//--set object method to method of form element, if it has one
					var _method = this.elements.attr('method');
					if(_method){
						this.method = _method;
					}
				}
			}
		}
		,submitHandler: function(_event){
			var _values = {};
			this.elements.find(this.inputSelector).each(function(){
				var $this = jQuery(this);
				_values[$this.attr('name')] = $this.val();
			});
			if(this.onSubmit){
				this.onSubmit.call(this, _values, _event);
			}
			if(_event.preventDefault){
				_event.preventDefault();
			}
			return false;
		}
	}
});
