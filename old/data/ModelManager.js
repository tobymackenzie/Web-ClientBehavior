/*
Class: ModelManager

Simple model handling that can fetch from and persist to server data mode, not much else currently, simply passed callback to get model data

Dependencies:
	tmlib: merge
	jquery
*/
/* global __, jQuery */
__.classes.ModelManager = function(_args){
		if(typeof _args == 'undefined'){
			_args = {};
		}

		//--optional attributes
		this.boot = _args.boot || {};
		this.clbFetch = _args.clbFetch || null;
		this.clbPersist = _args.clbPersist || null;
		this.fnGetRequestData = _args.fnGetRequestData || this.defaultFnGetRequestData;
		this.fnTransformDataForPersist = _args.fnTransformDataForPersist || this.defaultfnTransformDataForPersist;
		this.oninit = _args.oninit || null;
		this.optionsFetch = _args.optionsFetch || {};
		this.optionsPersist = _args.optionsPersist || {};
		this.urlFetch = _args.urlFetch || null;
		this.urlPersist = _args.urlPersist || null;

		//--direct attributes
		this.fetch = _args.fnFetch || this.defaultFnFetch;
		this.persist = _args.fnPersist || this.defaultFnFetch;

		//--derived attributes
		this.binder = jQuery({});

		if(this.oninit){
			this.oninit.call(this);
		}
	};
	__.classes.ModelManager.prototype.on = function(){
		this.binder.on.apply(this.binder, arguments);
	};
	__.classes.ModelManager.prototype.data = function(){
		this.binder.data.apply(this.binder, arguments);
	};
	__.classes.ModelManager.prototype.store = function(){
		var data = this.fnGetRequestData.apply(this, arguments);
		this.persist(data, this.urlPersist, this.clbPersist);
	};
	__.classes.ModelManager.prototype.defaultFnGetRequestData = function(_args){
		var _return = [];
		if(typeof _args != 'undefined'){
			if(__.isArray(_args)){
				_return = _args;
			}else{
				_return = [_args];
			}
		}
		return _return;
	};
	__.classes.ModelManager.prototype.defaultFnFetch = function(_data, _url, _callback){
		var _this = this;
		if(typeof _callback === 'undefined'){
			_callback = this.clbFetch;
		}
		var lclParams = {
			success: function(){
				if(_callback){
					_callback.apply(_this, arguments);
				}
			}
		};
		if(_data){
			lclParams.data = JSON.stringify(_data);
		}
		lclParams.url = _url || this.urlFetch;
		jQuery.ajax(__.lib.merge(this.optionsFetch, lclParams));
	};
	__.classes.ModelManager.prototype.defaultFnPersist = function(_data, _url, _callback){
		var _this = this;
		if(typeof _callback === 'undefined'){
			_callback = this.clbPersist;
		}
		var lclParams = {
			success: function(){
				if(_callback){
					_callback.apply(_this, arguments);
				}
			}
		};
		if(_data){
			lclParams.data = this.fnTransformDataForPersist.call(this, _data);
		}
		lclParams.url = _url || this.urlPersist;
		jQuery.ajax(__.lib.merge(this.optionsPersist, lclParams));
	};
	__.classes.modelManager.prototype.defaultfnTransformDataForPersist = function(_data){
		return JSON.stringify(_data);
	};
