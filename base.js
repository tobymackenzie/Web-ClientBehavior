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
	__.lib.init = function(){
		__.addClass(document.body, "hasjavascript");
	}
	tmlib.prototype.addListeners = function(argElements, argEvent, argFunction, argBubble){
		var fncBubble = (argBubble)?argBubble : false;
		if(!__.lib.isArray(argElements))
			argElements = new Array(argElements);
		for(var i = 0; i < argElements.length; ++i){
			var forElement = argElements[i];
			if(forElement.attachEvent)
				forElement.attachEvent("on"+argEvent, argFunction);
			else
				forElement.addEventListener(argEvent, argFunction, fncBubble);
		}
	}
	//-@based from http://andrewpeace.com/javascript-is-array.html
	__.lib.isArray = function(argObject){
		if(
			(typeof argObject == 'object' && argObject instanceof Array) //-normal array
			|| ((typeof argObject == "function" || typeof argObject == "object") && typeof argObject.length == 'number' && typeof argObject.item == "function") //-nodelist
		){
			return true;
		}else{
			return false;
		}
	}

/*-----
init
-----*/
__.addListeners(window, "load", __.lib.init, false);
__.addListeners(window, "load", __.scrOnload, false);
