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
	__.lib.isNumeric = function(argValue){
		return !isNaN(argValue - 0);
	}
	//-@based from http://phpjs.org/functions/array_search:335
	__.lib.arraySearch = function(argNeedle, argHaystack, argStrict){
		for(var key in argHaystack){
			if((!argStrict && argHaystack[key] == argNeedle) || (argStrict && argHastack[key] === argNeedle)){
				return key;
			}
		}
		return false;
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
	//-@ http://javascript.about.com/library/bldom12.htm
	__.lib.insertBefore = function(argElmInsert, argElmBefore){
		return argElmBefore.parentNode.insertBefore(argElmInsert, argElmBefore);
	}

	//-@ http://stackoverflow.com/questions/868407/hide-an-elements-next-sibling-with-javascript
	__.lib.getNextSibling = function(argElement){
		var elmReturn = argElement;
		do{
			elmReturn = elmReturn.nextSibling;
		}while(elmReturn && elmReturn.noteType != 1);

		if(elmReturn == argElement)
				elmReturn = false;
		return elmReturn;
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
	__.lib.varDump = function(variable, maxDeep){
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

/*
return instance name of object from within instance
-* only use for testing purposes
*/
	__.lib.getInstanceName = function(argObject){
/*
		this.checkMembers = function(argContainer, argObject){
			var fncReturn = "";
			if(typeof argObject != undefined){
				for(var key in argContainer){
					if(argContainer[key] === argObject)
						fncReturn = key;
					if(fncReturn == ""){
						fncReturn = this.checkMembers.call(this, argContainer[key], argObject);
						if(fncReturn != "")
							fncReturn = key+"."+fncReturn;
					}
					if(fncReturn != "")
						break;
				}
			}
			return fncReturn;
		}
		var fncReturn = "[not found]";
		if(__ === argObject)
			fncReturn = "window";
		else{
			fncReturn = this.checkMembers.call(this, __, argObject);
			if(fncReturn != "")
				fncReturn = "__."+fncReturn;
		}
		
		return fncReturn;
*/
			
	
	
		for(var key in window){
			if(window[key] === argObject)
				return key;
		}
		for(var key in __){
			if(__[key] === argObject)
				return "__."+key;
			for(var subkey in __[key]){
				if(__[key][subkey] === argObject)
					return "__."+key+"."+subkey;
				for(var subsubkey in __[key][subkey]){
					if(__[key][subkey][subsubkey] === argObject)
						return "__."+key+"."+subkey+"."+subsubkey;
				}
			}
		}
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
	//-@ based from http://snippets.dzone.com/posts/show/5629
	__.lib.urlFriendlify = function(argString, argType){
		//var regexURLCharactersValidAll = /[^a-z0-9\-\._~:\/\?#\[\]@!\$&'\(\)\*\+,;=]+/g;
		return argString.replace(/^\s+|\s+$/g, "") //--trim spaces
			.replace(/[\s]+/g, "-") //--replace spaces with -
			.replace(/[-]+/g, "-") //--combine consecutive hyphens
			.toLowerCase() //--lowercase
			.replace(/[^a-z0-9\-\._~:\[\]@!\$'\(\)\_\*]+/g, "") //--remove all but these characters


		;
	}
	__.lib.escapeHash = function(hash){
		return hash.replace(/\//g, "\\/");
	}
	__.lib.unescapeHash = function(hash){
		return hash.replace(/\\\//g, "\/");
	}

/*--timezone functions
--*/
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


