/* global __, document, HTMLElement, Object, window */
/*----------
data types
----------*/
//-@ http://www.shamasis.net/2011/08/infinite-ways-to-detect-array-in-javascript/
__.lib.isArray = (function(){
	//-- use native isArray() if available
	if (Array.isArray) {
		return Array.isArray;
	}

	//-- Retain references to variables for performance
	var toStringFn = Object.prototype.toString;
	var _arrayToString = toStringFn.call([]);

	return function(_var){
		return toStringFn.call(_var) === _arrayToString;
	};
})();

//-@based from http://andrewpeace.com/javascript-is-array.html
__.lib.isArrayLike = function(_var){
	return (
		__.lib.isArray(_var) //-- regular array
		|| ((typeof _var == 'function' || typeof _var == 'object') && typeof _var.length == 'number' && typeof _var.item == 'function') //-- nodeList or other
	);
};


//-@ http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
__.lib.isElement = function(arg){
	return(
		(typeof HTMLElement === 'object')
		? arg instanceof HTMLElement
		: typeof arg === 'object' && arg.nodeType === 1 && typeof arg.nodeName === 'string'
	);
};
//-@ alternative C from http://jsperf.com/alternative-isfunction-implementations
__.lib.isFunction = function(arg){
	return !!(arg && arg.constructor && arg.call && arg.apply);
};
__.lib.isInteger = function(argument){
	return argument.toString().match(/^-?[0-9]+$/);
};
__.lib.isNumeric = function(argValue){
	return !isNaN(argValue - 0);
};
//-@ http://phpjs.org/functions/is_object:450
__.lib.isObject = function(argValue){
	if(Object.prototype.toString.call(argValue) == '[object Array]'){
		return false;
	}
	return argValue !== null && typeof argValue == 'object';
};

/*-----
array/object
-----*/
//-@based from http://phpjs.org/functions/array_search:335
__.lib.arraySearch = function(argNeedle, argHaystack, argStrict){
	for(var key in argHaystack){
		if((!argStrict && argHaystack[key] == argNeedle) || (argStrict && argHaystack[key] === argNeedle)){
			return key;
		}
	}
	return false;
};
__.lib.each = function(argCollection, argCallback, argContext, argData){
	for(var key in argCollection){
		if(argCollection.hasOwnProperty(key)){
			var lopItem = argCollection[key];
			var lopReturn = argCallback.call((argContext || lopItem), lopItem, key, argCollection, argData);
			//- discontinue loop and return returned value if callback has return value
			if(typeof lopReturn !== 'undefined'){
				return lopReturn;
			}
		}
	}
};

/*-----
strings
-----*/
__.lib.nl2br = function(argString, argIsXML){
	var fncIsXML = (typeof argIsXML !== undefined)?argIsXML:false;
	var regex = /(\r\n|[\r\n])/g;
	if(fncIsXML){
		return argString.replace(regex, '<br />');
	}else{
		return argString.replace(regex, '<br>');
	}
};
__.lib.br2nl = function(argString){
	var regex = /(<br>|<br\s+\/>)/g;
	return argString.replace(regex, '\n');
};
__.lib.brRemove = function(argString){
	var regex = /(<br>|<br\s+\/>)/g;
	return argString.replace(regex, '');
};
//-@ http://stackoverflow.com/questions/6007821/how-do-i-distinguish-jquery-selector-strings-from-other-strings
__.lib.isHTML = function(_string){
	if(typeof _string === 'string'){
		//--first do quick non regex check
		switch(_string.charAt(0)){
			//--json
			case '{':
			case '"':
				return false;
			//-break;
			//--html with no extra characters inserted
			case '<':
				if(_string.charAt(_string.length - 1) === '>' && _string.length >= 3){
					return true;
				}
			//-break;
		}

		//--next do longer regex check
		var htmlPattern = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/;
		return htmlPattern.test(_string);
	}else{
		return false;
	}
};
//-@ http://stackoverflow.com/questions/8188645/javascript-regex-to-match-a-url-in-a-field-of-text
//-! does not succeed with all tests
__.lib.isURL = function(string){
	var absolutePattern = /^([\w]+:)?\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
	var hostlessPattern = /^\/([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
	return absolutePattern.test(string) || hostlessPattern.test(string);
};
//-@ from http://phpjs.org/functions/urlencode/
__.lib.urlEncode = function(argString){
	//--ensure string is string
	argString = (argString + '').toString();

	//--do replacements
	argString = encodeURIComponent(argString)
		.replace(/!/g, '%21')
		.replace(/'/g, '%27')
		.replace(/\(/g, '%28')
		.replace(/\)/, '%29')
		.replace(/\*/g, '%2A')
		.replace(/%20/g, '+') //--restore plusses
	;

	return argString;
};
//-@based from http://beardscratchers.com/journal/using-javascript-to-get-the-hostname-of-a-url
__.lib.urlParse = function(argURL){
	var regexExternal = /^(.*):\/\/([^\/]+)(.*)/i;
	var regexEmail = /^mailto:(.*)@(.*)/i;
	var regexTel = /^(tel|fax):(.*)/i;

	var resultExternal = argURL.match(regexExternal);
	if(resultExternal !== null){
		return {type: 'external', protocol: resultExternal[1], host: resultExternal[2], file: resultExternal[3]};
	}
	var resultEmail = argURL.match(regexEmail);
	if(resultEmail !== null){
		return {type: 'mailto', username: resultEmail[1], host: resultEmail[2]};
	}
	var resultTel = argURL.match(regexTel);
	if(resultTel !== null){
		return {type: resultTel[1], n: resultTel[2]};
	}

	return {type: 'internal', href: argURL};
};
//-@ based from http://snippets.dzone.com/posts/show/5629
__.lib.urlFriendlify = function(argString){
	//var regexURLCharactersValidAll = /[^a-z0-9\-\._~:\/\?#\[\]@!\$&'\(\)\*\+,;=]+/g;
	return argString.replace(/^\s+|\s+$/g, '') //--trim spaces
		.replace(/[\s]+/g, '-') //--replace spaces with -
		.replace(/[-]+/g, '-') //--combine consecutive hyphens
		.toLowerCase() //--lowercase
		.replace(/[^a-z0-9\-\._~:\[\]@!\$'\(\)\_\*]+/g, '') //--remove all but these characters


	;
};
__.lib.escapeHash = function(hash){
	return hash.replace(/\//g, '\\/');
};
__.lib.unescapeHash = function(hash){
	return hash.replace(/\\\//g, '\/');
};

/*-----
timezone
-----*/
__.lib.setTimezoneLocalCookie = function(){
	if(!this.cookies.get('timezone')){
		this.cookies.set({name:'timezone', value: this.dateGetLocalOffset()});
	}
};
__.lib.dateGetLocalOffset = function() {
	var fncOffset = -1 * this.dateSetStdTimezoneOffset() / 60;
	if(this.dateIsDST()){
		fncOffset += 1;
	}
	return fncOffset;
};
__.lib.dateSetStdTimezoneOffset = function() {
	var jan = new Date((new Date()).getFullYear(), 0, 1);
	var jul = new Date((new Date()).getFullYear(), 6, 1);
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};
__.lib.dateIsDST = function() {
	return (new Date()).getTimezoneOffset() < this.dateSetStdTimezoneOffset();
};


/*----------
debug
----------*/
/*
return instance name of object from within instance
-* only use for testing purposes
*/
__.lib.getInstanceName = function(argObject){
	var key;
/*
	this.checkMembers = function(argContainer, argObject){
		var fncReturn = '';
		if(typeof argObject != undefined){
			for(var key in argContainer){
				if(argContainer[key] === argObject)
					fncReturn = key;
				if(fncReturn == ''){
					fncReturn = this.checkMembers.call(this, argContainer[key], argObject);
					if(fncReturn != '')
						fncReturn = key+'.'+fncReturn;
				}
				if(fncReturn != '')
					break;
			}
		}
		return fncReturn;
	}
	var fncReturn = '[not found]';
	if(__ === argObject)
		fncReturn = 'window';
	else{
		fncReturn = this.checkMembers.call(this, __, argObject);
		if(fncReturn != '')
			fncReturn = '__.'+fncReturn;
	}

	return fncReturn;
*/



	for(key in window){
		if(window[key] === argObject){
			return key;
		}
	}
	for(key in __){
		if(__[key] === argObject){
			return '__.'+key;
		}
		for(var subkey in __[key]){
			if(__[key][subkey] === argObject){
				return '__.'+key+'.'+subkey;
			}
			for(var subsubkey in __[key][subkey]){
				if(__[key][subkey][subsubkey] === argObject){
					return '__.'+key+'.'+subkey+'.'+subsubkey;
				}
			}
		}
	}
};
__.lib.varDump = function(variable, maxDeep){
	//<-http://my.opera.com/SpShut/blog/2009/12/18/best-javascript-var-dump
	var deep = 0;
	if(typeof maxDeep === 'undefined'){
		maxDeep = 0;
	}

	function fetch(object, parent){
		var objectPath;

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
			buffer += '\n';
			if (deep < maxDeep) {
				buffer += fetch(object[i], objectPath);
			}
			} else if (typeof object[i] == 'function') {
				buffer += '\n';
			} else if (typeof object[i] == 'string') {
				buffer += ': "' + object[i] + '"\n';
			} else {
				buffer += ': ' + object[i] + '\n';
			}
		}

		deep--;
		return buffer;
	}

	if (typeof variable == 'object') {
		return fetch(variable);
	}

	return '(' + typeof variable + '): ' + variable + '\n';
};


/*----------
elements
----------*/
/*-----
class
-----*/
__.lib.addClass = function(argElement, argClass){
	if(new RegExp('\\b'+argClass+'\\b').test(argElement.className)){
		return 0;
	}else{
		argElement.className+=argElement.className?' '+argClass:argClass;
		return 1;
	}
};
__.lib.removeClass = function(argElement, argClass){
	var fncReplace = argElement.className.match(' '+argClass)?' '+argClass:argClass;
	argElement.className=argElement.className.replace(fncReplace,'');
};
__.lib.getClasses = function(argElement){
	return argElement.className.split(/\s+/);
};
__.lib.hasClass = function(argElement, argClass){
	if(new RegExp('\\b'+argClass+'\\b').test(argElement.className)){
		return 1;
	}else{
		return 0;
	}
};

/*-----
dom manipulation
-----*/
//-@ http://javascript.about.com/library/bldom12.htm
__.lib.insertBefore = function(argElmInsert, argElmBefore){
	return argElmBefore.parentNode.insertBefore(argElmInsert, argElmBefore);
};

/*-----
dom traversal
-----*/
__.lib.getElementsByClassName = function(args){
	var fncClassName = (args.className)?args.className:null;
	if(!fncClassName){
		return;
	}
	var fncElement = (args.element)?args.element:document;
	var fncTagName = (args.tagName)?args.tagName:null;

	var fncReturn = [], fncElementsToSearch = [];
	var fncRegex = new RegExp('\\b'+fncClassName+'\\b');

	if(fncTagName){
		fncElementsToSearch = fncElement.getElementsByTagName(fncTagName);
	}else if(fncElement.all){
		fncElementsToSearch = fncElement.all;
	}else{
		fncElementsToSearch = fncElement.getElementsByTagName('*');
	}

	for(var i=0; i < fncElementsToSearch.length; ++i){
		if(fncRegex.test(fncElementsToSearch[i].className)){
			fncReturn.push(fncElementsToSearch[i]);
		}
	}

	return fncReturn;
};
//-@ http://stackoverflow.com/questions/868407/hide-an-elements-next-sibling-with-javascript
__.lib.getNextSibling = function(argElement){
	var elmReturn = argElement;
	do{
		elmReturn = elmReturn.nextSibling;
	}while(elmReturn && elmReturn.noteType != 1);

	if(elmReturn == argElement){
		elmReturn = false;
	}

	return elmReturn;
};

/*-----
event
-----*/
//-*depricated in favor of addListeners
__.lib.addListener = function(argElement, argEvent, argFunction, argBubble){
	var fncBubble = (argBubble)?argBubble : false;
	if(argElement.attachEvent){
		argElement.attachEvent('on'+argEvent, argFunction);
	}else{
		argElement.addEventListener(argEvent, argFunction, fncBubble);
	}
};
__.lib.addListeners = function(argElements, argEvent, argFunction, argBubble){
	var fncBubble = (argBubble)?argBubble : false;
	if(!__.lib.isArrayLike(argElements)){
		argElements = new Array(argElements);
	}
	for(var i = 0; i < argElements.length; ++i){
		var forElement = argElements[i];
		if(forElement.attachEvent){
			forElement.attachEvent('on'+argEvent, argFunction);
		}else{
			forElement.addEventListener(argEvent, argFunction, fncBubble);
		}
	}
};
/*--dispatchEvent
fire an event on an element
--*/
__.lib.dispatchEvent = function(argElement, argEvent){
	if(document.createEvent){
		var event = document.createEvent('MouseEvents');
		event.initEvent(argEvent, true, true);
		argElement.dispatchEvent(event);
	}else if(document.createEventObject){
		argElement.fireEvent('on'+argEvent);
	}

};


/*----------
html
----------*/
/*--clearForm
supports the add placeholder support function
--*/
__.lib.clearForm = function(argElmForm){
	var fncThis;
	var i;
	if(!argElmForm){
		return false;
	}
	argElmForm.reset();
	if(!__.ua.supportsInputPlaceholder()){
//		else{
		// inputs
		var elmsInputs = argElmForm.getElementsByTagName('input');
		var elmsInputsLength = elmsInputs.length;
		for(i = 0; i < elmsInputsLength; ++i){
			fncThis = elmsInputs[i];
/*
			var fncThisType = fncThis.getAttribute('type');
			if(fncThis.value != '' && fncThisType != 'submit' && fncThisType != 'button'){
				fncThis.value = '';
*/
				__.lib.dispatchEvent(fncThis, 'blur');
//				}
		}
		// textareas
		var elmsTextareas = argElmForm.getElementsByTagName('textarea');
		var elmsTextareasLength = elmsTextareas.length;
		for(i = 0; i < elmsTextareasLength; ++i){
			fncThis = elmsTextareas[i];
/*
			if(fncThis.value != ''){
				fncThis.value = '';
*/
				__.lib.dispatchEvent(fncThis, 'blur');
//				}
		}
	}
};

