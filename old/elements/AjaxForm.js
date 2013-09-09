/*
Class: AjaxForm

Handle form submission with ajax

Dependencies:
	tmlib
	jquery
*/
/* global __, document, jQuery */
__.classes.AjaxForm = function(_args){
		if(typeof _args == 'undefined'){
			_args = {};
		}

		//--optional attributes
		this.boot = _args.boot || {};
		this.elmForm = _args.elmForm || jQuery();
		this.oninit = _args.oninit || null;
		this.onsubmitpreajax = _args.onsubmitpreajax || null;
		this.onsuccess = _args.onsuccess || null;

		//--derived attributes

		//--do something
		this.bindSubmit();

		if(this.oninit){
			this.oninit.call(this);
		}
	};
	__.classes.AjaxForm.prototype.submit = function(){
		var _this = this;
		var _values = {};
		this.elmForm.find('input, select, textarea').each(function(){
			var elmThis = jQuery(this);
			_values[elmThis.attr('name')] = elmThis.val();
		});
		if(this.onsubmitpreajax){
			this.onsubmitpreajax.call(_this, _values);
		}
		jQuery.ajax({
			data: _values
			,success: function(){
				if(_this.onsuccess){
					_this.onsuccess.apply(_this, arguments);
				}
			}
			,type: 'POST'
			,url: (this.elmForm.attr('action')) ? this.elmForm.attr('action') : document.URL
		});
	};
	__.classes.AjaxForm.prototype.bindSubmit = function(argElm){
		var _this = this;
		if(typeof argElm == 'undefined'){
			argElm = this.elmForm;
		}
		argElm.on('submit', function(argEvent){
			_this.submit.call(_this);
			if(argEvent.preventDefault){
				argEvent.preventDefault();
			}
			return false;
		});
	};
