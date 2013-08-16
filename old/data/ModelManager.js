/*
simple model handling that can fetch from and persist to server data mode, not much else currently, simply passed callback to get model data

-----dependencies
tmlib: merge
jquery

-----parameters
-----instantiation
-----html
-----css
*/

/*-------
©ModelManager
-------- */
__.classes.ModelManager = function(args){
		if(typeof args == 'undefined') args = {};
		//--optional attributes
		this.boot = args.boot || {};
		this.clbFetch = args.clbFetch || null;
		this.clbPersist = args.clbPersist || null;
		this.fnGetRequestData = args.fnGetRequestData || this.defaultFnGetRequestData;
		this.fnTransformDataForPersist = args.fnTransformDataForPersist || this.defaultfnTransformDataForPersist;
		this.oninit = args.oninit || null;
		this.optionsFetch = args.optionsFetch || {};
		this.optionsPersist = args.optionsPersist || {};
		this.urlFetch = args.urlFetch || null;
		this.urlPersist = args.urlPersist || null;

		//--direct attributes
		this.fetch = args.fnFetch || this.defaultFnFetch;
		this.persist = args.fnPersist || this.defaultFnFetch;

		//--derived attributes
		this.binder = $({});

		if(this.oninit) this.oninit.call(this);
	}
	__.classes.ModelManager.prototype.on = function(){
		this.binder.on.apply(this.binder, arguments);
	}
	__.classes.ModelManager.prototype.data = function(){
		this.binder.data.apply(this.binder, arguments);
	}
	__.classes.ModelManager.prototype.store = function(){
		var data = this.fnGetRequestData.apply(this, arguments);
		this.persist(data, this.urlPersist, this.clbPersist);
	}
	__.classes.ModelManager.prototype.defaultFnGetRequestData = function(args){
		var fncReturn = [];
		if(typeof args != 'undefined'){
			if(__.isArray(args))
				fncReturn = args;
			else
				fncReturn = [args];
		}
		return fncReturn;
	}
	__.classes.ModelManager.prototype.defaultFnFetch = function(argData, argURL, argCallback){
		var lclThis = this;
		var lclCallback = (typeof argCallback != 'undefined')? argCallback: this.clbFetch;
		var lclParams = {
			success: function(){
				if(lclCallback)
					lclCallback.apply(lclThis, arguments);
			}
		};
		if(argData)
			lclParams.data = JSON.stringify(argData);
		lclParams.url = argURL || this.urlFetch;
		jQuery.ajax(__.lib.merge(this.optionsFetch, lclParams));
	}
	__.classes.ModelManager.prototype.defaultFnPersist = function(argData, argURL, argCallback){
		var lclThis = this;
		var lclCallback = (typeof argCallback != 'undefined')? argCallback: this.clbPersist;
		var lclParams = {
			success: function(){
				if(lclCallback)
					lclCallback.apply(lclThis, arguments);
			}
		};
		if(argData)
			lclParams.data = this.fnTransformDataForPersist.call(this, argData);
		lclParams.url = argURL || this.urlPersist;
		jQuery.ajax(__.lib.merge(this.optionsPersist, lclParams));
	}
	__.classes.modelManager.prototype.defaultfnTransformDataForPersist = function(argData){
		return JSON.stringify(argData);
	}

