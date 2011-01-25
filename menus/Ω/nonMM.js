/* *********
config
******** */
var cfgNavigationID = "topnavigation";
var cfgNavigationMenuLIClass = "menu_li"
var cfgNavigationToplevelItemsClass = "toplevel";
var cfgSubmenuClass = "submenu";

/* ***** 
global variables
******* */
var __, elmBody, elmMenu, elmsTopLevelMenuLIs, elmsMenuAssociations, glbTimeout, elmCurrentlySelected;


/* ***** 
onload
****** */
tmlibAddListener(window, "load", scrOnload, false);
function scrOnload(){
	// init elements
/*
	elmBody = document.getElementsByTagName("body");
	elmBody = elmBody[0];
*/
	elmMenu = document.getElementById(cfgNavigationID);
	elmsTopLevelMenuLIs = tmlibGetElementsByClassName({"className": cfgNavigationMenuLIClass, "element": elmMenu});
	elmsMenuAssociations = tmlibGetAllMenuPieces({"wrapperElements": elmsTopLevelMenuLIs, "toplevelClass": cfgNavigationToplevelItemsClass, "submenuClass": cfgSubmenuClass});
	__ = new tmlib();

	// TM suckerfish menu
/* 	tmlibAddListener(elmBody, "mouseup", function(){P7_autoLayers(0);}); */
	tmlibMenuDropdownInit(elmsMenuAssociations);
}

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
		forElmToplevel = tmlibGetElementsByClassName({"className": fncToplevelClass, "element": fncElmsWrapper[i]});
		forElmSubmenu = tmlibGetElementsByClassName({"className": fncSubmenuClass, "element": fncElmsWrapper[i]});
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
			tmlibAddListener(argElmsMenuArray[i]["elmItemWrapper"], "mouseover", callbackFull, false);
			tmlibAddListener(argElmsMenuArray[i]["elmToplevel"], "mouseover", callbackFull, false);
			tmlibAddListener(argElmsMenuArray[i]["elmSubmenu"], "mouseover", callbackFull, false);
			tmlibAddListener(argElmsMenuArray[i]["elmItemWrapper"], "click", callbackFull, false);
			tmlibAddListener(argElmsMenuArray[i]["elmItemWrapper"], "touchstart", callbackFull, false);
			tmlibAddListener(argElmsMenuArray[i]["elmItemWrapper"], "mouseout", callbackMouseout, false);
		}
		// empty menu items
		else{
			tmlibAddListener(argElmsMenuArray[i]["elmItemWrapper"], "mouseover", callbackEmpty, false);
			tmlibAddListener(argElmsMenuArray[i]["elmItemWrapper"], "click", callbackEmpty, false);
			tmlibAddListener(argElmsMenuArray[i]["elmItemWrapper"], "touchstart", callbackEmpty, false);
		}
	}
}
function tmlibMenuDropdownOpen(argElement){
	if(elmCurrentlySelected && elmCurrentlySelected !== argElement)
		tmlibMenuDropdownCloseCurrent();
	if(argElement){
		tmlibAddClass(argElement, "selected");
		elmCurrentlySelected = argElement;
	}
}
function tmlibMenuDropdownCloseCurrent(){
	if(elmCurrentlySelected){
		tmlibRemoveClass(elmCurrentlySelected, "selected");
		elmCurrentlySelected = 0;
		return 1;
	}
	return 0;
}
function tmlibMenuDropdownCloseAll(){
					for(j=0;j < argElmsMenuArray.length; ++j){
						tmlibRemoveClass(argElmsMenuArray[j]["elmItemWrapper"], "selected");
					}
}

/* ********* 
library
********* */
function tmlibAddListener(argElement, argEvent, argFunction, argBubble){
	var fncBubble = (argBubble)?argBubble : false;
	if(argElement.attachEvent)
		argElement.attachEvent("on"+argEvent, argFunction);
	else
		argElement.addEventListener(argEvent, argFunction, fncBubble);
}
function tmlibGetElementsByClassName(args){
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
function tmlibAddClass(argElement, argClass){
	if(new RegExp('\\b'+argClass+'\\b').test(argElement.className))
		return 0;
	else{
		argElement.className+=argElement.className?' '+argClass:argClass;
		return 1;
	}
}
function tmlibRemoveClass(argElement, argClass){
      var fncReplace = argElement.className.match(' '+argClass)?' '+argClass:argClass;
      argElement.className=argElement.className.replace(fncReplace,'');
}
function tmlibHasClass(argElement, argClass){
	if(new RegExp('\\b'+argClass+'\\b').test(argElement.className))
		return 1;
	else
		return 0;
}