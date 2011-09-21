/*
handler for dialog to use single dialog with changing content, passed directly or via ajax call

-----dependencies
tmlib: getWidthScrollbar
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
		if(typeof args== "undefined") var args= {};
		var fncThis = this;
		//--required attributes
//->return
		//--optional attributes
		this.ajaxData = jQuery.extend({ajaxcall: 1}, (args.ajaxData || null));
		this.boot = args.boot || {};
		this.classLoading = args.classLoading || "loading";
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
		this.oninit = args.oninit || null;
		this.onshow = args.onshow || null;
		this.onsuccess = args.onsuccess || null;
		this.widthAdded = args.widthAdded || 0;
		this.widthScrollbar = (typeof args.widthScrollbar != "undefined")? args.widthScrollbar: __.lib.getWidthScrollbar();
		this.heightMax = args.heightMax || 500;
		this.url = args.url || null;

		this.request = null;
		this.elmDialog = null;
		//--derived attributes
		this.isLimitingHeight = false;
		
		//--do something
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

			if(this.doManageHeight){
				if(this.heightMax == "viewport"){
					var lclHeightMax = $(window).height();
				}else if(isNumeric(this.heightMax)){
					var lclHeightMax = this.heightMax;
				}else{
					var lclHeightMax = false;
				}
				if(lclHeightMax && heightNewHTML > lclHeightMax){
					this.isLimitingHeight = true;
					this.elmDialog.dialog("option", "height", lclHeightMax);
				}else{
					this.isLimitingHeight = false;
					this.dialog("option", "height", "auto");
				}
			}
			if(this.doManageWidth){
				if(this.isLimitingHeight){
					widthNewHTML += this.widthScrollbar;
				}
				this.dialog("option", "width", widthNewHTML);
			}
		}
		this.dialog("open");
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

		this.elmDialog.addClass(this.classLoading).html("").dialog("open");
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
