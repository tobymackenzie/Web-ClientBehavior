/*
handler for dialog to use single dialog with changing content, passed directly or via ajax call

-----dependencies
tmlib: getWidthScrollbar, AjaxForm(if selectorAjaxForm)
jquery
jqueryui: dialog

-----parameters
-----instantiation
-----html
-----css
*/

/*---------
@HandlerDialog
----------*/
__.classes.HandlerDialog = function(args){
		if(typeof args == "undefined") var args = {};
		var fncThis = this;
		//--required attributes
//->return
		//--optional attributes
		this.ajaxData = jQuery.extend({ajaxcall: 1}, (args.ajaxData || null));
		this.boot = args.boot || {};
		this.classLoading = args.classLoading || "loading";
		this.clbHandleFormSuccess = args.clbHandleFormSuccess || this.defaultHandleFormSuccess;
		this.clbManageWidthHeight = args.clbManageWidthHeight || this.defaultManageWidthHeight;
		this.dialogArguments = {
			autoOpen: false
			,close: function(event, ui){
				if(fncThis.request){
					fncThis.request.abort();
					fncThis.request = null;
				}
			}
		};
		this.dialogArguments = jQuery.extend(this.dialogArguments, (args.dialogArguments || {}));
		this.doManageWidth = (typeof args.doManageWidth != "undefined")? args.doManageWidth: true;
		this.doManageHeight = (typeof args.doManageHeight != "undefined")? args.doManageHeight: true;
		this.htmlLoading = args.htmlLoading || "";
		this.oninit = args.oninit || null;
		this.onshow = args.onshow || null;
		this.onsuccess = args.onsuccess || null;
		this.widthModifierContent = args.widthModifierContent || 0;
		this.widthScrollbar = (typeof args.widthScrollbar != "undefined")? args.widthScrollbar: __.lib.getWidthScrollbar();
		this.heightMax = args.heightMax || "viewport";
		this.heightModifierContent = args.heightModifierContent || 0;
		this.heightModifierContainer = (typeof args.heightModifierContainer != "undefined")? args.heightModifierContainer: -40;
		this.selectorAjaxForm = args.selectorAjaxForm || "";
		this.url = args.url || null;

		//--derived attributes
		this.arrAjaxForms = [];
		this.elmDialog = null;
		this.isLimitingHeight = false;
		this.request = null;
		
		//--prevent scrolling of document
		if(this.doManageHeight && this.heightMax == "viewport"){
			this.elmHTML = $("html");
			this.valueHTMLOverflow = this.elmHTML.css("overflow");
			this.initDialog();
			this.elmDialog.bind("dialogopen", function(argEvent, argUI){
				fncThis.elmHTML.css("overflow", "hidden");
			});
			this.elmDialog.bind("dialogclose", function(argEvent, argUI){
				fncThis.elmHTML.css("overflow", fncThis.valueHTMLOverflow);
			});
		}

		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.HandlerDialog.prototype.bindAjaxForm = function(argElmsForm){
		var lclThis = this;
		if(typeof argElmsForm == "undefined")
			argElmsForm = this.elmDialog.find(this.selectorAjaxForm);
		argElmsForm.each(function(){
			lclThis.arrAjaxForms.push(new __.classes.AjaxForm({
				elmForm: $(this)
				,onsuccess: function(){
					lclThis.clbHandleFormSuccess.apply(lclThis, arguments);
				}
			}));
		});
	}
	__.classes.HandlerDialog.prototype.defaultHandleFormSuccess = function(argData, argStatus, argXHR){
		var lclContentType = argXHR.getResponseHeader("content-type");
		if(lclContentType.indexOf("text/html") > -1){
			this.showWithContent(argData);
		}else{
			this.elmDialog.dialog("close");
		}
	}
	__.classes.HandlerDialog.prototype.initDialog = function(){
		if(!this.elmDialog){
			this.elmDialog = jQuery("<div>");
			if(this.doManageHeight)
				this.elmDialog.css({overflow: "auto"});
			this.elmDialog.dialog(this.dialogArguments);
		}
	}
	__.classes.HandlerDialog.prototype.showWithContent = function(argContent){
		this.initDialog();
		var elmNewHTML = jQuery(argContent);
		this.elmDialog.html(elmNewHTML);
		if(this.doManageWidth || this.doManageHeight){
			this.clbManageWidthHeight.call(this, elmNewHTML);
		}
		this.dialog("open");
		if(this.selectorAjaxForm)
			this.bindAjaxForm();
		if(this.onshow)
			this.onshow.call(this);
	}
	__.classes.HandlerDialog.prototype.showForAjax = function(args){
		var fncThis = this;
		this.initDialog();
		if(typeof args.url == "undefined")
			args.url = this.url;
		args.data = jQuery.extend({}, this.ajaxData, (args.data || null));
		if(typeof args.success == "undefined")
			args.success = function(data){ fncThis.callbackAjaxSuccess(data, this) };

		if(this.doManageWidth)
			this.dialog("option", "width", "auto");
		if(this.doManageHeight){
			this.dialog("option", "height", "auto");
			this.isLimitingHeight = false;
		}

		if(__.lib.isFunction(this.htmlLoading))
			var lclHtmlLoading = this.htmlLoading.call(this);
		else
			var lclHtmlLoading = this.htmlLoading;

		this.elmDialog.addClass(this.classLoading).html(lclHtmlLoading).dialog("open");

		this.request = jQuery.ajax(args);
	}
	__.classes.HandlerDialog.prototype.callbackAjaxSuccess = function(argData, argContext){
		if(this.onsuccess)
			argData = this.onsuccess.call(this, argData) || argData;
		this.showWithContent(argData);
		this.elmDialog.removeClass(this.classLoading);
		this.dialog("option", "position", this.dialog("option", "position"));
		this.request = null;
	}
	__.classes.HandlerDialog.prototype.dialog = function(){
		return this.elmDialog.dialog.apply(this.elmDialog, arguments);
	}
	__.classes.HandlerDialog.prototype.defaultManageWidthHeight = function(argElmNewHTML){
		var lcl = {};
		lcl.elmNewHTMLClone = jQuery('<div class="ui-dialog">').html(argElmNewHTML.clone());
		lcl.elmNewHTMLClone.addClass("ui-dialog-content "+this.dialogArguments.dialogClass);
		lcl.elmNewHTMLClone.css({position: "absolute", left: "-9000px", top: "-9000px", display: "table"});
		jQuery("body").append(lcl.elmNewHTMLClone);
		lcl.widthNewHTML = lcl.elmNewHTMLClone.width();
		lcl.widthNewHTML += this.widthModifierContent;
		lcl.heightNewHTML = lcl.elmNewHTMLClone.height();
		lcl.heightNewHTML += this.heightModifierContent;
		lcl.elmNewHTMLClone.remove();

		if(this.doManageHeight){
			if(this.heightMax == "viewport"){
				lcl.heightMax = $(window).height() + this.heightModifierContainer;
			}else if(isNumeric(this.heightMax)){
				lcl.heightMax = this.heightMax;
			}else{
				lcl.heightMax = false;
			}
			if(lcl.heightMax && lcl.heightNewHTML > lcl.heightMax){
				this.isLimitingHeight = true;
				this.elmDialog.dialog("option", "height", lcl.heightMax);
			}else{
				this.isLimitingHeight = false;
				this.dialog("option", "height", "auto");
			}
		}
		if(this.doManageWidth){
			if(this.isLimitingHeight){
				lcl.widthNewHTML += this.widthScrollbar;
			}
			this.dialog("option", "width", lcl.widthNewHTML);
		}
	}

