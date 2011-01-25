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
 		b=(document.layers)?g:g.style;b.display="none";b.visibility="hidden";
 	}
 }
 for(k=1;k<args.length;k++){
 	if((g=MM_findObj(args[k]))!=null){b=(document.layers)?g:g.style;
	 	b.display="block";
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
  		TO=setTimeout('menudiv.style.display=\'none\';menudiv.style.visibility=\'hidden\';',750)
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
  		TO=setTimeout('menudiv.style.display=\'none\';menudiv.style.visibility=\'hidden\';',750)
  	}
 }
 else if(document.getElementById){
 	menudiv=evt.currentTarget;
 	relT=evt.relatedTarget;
  	while(relT!=null){if(menudiv==relT){
  		mT=true;break;
  	}
  	relT=relT.parentNode;
  }if(!mT){TO=setTimeout('menudiv.style.display=\'none\';menudiv.style.visibility=\'hidden\';',750)}}
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