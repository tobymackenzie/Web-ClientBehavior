/* *********
config
******** */
var cfgNavigationID = "top_navigation";
var cfgNavigationToplevelItemsClass = "toplevel";
var cfgSubmenuClass = "submenu";
var cfgSubmenuPadding = 20;

/* ***** 
global variables
******* */
var elmBody, elmMenu, elmsTopLevelMenuTDs, elmsTopLevelMenuItems, elmsMenuAssociations, elmsToplevelAndSubmenu;


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
	elmsTopLevelMenuTDs = elmMenu.getElementsByTagName("td");
	elmsTopLevelMenuItems = tmlibGetElementsByClassName({"className": cfgNavigationToplevelItemsClass, "element": elmMenu});
	elmsToplevelAndSubmenu = tmlibGetToplevelAndSubmenuItems({"wrapperElements": elmsTopLevelMenuTDs, "toplevelClass": cfgNavigationToplevelItemsClass, "submenuClass": cfgSubmenuClass});

	// MM suckerfish menu
/* 	tmlibAddListener(elmBody, "mouseup", function(){P7_autoLayers(0);}); */
	P7_autoHide('submenu_news', 'submenu_about_us', 'submenu_worship', 'submenu_activities', 'submenu_education', 'submenu_resources', 'submenu_contact', 'submenu_home');
	tmlibMenuDropdownInit(elmsToplevelAndSubmenu);

	// menu sizing
	scrMenuSizing({"elmMenu":elmMenu, "elmsToplevel":elmsTopLevelMenuTDs, "submenuClass": cfgSubmenuClass, "submenuPadding": cfgSubmenuPadding});
}

/* *********
MM suckerfish init
*********** */
// get all toplevel and submenu items in associatiative array, only useful for MM type code
function tmlibGetToplevelAndSubmenuItems(args){
	var fncElmsWrapper = (args.wrapperElements)? args.wrapperElements : null;
	var fncToplevelClass = (args.toplevelClass)? args.toplevelClass : "toplevel";
	var fncSubmenuClass = (args.submenuClass)? args.submenuClass : "submenu";

	var fncArray = new Array();
	
	if(!fncElmsWrapper) return false;
	
	for(var i=0; i < fncElmsWrapper.length; ++i){
		forElmToplevel = tmlibGetElementsByClassName({"className": fncToplevelClass, "element": fncElmsWrapper[i]});
		forElmToplevel = forElmToplevel[0];
		forElmSubmenu = tmlibGetElementsByClassName({"className": fncSubmenuClass, "element": fncElmsWrapper[i]});
		forElmSubmenu = forElmSubmenu[0];
		fncArray.push(new Array(forElmToplevel, forElmSubmenu));
	}
	return fncArray;
}
function tmlibMenuDropdownInit(argElmsToplevelAndSubmenu){
	for(i=0;i < argElmsToplevelAndSubmenu.length; ++i){
		if(argElmsToplevelAndSubmenu[i][1]){
			var forMenu = argElmsToplevelAndSubmenu[i][1];
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
			tmlibAddListener(argElmsToplevelAndSubmenu[i][0], "mouseover", callback, false);
			tmlibAddListener(argElmsToplevelAndSubmenu[i][0], "click", callback, false);
			tmlibAddListener(argElmsToplevelAndSubmenu[i][0], "touchstart", callback, false);
			tmlibAddListener(argElmsToplevelAndSubmenu[i][1], "mouseover", function(){clearTimeout(TO);}, false);
		}
		// empty menu items
		else{
			tmlibAddListener(argElmsToplevelAndSubmenu[i][0], "mouseover", function(){P7_autoLayers(0);}, false);
			tmlibAddListener(argElmsToplevelAndSubmenu[i][0], "click", function(){P7_autoLayers(0);}, false);
			tmlibAddListener(argElmsToplevelAndSubmenu[i][0], "touchstart", function(){P7_autoLayers(0);}, false);
		}
	}
}

/* ***** 
menu sizing
****** */

function scrMenuSizing(args){
	var fncElmMenu = (args.elmMenu)? args.elmMenu : document.getElementById("topnavigation");
	var fncElmsToplevel = (args.elmsToplevel)? args.elmsToplevel : tmlibGetElementsByClassName({"className": "toplevel", "element": fncElmMenu});
	var fncSubmenuClass = (args.submenuClass)? args.submenuClass : "submenu";
	var fncSubmenuPadding = (args.submenuPadding)? args.submenuPadding : 0;
	
	for(var i=0; i < fncElmsToplevel.length; ++i){
		forElmSubmenu = tmlibGetElementsByClassName({"className": fncSubmenuClass, "element": fncElmsToplevel[i]});
		forElmSubmenu = forElmSubmenu[0];
		if(forElmSubmenu){
			forElmSubmenuUL = forElmSubmenu.getElementsByTagName("ul");
			forElmSubmenuUL = forElmSubmenuUL[0];
			forSubmenuWidth = forElmSubmenuUL.offsetWidth;
			if(forElmSubmenu.offsetWidth < fncElmsToplevel[i].offsetWidth){
				forElmSubmenuUL.style.width = (fncElmsToplevel[i].offsetWidth - fncSubmenuPadding) + "px";
			} else{
				forElmSubmenu.style.width = (fncElmsToplevel[i].offsetWidth - fncSubmenuPadding) + "px";
				forElmSubmenuUL.style.width = forSubmenuWidth + "px";
			}
			if(forElmSubmenuUL.offsetWidth > fncElmsToplevel[i].offsetWidth){
				ifOffset = (fncElmsToplevel[i].offsetWidth - (forElmSubmenuUL.offsetWidth + fncSubmenuPadding)) / 2;
				forElmSubmenuUL.style.left = ifOffset+ "px";
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

function MM_validateForm() { //v4.0
  var i,p,q,nm,test,num,min,max,errors='',args=MM_validateForm.arguments;
  for (i=0; i<(args.length-2); i+=3) { test=args[i+2]; val=MM_findObj(args[i]);
    if (val) { nm=val.name; if ((val=val.value)!="") {
      if (test.indexOf('isEmail')!=-1) { p=val.indexOf('@');
        if (p<1 || p==(val.length-1)) errors+='- '+nm+' must contain an e-mail address.\n';
      } else if (test!='R') { num = parseFloat(val);
        if (isNaN(val)) errors+='- '+nm+' must contain a number.\n';
        if (test.indexOf('inRange') != -1) { p=test.indexOf(':');
          min=test.substring(8,p); max=test.substring(p+1);
          if (num<min || max<num) errors+='- '+nm+' must contain a number between '+min+' and '+max+'.\n';
    } } } else if (test.charAt(0) == 'R') errors += '- '+nm+' is required.\n'; }
  } if (errors) alert('The following error(s) occurred:\n'+errors);
  document.MM_returnValue = (errors == '');
}
