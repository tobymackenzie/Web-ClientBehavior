/*
Class: CollapsingNav

Monitors the padding of nav elements inside a flexible horizontal nav container, putting items into a submenu when the padding gets too small (ie items get scrunched together).  Kinda limited in scope, in that it won't work for items with fixed padding, but that could be added as a different calculation method.

Example Usage:
	$sectionNavs = jQuery('.sectionNav');
	if($sectionNavs.length){
		$sectionNavs.each(function(){
			var $this = jQuery(this);
			var _collapsingNav = new __CollapsingNav({
				$: $this
				,doHandleResize: function(){
					return this.$.is('.current');
				}
			});
			var _dropDownMenu = new __.classes.DropDownMenu({
				elmWrapper: $this
				,itemSelector: '> .topItem'
			});
		});
	}

*/
/* global clearTimeout, define, setTimeout, window */
define(['tmclasses/tmclasses', 'jquery', './DropDown'], function(__tmclasses, jQuery, __DropDown){
	var __hasTooManyItemsMethods = {
		itemPadding: function(){
			var _this = this;
			var $navItems = this.mainList.find(this.navItemSelector);
			var _hasEnoughHeightDifference = false;
			var _hasTooLittlePadding = false;

			$navItems.each(function(){
				var $this = jQuery(this);
				var $topLevel = $this.find(_this.topLevelSelector);
				var _itemPadding = $this.outerWidth() - $topLevel.outerWidth();
				if(_itemPadding < _this.minimumPadding){
					_hasTooLittlePadding = true;
					return false;
				}
				//--check height to see if item wraps
				//-# must do this for each item, since individual items may have different font-size, etc
				var _html = $topLevel.html();
				$topLevel.html('x');
				var _singleLineHeight = $topLevel.outerHeight();
				$topLevel.html(_html);
				var _outerHeight = $topLevel.outerHeight();
				if(
					_singleLineHeight
					&& Math.abs(_outerHeight - _singleLineHeight) > 0.3 * _singleLineHeight
				){
					_hasEnoughHeightDifference = true;
					return false;
				}
			});
			return _hasEnoughHeightDifference || _hasTooLittlePadding;
		}
		,rightPos: function(){
			var _this = this;
			var $container = _this.getContainer();

			var containerRight = $container.offset().left + $container.outerWidth();
			var mainListRight = _this.mainList.offset().left + _this.mainList.outerWidth();

			return mainListRight > containerRight;
		}
	};

	var __CollapsingNav = __tmclasses.create({
		init: function(){
			this.__parent(arguments);
			var _this = this;

			if(!_this.moreItem){
				_this.moreItem = jQuery(_this.moreItemHTML);
			}
			_this.moreItem.data('isAttached', false);

			if(!_this.moreList){
				_this.moreList = _this.moreItem.find(_this.moreListSelector);
			}

			if(!_this.mainList){
				_this.mainList = _this.$.find(_this.mainListSelector);
			}

			if(_this.dropDown === undefined){
				_this.dropDown = new __DropDown(_this.getDropDownOpts());
			}

			if(_this.isActive){
				_this.activate();
			}
		}
		,properties: {
			$: null
			,$window: jQuery(window)
			,activate: function(){
				//--attach resize listener
				this.$window.on('resize', jQuery.proxy(this.handleResizeInInterval, this));

				this.isActive = true;

				this.handleResize();
			}
			,container: function(){
				this.container = jQuery('body');
				return this.container;
			}
			,dropDown: undefined
			,getContainer: function(){
				if(typeof this.container === 'function'){
					return this.container();
				}else{
					return this.container;
				}
			}
			,getDropDownOpts: function(_opts){
				return jQuery.extend({
					$: this.moreItem
					,itemSelector: 'this'
				}, _opts);
			}
			,deactivate: function(){
				clearTimeout(this.resizeTimeout);

				//--detach resize listener
				this.$window.off('resize', jQuery.proxy(this.handleResizeInInterval, this));

				if(this.dropDown){
					this.dropDown.deactivate();
				}

				this.isActive = false;

				this.popAllFromMoreList();
			}
			,doHandleResize: true
			,fillFrom: 'top'
			,getNextItemInMoreList: function(){
				var $items = this.moreList.find(this.navItemSelector);
				if($items.length){
					if(this.fillFrom === 'top'){
						return $items.first();
					}else{
						return $items.last();
					}
				}else{
					return null;
				}
			}
			,handleResize: function(){
				var doHandleResize = true;
				switch(typeof this.doHandleResize){
					case 'function':
						doHandleResize = this.doHandleResize.apply(this, arguments);
					break;
					default:
						doHandleResize = (this.doHandleResize);
					break;
				}
				if(doHandleResize){
					if(this.hasTooManyItems()){
						if(!this.moreItem.data('isAttached')){
							//--attach moreItem
							this.mainList.append(this.moreItem);
							this.moreItem.data('isAttached', true);
						}
						//--add items one by one to menu until not _isSectionNavTooNarrow
						do{
							this.pushItemToMoreList();
						}while(this.hasTooManyItems());
					}else{
						//--remove items one by one until not _isSectionNavTooNarrow
						do{
							this.popItemFromMoreList();
						}while(this.moreList.find(this.navItemSelector).length && !this.hasTooManyItems());

						//--reinsert one if too many are added
						if(this.hasTooManyItems()){
							this.pushItemToMoreList();
						}

						//--if item count reaches 0, detach moreItem
						if(this.moreItem.data('isAttached') && !this.moreList.find(this.navItemSelector).length){
							this.moreItem.detach();
							this.moreItem.data('isAttached', false);
						}
					}
					if(this.dropDown){
						this.dropDown.activate();
					}
				}
			}
			,handleResizeInInterval: function(){
				var _this = this;
				clearTimeout(_this.resizeTimeout);
				_this.resizeTimeout = setTimeout(function(){
					_this.handleResize();
				}, _this.resizeInterval);
			}
			,isActive: true
			,hasTooManyItems: function(){
				//--get actual method from private map based on 'hasTooManyItemsMethod' setting
				return __hasTooManyItemsMethods[this.hasTooManyItemsMethod].apply(this, arguments);
			}
			,hasTooManyItemsMethod: 'rightPos'
			,mainListSelector: '.navList.l-1'
			,minimumPadding: 20
			,moreItem: null
			,moreItemHTML: '<li class="topItem dropDown">'
				+	'<a class="topLevel" href="javascript:/* open submenu */">More</a>'
				+	'<div class="subMenu">'
				+		'<ul class="navList"></ul>'
				+	'</div>'
				+ '</li>'
			,moreList: null
			,moreListSelector: '.navList'
			,mainList: null
			,navItemSelector: '> .topItem'
			,popAllFromMoreList: function(){
				var $item;
				while(($item = this.getNextItemInMoreList())){
					this.popItemFromMoreList($item);
				}
				return this;
			}
			,popItemFromMoreList: function($item){
				if(!$item){
					$item = this.getNextItemInMoreList();
				}
				if($item){
					$item.detach();
					this.mainList.find(this.navItemSelector).last().before($item);
					if(this.dropDown && this.dropDown.doSizeAndCenter){
						this.dropDown.sizeAndCenter();
					}
				}
				return this;
			}
			,pushItemToMoreList: function(){
				var $item = (this.moreItem.data('isAttached'))
					? this.moreItem.prev()
					: this.mainList.find(this.navItemSelector).last();
				$item.detach();
				if(this.fillFrom === 'bottom'){
					this.moreList.append($item);
				}else{
					this.moreList.prepend($item);
				}
				if(this.dropDown && this.dropDown.doSizeAndCenter){
					this.dropDown.sizeAndCenter();
				}
				return this;
			}
			,resizeTimeout: null
			,resizeInterval: 200
			,topLevelSelector: '> .navItem'
		}
	});
	return __CollapsingNav;
});
