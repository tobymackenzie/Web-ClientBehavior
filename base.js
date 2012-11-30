document.getElementsByTagName('html')[0].className += ' hasjavascript';

(function(dependencies, undefined){
	/*=====
	==dependencies
	Allow injection of dependencies so they can be theoretically modified for testing.
	Local names allow them to be minified.
	=====*/

	var window = dependencies.window || window;
	if(dependencies.head) var head = dependencies.head;
	else if(window.head) var head = window.head;
	if(dependencies.jQuery) var jQuery = dependencies.jQuery;
	else if(window.jQuery) var jQuery = window.jQuery;

	/*=====
	==tmlib
	=====*/

	if(typeof window.__ === 'undefined') var __ = window.__ = {ua: {}, cfg: {}, 'class': {}, classes: {}, core: {}, 'data': {}, lib: {}, objects: {}};

	/*===
	==lib
	===*/

	__.message = function(arg){
		if(window.console && window.console.log){
			if(window.console.log.apply){
				window.console.log.apply(window.console, arguments);
			}else{ //--ie 8+, doesn't support multi-argument console.log, so we will loop through the arguments and log each one
				window.console.log('-----message:');
				for(var key in arguments){
					window.console.log(arguments[key]);
				}
			}
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

})({'window': window});
