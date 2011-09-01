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
	,set : function(args){
		var fncExpires = false;
		if(args.expires){
			var fncExpires = new Date();
			fncExpires.setDate(fncExpires.getDate()+args.expires);
		}
		var fncPath = "/";
		if(args.path && typeof args.path !== undefined){
			if(args.path !== false)
				fncPath = args.path;
			else
				fncPath = "";
		}
		document.cookie = args.name + "=" + escape(args.value) + ((fncExpires) ? ";expires="+fncExpires.toUTCString():"") + ((fncPath) ? ";path="+fncPath : "");
	}
}

