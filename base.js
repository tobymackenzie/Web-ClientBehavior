document.getElementsByTagName('html')[0].className += ' hasjavascript';

(function(window, undefined){

	/*=====
	==tmlib
	=====*/

	if(typeof window.__ === "undefined") var __ = window.__ = {ua: {}, cfg: {}, "class": {}, classes: {}, "data": {}, lib: {}, objects: {}};

	/*===
	==lib
	===*/

	__.message = function(argument){
		if(window.console)
			window.console.log.apply(window.console, arguments);
	//		else alert(argument);
	}

	/*===
	==classes
	===*/


	/*=====
	==config
	=====*/
	__.cfg.whatever = "whatever";


	/*=====
	==main
	=====*/

	__.onload = function(){

	}

	/*===
	==init
	===*/

	//-!barejs-__.lib.addListeners(window, "load", __.onload, false);
	//-!havehead-head.ready(__.onload);
	//-!havejquery-jQuery(__.onload);

})(window);

