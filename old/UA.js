/*
get various characteristics of the user agent
-----dependencies
-----parameters
-----instantiation
-----html
-----css
*/

/*-------
©UA
-------- */
__.ua = {
	init: function(){
		if(!this._data.browser) this._data.browser = navigator.appName;
		if(!this._data.version){
			if(this.isIE()){
				//-@ http://obvcode.blogspot.com/2007/11/easiest-way-to-check-ie-version-with.html
				this._data.version = parseFloat(navigator.appVersion.split("MSIE")[1]);
			}else{
				this._data.version = parseFloat(navigator.appVersion);
			}
		}
	}
	,_data: {}
	,browser: function(){
		if(typeof this._data.browser == 'undefined')
			this.init();
		return this._data.browser;
	}
	//-@ http://menacingcloud.com/?c=highPixelDensityDisplays
	,devicePixelRatio: function(){
		if(typeof this._data.devicePixelRatio == 'undefined')
			this._data.devicePixelRatio = (typeof window.devicePixelRatio == 'undefined')? 1: window.devicePixelRatio;
		return this._data.devicePixelRatio;
	}
	,isIE: function(){
		if(typeof this._data.isie == 'undefined'){
			//-# since this calls init, we must make sure we don't create an infinite loop
			if(typeof this._data.browser == 'undefined') this.init(true);
			if(this._data.browser.indexOf('Internet Explorer', 0) == -1) this._data.isie = false;
			else this._data.isie = true;
		}
		return this._data.isie;
	}
	,isIE6: function(){
		if(this.isIE()){
			if(this.version() == 6)
				return true;
			else return false;
		}else
			return false;
	}
	,isIphone: function(){
		if(typeof this._data.isiphone == 'undefined')
			this._data.isiphone = (navigator.userAgent.toLowerCase().indexOf('iphone')!=-1);
		return this._data.isiphone;
	}
	,version: function(){
		if(typeof this._data.version == 'undefined')
			this.init();
		return this._data.version;
	}
};

