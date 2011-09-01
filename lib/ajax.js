/*
based from http://net.tutsplus.com/articles/news/how-to-make-ajax-requests-with-raw-javascript/
@param url
@param onsuccess
@param scope
*/
	__.lib.ajaxCall = function(args){
		var fnc = {};
		fnc.ajaxObject = false;
		fnc.method = args.method || "GET";
		fnc.onsuccess = args.onsuccess || function(){};
		fnc.scope = args.scope || window;
		if(typeof args.parameters == "object"){
			var tmpParameters = new Array();
			for(var key in args.parameters){
				if(args.parameters.hasOwnProperty(key))
					tmpParameters.push(key+"="+args.parameters[key]);
			}
			fnc.parameters = tmpParameters.join("&");
		}else if(typeof args.parameters == "string")
			fnc.parameters = args.parameters;
		else
			fnc.parameters = "";
		fnc.url = args.url || false;
		
		if(typeof XMLHttpRequest !== 'undefined') fnc.ajaxObject = new XMLHttpRequest();  
		else {  
			var versions = ["MSXML2.XmlHttp.5.0",  
			"MSXML2.XmlHttp.4.0",  
			"MSXML2.XmlHttp.3.0",  
			"MSXML2.XmlHttp.2.0",  
			"Microsoft.XmlHttp"]  
			
			for(var i = 0, len = versions.length; i < len; i++) {  
				try {  
					fnc.ajaxObject = new ActiveXObject(versions[i]);  
					break;  
				}  
				catch(e){} //-eat errors in creating invalid objects
			} 
		}
		if(!fnc.ajaxObject)
			return false;
		
		fnc.ajaxObject.onreadystatechange = function(){  
			if(fnc.ajaxObject.readyState < 4) {
				return;
			}			
			if(fnc.ajaxObject.status !== 200) {  
				return;  
			}			
			if(fnc.ajaxObject.readyState === 4) {  
				fnc.onsuccess.call(fnc.scope, fnc.ajaxObject);
			}  
		}
		if(fnc.method == "GET" || fnc.method == "get"){
			if(fnc.parameters != "")
				fnc.ajaxObject.open(fnc.method, fnc.url+"?"+fnc.parameters, true);
			else
				fnc.ajaxObject.open(fnc.method, fnc.url, true);
			fnc.ajaxObject.send();  
		}else
			fnc.ajaxObject.send(fnc.parameters);  
	}

