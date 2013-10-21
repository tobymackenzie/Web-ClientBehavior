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
		,$content: '.dialogContent'
		,$closeButton: '<a class="dialogCloseButton closeButton button">Close Dialog</a>'
		,addElmToDOM: function(_elm, _container){
			_container.append(_elm);
			return this;
		}
		,blocker: null
		,container: undefined
		,elements: '<div class="dialogWrapWrap"><div class="dialogWrap"><div class="dialog"><div class="dialogContent"></div></div></div></div>'
		,get$: function(){
			if(typeof this.$ === 'string'){
				this.loadElm(this.$, 'set$', this.getElements());
			}
			return this.$;
		}
		,get$Content: function(){
			if(typeof this.$content === 'string'){
				this.loadElm(this.$content, 'set$Content', this.get$());
			}
			return this.$content;
		}
		,get$CloseButton: function(){
			if(typeof this.$closeButton === 'string'){
				this.loadElm(this.$closeButton, 'set$CloseButton', this.get$());
			}
			return this.$closeButton;
		}
		,hide: function(){
			__.mixins.Widget.properties.hide.apply(this, arguments);
			if(this.blocker){
				this.blocker.hide();
			}
			return this;
		}
		,loadElm: function(_elm, _setter, _container){
			var _promise
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
					this.addElmToDOM(_newElm, _container);
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
			this.$ = _$;
			if(this.get$CloseButton()){
				this.get$CloseButton().on('click', jQuery.proxy(this.hide, this));
			}
			return this;
		}
		,set$Content: function(_$){
			this.$content = _$;
			return this;
		}
		,set$CloseButton: function(_$){
			if(this.$closeButton instanceof jQuery){
				this.get$CloseButton.off('click', jQuery.proxy(this.hide, this));
			}
			this.$closeButton = _$;
			return this;
		}
		,setContent: function(_content){
			this.get$Content().html(_content);
			return this;
		}
		,setElements: function(_elm){
			var _this = this;
			__.mixins.Widget.properties.setElements.call(this, _elm);
			this.getElements().on('click', '.dialogWrap', function(_event){
				if(_event.target === this){
					_this.hide();
				}
			});
		}
		,show: function(){
			__.mixins.Widget.properties.show.apply(this, arguments);
			if(this.blocker){
				this.blocker.show();
			}
			return this;
		}
	}
});

