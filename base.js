document.getElementsByTagName('html')[0].className += ' hasjavascript';

if(typeof __ === "undefined") var __ = {ua: {}, cfg: {}, class: {}, classes: {}, data: {}, lib: {}, objects: {}};

__.cfg.whatever = "whatever";

__.onload = function(){
	
}

/*---------- 
©lib
---------*/
__.message = function(argument){
	if(window.console) 
		console.log(argument);
//		else alert(argument);
}

/*-----
init
-----*/
//-!removeonhead-__.lib.addListeners(window, "load", __.onload, false);
head.ready(__.onload);
