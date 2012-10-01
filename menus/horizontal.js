/*
-----dependencies
tmlib: addListeners, getElementsByClassName, addClass, removeClass, hasClass, isIE, isIE6, ua.init

-----styling
/*--base
#topnavigation .subMenu{
	display: none;
}
#topnavigation .topItem.selected .subMenu, #topnavigation .topItem:hover .subMenu, #topnavigation .topItem:focus .subMenu{
	display: block;
}

-----instantiation
__.cfg.navigationID = 'mainnavigation';
__.cfg.menuPadding = 20;
__.cfg.subMenuOffset = 0;
__.cfg.addedWidth = 20;


__.scrOnload = function(){
//	no sizing
	__.topnavigationDropdownhandler = new __.classes.suckerfish({menuID: __.cfg.navigationID});

// size and center 1
//	__.topnavigationDropdownhandler = new __.classes.suckerfish({menuID: __.cfg.navigationID, menuPadding: __.cfg.subMenuPadding,subMenuOffset: __.cfg.subMenuOffset, addedWidth: __.cfg.addedWidth});
//	oTopnavigationDropdownhandler.sizeAndCenter1();

// size and center 2
//	__.topnavigationDropdownhandler = new __.classes.suckerfish({menuID: __.cfg.navigationID, menuPadding: __.cfg.menuPadding, subMenuOffset: __.cfg.subMenuOffset, addedWidth: __.cfg.addedWidth});
//	__.topnavigationDropdownhandler.sizeAndCenter2();
}

/*----------
©TMlib suckerfish
----------*/
__.classes.suckerfish = function (args){
		this.wrapperClass = (args.wrapperClass)? args.wrapperClass : 'topItem';
		this.topLevelClass = (args.topLevelClass)? args.topLevelClass : 'topLevel';
		this.subMenuClass = (args.subMenuClass)? args.subMenuClass : 'subMenu';
		this.doCloseOnClickOutside = args.doCloseOnClickOutside || false;
		this.doSizeAndCenter = (args.doSizeAndCenter)? args.doSizeAndCenter : false;
		this.doSizeAndCenterFirst = (typeof args.doSizeAndCenterFirst != 'undefined')? args.doSizeAndCenterFirst : true;
		this.doSizeAndCenterLast = (typeof args.doSizeAndCenterLast != 'undefined')? args.doSizeAndCenterLast : true;
		this.menuPadding = (args.menuPadding)? args.menuPadding : 0;
		this.onClose = args.onClose || null;
		this.onOpen = args.onOpen || null;
		this.subMenuOffset = (args.subMenuOffset)? args.subMenuOffset : 0;
		this.addedWidth = (args.addedWidth)? args.addedWidth : 0;
		this.classSelected = args.classSelected || 'selected';

		this.elmMenu = document.getElementById(this.menuID);
		this.elmsWrapper = __.lib.getElementsByClassName({'className': this.wrapperClass, 'element': this.elmMenu});
		this.elmsMenuAssociations = this.getAllMenuPieces();
		this.elmCurrentlySelected = 0;

		this.timeout;

		this.attachListeners();
	}
	__.classes.suckerfish.prototype.getAllMenuPieces = function(){
		var fncReturnArray = new Array();
		for(var i=0; i < this.elmsWrapper.length; ++i){
			var forArray = new Array;
			var forElmtopLevel = __.lib.getElementsByClassName({'className': this.topLevelClass, 'element': this.elmsWrapper[i]});
			var forelmSubMenu = __.lib.getElementsByClassName({'className': this.subMenuClass, 'element': this.elmsWrapper[i]});
			fncReturnArray.push({'elmItemWrapper':this.elmsWrapper[i], 'elmtopLevel':forElmtopLevel[0], 'elmSubMenu': (forelmSubMenu[0])?forelmSubMenu[0]:null})
		}

		return fncReturnArray;
	}
	__.classes.suckerfish.prototype.attachListeners = function(){
		var fncThis = this;
		for(var i=0;i < this.elmsMenuAssociations.length; ++i){
			var forElmMenuItemArray = this.elmsMenuAssociations[i];
			if(this.elmsMenuAssociations[i]['elmSubMenu']){
				var callbackFull = function(forElmMenuItemArray, fncThis) {
					return function(){
						clearTimeout(fncThis.timeout);
						if(!(this.elmCurrentlySelected === forElmMenuItemArray['elmItemWrapper']))
							fncThis.dropdownOpen(forElmMenuItemArray['elmItemWrapper']);
					}
				}(forElmMenuItemArray, fncThis);
				var callbackMouseout = function(fncThis){
					return function(){
						fncThis.timeout = setTimeout(function(fncThis){ return function(){fncThis.dropdownCloseCurrent(); };}(fncThis) ,750);
					};

				}(fncThis);
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'mouseover', callbackFull, false);
				__.lib.addListeners(forElmMenuItemArray['elmtopLevel'], 'mouseover', callbackFull, false);
				__.lib.addListeners(forElmMenuItemArray['elmtopLevel'], 'focus', callbackFull, false);
				__.lib.addListeners(forElmMenuItemArray['elmSubMenu'], 'mouseover', callbackFull, false);
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'click', callbackFull, false);
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'touchstart', callbackFull, false);
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'mouseout', callbackMouseout, false);

				forElmMenuItemArray['elmtopLevel'].href='javascript:/*openMenu()*/;';
				forElmMenuItemArray['elmtopLevel'].style.cursor = 'default';
			}
			// empty menu items
			else{
				var callbackEmpty = function(fncThis){
					return function(){
						fncThis.dropdownCloseCurrent();
					}
				}(fncThis)
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'mouseover', callbackEmpty, false);
				__.lib.addListeners(forElmMenuItemArray['elmtopLevel'], 'focus', callbackEmpty, false);
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'click', callbackEmpty, false);
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'touchstart', callbackEmpty, false);
			}
		}
		if(this.doCloseOnClickOutside){
			__.lib.addListeners(document.body, 'click', function(){ fncThis.dropdownCloseAll(); }, true);
		}
	}
	__.classes.suckerfish.prototype.dropdownOpen = function(argElement){
		var doOnOpen = (this.elmCurrentlySelected !== argElement)
		if(this.elmCurrentlySelected && this.elmCurrentlySelected !== argElement){
			this.dropdownCloseCurrent();
		}
		if(argElement){
			__.lib.addClass(argElement, this.classSelected);
			this.elmCurrentlySelected = argElement;
			if(doOnOpen && this.onOpen){
				this.onOpen.call(this, argElement);
			}
		}
	}
	__.classes.suckerfish.prototype.dropdownCloseCurrent = function(){
		if(this.elmCurrentlySelected){
			__.lib.removeClass(this.elmCurrentlySelected, this.classSelected);
			var elmWasCurrent = this.elmCurrentlySelected;
			this.elmCurrentlySelected = 0;
			if(this.onClose){
				this.onClose.call(this, elmWasCurrent);
			}
			return 1;
		}
		return 0;
	}
	__.classes.suckerfish.prototype.dropdownCloseAll = function(){
		for(j=0;j < this.elmsMenuAssociations.length; ++j){
			__.lib.removeClass(this.elmsMenuAssociations[j]['elmItemWrapper'], this.classSelected);
		}
		if(this.elmCurrentlySelected){
			var elmWasCurrent = this.elmCurrentlySelected;
			this.elmCurrentlySelected = 0;
			if(this.onClose){
				this.onClose.call(this, elmWasCurrent);
			}
		}
	}


/*---menu sizing
---*/
	__.classes.suckerfish.prototype.sizeAndCenter1 = function(){
		for(var i=0; i < this.elmsMenuAssociations.length; ++i){
			var forElmMenuItemArray = this.elmsMenuAssociations[i];
			if(forElmMenuItemArray['elmSubMenu'] && (this.doSizeAndCenterFirst || (i != 0)) && (this.doSizeAndCenterLast || (i != this.elmsMenuAssociations.length - 1))){
				if(forElmMenuItemArray['elmSubMenu'].offsetWidth < forElmMenuItemArray['elmtopLevel'].offsetWidth + this.addedWidth && !__.ua.isIE6()){
					forElmMenuItemArray['elmSubMenu'].style.width = (forElmMenuItemArray['elmtopLevel'].offsetWidth + this.addedWidth/*  - this.subMenuPadding */) + 'px';
				}
				if(forElmMenuItemArray['elmSubMenu'].offsetWidth > forElmMenuItemArray['elmtopLevel'].offsetWidth){
					ifOffset = ((forElmMenuItemArray['elmtopLevel'].offsetWidth - (forElmMenuItemArray['elmSubMenu'].offsetWidth/*  + this.submenuPadding */)) / 2);
					if(__.ua.isIE6()) ifOffset += this.subMenuOffset;
					forElmMenuItemArray['elmSubMenu'].style.left = ifOffset+ 'px';
				}
			}
		}
	}
	__.classes.suckerfish.prototype.sizeAndCenter2 = function(){
		for(var i=0; i < this.elmsMenuAssociations.length; ++i){
			var forElmMenuItemArray = this.elmsMenuAssociations[i];
			if(forElmMenuItemArray['elmSubMenu'] && (this.doSizeAndCenterFirst || (i != 0)) && (this.doSizeAndCenterLast || (i != this.elmsMenuAssociations.length - 1))){
				forElmMenuItemArray['elmSubMenu'].style.visibility = 'hidden';
				forElmMenuItemArray['elmSubMenu'].style.display = 'block';
				if(forElmMenuItemArray['elmSubMenu'].offsetWidth < forElmMenuItemArray['elmtopLevel'].offsetWidth + this.addedWidth && !__.ua.isIE6()){
					forElmMenuItemArray['elmSubMenu'].style.width = (forElmMenuItemArray['elmtopLevel'].offsetWidth + this.addedWidth + this.menuPadding*2) + 'px';
				}
				if(forElmMenuItemArray['elmSubMenu'].offsetWidth > forElmMenuItemArray['elmtopLevel'].offsetWidth){
					ifOffset = ((forElmMenuItemArray['elmtopLevel'].offsetWidth - forElmMenuItemArray['elmSubMenu'].offsetWidth ) / 2) + this.menuPadding;
					if(__.ua.isIE6()) ifOffset += this.subMenuOffset;
					forElmMenuItemArray['elmSubMenu'].style.left = ifOffset+ 'px';
				}
				forElmMenuItemArray['elmSubMenu'].style.display = '';
				forElmMenuItemArray['elmSubMenu'].style.visibility = '';
			}
		}
	}

