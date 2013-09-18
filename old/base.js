(function(__deps, undefined){
	/*=====
	==dependencies
	Allow injection of dependencies so they can be theoretically modified for testing.
	Local names allow them to be minified.
	=====*/
	var $, globals, __head, __jQuery, window;
	if(!__deps){
		__deps = {};
	}

	window = globals = __deps.globals || this;

	__head = __deps.head || window.head;
	__jQuery = $ = __deps.jQuery || window.jQuery;

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
	__.ready = function(_function){
		if(__jQuery){
			__jQuery(_function);
		}else if(__head){
			__head.ready(_function);
		}else if(__.lib.addListeners){
			__.lib.addListeners(window, 'load', _function, false);
		}else{
			_function.call(this);
		}
	};

	var clog = __.message = function(){
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

	__.ready(function(){

	});
})();
