/* global define */
define(['jquery', 'tmlib/fx/AnimationTransition', 'tmclasses/tmclasses', 'tmlib/ui/SwitchList', 'tmlib/ua/ua'], function(jQuery, __AnimationTransition, __tmclasses, __SwitchList, __ua){

	//-! temporarily here until it makes its way elsewhere
	var __getElmDimensions = function(_elm){
		var _data = {};
		if(_elm){
			var _originalCSS = {
				position: _elm.css('position'),
				visibility: _elm.css('visibility')
			};

			_elm.css({position: 'absolute', visibility: 'hidden'});
			_data.width = _elm.outerWidth();
			_data.height = _elm.outerHeight();
			_elm.css(_originalCSS);
		}

		return _data;
	};
	var __this = __tmclasses.create({
		parent: __SwitchList
		,init: function(){
			var _this = this;
			_this.__parent(arguments);
			if(_this.$){
				_this.$.on('click', _this.actionSelector, function(_event){
					_event.preventDefault();
					var $this = jQuery(this);
					_this.switchToItem($this.closest('.expandGalleryItem'));
				});
			}
			if(this.doEqualizeRowHeights){
				if(this.responsiveHandler){
					_this.responsiveHandler.sub('resize', jQuery.proxy(_this.equalizeRowsHeights, _this));
				}
				_this.equalizeRowsHeights();
			}
		}
		,properties: {
			$: null
			,actionSelector: '.expandGalleryItemAction'
			,autoStart: false
			,duration: 200
			,doEqualizeRowHeights: false
			,equalizeRowHeights: function(_rowItems){
				var _i;
				var _item;
				var _height;
				var _maxHeight = 0;
				var _length = _rowItems.length;
				if(_length > 1){
					for(_i = 0; _i < _length; ++_i){
						_item = _rowItems[_i];
						_height = _item.outerHeight();
						if(_height > _maxHeight){
							_maxHeight = _height;
						}
					}
					for(_i = 0; _i < _length; ++_i){
						_item = _rowItems[_i];
						_item.css('height', _maxHeight);
					}
				}
			}
			/*
			Method: equalizeRowsHeights
			Equalize height of items in each row so that expanded content doesn't get overlapped by taller items in same row.
			*/
			,equalizeRowsHeights: function(){
				if(!(__ua.isIE() && __ua.getVersion() < 8)){ //-# ie7 seems to get into infinite loop with this
					var _this = this;
					var _bp = _this.responsiveHandler.getBreakPoint();
					if(_this.$){
						var $actions = _this.$.find(_this.getItemSelector());
						if(_this.isNVP(_bp)){
							$actions.css('height', '');
						}else{
							var _previousPosition;
							var _previousRowItems = [];
							$actions.css('height', '');
							$actions.each(function(){
								var $this = jQuery(this);
								var _position = $this.position().top;
								if(_position === _previousPosition || _previousPosition === undefined){
									_previousRowItems.push($this);
								}else{
									_this.equalizeRowHeights(_previousRowItems);
									_previousRowItems = [];
									_previousRowItems.push($this);
								}
								_previousPosition = _position;
							});
							_this.equalizeRowHeights(_previousRowItems);
						}
					}
				}
			}
			,expandContainerSelector: 'this'
			,getExpandContainer: function(_item){
				if(this.getExpandContainerSelector() === 'this' || !_item){
					return _item;
				}else{
					return _item.closest(this.getExpandContainerSelector());
				}
			}
			,getExpandContainerSelector: function(){
				return this.expandContainerSelector;
			}
			,getItemDetail: function(_item){
				if(_item){
					if(!_item.data('expandGalleryDetail')){
						_item.data('expandGalleryDetail', _item.find('.expandGalleryItemDetail'));
					}
					return _item.data('expandGalleryDetail');
				}else{
					return null;
				}
			}
			,getItemSelector: function(){
				return this.itemSelector;
			}
			//,getTransElements: function(_item, _opts){
			//	var _current = (this.current) ? this.getExpandContainer(this.current) : null;
			//	var _next = (_item) ? this.getExpandContainer(_item) : null;
			//	return [
			//		_current
			//		,_item
			//		,this.currentNav
			//		,_opts.newNav
			//	];
			//}
			,isNVP: function(_bp){
				return this.responsiveHandler && this.responsiveHandler.isNVP(_bp) || false;
			}
			,itemSelector: '.expandGalleryItem'
			,responsiveHandler: undefined
			/*
			Property: scrollContainer
			Get copy of body/html element for use by scrollToItem action of open transition.  Seem to need both to be cross browser safe
			*/
			,scrollContainer: undefined
			,getScrollContainer: function(){
				if(!this.scrollContainer){
					this.scrollContainer = jQuery('body,html');
				}
				return this.scrollContainer;
			}
			/*
			Method: scrollToItem
			Called after transition, will scroll to the opened item so that it isn't out of view
			Arguments:
				_data(Array): _data from transition
			*/
			,scrollToItem: function(_data){
				if(_data.elements[3]){
					var _scrollTo = _data.elements[3].offset().top - 100;
					if(_scrollTo < 0){
						_scrollTo = 0;
					}
					this.getScrollContainer().animate({
						scrollTop: _scrollTo
					}, this.duration);
				}
			}
			,transition: function(_opts){
				if(_opts && _opts.elements && _opts.elements.length){
					var _this = this;
					var _old = _opts.elements[0];
					var _new = _opts.elements[1];
					var _oldTarget = (_this.getExpandContainerSelector() === 'this') ? _old : _this.getExpandContainer(_old);
					var _newTarget = (_this.getExpandContainerSelector() === 'this') ? _new : _this.getExpandContainer(_new);
					_opts.elements = [
						(_newTarget.is(_oldTarget)) ? null : _oldTarget
						,_this.getItemDetail(_old)
						,_newTarget
						,_this.getItemDetail(_new)
					];
					if(_old && _old.is(_new)){
						_opts.after = function(){
							_new.removeClass('current');
							_this.current = undefined;
							if(_this.nav){
								_this.currentNav = undefined;
							}
							_this.isTransitioning = false;
						};
						_this.transitionClose.transitionForElements(_opts);
					}else{
						_this.transitionOpen.transitionForElements(_opts);
					}
				}
			}
			,getTransition: function(){
				var _this = this;
				/*-# elements
				1: previous item
				2: previous item detail
				3: next item
				4: next item detail
				*/
				if(!_this.transitionOpen){
					_this.transitionOpen = __this.getDefaultTransitionOpen(null, _this);
				}
				if(!_this.transitionClose){
					_this.transitionClose = __this.getDefaultTransitionClose(null, _this);
				}
				return _this.transition;
			}
			,transitionClose: undefined
			,transitionOpen: undefined
		}
		,statics: {
			getDefaultTransitionOpen: function(_opts, _this){
				var _defaults = {
					duration: (_this) ? _this.duration : 200
					,stylesBefore: [
						null
						,null
						,function(_elm){
							_elm.data('paddingBottom', _elm.css('padding-bottom'));
						}
						,function(_elm){
							var _styles = {display: 'block', height: 0};
							if(_elm){
								// var _container = _opts.elements[2];
								var _height = __getElmDimensions(_elm).height;
								//_styles.top = _container.position().top + _container.outerHeight();
								_elm.data('height', _height);
							}
							return _styles;
						}
					]
					,stylesTransition: [
						function(_elm){
							if(_elm){
								return {
									paddingBottom: _elm.data('paddingBottom')
								};
							}
						}
						,{height: 0}
						,function(_elm, _opts){
							return {
								paddingBottom: _opts.elements[3].data('height')
							};
						}
						,function(_elm){
							return {
								height: _elm.data('height')
							};
						}
					]
					,stylesAfter: [
						{paddingBottom: ''}
						,{display: '', height: ''}
					]
					,onAfter: function(_data){
						if(_this && _this.scrollToItem){
							_this.scrollToItem(_data);
						}
						__AnimationTransition.prototype.onAfter.apply(this, arguments);
					}
				};
				if(_opts){
					jQuery.extend(_defaults, _opts);
				}
				return new __AnimationTransition(_defaults);
			}
			,getDefaultTransitionClose: function(_opts, _this){
				var _defaults = {
					duration: (_this) ? _this.duration : 200
					,stylesBefore: [
						null
						,null
						,null
						,null
					]
					,stylesTransition: [
						null
						,null
						,function(_elm){
							if(_elm){
								return {
									paddingBottom: _elm.data('paddingBottom')
								};
							}
						}
						,{height: 0}
					]
					,stylesAfter: [
						null
						,null
						,{paddingBottom: ''}
						,{display: '', height: ''}
					]
				};
				if(_opts){
					jQuery.extend(_defaults, _opts);
				}
				return new __AnimationTransition(_defaults);
			}
		}
	});
	return __this;
});
