/* *** config *** */
var cfgNavigationID = "topnavigation";
var cfgNavigationMenuLIClass = "menu_li"
var cfgNavigationToplevelItemsClass = "toplevel";
var cfgSubmenuClass = "submenu";
var cfgSubmenuPadding = 20;
var cfgSubmenuOffset = 47;
var cfgAddedWidth = 60;

/* *** global variables *** */
var __, elmBody, elmMenu, elmsTopLevelMenuLIs, elmsMenuAssociations, glbTimeout, elmCurrentlySelected;

/* *** onload *** */
function scrOnload(){
	// init elements
/*
	elmBody = document.getElementsByTagName("body");
	elmBody = elmBody[0];
*/
	elmMenu = document.getElementById(cfgNavigationID);
	elmsTopLevelMenuLIs = __.getElementsByClassName({"className": cfgNavigationMenuLIClass, "element": elmMenu});
	elmsMenuAssociations = tmlibGetAllMenuPieces({"wrapperElements": elmsTopLevelMenuLIs, "toplevelClass": cfgNavigationToplevelItemsClass, "submenuClass": cfgSubmenuClass});

	// TM suckerfish menu
/* 	__.addListener(elmBody, "mouseup", function(){P7_autoLayers(0);}); */
	tmlibMenuDropdownInit(elmsMenuAssociations);

	// menu sizing
	tmlibMenuSizing({"elmsMenuArray":elmsMenuAssociations, "submenuPadding": cfgSubmenuPadding, "submenuOffset" : cfgSubmenuOffset, "addedWidth": cfgAddedWidth});
}

/* ----------- tmlib ------------ */
/* *********
TM suckerfish init
*********** */
// get all toplevel and submenu items in associatiative array
function tmlibGetAllMenuPieces(arguments){
	var fncElmsWrapper = (arguments.wrapperElements)? arguments.wrapperElements : null;
	var fncToplevelClass = (arguments.toplevelClass)? arguments.toplevelClass : "toplevel";
	var fncSubmenuClass = (arguments.submenuClass)? arguments.submenuClass : "submenu";

	var fncReturnArray = new Array();
	
	if(!fncElmsWrapper) return false;
	
	for(var i=0; i < fncElmsWrapper.length; ++i){
		var forArray = new Array;
		forElmToplevel = __.getElementsByClassName({"className": fncToplevelClass, "element": fncElmsWrapper[i]});
		forElmSubmenu = __.getElementsByClassName({"className": fncSubmenuClass, "element": fncElmsWrapper[i]});
		fncReturnArray.push({"elmItemWrapper":fncElmsWrapper[i], "elmToplevel":forElmToplevel[0], "elmSubmenu": forElmSubmenu[0]})
	}
	return fncReturnArray;
}
function tmlibMenuDropdownInit(argElmsMenuArray){
	for(i=0;i < argElmsMenuArray.length; ++i){
		if(argElmsMenuArray[i]["elmSubmenu"]){
			var forElmMenuItemArray = argElmsMenuArray[i];
			var callbackFull = function(forElmMenuItemArray) {
				return function(){
					if(elmCurrentlySelected === forElmMenuItemArray["elmItemWrapper"])
						clearTimeout(glbTimeout);
					else{
						clearTimeout(glbTimeout);
						tmlibMenuDropdownOpen(forElmMenuItemArray["elmItemWrapper"]);
					}
				}
			}(forElmMenuItemArray);
			var callbackMouseout = function(){
					glbTimeout = setTimeout("tmlibMenuDropdownCloseCurrent()", 750);
			};
			var callbackEmpty = function(){
				tmlibMenuDropdownCloseCurrent();
			}
			__.addListener(argElmsMenuArray[i]["elmItemWrapper"], "mouseover", callbackFull, false);
			__.addListener(argElmsMenuArray[i]["elmToplevel"], "mouseover", callbackFull, false);
			__.addListener(argElmsMenuArray[i]["elmSubmenu"], "mouseover", callbackFull, false);
			__.addListener(argElmsMenuArray[i]["elmItemWrapper"], "click", callbackFull, false);
			__.addListener(argElmsMenuArray[i]["elmItemWrapper"], "touchstart", callbackFull, false);
			__.addListener(argElmsMenuArray[i]["elmItemWrapper"], "mouseout", callbackMouseout, false);
		}
		// empty menu items
		else{
			__.addListener(argElmsMenuArray[i]["elmItemWrapper"], "mouseover", callbackEmpty, false);
			__.addListener(argElmsMenuArray[i]["elmItemWrapper"], "click", callbackEmpty, false);
			__.addListener(argElmsMenuArray[i]["elmItemWrapper"], "touchstart", callbackEmpty, false);
		}
	}
}
function tmlibMenuDropdownOpen(argElement){
	if(elmCurrentlySelected && elmCurrentlySelected !== argElement)
		tmlibMenuDropdownCloseCurrent();
	if(argElement){
		__.addClass(argElement, "selected");
		elmCurrentlySelected = argElement;
	}
}
function tmlibMenuDropdownCloseCurrent(){
	if(elmCurrentlySelected){
		__.removeClass(elmCurrentlySelected, "selected");
		elmCurrentlySelected = 0;
		return 1;
	}
	return 0;
}
function tmlibMenuDropdownCloseAll(){
					for(j=0;j < argElmsMenuArray.length; ++j){
						__.removeClass(argElmsMenuArray[j]["elmItemWrapper"], "selected");
					}
}

/* ***** 
menu sizing
****** */

function tmlibMenuSizing(arguments){
	var fncElmsMenuArray = (arguments.elmsMenuArray)? arguments.elmsMenuArray : 0;	
	var fncSubmenuPadding = (arguments.submenuPadding)? arguments.submenuPadding : 0;
	var fncSubmenuOffset = (arguments.submenuOffset)? arguments.submenuOffset : 0;
	var fncAddedWidth = (arguments.addedWidth)? arguments.addedWidth : 0;

	if(!fncElmsMenuArray) return false;
	
	for(var i=0; i < fncElmsMenuArray.length; ++i){
		if(fncElmsMenuArray[i]["elmSubmenu"]){
			if(fncElmsMenuArray[i]["elmSubmenu"].offsetWidth < fncElmsMenuArray[i]["elmToplevel"].offsetWidth + fncAddedWidth && !__.isIE6()){
				fncElmsMenuArray[i]["elmSubmenu"].style.width = (fncElmsMenuArray[i]["elmToplevel"].offsetWidth + fncAddedWidth/*  - fncSubmenuPadding */) + "px";
			}
			if(fncElmsMenuArray[i]["elmSubmenu"].offsetWidth > fncElmsMenuArray[i]["elmToplevel"].offsetWidth){
				ifOffset = ((fncElmsMenuArray[i]["elmToplevel"].offsetWidth - (fncElmsMenuArray[i]["elmSubmenu"].offsetWidth/*  + fncSubmenuPadding */)) / 2);
				if(__.isIE6()) ifOffset += fncSubmenuOffset;
				fncElmsMenuArray[i]["elmSubmenu"].style.left = ifOffset+ "px";
			}
		}
	}
}

/* ********* 
library
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
/* 		if(fncRegex.test(fncElementsToSearch[i].getAttribute("class"))) */
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
tmlib.prototype.getUABrowser = function(){
	return this.browser;
}
tmlib.prototype.getUAVersion = function(){
	return this.version;
}

/* *****
init tmlib
***** */
__ = new tmlib();
__.addListener(window, "load", scrOnload, false);
