/*
handler for dialog to use single dialog with changing content, passed directly or via ajax call

-----dependencies
tmlib
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
__.classes.HandlerDialog = function(arguments){
		if(typeof arguments == "undefined") var arguments = {};
		var fncThis = this;
		//--required attributes
//->return
		//--optional attributes
		this.ajaxData = jQuery.extend({ajaxcall: 1}, (arguments.ajaxData || null));
		this.boot = arguments.boot || {};
		this.classLoading = arguments.classLoading || "loading";
		this.dialogArguments = {
			autoOpen: false
			,close: function(event, ui){
				if(fncThis.request){
					fncThis.request.abort();
					fncThis.request = null;
				}
			}
		};
		this.dialogArguments = jQuery.extend(this.dialogArguments, (arguments.dialogArguments || {}));
		this.doManageWidth = (typeof arguments.doManageWidth != "undefined")? arguments.doManageWidth: true;
		this.doManageHeight = (typeof arguments.doManageHeight != "undefined")? arguments.doManageHeight: true;
		this.oninit = arguments.oninit || null;
		this.onshow = arguments.onshow || null;
		this.onsuccess = arguments.onsuccess || null;
		this.widthAdded = arguments.widthAdded || 0;
		this.widthScrollbar = (typeof arguments.widthScrollbar != "undefined")? arguments.widthScrollbar: 25;
		this.heightMax = arguments.heightMax || 500;
		this.url = arguments.url || null;

		this.request = null;
		this.elmDialog = null;
		//--derived attributes

		//--do something
		if(this.oninit)
			this.oninit.call(this);
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
			var elmNewHTMLClone = jQuery("<div>").html(elmNewHTML.clone());
			elmNewHTMLClone.addClass("ui-dialog-content "+this.dialogArguments.dialogClass);
			elmNewHTMLClone.css({position: "absolute", left: "-9000px", top: "-9000px", display: "table"});
			jQuery("body").append(elmNewHTMLClone);
			var widthNewHTML = elmNewHTMLClone.width();
			widthNewHTML += this.widthAdded;
			var heightNewHTML = elmNewHTMLClone.height();
			elmNewHTMLClone.remove();
			if(heightNewHTML > this.heightMax){
				widthNewHTML += this.widthScrollbar;
			}
			if(this.doManageWidth)
				this.dialog("option", "width", widthNewHTML);
			if(this.doManageHeight){
				if(heightNewHTML > this.heightMax){
					this.dialog("option", "height", this.heightMax);
				}else
					this.dialog("option", "height", "auto");
			}
		}
		this.dialog("open");
		if(this.onshow)
			this.onshow.call(this);
	}
	__.classes.HandlerDialog.prototype.showForAjax = function(arguments){
		var fncThis = this;
		this.initDialog();
		if(typeof arguments.url == "undefined")
			arguments.url = this.url;
		arguments.data = jQuery.extend({}, this.ajaxData, (arguments.data || null));
		if(typeof arguments.success == "undefined")
			arguments.success = function(data){ fncThis.callbackAjaxSuccess(data, this) };

		this.elmDialog.addClass(this.classLoading).html("").dialog("open");
		this.request = jQuery.ajax(arguments);
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
