/* *** config *** */
var cfgNavigationID = "top_navigation";
var cfgNavigationMenuLIClass = "menu_li"
var cfgNavigationToplevelItemsClass = "menu";
var cfgSubmenuClass = "submenu";

/* *** global variables *** */
var __, oTopnavigationDropdownhandler;

/* *** onload *** */
function scrOnload(){
	oTopnavigationDropdownhandler = new tmlibSuckerfish({"menuID":cfgNavigationID,"wrapperClass":cfgNavigationMenuLIClass,"toplevelClass":cfgNavigationToplevelItemsClass,"submenuClass":cfgSubmenuClass});
}

/* ----------- tmlib ------------ */
/* *********
©TMlib suckerfish
*********** */
function tmlibSuckerfish(args){
	this.menuID = (args.meniID)? args.menuID : "topnavigation";
	this.wrapperClass = (args.wrapperClass)? args.wrapperClass : "menu_li";
	this.toplevelClass = (args.toplevelClass)? args.toplevelClass : "toplevel";
	this.submenuClass = (args.submenuClass)? args.submenuClass : "submenu";
	this.doSizeAndCenter = (args.doSizeAndCenter)? args.doSizeAndCenter : 0;
	this.submenuPadding = (args.submenuPadding)? args.submenuPadding : 0;
	this.submenuOffset = (args.submenuOffset)? args.submenuOffset : 0;
	this.addedWidth = (args.addedWidth)? args.addedWidth : 0;
	
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
			fncReturnArray.push({"elmItemWrapper":this.elmsWrapper[i], "elmToplevel":forElmToplevel[0], "elmSubmenu": forElmSubmenu[0]})
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

/* *****
init tmlib
***** */
__ = new tmlib();
__.addListener(window, "load", scrOnload, false);
