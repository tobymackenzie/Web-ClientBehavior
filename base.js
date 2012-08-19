document.getElementsByTagName('html')[0].className += ' hasjavascript';

(function(window, undefined){

	/*=====
	==tmlib
	=====*/

	if(typeof window.__ === 'undefined') var __ = window.__ = {ua: {}, cfg: {}, 'class': {}, classes: {}, 'data': {}, lib: {}, objects: {}};

	/*===
	==lib
	===*/

	__.message = function(arg){
		if(window.console && window.console.log){
			if(window.console.log.apply)
				window.console.log.apply(window.console, arguments);
			else
				window.console.log(arg); //-# for ie8
		}//else alert(arg); //-# for ielte7, other old browsers
	}

	/*===
	==classes
	===*/


	/*=====
	==config
	=====*/
	__.cfg.whatever = 'whatever';


	/*=====
	==main
	=====*/

	__.onload = function(){

	}

	/*===
	==init
	===*/

	//-!barejs-__.lib.addListeners(window, 'load', __.onload, false);
	//-!havehead-head.ready(__.onload);
	//-!havejquery-jQuery(__.onload);

})(window);

