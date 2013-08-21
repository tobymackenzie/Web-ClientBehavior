/*
simple, one level, dropdown menu that uses css classes to open dropdown menus, closes after a delay
-----dependencies
tmlib: __.core.objects.mergeInto, __.lib.isNumeric, __.ua.isIE6
jquery

-----styling
/*==dropDownList */
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
*/
	__.elmSiteNavigationMain = jQuery('.siteNavigationMain');
	if(__.elmSiteNavigationMain.length > 0){
		__.mainNavigationDropDownHandler = new __.classes.DropDownMenu({
			elmWrapper: __.elmSiteNavigationMain
		});
	}
/*
-----
*/

/*----------
==DropDownMenu
----------*/
__.classes.DropDownMenu = function(_args){
		/*==attributes */
		__.core.objects.mergeInto(this, _args);

		if(!this.elmsItems && this.elmWrapper){
			this.elmsItems = this.elmWrapper.find(this.itemSelector);
		}

		/*==init */
		//--attach listeners
		this.attachListeners(this.elmWrapper);

		//--set empty hrefs and hide link cursor if needed
		this.elmsItems.filter(this.hasDropDownSelector).find(this.topLevelSelector).each(function(){
			var elmThis = jQuery(this);
			if(elmThis.is('a') && !elmThis.attr('href')){
				elmThis.attr('href', 'javascript:/*openMenu()*/;');
				elmThis.css({'cursor': 'default'});
			}
		});

		if(this.doSizeAndCenter){
			this.sizeAndCenter();
		}

		if(this.onInit){
			this.onInit.call(this);
		}
	};
	__.core.objects.mergeInto(__.classes.DropDownMenu.prototype, {
		'attachListeners': function(_$element){
			var lcThis = this;
			_$element.on(
				'mouseenter focus click touchstart'
				,this.itemSelector
				,function(){
					var elmThis = jQuery(this);
					if(elmThis.is(lcThis.hasDropDownSelector)){
						clearTimeout(lcThis.timeout);
					}
					if(lcThis.elmCurrentlySelected !== elmThis){
						if(lcThis.onHover){
							lcThis.onHover.call(lcThis, elmThis);
						}
						lcThis.openDropDown(elmThis);
					}
				}
			);
			_$element.on(
				'mouseleave'
				,this.itemSelector
				,function(){
					clearTimeout(lcThis.timeout);
					lcThis.timeout = setTimeout(function(){
						lcThis.closeCurrentDrowDown();
					}, lcThis.delay);
				}
			);
			if(this.doCloseOnClickOutside){
				jQuery('body').on('click',
					function(){
						lcThis.closeAllDropDowns();
					}
				);
			}
		}
		,'classOpened': 'selected'
		,'closeAllDropDowns': function(){
			var lcThis = this;
			this.elmsItems.each(function(){
				lcThis.closeDropDown(jQuery(this));
			});
		}
		,'closeCurrentDrowDown': function(){
			if(this.elmCurrentlySelected){
				var elmWasCurrent = this.elmCurrentlySelected;
				this.closeDropDown(elmWasCurrent);
				this.elmCurrentlySelected = null;
				return true;
			}
			return false;
		}
		,'closeDropDown': function(_$element){
			if(_$element.hasClass(this.classOpened)){
				_$element.removeClass(this.classOpened);
				if(this.onClose){
					this.onClose.call(this, _$element);
				}
			}
		}
		,'delay': 750
		,'doCloseOnClickOutside': false
		,'elmCurrentlySelected': null
		,'elmsItems': null
		,'elmWrapper': null
		,'hasDropDownSelector': '.dropDown'
		,'itemSelector': '.topItem'
		,'onClose': null
		,'onOpen': null
		,'onHover': null
		,'onInit': null
		,'openDropDown': function(_$element){
			var doOnOpen = (this.elmCurrentlySelected !== _$element);
			if(this.elmCurrentlySelected && this.elmCurrentlySelected !== _$element){
				clearTimeout(this.timeout);
				this.closeCurrentDrowDown();
			}
			if(_$element){
				_$element.addClass(this.classOpened);
				this.elmCurrentlySelected = _$element;
				if(doOnOpen && this.onOpen){
					this.onOpen.call(this, _$element);
				}
			}
		}
		,'subMenuSelector': '.subMenu'
		,'topLevelSelector': '.topLevel'
		,'timeout': null

		/*===menu sizing */
		,'centeringItemSelector': 'this'
		,'centeringItemWidthGetter': 'width'
		,'centeringOffset': 'paddingLeft'
		,'doSizeAndCenter': false
		,'doSizeAndCenterFirst': true
		,'doSizeAndCenterLast': true
		,'sizeAndCenter': function(){
			var _this = this;
			var _countItems = this.elmsItems.length;
			this.elmsItems.each(function(_i){
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
					$subMenu.css({
						'display': 'block'
						,'visibility': 'hidden'
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
					if(
						$subMenu.outerWidth() < $centeringItem.outerWidth()
						&& !__.ua.isIE6()
					){
						var _newSize = $centeringItem.outerWidth();
						$subMenu.css('width', _newSize);
					}
					if($subMenu.outerWidth() > $centeringItem.outerWidth()){
						var _subMenuOffset = (__.lib.isNumeric(_this.subMenuOffset))
							? _this.subMenuOffset
							: $centeringItem.css(_this.subMenuOffset)
						;
						_subMenuOffset = parseInt(_subMenuOffset, 10);
						var _ifOffset = ($centeringItem[_this.centeringItemWidthGetter]() - $subMenu.outerWidth()) / 2 + _subMenuOffset;
						$subMenu.css('left', _ifOffset + 'px');
					}
					$subMenu.css({
						'display': ''
						,'visibility': ''
					});
				}
			});
		}
		,'subMenuOffset': 'paddingLeft'
	});
