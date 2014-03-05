/*
Library: ua
Check basic details about the user agent
*/
/* global define, window */
define([], function(){
	var __this = {
		init: function(){
			if(!this.__data.browser){
				this.__data.browser = window.navigator.appName;
			}
			if(!this.__data.version){
				if(this.isIE()){
					//-@ http://obvcode.blogspot.com/2007/11/easiest-way-to-check-ie-version-with.html
					this.__data.version = parseFloat(window.navigator.appVersion.split('MSIE')[1]);
				}else{
					this.__data.version = parseFloat(window.navigator.appVersion);
				}
			}
		}
		,__data: {}
		,getBrowser: function(){
			if(typeof this.__data.browser === 'undefined'){
				this.init();
			}
			return this.__data.browser;
		}
		//-@ http://menacingcloud.com/?c=highPixelDensityDisplays
		,getDevicePixelRatio: function(){
			if(typeof this.__data.devicePixelRatio === 'undefined'){
				this.__data.devicePixelRatio =
					(typeof window.devicePixelRatio === 'undefined')
					? 1
					: window.devicePixelRatio
				;
			}
			return this.__data.devicePixelRatio;
		}
		,getVersion: function(){
			if(typeof this.__data.version === 'undefined'){
				this.init();
			}
			return this.__data.version;
		}
		,isIE: function(){
			if(typeof this.__data.isie === 'undefined'){
				//-# since this calls init, we must make sure we don't create an infinite loop
				if(typeof this.__data.browser === 'undefined'){
					this.init(true);
				}
				if(this.__data.browser.indexOf('Internet Explorer', 0) == -1){ this.__data.isie = false;
				}else{
					this.__data.isie = true;
				}
			}
			return this.__data.isie;
		}
		,isIE6: function(){
			if(this.isIE()){
				return (this.getVersion() == 6);
			}else{
				return false;
			}
		}
		,isIOS: function(){
			if(typeof this.__data.isIOS === 'undefined'){
				this.__data.isIOS = (window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) ? true : false;
			}
			return this.__data.isIOS;
		}
		,isIPhone: function(){
			if(typeof this.__data.isIPhone === 'undefined'){
				this.__data.isIPhone = (window.navigator.userAgent.toLowerCase().indexOf('iphone')!=-1);
			}
			return this.__data.isIPhone;
		}
	};
	return __this;
});
