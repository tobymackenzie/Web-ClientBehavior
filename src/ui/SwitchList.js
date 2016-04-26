/*
Class: SwitchList
A collection of elements, of which one is always current and the current item can be switched between
*/
/* global clearInterval, define, setInterval */
define(['tmclasses/tmclasses', 'jquery', '../fx/AnimationTransition'], function(__tmclasses, jQuery, __AnimationTransition){
	var __SwitchList = __tmclasses.create({
		init: function(){
			var _this = this;
			_this.__parent(arguments);
			if(typeof _this.items === 'string' && _this.$){
				_this.items = _this.$.find(_this.items);
			}
			if(_this.navItems){
				_this.navItems.find('a').on('click', function(){
					if(!_this.isTransitioning){
						var $link = jQuery(this);
						// var $item = $link.closest(_this.navItems);
						var $item = $link.parent();
						var _isStarted = (_this._interval) ? true : false;
						if(_isStarted){
							_this.stop();
						}
						_this.switchToItem(_this.items.eq(_this.navItems.index($item)), {after: function(){
							if(_isStarted){
								_this.start();
							}
						}});
					}
				});
			}

			if(typeof _this.items === 'object' && _this.items.length){
				var _postInit = function(){
					if(_this.autoStart){
						_this.start();
					}
					_this.pub('init');
				};
				if(!_this.current && _this.autoStart){
					// _this.current = _this.items.first();
					_this.switchToItem(_this.items.first(), {
						after: _postInit
						,duration: 0
					});
				}else{
					_postInit();
				}
			}
		}
		,properties: {
			$: undefined
			,afterSwitch: function(_item, _opts){
				if(_item.is(this.current)){
					_item.removeClass(this.currentClass);
					this.current = undefined;
					if(this.nav){
						this.currentNav = undefined;
					}
				}else{
					this.current = _item;
					this.current.addClass(this.currentClass);
					if(_opts.elements[0]){
						_opts.elements[0].removeClass(this.currentClass);
					}
					if(this.nav){
						// this.currentNav = _newNav;
					}
				}
				if(typeof _opts.after === 'function'){
					_opts.after.apply(this, arguments);
				}
				this.isTransitioning = false;
			}
			,autoStart: true
			,carousel: true
			,current: undefined
			,currentNav: undefined
			,currentClass: 'current'
			,deInit: function(){
				this.stop();
				delete this.current;
				delete this.currentNav;
				delete this.items;
				delete this.nav;
				delete this.navItems;
				this.__parent(arguments);
			}
			,duration: 1000
			,getTransElements: function(_item, _opts){
				return [
					this.current
					,_item
					,this.currentNav
					,_opts.newNav
				];
			}
			,_interval: undefined
			,interval: 4000
			,isTransitioning: false
			,items: '>*'
			,nav: undefined
			,navItems: undefined
			,preSwitch: undefined
			,start: function(){
				var _this = this;
				if(typeof this.items === 'object' && this.items.length > 1 && !this._interval){
					this._interval = setInterval(function(){
						_this.switchToNext();
					}, this.interval);
				}
				return this;
			}
			,stop: function(){
				if(this._interval){
					clearInterval(this._interval);
					this._interval = null;
				}
				return this;
			}
			,switchToItem: function(_item, _opts){
				var _this = this;
				if(!_this.isTransitioning){
					if(!_opts){
						_opts = {};
					}
					if(_item && _item.length){
						if(_this.preSwitch){
							_this.preSwitch(_item);
						}
						if(!_opts.newNav){
							_opts.newNav = (_this.navItems) ? _this.navItems.eq(_this.items.index(_item)) : null;
						}
						if(!_opts.elements){
							_opts.elements = _this.getTransElements(_item, _opts);
						}
						var _passedAfter = _opts.after || undefined;
						_opts.after = function(){
							_opts.after = _passedAfter;
							_this.afterSwitch(_item, _opts);
						};
						_this.isTransitioning = true;
						var _transition = _this.getTransition();
						if(_transition instanceof __AnimationTransition){
							_transition.transitionForElements(_opts);
						}else if(typeof _transition === 'function'){
							_transition.call(_this, _opts);
						}
					}
				}
			}
			,switchToNext: function(){
				var _nextItem = this.current.next();
				if(!_nextItem.length && this.carousel){
					_nextItem = this.items.first();
				}
				if(_nextItem.length){
					this.switchToItem(_nextItem);
				}
			}
			,transition: undefined
			,getTransition: function(){
				var _this = this;
				if(!_this.transition){
					_this.transition = new __AnimationTransition({
						/*
						1: previous item
						2: next item
						*/
						duration: _this.duration
						,stylesBefore: [
							null
							,{display: 'block', opacity: 0}
						]
						,stylesTransition: [
							[
								{opacity: 0}
								,null
							]
							,[
								null
								,{opacity: 1}
							]
						]
						,stylesAfter: [
							{opacity: ''}
							,{opacity: ''}
						]
					});
				}
				return _this.transition;
			}
		}
	});
	return __SwitchList;
});
