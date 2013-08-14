(function(_deps, undefined){
	/*=====
	==dependencies
	Allow injection of dependencies so they can be theoretically modified for testing.
	Local names allow them to be minified.
	=====*/
	var $, globals, head, jQuery, window;
	if(!_deps){
		_deps = {};
	}

	window = globals = _deps.globals || this;

	head = _deps.head || window.head;
	jQuery = $ = _deps.jQuery || window.jQuery;

	/*=====
	==tmlib
	=====*/

	var __;
	if(typeof window.__ === 'undefined'){
		window.__ = {ua: {}, cfg: {}, 'class': {}, classes: {}, core: {}, 'data': {}, lib: {}, objects: {}};
	}
	__ = window.__;

	/*===
	==lib
	===*/

	var clog = __.message = function(arg){
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
	};

	/*===
	==classes
	===*/


	/*=====
	==config
	=====*/


	/*=====
	==main onload
	=====*/

	var __main = function(){

	};

	/*===
	==init
	===*/
	if(typeof jQuery != 'undefined'){
		jQuery(__main);
	}else if(typeof head != 'undefined'){
		head.ready(__main);
	}else if(typeof __.lib.addListeners != 'undefined'){
		__.lib.addListeners(window, 'load', __main, false);
	}
})();
