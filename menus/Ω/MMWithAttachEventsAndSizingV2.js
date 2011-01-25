/* *********
config
******** */
var cfgNavigationID = "topnavigation";
var cfgNavigationMenuLIClass = "menu_li"
var cfgNavigationToplevelItemsClass = "toplevel";
var cfgSubmenuClass = "submenu";
var cfgSubmenuPadding = 20;
var cfgSubmenuOffset = 47;
var cfgAddedWidth = 60;

/* ***** 
global variables
******* */
var elmBody, elmMenu, elmsTopLevelMenuLIs, elmsTopLevelMenuItems, elmsMenuAssociations, elmsMenuPieces;


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
	elmsTopLevelMenuItems = tmlibGetElementsByClassName({"className": cfgNavigationToplevelItemsClass, "element": elmMenu});
	elmsMenuPieces = tmlibGetAllMenuPieces({"wrapperElements": elmsTopLevelMenuLIs, "toplevelClass": cfgNavigationToplevelItemsClass, "submenuClass": cfgSubmenuClass});

	// MM suckerfish menu
/* 	tmlibAddListener(elmBody, "mouseup", function(){P7_autoLayers(0);}); */
	P7_autoHide('submenu_company', 'submenu_services', 'submenu_payments', 'submenu_contact');
	tmlibMenuDropdownInit(elmsMenuPieces);

	// menu sizing
	scrMenuSizing({"elmsMenuArray":elmsMenuPieces, "submenuPadding": cfgSubmenuPadding, "submenuOffset" : cfgSubmenuOffset, "addedWidth": cfgAddedWidth});
}

/* *********
MM suckerfish init
*********** */
// get all toplevel and submenu items in associatiative array, only useful for MM type code
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
			var forMenu = argElmsMenuArray[i]["elmSubmenu"];
			var forID = String(forMenu.getAttribute("id"));
			var callback = function(forID) {
				return function(){
					P7_autoLayers(0, forID);
/*
					if(e.stopPropagation){ e.stopPropagation(); }
					e.cancelBubble = true;
*/
				}
			}(forID);
			tmlibAddListener(argElmsMenuArray[i]["elmToplevel"], "mouseover", callback, false);
			tmlibAddListener(argElmsMenuArray[i]["elmToplevel"], "click", callback, false);
			tmlibAddListener(argElmsMenuArray[i]["elmToplevel"], "touchstart", callback, false);
			tmlibAddListener(argElmsMenuArray[i]["elmSubmenu"], "mouseover", function(){clearTimeout(TO);}, false);
		}
		// empty menu items
		else{
			tmlibAddListener(argElmsMenuArray[i]["elmToplevel"], "mouseover", function(){P7_autoLayers(0);}, false);
			tmlibAddListener(argElmsMenuArray[i]["elmToplevel"], "click", function(){P7_autoLayers(0);}, false);
			tmlibAddListener(argElmsMenuArray[i]["elmToplevel"], "touchstart", function(){P7_autoLayers(0);}, false);
		}
	}
}

/* ***** 
menu sizing
****** */

function scrMenuSizing(arguments){
	var fncElmsMenuArray = (arguments.elmsMenuArray)? arguments.elmsMenuArray : 0;	
	var fncSubmenuPadding = (arguments.submenuPadding)? arguments.submenuPadding : 0;
	var fncSubmenuOffset = (arguments.submenuOffset)? arguments.submenuOffset : 0;
	var fncAddedWidth = (arguments.addedWidth)? arguments.addedWidth : 0;

	if(!fncElmsMenuArray) return false;
	
	for(var i=0; i < fncElmsMenuArray.length; ++i){
		if(fncElmsMenuArray[i]["elmSubmenu"]){
			if(fncElmsMenuArray[i]["elmSubmenu"].offsetWidth < fncElmsMenuArray[i]["elmToplevel"].offsetWidth + fncAddedWidth){
				fncElmsMenuArray[i]["elmSubmenu"].style.width = (fncElmsMenuArray[i]["elmToplevel"].offsetWidth + fncAddedWidth/*  - fncSubmenuPadding */) + "px";
			}
			if(fncElmsMenuArray[i]["elmSubmenu"].offsetWidth > fncElmsMenuArray[i]["elmToplevel"].offsetWidth){
				ifOffset = ((fncElmsMenuArray[i]["elmToplevel"].offsetWidth - (fncElmsMenuArray[i]["elmSubmenu"].offsetWidth/*  + fncSubmenuPadding */)) / 2) + fncSubmenuOffset;
/* 				console.log("(("+fncElmsMenuArray[i]["elmToplevel"].offsetWidth+"-("+fncElmsMenuArray[i]["elmSubmenu"].offsetWidth+"+"+fncSubmenuPadding+"))/2+"+fncSubmenuOffset+"="+ifOffset); */
				fncElmsMenuArray[i]["elmSubmenu"].style.left = ifOffset+ "px";
			}
		}
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


/* **************
MM
*********** */
function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function P7_autoLayers() { //v1.4 by PVII
 var g,b,k,f,args=P7_autoLayers.arguments;
 a=parseInt(args[0]);
 if(isNaN(a))a=0;
 if(!document.p7setc){
 	p7c=new Array();
 	document.p7setc=true;
 	for(var u=0;u<10;u++){
 		p7c[u]=new Array();
 	}
 }
 for(k=0;k<p7c[a].length;k++){
 	if((g=MM_findObj(p7c[a][k]))!=null){
 		b=(document.layers)?g:g.style;b.visibility="hidden";
 	}
 }
 for(k=1;k<args.length;k++){
 	if((g=MM_findObj(args[k]))!=null){b=(document.layers)?g:g.style;
	 	b.visibility="visible";
	 	f=false;
	 	for(var j=0;j<p7c[a].length;j++){
	 		if(args[k]==p7c[a][j]) {f=true;}
	 	}
		if(!f){p7c[a][p7c[a].length++]=args[k];}
	}
 }
}
function P7_hideDiv(evt) { //v1.3 by PVII
 var relT,mT=false; 
 if(document.layers){
 	menudiv=evt.target;
 	if(menudiv.p7aHide){
  		TO=setTimeout('menudiv.style.visibility=\'hidden\';',750)
  	}
  	else{
  		routeEvent(evt);
  	}
 }
 else if(document.all&&!window.opera){
 	menudiv=event.srcElement;
  	while(menudiv!=null){
  		if(menudiv.tagName=="DIV" && menudiv.p7ahD){
  			mT=true;break;
  		}menudiv=menudiv.parentElement;
  	}
  	if(!menudiv.contains(event.toElement)){
  		TO=setTimeout('menudiv.style.visibility=\'hidden\';',750)
  	}
 }
 else if(document.getElementById){
 	menudiv=evt.currentTarget;
 	relT=evt.relatedTarget;
  	while(relT!=null){if(menudiv==relT){
  		mT=true;break;
  	}
  	relT=relT.parentNode;
  }if(!mT){TO=setTimeout('menudiv.style.visibility=\'hidden\';',750)}}
}
//Customized to delay before closing, also must include onmouseover="clearTimeout(TO);" in the div.
var menudiv;
var TO;

function P7_autoHide() { //v1.3 by PVII
 var i,g,args=P7_autoHide.arguments;
 for(i=0;i<args.length;i++){
 	if((g=MM_findObj(args[i]))!=null){
  		g.p7aHide=true;
  		if(document.layers){
  			g.captureEvents(Event.MOUSEOUT);
  		}
  		g.onmouseout=P7_hideDiv;g.p7ahD=true;
  	}
  }
}
