if(typeof __ === 'undefined') var __ = new tmlib;

__.cfg.whatever = "whatever";

__.scrOnload = function(){
	
}

/* ********* 
©tmlib
********* */
function tmlib(){
		this.classes = {};
		this.lib = {};
		this.cfg = {};
	}
	__.lib.init = function(){
		__.addClass(document.body, "hasjavascript");
	}
	//-*depricated in favor of addListeners
	tmlib.prototype.addListener = function(argElement, argEvent, argFunction, argBubble){
		var fncBubble = (argBubble)?argBubble : false;
		if(argElement.attachEvent)
			argElement.attachEvent("on"+argEvent, argFunction);
		else
			argElement.addEventListener(argEvent, argFunction, fncBubble);
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
	tmlib.prototype.getElementsByClassName = function(args){
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
				fncReturn.push(fncElementsToSearch[i]);
		}
		
		return fncReturn;
	}
	tmlib.prototype.addClass = function(argElement, argClass){
		if(new RegExp('\\b'+argClass+'\\b').test(argElement.className))
			return 0;
		else{
			argElement.className+=argElement.className?' '+argClass:argClass;
			return 1;
		}
	}
	tmlib.prototype.removeClass = function(argElement, argClass){
		  var fncReplace = argElement.className.match(' '+argClass)?' '+argClass:argClass;
		  argElement.className=argElement.className.replace(fncReplace,'');
	}
	tmlib.prototype.hasClass = function(argElement, argClass){
		if(new RegExp('\\b'+argClass+'\\b').test(argElement.className))
			return 1;
		else
			return 0;
	}
	tmlib.prototype.getClasses = function(argElement){
		return argElement.className.split(/\s+/);
	}
	
	tmlib.prototype.isIE = function(){
		if(this.isievar)
			return this.isie;
		else{
			this.initUA();
			if(this.browser.indexOf("Internet Explorer", 0) == -1) return 0;
			else return 1;
		}
	}
	tmlib.prototype.isIE6 = function(){
		if(this.isIE){
			if(!this.ieversion) // http://www.javascriptkit.com/javatutors/navigator.shtml
				if(/MSIE (\d+\.\d+);/.test(navigator.userAgent))
					this.ieversion = new Number(RegExp.$1) // capture x.x portion and store as a number
			if(this.ieversion == 6)
				return 1;
			else return 0;
		}
		else
			return 0;
	}
	tmlib.prototype.initUA = function(){
		if(!this.browser) this.browser = navigator.appName;
		if(!this.verion) this.version = parseFloat(navigator.appVersion);
	}
	tmlib.prototype.isIphone = function(){
		var isIphone = (navigator.userAgent.toLowerCase().indexOf('iphone')!=-1);
		if (isIphone)
			return true;
		else
			return false;
	}
	tmlib.prototype.message = function(argument){
		if(window.console) 
			console.log(argument);
		else alert(argument);
	}
	__.lib.vardump = function(variable, maxDeep){
		//<-http://my.opera.com/SpShut/blog/2009/12/18/best-javascript-var-dump
		var deep = 0;
		var maxDeep = maxDeep || 0;

		function fetch(object, parent){
			var buffer = '';
			deep++;

			for (var i in object) {
			if (parent) {
				objectPath = parent + '.' + i;
			} else {
				objectPath = i;
			}

			buffer += objectPath + ' (' + typeof object[i] + ')';

			if (typeof object[i] == 'object') {
				buffer += "\n";
				if (deep < maxDeep) {
					buffer += fetch(object[i], objectPath);
				}
				} else if (typeof object[i] == 'function') {
					buffer += "\n";
				} else if (typeof object[i] == 'string') {
					buffer += ': "' + object[i] + "\"\n";
				} else {
					buffer += ': ' + object[i] + "\n";
				}
			}

			deep--;
			return buffer;
		}

		if (typeof variable == 'object') {
			return fetch(variable);
		}

		return '(' + typeof variable + '): ' + variable + "\n";
	}
	tmlib.prototype.isInteger = function(argument){
		return argument.toString().match(/^-?[0-9]+$/);
	}
	//-@based from http://andrewpeace.com/javascript-is-array.html
	__.lib.isArray = function(argObject){
		return typeof argObject == 'object' && (argObject instanceof Array);
	}

/*--dispatchEvent
fire an event on an element
--*/
	tmlib.prototype.dispatchEvent = function(argElement, argEvent){
		if(document.createEvent){
			var event = document.createEvent("MouseEvents");
			event.initEvent(argEvent, true, true);
			argElement.dispatchEvent(event);
		}else if(document.createEventObject){
			argElement.fireEvent("on"+argEvent);
		}
			
	}

/*--clearForm 
supports the add placeholder support function
--*/
	tmlib.prototype.clearForm = function(argElmForm){
		if(!argElmForm) return false;
		argElmForm.reset();
		if(!__.supportsInputPlaceholder()){
//		else{
			// inputs
			var elmsInputs = argElmForm.getElementsByTagName("input");
			var elmsInputsLength = elmsInputs.length;
			for(var i = 0; i < elmsInputsLength; ++i){
				var fncThis = elmsInputs[i];
/*
				var fncThisType = fncThis.getAttribute("type");
				if(fncThis.value != "" && fncThisType != "submit" && fncThisType != "button"){
					fncThis.value = "";
*/
					__.dispatchEvent(fncThis, "blur");
//				}
			}
			// textareas
			var elmsTextareas = argElmForm.getElementsByTagName("textarea");
			var elmsTextareasLength = elmsTextareas.length;
			for(var i = 0; i < elmsTextareasLength; ++i){
				var fncThis = elmsTextareas[i];
/*
				if(fncThis.value != ""){
					fncThis.value = "";
*/
					__.dispatchEvent(fncThis, "blur");
//				}
			}
		}
	}

/*--string functions
--*/
	tmlib.prototype.nl2br = function(argString, argIsXML){
		var fncIsXML = (typeof argIsXML !== undefined)?argIsXML:false;
		var regex = /(\r\n|[\r\n])/g;
		if(fncIsXML)
			return argString.replace(regex, "<br />")
		else
			return argString.replace(regex, "<br>")
	}
	tmlib.prototype.br2nl = function(argString){
		var regex = /(<br>|<br\s+\/>)/g;
		return argString.replace(regex, "\n");
	}
	tmlib.prototype.brRemove = function(argString){
		var regex = /(<br>|<br\s+\/>)/g;
		return argString.replace(regex, "");
	}
	//-@based from http://beardscratchers.com/journal/using-javascript-to-get-the-hostname-of-a-url
	__.lib.urlParse = function(argURL){
		var regexExternal = /^(.*):\/\/([^\/]+)(.*)/i;
		var regexEmail = /^mailto:(.*)@(.*)/i;
		var regexTel = /^(tel|fax):(.*)/i;
		
		var resultExternal = argURL.match(regexExternal);
		if(resultExternal != null)
			return {type: "external", protocol: resultExternal[1], host: resultExternal[2], file: resultExternal[3]};
		var resultEmail = argURL.match(regexEmail);
		if(resultEmail != null)
			return {type: "mailto", username: resultEmail[1], host: resultEmail[2]};
		var resultTel = argURL.match(regexTel);
		if(resultTel != null)
			return {type: resultTel[1], n: resultTel[2]};

		return {type: "internal", href: argURL};
	}

/*
timezone functions
*/
	tmlib.prototype.setTimezoneLocalCookie = function(){
		if(!this.lib.cookies.get("timezone"))
			this.lib.cookies.set({name:"timezone", value:this.dateGetLocalOffset()});
	}
	tmlib.prototype.dateGetLocalOffset = function() {
		var fncOffset = -1 * this.dateSetStdTimezoneOffset() / 60;
		if(this.dateIsDST()) fncOffset += 1;
		return fncOffset;
	}

	tmlib.prototype.dateSetStdTimezoneOffset = function() {
		var jan = new Date((new Date).getFullYear(), 0, 1);
		var jul = new Date((new Date).getFullYear(), 6, 1);
		return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	}

	tmlib.prototype.dateIsDST = function() {
		return (new Date).getTimezoneOffset() < this.dateSetStdTimezoneOffset();
	}

/* ----
init
---- */
__.addListeners(window, "load", __.lib.init, false);
__.addListeners(window, "load", __.scrOnload, false);
