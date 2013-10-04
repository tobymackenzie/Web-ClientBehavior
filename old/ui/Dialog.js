/*
Class: HandlerDialog
Handler for dialog to use single dialog with changing content, passed directly or via ajax call

Dependencies:
	tmlib: getWidthScrollbar, AjaxForm(if selectorAjaxForm), __.lib.isNumeric
	jquery
	jqueryui: dialog

*/
/* global __, jQuery */
__.classes.Dialog = __.core.Classes.create({
	init: function(){
		this.__base(arguments);
		if(typeof this.container === 'undefined'){
			this.container = jQuery('body');
		}
		if(typeof this.elements !== 'string'){
			this.setElements(this.elements);
		}
	}
	,mixins: __.mixins.Widget
	,properties: {
		$: '.dialog'
		,addElmToDOM: function(_elm, _container){
			_container.append(_elm);
			return this;
		}
		,blocker: null
		,container: undefined
		,elements: '<div class="dialogWrapWrap"><div class="dialogWrap"><div class="dialog"></div></div></div>'
		,get$: function(){
			if(typeof this.$ === 'string'){
				this.loadElm(this.$, 'set$', this.getElements());
			}
			return this.$;
		}
		,hide: function(){
			__.mixins.Widget.properties.hide.apply(this, arguments);
			if(this.blocker){
				this.blocker.hide();
			}
			return this;
		}
		,loadElm: function(_elm, _setter, _container){
			var _promise;
			var _this = this;
			if(typeof _elm === 'string'){
				var _newElm;
				if(__.lib.isUrl(_elm)){
					var _request = jQuery.ajax({
						url: _elm
						,dataType: 'html'
						,success: function(argData){
							var _elements = jQuery(argData);
							_this.addElmToDOM(_elements, _container);
							_this[_setter](_elements);
						}
					});
					_promise = _request.promise();
				}else if(__.lib.isHTML(_elm)){
					_newElm = jQuery(_elm);
					this.addElmToDOM(_newElm);
					this[_setter](_newElm);
				}else{
					_newElm = _container.find(_elm);
					if(!_newElm.length){
						_newElm = jQuery(_elm);
					}
					this[_setter](_newElm);
				}
			}
			//--if there is no promise, return an already resolved promise
			if(typeof _promise === 'undefined'){
				_promise = jQuery.Deferred();
				_promise.resolve();
			}
			return _promise;
		}
		,set$: function(_$){
			if(typeof this.$ === 'object'){
				this.$.off('click', this.stopPropogationHandler);
			}
			this.$ = _$;
			this.$.on('click', this.stopPropogationHandler);
			return this;
		}
		,setContent: function(_content){
			this.get$().html(_content);
			return this;
		}
		,setElements: function(_elm){
			var _this = this;
			__.mixins.Widget.properties.setElements.call(this, _elm);
			this.getElements().on('click', function(){
				_this.hide();
			});
		}
		,show: function(){
			__.mixins.Widget.properties.show.apply(this, arguments);
			if(this.blocker){
				this.blocker.show();
			}
			return this;
		}
		,stopPropogationHandler: function(_event){
			return _event.stopPropagation && _event.stopPropagation();
		}
	}
});
