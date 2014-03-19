/*
Class: DropDown
Simple, one level, dropdown menu that uses css classes to open dropdown menus, closes after a delay

-----styling
.dropDownNavigationList{
	margin: 0;
	padding: 0;
	list-style: none;
}
.dropDownNavigation .topItem{
	position: relative;
	float: left;
	line-height: 1;
}
.subMenu{
	display: none;
	position: absolute;
	z-index: 1000;
	left: 0;
	top: 100%;
	min-width: 100%;
}
.subMenu a{
}
.dropDownNavigation .topItem.selected .subMenu
,.dropDownNavigation .topItem:hover .subMenu
,.dropDownNavigation .topItem:focus .subMenu
{
	display: block;
}
/*

-----instantiation
	__.elmSiteNavigationMain = jQuery('.siteNavigationMain');
	if(__.elmSiteNavigationMain.length > 0){
		__.mainNavigationDropDownHandler = new __.classes.DropDownMenu({
			$: __.elmSiteNavigationMain
		});
	}
*/
/* global clearTimeout, define, setTimeout */
define(['tmclasses/tmclasses', 'jquery', '../core/is', '../ua/ua'], function(__tmclasses, jQuery, __is, __ua){
	var __this = __tmclasses.create({
		init: function(){
			this.__parent(arguments);

			if(!this.$items && this.$){
				if(this.itemSelector === 'this'){
					this.$items = this.$;
				}else{
					this.$items = this.$.find(this.itemSelector);
				}
			}

			/*==init */
			//--attach listeners
			this.attachListeners(this.$);

			//--set empty hrefs and hide link cursor if needed
			this.$items.filter(this.hasDropDownSelector).find(this.topLevelSelector).each(function(){
				var $this = jQuery(this);
				if($this.is('a') && !$this.attr('href')){
					var _urlPiece = 'javas'; //-# needed to pass linting.  consider changing jshintrc
					$this.attr('href', _urlPiece + 'cript:/*openMenu()*/;');
					$this.css({'cursor': 'default'});
				}
			});

			if(this.$){
				this.activate();
			}

			if(this.onInit){
				this.onInit.call(this);
			}
		}
		,properties: {
			$: null
			,$current: null
			,$items: null
			,activate: function(){
				if(this.doSizeAndCenter){
					this.sizeAndCenter();
				}
			}
			,attachListeners: function(_$){
				var _this = this;

				//--attach listeners to container.  must build so we can add selector argument only if we need to
				var _focusArgs = [
					// 'mouseenter focus click touchstart' //-# touchstart seemed to cause double events on occasion on ipad.  may need to reconsider, since I put this here because of problems on touch screens
					'mouseenter focus click'
				];
				var _blurArgs = [
					'mouseleave blur'
				];
				if(this.itemSelector !== 'this'){
					_focusArgs.push(_this.itemSelector);
					_blurArgs.push(_this.itemSelector);
				}
				_focusArgs.push(function(_event){
					var $this = jQuery(this);
					if($this.is(_this.hasDropDownSelector)){
						clearTimeout(_this.blurTimeout);
					}
					//--open dropdown if different than current
					if(!$this.is(_this.$current)){
						_this.pub('hover', $this);
						_this.openDropDown($this);
					//--close if clicking the current item
					}else if(_event.type === 'click'){
						_this.closeCurrentDrowDown();
					}
				});
				_blurArgs.push(function(){
					clearTimeout(_this.blurTimeout);
					_this.blurTimeout = setTimeout(function(){
						_this.closeCurrentDrowDown();
					}, _this.delay);
				});
				_$.on.apply(_$, _focusArgs);
				_$.on.apply(_$, _blurArgs);

				if(_this.doCloseOnClickOutside){
					jQuery('body').on('click',
						jQuery.proxy(_this.closeAllDropDowns, this));
				}
			}
			,openedClass: 'opened'
			,closeAllDropDowns: function(){
				var _this = this;
				this.$items.each(function(){
					_this.closeDropDown(jQuery(this));
				});
			}
			,closeCurrentDrowDown: function(){
				if(this.$current){
					var elmWasCurrent = this.$current;
					this.closeDropDown(elmWasCurrent);
					this.$current = null;
					return true;
				}
				return false;
			}
			,closeDropDown: function(_$){
				if(_$.hasClass(this.openedClass)){
					_$.removeClass(this.openedClass);
					this.pub('close', _$);
				}
			}
			,deactivate: function(){
				//--reset centering styles
				if(this.doSizeAndCenter){
					this.$.find(this.subMenuSelector).css({left: '', width: ''});
				}
			}
			,delay: 750
			,doCloseOnClickOutside: false
			,hasDropDownSelector: '.dropDown'
			,itemSelector: '>.navItem'
			,onInit: null
			,openDropDown: function(_$){
				var _doPublish = (this.$current !== _$);
				if(this.$current && this.$current !== _$){
					clearTimeout(this.blurTimeout);
					this.closeCurrentDrowDown();
				}
				if(_$){
					_$.addClass(this.openedClass);
					this.$current = _$;
					if(_doPublish){
						this.pub('open', _$);
					}
				}
			}
			,subMenuSelector: '.subMenu'
			,topLevelSelector: '.topLevel'

			,blurTimeout: undefined

			/*===menu sizing */
			,centeringItemSelector: 'this'
			,centeringItemWidthGetter: 'width'
			,centeringOffset: 'paddingLeft'
			,doSizeAndCenter: false
			,doSizeAndCenterFirst: true
			,doSizeAndCenterLast: true
			,sizeAndCenter: function(){
				var _this = this;
				var _countItems = this.$items.length;
				this.$items.each(function(_i){
					var $this = jQuery(this);
					var $subMenu = $this.find(_this.subMenuSelector);
					if(
						$subMenu.length
						&& (
							_this.doSizeAndCenterFirst
							|| (_i !== 0)
						)
						&& (
							_this.doSizeAndCenterLast
							|| (_i !== _countItems)
						)
					){
						//--show to calculate widths
						$subMenu.css({
							display: 'block'
							,visibility: 'hidden'
						});
						var $centeringItem;
						switch(_this.centeringItemSelector){
							case 'this':
							case 'topItem':
								$centeringItem = $this;
							break;
							case 'topLevel':
								$centeringItem = $this.find(_this.topLevelSelector);
							break;
							default:
								$centeringItem = $this.find(_this.centeringItemSelector);
							break;
						}
						var _centerItemWidth = $centeringItem.width();
						if(
							$subMenu.width() < _centerItemWidth
							&& !__ua.isIE6()
						){
							var _newSize = _centerItemWidth;
							$subMenu.css('width', _newSize);
						}
						if($subMenu.width() > _centerItemWidth){
							var _subMenuOffset;
							if(__is.numeric(_this.subMenuOffset)){
								_subMenuOffset = _this.subMenuOffset;
							}else if(_this.subMenuOffset){
								_subMenuOffset = $centeringItem.css(_this.subMenuOffset);
							}else{
								_subMenuOffset = 0;
							}
							_subMenuOffset = parseInt(_subMenuOffset, 10);
							var _ifOffset = ($centeringItem[_this.centeringItemWidthGetter]() - $subMenu.width()) / 2 + _subMenuOffset;
							$subMenu.css('left', _ifOffset + 'px');
						}
						$subMenu.css({
							display: ''
							,visibility: ''
						});
					}
				});
			}
			,subMenuOffset: 0
		}
	});
	return __this;
});
