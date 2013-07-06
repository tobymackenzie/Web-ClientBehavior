/*
Class: CollapsingNav
Monitors the padding of nav elements inside a flexible horizontal nav container, putting items into a submenu when the padding gets too small (ie items get scrunched together).  Kinda limited in scope, in that it won't work for items with fixed padding, but that could be added as a different calculation method.

Example Usage:
	$sectionNavs = jQuery('.sectionNav');
	if($sectionNavs.length){
		$sectionNavs.each(function(){
			var $this = jQuery(this);
			var _collapsingNav = new __.classes.CollapsingNav({
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

/* global __, clearTimeout, jQuery, setTimeout, window */
__.classes.CollapsingNav = __.core.Classes.create({
	'init': function(_options){
		__.core.Classes.BaseClass.prototype.init.call(this, _options);

		if(!this.moreItem){
			this.moreItem = jQuery(this.moreItemHTML);
		}
		this.moreItem.data('isAttached', false);

		if(!this.moreList){
			this.moreList = this.moreItem.find(this.moreListSelector);
		}

		if(!this.mainList){
			this.mainList = this.$.find(this.mainListSelector);
		}

		//--attach resize listener
		var _this = this;
		jQuery(window).on('resize', function(){
			_this.handleResizeInInterval();
		});

		//--do handle of resize on page load
		this.handleResize();
	}
	,'properties': {
		$: null
		,doHandleResize: true
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
				if(this.isTooNarrow()){
					if(!this.moreItem.data('isAttached')){
						//--attach moreItem
						this.mainList.append(this.moreItem);
						this.moreItem.data('isAttached', true);
					}
					//--add items one by one to menu until not _isSectionNavTooNarrow
					do{
						this.pushItemToMoreList();
					}while(this.isTooNarrow());
				}else{
					//--remove items one by one until not _isSectionNavTooNarrow
					do{
						this.popItemFromMoreList();
					}while(this.moreList.find(this.navItemSelector).length && !this.isTooNarrow());

					//--if item count reaches 0, detach moreItem
					if(this.moreItem.data('isAttached') && !this.moreList.find(this.navItemSelector).length){
						this.moreItem.detach();
						this.moreItem.data('isAttached', false);
					}
				}
			}
		}
		,handleResizeInInterval: function(){
			var _this = this;
			clearTimeout(this.resizeTimeout);
			this.resizeTimeout = setTimeout(function(){
				_this.handleResize();
			}, this.resizeInterval);
		}
		,isTooNarrow: function(){
			var $navItems = this.mainList.find(this.navItemSelector);
			var _itemPadding = 0;
			var _hasDifferentHeight = false;
			var _previousHeight;
			$navItems.each(function(_index){
				var $this = jQuery(this);
				var $topLevel = $this.find('.topLevel');
				_itemPadding += $this.outerWidth() - $topLevel.outerWidth();
				var _outerHeight = $topLevel.outerHeight();
				if(_previousHeight !== undefined && _outerHeight !== _previousHeight){
					_hasDifferentHeight = true;
					return false;
				}
				if(_index){
					_previousHeight = _outerHeight;
				}
			});
			return _hasDifferentHeight || _itemPadding < this.minimumPadding;
		}
		,mainListSelector: '.navList.l-1'
		,minimumPadding: 100
		,moreItem: null
		,moreItemHTML: '<li class="topItem dropdown">'
			+	'<a class="topLevel" href="javascript:/* open submenu */">More</a>'
			+	'<div class="subMenu">'
			+		'<ul class="navList"></ul>'
			+	'</div>'
			+ '</li>'
		,moreList: null
		,moreListSelector: '.navList'
		,mainList: null
		,navItemSelector: '> .topItem'
		,popItemFromMoreList: function(){
			var $item = this.moreList.find(this.navItemSelector).last();
			$item.detach();
			this.mainList.find(this.navItemSelector).last().before($item);
		}
		,pushItemToMoreList: function(){
			var $item = this.mainList.find(this.navItemSelector).last().prev();
			$item.detach();
			this.moreList.append($item);
		}
		,resizeTimeout: null
		,resizeInterval: 200
	}
});