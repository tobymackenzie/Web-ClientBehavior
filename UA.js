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
__.UA = {
	_data: []
	//-@ http://menacingcloud.com/?c=highPixelDensityDisplays
	,devicePixelRatio: function(){
		if(typeof this._data.devicePixelRatio == "undefined")
			this._data.devicePixelRatio = (typeof window.devicePixelRatio == "undefined")? 1: window.devicePixelRatio;
		return this._data.devicePixelRatio;
	}
};

