/*
simple, one level, dropdown menu that uses css classes to open dropdown menus, closes after a delay
-----dependencies
tmlib, jquery

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
__.classes.DropDownMenu = function (args){
		/*==attributes */
		this.classOpened = args.classOpened || 'selected';
		this.selectorHasDropDown = args.selectorHasDropDown || '.dropDown';
		this.selectorItem = args.selectorItem || '.topItem';
		this.selectorSubMenu = args.selectorSubMenu || '.subMenu';
		this.selectorTopLevel = args.selectorTopLevel || '.topLevel';
		this.delay = (typeof args.delay != 'undefined') ? args.delay : 750;
		this.doCloseOnClickOutside = args.doCloseOnClickOutside || false;
		this.elmWrapper = args.elmWrapper || null;
		this.elmsItems = args.elmsItems || null;
		if(!this.elmsItems && this.elmWrapper){
			this.elmsItems = this.elmWrapper.find(this.selectorItem);
		}
		this.onClose = args.onClose || null;
		this.onOpen = args.onOpen || null;
		this.onHover = args.onHover || null;
		this.onInit = args.onInit || null;

		/*---size and center stuff */
		this.addedWidth = (args.addedWidth)? args.addedWidth : 0;
		this.doSizeAndCenter = (args.doSizeAndCenter)? args.doSizeAndCenter : false;
		this.doSizeAndCenterFirst = (typeof args.doSizeAndCenterFirst != 'undefined')? args.doSizeAndCenterFirst : true;
		this.doSizeAndCenterLast = (typeof args.doSizeAndCenterLast != 'undefined')? args.doSizeAndCenterLast : true;
		this.menuPadding = (args.menuPadding)? args.menuPadding : 0;
		this.subMenuOffset = (args.subMenuOffset)? args.subMenuOffset : 0;


		this.elmCurrentlySelected = null;
		this.timeout = null;


		/*==init */
		//--attach listeners
		this.attachListeners(this.elmWrapper);

		//--set empty hrefs and hide link cursor if needed
		this.elmsItems.filter(this.selectorHasDropDown).find(this.selectorTopLevel).each(function(){
			var elmThis = jQuery(this);
			if(elmThis.is('a') && !elmThis.attr('href')){
				elmThis.attr('href', 'javascript:/*openMenu()*/;');
				elmThis.css({'cursor': 'default'});
			}
		});

		if(this.onInit){
			this.onInit.call(this);
		}
	}
	__.classes.DropDownMenu.prototype.attachListeners = function(argElement){
		var lcThis = this;
		argElement.on(
			'mouseenter focus click touchstart'
			,this.selectorItem
			,function(){
				var elmThis = jQuery(this);
				if(elmThis.is(lcThis.selectorHasDropDown)){
					clearTimeout(lcThis.timout);
				}
				if(lcThis.elmCurrentlySelected !== elmThis){
					if(lcThis.onHover){
						lcThis.onHover.call(lcThis, elmThis);
					}
					lcThis.openDropDown(elmThis);
				}
			}
		);
		argElement.on(
			'mouseleave'
			,this.selectorItem
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
	__.classes.DropDownMenu.prototype.openDropDown = function(argElement){
		var doOnOpen = (this.elmCurrentlySelected !== argElement)
		if(this.elmCurrentlySelected && this.elmCurrentlySelected !== argElement){
			this.closeCurrentDrowDown();
		}
		if(argElement){
			argElement.addClass(this.classOpened);
			this.elmCurrentlySelected = argElement;
			if(doOnOpen && this.onOpen){
				this.onOpen.call(this, argElement);
			}
		}
	}
	__.classes.DropDownMenu.prototype.closeDropDown = function(argElement){
		if(argElement.hasClass(this.classOpened)){
			argElement.removeClass(this.classOpened);
			if(this.onClose){
				this.onClose.call(this, argElement);
			}
		}
	}
	__.classes.DropDownMenu.prototype.closeCurrentDrowDown = function(){
		if(this.elmCurrentlySelected){
			var elmWasCurrent = this.elmCurrentlySelected;
			this.closeDropDown(elmWasCurrent);
			this.elmCurrentlySelected = null;
			return true;
		}
		return false;
	}
	__.classes.DropDownMenu.prototype.closeAllDropDowns = function(){
		var lcThis = this;
		this.elmsItems.each(function(){
			lcThis.closeDropDown(jQuery(this));
		});
	}


/*---menu sizing
---*/
	// __.classes.DropDownMenu.prototype.sizeAndCenter1 = function(){
	// 	for(var i=0; i < this.elmsMenuAssociations.length; ++i){
	// 		var forElmMenuItemArray = this.elmsMenuAssociations[i];
	// 		if(forElmMenuItemArray['elmSubMenu'] && (this.doSizeAndCenterFirst || (i != 0)) && (this.doSizeAndCenterLast || (i != this.elmsMenuAssociations.length - 1))){
	// 			if(forElmMenuItemArray['elmSubMenu'].offsetWidth < forElmMenuItemArray['elmtopLevel'].offsetWidth + this.addedWidth && !__.ua.isIE6()){
	// 				forElmMenuItemArray['elmSubMenu'].style.width = (forElmMenuItemArray['elmtopLevel'].offsetWidth + this.addedWidth/*  - this.subMenuPadding */) + 'px';
	// 			}
	// 			if(forElmMenuItemArray['elmSubMenu'].offsetWidth > forElmMenuItemArray['elmtopLevel'].offsetWidth){
	// 				ifOffset = ((forElmMenuItemArray['elmtopLevel'].offsetWidth - (forElmMenuItemArray['elmSubMenu'].offsetWidth/*  + this.submenuPadding */)) / 2);
	// 				if(__.ua.isIE6()) ifOffset += this.subMenuOffset;
	// 				forElmMenuItemArray['elmSubMenu'].style.left = ifOffset+ 'px';
	// 			}
	// 		}
	// 	}
	// }
	// __.classes.DropDownMenu.prototype.sizeAndCenter2 = function(){
	// 	for(var i=0; i < this.elmsMenuAssociations.length; ++i){
	// 		var forElmMenuItemArray = this.elmsMenuAssociations[i];
	// 		if(forElmMenuItemArray['elmSubMenu'] && (this.doSizeAndCenterFirst || (i != 0)) && (this.doSizeAndCenterLast || (i != this.elmsMenuAssociations.length - 1))){
	// 			forElmMenuItemArray['elmSubMenu'].style.visibility = 'hidden';
	// 			forElmMenuItemArray['elmSubMenu'].style.display = 'block';
	// 			if(forElmMenuItemArray['elmSubMenu'].offsetWidth < forElmMenuItemArray['elmtopLevel'].offsetWidth + this.addedWidth && !__.ua.isIE6()){
	// 				forElmMenuItemArray['elmSubMenu'].style.width = (forElmMenuItemArray['elmtopLevel'].offsetWidth + this.addedWidth + this.menuPadding*2) + 'px';
	// 			}
	// 			if(forElmMenuItemArray['elmSubMenu'].offsetWidth > forElmMenuItemArray['elmtopLevel'].offsetWidth){
	// 				ifOffset = ((forElmMenuItemArray['elmtopLevel'].offsetWidth - forElmMenuItemArray['elmSubMenu'].offsetWidth ) / 2) + this.menuPadding;
	// 				if(__.ua.isIE6()) ifOffset += this.subMenuOffset;
	// 				forElmMenuItemArray['elmSubMenu'].style.left = ifOffset+ 'px';
	// 			}
	// 			forElmMenuItemArray['elmSubMenu'].style.display = '';
	// 			forElmMenuItemArray['elmSubMenu'].style.visibility = '';
	// 		}
	// 	}
	// }

