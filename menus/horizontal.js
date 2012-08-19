/*
-----dependencies
tmlib: addListeners, getElementsByClassName, addClass, removeClass, hasClass, isIE, isIE6, ua.init

-----styling
/*--base
#topnavigation .submenu{
	display: none;
}
#topnavigation .topitem.selected .submenu, #topnavigation .topitem:hover .submenu, #topnavigation .topitem:focus .submenu{
	display: block;
}

-----instantiation
__.cfg.navigationID = 'mainnavigation';
__.cfg.menuPadding = 20;
__.cfg.submenuOffset = 0;
__.cfg.addedWidth = 20;


__.scrOnload = function(){
//	no sizing
	__.topnavigationDropdownhandler = new __.classes.suckerfish({menuID: __.cfg.navigationID});

// size and center 1
//	__.topnavigationDropdownhandler = new __.classes.suckerfish({menuID: __.cfg.navigationID, menuPadding: __.cfg.submenuPadding,submenuOffset: __.cfg.submenuOffset, addedWidth: __.cfg.addedWidth});
//	oTopnavigationDropdownhandler.sizeAndCenter1();

// size and center 2
//	__.topnavigationDropdownhandler = new __.classes.suckerfish({menuID: __.cfg.navigationID, menuPadding: __.cfg.menuPadding, submenuOffset: __.cfg.submenuOffset, addedWidth: __.cfg.addedWidth});
//	__.topnavigationDropdownhandler.sizeAndCenter2();
}

/*----------
©TMlib suckerfish
----------*/
__.classes.suckerfish = function (args){
		this.wrapperClass = (args.wrapperClass)? args.wrapperClass : 'topitem';
		this.toplevelClass = (args.toplevelClass)? args.toplevelClass : 'toplevel';
		this.submenuClass = (args.submenuClass)? args.submenuClass : 'submenu';
		this.doCloseOnClickOutside = args.doCloseOnClickOutside || false;
		this.doSizeAndCenter = (args.doSizeAndCenter)? args.doSizeAndCenter : false;
		this.doSizeAndCenterFirst = (typeof args.doSizeAndCenterFirst != 'undefined')? args.doSizeAndCenterFirst : true;
		this.doSizeAndCenterLast = (typeof args.doSizeAndCenterLast != 'undefined')? args.doSizeAndCenterLast : true;
		this.menuPadding = (args.menuPadding)? args.menuPadding : 0;
		this.submenuOffset = (args.submenuOffset)? args.submenuOffset : 0;
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
			var forElmToplevel = __.lib.getElementsByClassName({'className': this.toplevelClass, 'element': this.elmsWrapper[i]});
			var forElmSubmenu = __.lib.getElementsByClassName({'className': this.submenuClass, 'element': this.elmsWrapper[i]});
			fncReturnArray.push({'elmItemWrapper':this.elmsWrapper[i], 'elmToplevel':forElmToplevel[0], 'elmSubmenu': (forElmSubmenu[0])?forElmSubmenu[0]:null})
		}

		return fncReturnArray;
	}
	__.classes.suckerfish.prototype.attachListeners = function(){
		var fncThis = this;
		for(var i=0;i < this.elmsMenuAssociations.length; ++i){
			var forElmMenuItemArray = this.elmsMenuAssociations[i];
			if(this.elmsMenuAssociations[i]['elmSubmenu']){
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
				__.lib.addListeners(forElmMenuItemArray['elmToplevel'], 'mouseover', callbackFull, false);
				__.lib.addListeners(forElmMenuItemArray['elmToplevel'], 'focus', callbackFull, false);
				__.lib.addListeners(forElmMenuItemArray['elmSubmenu'], 'mouseover', callbackFull, false);
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'click', callbackFull, false);
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'touchstart', callbackFull, false);
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'mouseout', callbackMouseout, false);

				forElmMenuItemArray['elmToplevel'].href='javascript:/*openMenu()*/;';
				forElmMenuItemArray['elmToplevel'].style.cursor = 'default';
			}
			// empty menu items
			else{
				var callbackEmpty = function(fncThis){
					return function(){
						fncThis.dropdownCloseCurrent();
					}
				}(fncThis)
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'mouseover', callbackEmpty, false);
				__.lib.addListeners(forElmMenuItemArray['elmToplevel'], 'focus', callbackEmpty, false);
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'click', callbackEmpty, false);
				__.lib.addListeners(forElmMenuItemArray['elmItemWrapper'], 'touchstart', callbackEmpty, false);
			}
		}
		if(this.doCloseOnClickOutside){
			__.lib.addListeners(document.body, 'click', function(){ fncThis.dropdownCloseAll(); }, true);
		}
	}
	__.classes.suckerfish.prototype.dropdownOpen = function(argElement){
		if(this.elmCurrentlySelected && this.elmCurrentlySelected !== argElement)
			this.dropdownCloseCurrent();
		if(argElement){
			__.lib.addClass(argElement, this.classSelected);
			this.elmCurrentlySelected = argElement;
		}
	}
	__.classes.suckerfish.prototype.dropdownCloseCurrent = function(){
		if(this.elmCurrentlySelected){
			__.lib.removeClass(this.elmCurrentlySelected, this.classSelected);
			this.elmCurrentlySelected = 0;
			return 1;
		}
		return 0;
	}
	__.classes.suckerfish.prototype.dropdownCloseAll = function(){
		for(j=0;j < this.elmsMenuAssociations.length; ++j){
			__.lib.removeClass(this.elmsMenuAssociations[j]['elmItemWrapper'], this.classSelected);
		}
	}


/*---menu sizing
---*/
	__.classes.suckerfish.prototype.sizeAndCenter1 = function(){
		for(var i=0; i < this.elmsMenuAssociations.length; ++i){
			var forElmMenuItemArray = this.elmsMenuAssociations[i];
			if(forElmMenuItemArray['elmSubmenu'] && (this.doSizeAndCenterFirst || (i != 0)) && (this.doSizeAndCenterLast || (i != this.elmsMenuAssociations.length - 1))){
				if(forElmMenuItemArray['elmSubmenu'].offsetWidth < forElmMenuItemArray['elmToplevel'].offsetWidth + this.addedWidth && !__.ua.isIE6()){
					forElmMenuItemArray['elmSubmenu'].style.width = (forElmMenuItemArray['elmToplevel'].offsetWidth + this.addedWidth/*  - this.submenuPadding */) + 'px';
				}
				if(forElmMenuItemArray['elmSubmenu'].offsetWidth > forElmMenuItemArray['elmToplevel'].offsetWidth){
					ifOffset = ((forElmMenuItemArray['elmToplevel'].offsetWidth - (forElmMenuItemArray['elmSubmenu'].offsetWidth/*  + this.ubmenuPadding */)) / 2);
					if(__.ua.isIE6()) ifOffset += this.submenuOffset;
					forElmMenuItemArray['elmSubmenu'].style.left = ifOffset+ 'px';
				}
			}
		}
	}
	__.classes.suckerfish.prototype.sizeAndCenter2 = function(){
		for(var i=0; i < this.elmsMenuAssociations.length; ++i){
			var forElmMenuItemArray = this.elmsMenuAssociations[i];
			if(forElmMenuItemArray['elmSubmenu'] && (this.doSizeAndCenterFirst || (i != 0)) && (this.doSizeAndCenterLast || (i != this.elmsMenuAssociations.length - 1))){
				forElmMenuItemArray['elmSubmenu'].style.visibility = 'hidden';
				forElmMenuItemArray['elmSubmenu'].style.display = 'block';
				if(forElmMenuItemArray['elmSubmenu'].offsetWidth < forElmMenuItemArray['elmToplevel'].offsetWidth + this.addedWidth && !__.ua.isIE6()){
					forElmMenuItemArray['elmSubmenu'].style.width = (forElmMenuItemArray['elmToplevel'].offsetWidth + this.addedWidth + this.menuPadding*2) + 'px';
				}
				if(forElmMenuItemArray['elmSubmenu'].offsetWidth > forElmMenuItemArray['elmToplevel'].offsetWidth){
					ifOffset = ((forElmMenuItemArray['elmToplevel'].offsetWidth - forElmMenuItemArray['elmSubmenu'].offsetWidth ) / 2) + this.menuPadding;
					if(__.ua.isIE6()) ifOffset += this.submenuOffset;
					forElmMenuItemArray['elmSubmenu'].style.left = ifOffset+ 'px';
				}
				forElmMenuItemArray['elmSubmenu'].style.display = '';
				forElmMenuItemArray['elmSubmenu'].style.visibility = '';
			}
		}
	}

