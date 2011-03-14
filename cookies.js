/* -----
©cookies
----- */
//-@based on functions from http://www.w3schools.com/JS/js_cookies.asp
__.lib.cookies = {
	get : function(argName){
		if (document.cookie.length>0){
			var fncStart = document.cookie.indexOf(argName + "=");
			if (fncStart!=-1){
				fncStart = fncStart + argName.length+1;
				var fncEnd=document.cookie.indexOf(";",fncStart);
				if(fncEnd==-1) fncEnd=document.cookie.length;
				return unescape(document.cookie.substring(fncStart,fncEnd));
			}
		}
		return "";
	}
	/*
	arguments:
		name: string, required, name of cookie
		value: string, required, value of cookie
		expires: int, in days, defaults to none (session duration)
		path: string, path of cookie, false means path of current page, defaults to "/"
	*/
	,set : function(arguments){
		var fncExpires = false;
		if(arguments.expires){
			var fncExpires = new Date();
			fncExpires.setDate(fncExpires.getDate()+arguments.expires);
		}
		var fncPath = "/";
		if(arguments.path && typeof arguments.path !== undefined){
			if(arguments.path !== false)
				fncPath = arguments.path;
			else
				fncPath = "";
		}
		document.cookie = arguments.name + "=" + escape(arguments.value) + ((fncExpires) ? ";expires="+fncExpires.toUTCString():"") + ((fncPath) ? ";path="+fncPath : "");
	}
}

