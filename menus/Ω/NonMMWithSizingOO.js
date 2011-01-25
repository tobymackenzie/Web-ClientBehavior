/* *** config *** */
var cfgNavigationID = "topnavigation";
var cfgNavigationMenuLIClass = "menu_li"
var cfgNavigationToplevelItemsClass = "toplevel";
var cfgSubmenuClass = "submenu";
var cfgSubmenuPadding = 20;
var cfgSubmenuOffset = 47;
var cfgAddedWidth = 60;

/* *** global variables *** */
var __, oTopnavigationDropdownhandler;

/* *** onload *** */
function scrOnload(){
	oTopnavigationDropdownhandler = new tmlibSuckerfish({"menuID":cfgNavigationID,"wrapperClass":cfgNavigationMenuLIClass,"toplevelClass":cfgNavigationToplevelItemsClass,"submenuClass":cfgSubmenuClass, "submenuPadding":cfgSubmenuPadding, "submenuOffset": cfgSubmenuOffset, "addedWidth": cfgAddedWidth});
	oTopnavigationDropdownhandler.sizeAndCenter();
}

/* ----------- tmlib ------------ */
/* *********
©TMlib suckerfish
*********** */
function tmlibSuckerfish(arguments){
	this.menuID = (arguments.meniID)? arguments.menuID : "topnavigation";
	this.wrapperClass = (arguments.wrapperClass)? arguments.wrapperClass : "menu_li";
	this.toplevelClass = (arguments.toplevelClass)? arguments.toplevelClass : "toplevel";
	this.submenuClass = (arguments.submenuClass)? arguments.submenuClass : "submenu";
	this.doSizeAndCenter = (arguments.doSizeAndCenter)? arguments.doSizeAndCenter : 0;
	this.submenuPadding = (arguments.submenuPadding)? arguments.submenuPadding : 0;
	this.submenuOffset = (arguments.submenuOffset)? arguments.submenuOffset : 0;
	this.addedWidth = (arguments.addedWidth)? arguments.addedWidth : 0;
	
	this.elmMenu = elmMenu = document.getElementById(cfgNavigationID);
	this.elmsWrapper = __.getElementsByClassName({"className": this.wrapperClass, "element": elmMenu});
	this.elmsMenuAssociations = this.getAllMenuPieces();
	this.elmCurrentlySelected = 0;
	
	this.timeout;
	
	this.attachListeners();
}
	tmlibSuckerfish.prototype.getAllMenuPieces = function(){
		var fncReturnArray = new Array();
		for(var i=0; i < this.elmsWrapper.length; ++i){
			var forArray = new Array;
			forElmToplevel = __.getElementsByClassName({"className": this.toplevelClass, "element": this.elmsWrapper[i]});
			forElmSubmenu = __.getElementsByClassName({"className": this.submenuClass, "element": this.elmsWrapper[i]});
			fncReturnArray.push({"elmItemWrapper":this.elmsWrapper[i], "elmToplevel":forElmToplevel[0], "elmSubmenu": (forElmSubmenu[0])?forElmSubmenu[0]:null})
		}
		return fncReturnArray;
	}
	tmlibSuckerfish.prototype.attachListeners = function(){
		var fncThis = this;
		for(i=0;i < this.elmsMenuAssociations.length; ++i){
			var forElmMenuItemArray = this.elmsMenuAssociations[i];
			if(this.elmsMenuAssociations[i]["elmSubmenu"]){
				var callbackFull = function(forElmMenuItemArray, fncThis) {
					return function(){
						clearTimeout(fncThis.timeout);
						if(!(this.elmCurrentlySelected === forElmMenuItemArray["elmItemWrapper"]))
							fncThis.dropdownOpen(forElmMenuItemArray["elmItemWrapper"]);
					}
				}(forElmMenuItemArray, fncThis);
				var callbackMouseout = function(fncThis){
					return function(){
						fncThis.timeout = setTimeout(function(fncThis){ return function(){fncThis.dropdownCloseCurrent(); };}(fncThis) ,750);
					};
	
				}(fncThis);
				__.addListener(forElmMenuItemArray["elmItemWrapper"], "mouseover", callbackFull, false);
				__.addListener(forElmMenuItemArray["elmToplevel"], "mouseover", callbackFull, false);
				__.addListener(forElmMenuItemArray["elmSubmenu"], "mouseover", callbackFull, false);
				__.addListener(forElmMenuItemArray["elmItemWrapper"], "click", callbackFull, false);
				__.addListener(forElmMenuItemArray["elmItemWrapper"], "touchstart", callbackFull, false);
				__.addListener(forElmMenuItemArray["elmItemWrapper"], "mouseout", callbackMouseout, false);
			}
			// empty menu items
			else{
				var callbackEmpty = function(fncThis){
					return function(){
						fncThis.dropdownCloseCurrent();
					}
				}(fncThis)
				__.addListener(forElmMenuItemArray["elmItemWrapper"], "mouseover", callbackEmpty, false);
				__.addListener(forElmMenuItemArray["elmItemWrapper"], "click", callbackEmpty, false);
				__.addListener(forElmMenuItemArray["elmItemWrapper"], "touchstart", callbackEmpty, false);
			}
		}
	}
	tmlibSuckerfish.prototype.dropdownOpen = function(argElement){
		if(this.elmCurrentlySelected && this.elmCurrentlySelected !== argElement)
			this.dropdownCloseCurrent();
		if(argElement){
			__.addClass(argElement, "selected");
			this.elmCurrentlySelected = argElement;
		}
	}
	tmlibSuckerfish.prototype.dropdownCloseCurrent = function(){
		if(this.elmCurrentlySelected){
			__.removeClass(this.elmCurrentlySelected, "selected");
			this.elmCurrentlySelected = 0;
			return 1;
		}
		return 0;
	}
	tmlibSuckerfish.prototype.dropdownCloseAll = function(){
						for(j=0;j < argElmsMenuArray.length; ++j){
							__.removeClass(argElmsMenuArray[j]["elmItemWrapper"], "selected");
						}
	}
/* ***** 
©menu sizing
****** */

tmlibSuckerfish.prototype.sizeAndCenter = function(){	
	for(var i=0; i < this.elmsMenuAssociations.length; ++i){
		var forElmMenuItemArray = this.elmsMenuAssociations[i];
		if(forElmMenuItemArray["elmSubmenu"]){
			if(forElmMenuItemArray["elmSubmenu"].offsetWidth < forElmMenuItemArray["elmToplevel"].offsetWidth + this.addedWidth && !__.isIE6()){
				forElmMenuItemArray["elmSubmenu"].style.width = (forElmMenuItemArray["elmToplevel"].offsetWidth + this.addedWidth/*  - this.submenuPadding */) + "px";
			}
			if(forElmMenuItemArray["elmSubmenu"].offsetWidth > forElmMenuItemArray["elmToplevel"].offsetWidth){
				ifOffset = ((forElmMenuItemArray["elmToplevel"].offsetWidth - (forElmMenuItemArray["elmSubmenu"].offsetWidth/*  + this.ubmenuPadding */)) / 2);
				if(__.isIE6()) ifOffset += this.submenuOffset;
				forElmMenuItemArray["elmSubmenu"].style.left = ifOffset+ "px";
			}
		}
	}
}

/* ********* 
©library
********* */
function tmlib(){}
	tmlib.prototype.addListener = function(argElement, argEvent, argFunction, argBubble){
		var fncBubble = (argBubble)?argBubble : false;
		if(argElement.attachEvent)
			argElement.attachEvent("on"+argEvent, argFunction);
		else
			argElement.addEventListener(argEvent, argFunction, fncBubble);
	}
	tmlib.prototype.getElementsByClassName = function(args){
		var fncClassName = (args.className)?args.className:null; if(!fncClassName) return;
		var fncElement = (args.element)?args.element:document;
		var fncTagName = (args.tagName)?args.tagName:null;
		
		var fncReturn = [], fncElementsToSearch = [];
		var fncRegex = new RegExp('\\b'+fncClassName+'\\b');
		
		if(fncTagName){
			fncElementsToSearch = fncElement.getElementsByTagName(fncTagName);
		}
		else if(fncElement.all)
			fncElementsToSearch = fncElement.all;
		else
			fncElementsToSearch = fncElement.getElementsByTagName('*');
	
		for(var i=0; i < fncElementsToSearch.length; ++i){
			if(fncRegex.test(fncElementsToSearch[i].className))
				fncReturn.push(fncElementsToSearch[i]);
		}
		
		return fncReturn;
	}
	tmlib.prototype.addClass = function(argElement, argClass){
		if(new RegExp('\\b'+argClass+'\\b').test(argElement.className))
			return 0;
		else{
			argElement.className+=argElement.className?' '+argClass:argClass;
			return 1;
		}
	}
	tmlib.prototype.removeClass = function(argElement, argClass){
		  var fncReplace = argElement.className.match(' '+argClass)?' '+argClass:argClass;
		  argElement.className=argElement.className.replace(fncReplace,'');
	}
	tmlib.prototype.hasClass = function(argElement, argClass){
		if(new RegExp('\\b'+argClass+'\\b').test(argElement.className))
			return 1;
		else
			return 0;
	}
	
	tmlib.prototype.isIE = function(){
		if(this.isievar)
			return this.isie
		else{
			this.initUA();
			if(this.browser.indexOf("Internet Explorer", 0) == -1) return 1
			else return 0;
		}
	}
	tmlib.prototype.isIE6 = function(){
		if(this.isIE){
			if(!this.ieversion) // http://www.javascriptkit.com/javatutors/navigator.shtml
				if(/MSIE (\d+\.\d+);/.test(navigator.userAgent))
					this.ieversion = new Number(RegExp.$1) // capture x.x portion and store as a number
			if(this.ieversion == 6)
				return 1;
			else return 0;
		}
		else
			return 0;
	}
	tmlib.prototype.initUA = function(){
		if(!this.browser) this.browser = navigator.appName;
		if(!this.verion){
			this.version = parseFloat(navigator.appVersion);
		}
	}

/* *****
init tmlib
***** */
__ = new tmlib();
__.addListener(window, "load", scrOnload, false);
