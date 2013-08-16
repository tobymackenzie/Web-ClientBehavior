/*
handle form submission with ajax

-----dependencies
tmlib
jquery

-----parameters
-----instantiation
-----html
-----css
*/

/*----
©AjaxForm
-----*/
__.classes.AjaxForm = function(args){
		if(typeof args == 'undefined') var args = {};
		//--required attributes
//->return

		//--optional attributes
		this.boot = args.boot || {};
		this.elmForm = args.elmForm || jQuery();
		this.oninit = args.oninit || null;
		this.onsubmitpreajax = args.onsubmitpreajax || null;
		this.onsuccess = args.onsuccess || null;

		//--derived attributes

		//--do something
		this.bindSubmit();

		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.AjaxForm.prototype.submit = function(){
		var lclThis = this;
		var lclValues = {};
		this.elmForm.find('input, select, textarea').each(function(){
			var elmThis = $(this);
			lclValues[elmThis.attr('name')] = elmThis.val();
		});
		if(this.onsubmitpreajax)
			this.onsubmitpreajax.call(lclThis, lclValues);
		jQuery.ajax({
			data: lclValues
			,success: function(argData){
				if(lclThis.onsuccess)
					lclThis.onsuccess.apply(lclThis, arguments);
			}
			,type: 'POST'
			,url: (this.elmForm.attr('action'))? this.elmForm.attr('action'): document.URL
		});
	}
	__.classes.AjaxForm.prototype.bindSubmit = function(argElm){
		var lclThis = this;
		if(typeof argElm == 'undefined') argElm = this.elmForm;
		argElm.on('submit', function(argEvent){
			lclThis.submit.call(lclThis);
			if(argEvent.preventDefault)
				argEvent.preventDefault();
			return false;
		});
	}

