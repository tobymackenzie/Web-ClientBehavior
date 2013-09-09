/*
Library: Cookies

-@based on functions from http://www.w3schools.com/JS/js_cookies.asp
*/
/* global __, document, escape, unescape */
__.lib.cookies = {
	get : function(argName){
		if (document.cookie.length>0){
			var _start = document.cookie.indexOf(argName + '=');
			if (_start !== -1){
				_start = _start + argName.length+1;
				var _end=document.cookie.indexOf(';',_start);
				if(_end === -1){
					_end = document.cookie.length;
				}
				return unescape(document.cookie.substring(_start,_end));
			}
		}
		return '';
	}
	/*
	Method: set
	Parameters:
		name: string, required, name of cookie
		value: string, required, value of cookie
		expires: int, in days, defaults to none (session duration)
		path: string, path of cookie, false means path of current page, defaults to '/'
	*/
	,set : function(_args){
		var _expires = false;
		if(_args.expires){
			_expires = new Date();
			_expires.setDate(_expires.getDate() + _args.expires);
		}
		var _path = '/';
		if(_args.path && typeof _args.path !== undefined){
			if(_args.path !== false){
				_path = _args.path;
			}else{
				_path = '';
			}
		}
		document.cookie = _args.name + '=' + escape(_args.value) + ((_expires) ? ';expires=' + _expires.toUTCString():'') + ((_path) ? ';path=' + _path : '');
	}
};
