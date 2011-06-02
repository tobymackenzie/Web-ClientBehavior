document.getElementsByTagName('html')[0].className += ' hasjavascript';

if(typeof __ === 'undefined') var __ = new tmlib;

__.cfg.whatever = "whatever";

__.scrOnload = function(){
	
}

/*---------- 
©tmlib
---------*/
function tmlib(){
		this.classes = {};
		this.lib = {};
		this.cfg = {};
	}
	tmlib.prototype.message = function(argument){
		if(window.console) 
			console.log(argument);
//		else alert(argument);
	}

/*-----
init
-----*/
//-!removeonhead-__.addListeners(window, "load", __.scrOnload, false);
head.ready(__.scrOnload);
