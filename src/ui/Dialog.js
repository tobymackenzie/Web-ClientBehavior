/*
Class: Dialog

*/
/* global define */
define([
	'tmclasses/tmclasses'
	,'jquery'
], function(
	tmclasses
	,jQuery
){
	var Dialog = tmclasses.create({
		init: function(){
			var _self = this;
			_self.__parent(arguments);
			if(!_self._targets){
				_self._targets = {};
			}
		}
		,properties: {
			//==properties
			//--elms
			$el: '<div class="dialogWrap">'
			,getEl: function(){
				var _self = this;
				if(!(_self.$el instanceof jQuery)){
					_self.initEl();
				}
				return _self.$el;
			}
			,actions: '<div class="dialogActions">'
			,container: jQuery('body')
			,closeAction: '<button class="dialogAction-close"><span class="dialogActionContent">Close</span></button>'
			,content: '<div class="dialogContent">'
			,dialog: '<div class="dialog">'
			,innerWrap: '<div class="dialogInnerWrap">'
			,overlay: '<div class="dialogOverlay">'

			//--store
			,ajaxOpts: undefined
			,_current: undefined
			,_state: undefined
			,_targets: undefined

			//==methods
			/*
			Close dialog.
			*/
			,close: function(){
				var _self = this;
				if(_self._state !== 'closed'){
					_self.getEl().removeClass('open');
					_self._state = 'closed';
				}
			}
			,initEl: function(){
				var _self = this;
				if(!(_self.$el instanceof jQuery) && _self.$el){
					_self.$el = jQuery(_self.$el);
				}
				if(!(_self.innerWrap instanceof jQuery) && _self.innerWrap){
					_self.innerWrap = jQuery(_self.innerWrap);
					_self.$el.append(_self.innerWrap);
				}
				if(!(_self.dialog instanceof jQuery) && _self.dialog){
					_self.dialog = jQuery(_self.dialog);
					_self.innerWrap.append(_self.dialog);
				}
				if(!(_self.content instanceof jQuery) && _self.content){
					_self.content = jQuery(_self.content);
					_self.dialog.append(_self.content);
				}
				if(!(_self.actions instanceof jQuery) && _self.actions){
					_self.actions = jQuery(_self.actions);
					_self.dialog.append(_self.actions);
				}
				if(!(_self.closeAction instanceof jQuery) && _self.closeAction){
					_self.closeAction = jQuery(_self.closeAction);
					_self.actions.append(_self.closeAction);
				}
				if(!(_self.overlay instanceof jQuery) && _self.overlay){
					_self.overlay = jQuery(_self.overlay);
					_self.$el.append(_self.overlay);
				}
				_self.container.append(_self.$el);
				_self.closeAction.on('click', function(){
					_self.close();
				});
				_self.overlay.on('click', function(){
					_self.close();
				});
			}

			/*
			Open dialog.
			*/
			,open: function(){
				var _self = this;
				if(_self._state !== 'opened'){
					_self.getEl().addClass('open');
					_self._state = 'opened';
				}
			}
			/*
			Open dialog with passed in target.
			*/
			,show: function(_target){
				var _self = this;
				if(_self.current === _target){
					_self.open();
				}else{
					var _content;
					if(typeof _target === 'object'){
						_content = _target;
					}else if(_self._targets[_target]){
						_content = _self._targets[_target];
					}else{
						_target = _target.replace(/^\s+|\s+$/g, '');
						switch(_target.charAt(0)){
							case '#':
							case '<':
								_self._targets[_target] = _content = jQuery(_target);
							break;
							// case '/':
							default:
								var _ajaxOpts = {};
								if(_self.ajaxOpts){
									jQuery.extend(_ajaxOpts, _self.ajaxOpts);
								}
								_ajaxOpts.url = _target;
								var _promise = jQuery.ajax(_ajaxOpts).promise();
								_promise.done(function(_data){
									if(typeof _data === 'string' && _data[0] === '{'){
										_data = jQuery.parseJSON(_data);
									}
									var _content = jQuery(
										(typeof _data === 'object')
										? _data.content
										: _data
									);
									_self._targets[_target] = _content;

									_self.show(_target);
								});
								return _promise;
							// break;
						}
					}
					if(_content){
						_self.getEl();
						_self.content.html('').append(_content);
						_self.open();
						_self.current = _target;
					}
				}
			}
		}
	});
	return Dialog;
});
