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
		//--required attributes
//->return
		//--optional attributes
		this.ajaxData = $.extend({ajaxcall: 1}, (arguments.ajaxData || null));
		this.boot = arguments.boot || {};
		this.dialogArguments = {autoOpen: false};
		this.dialogArguments = $.extend(this.dialogArguments, (arguments.dialogArguments || {}));
		this.doManageWidth = (typeof arguments.doManageWidth != "undefined")? arguments.doManageWidth: true;
		this.doManageHeight = (typeof arguments.doManageHeight != "undefined")? arguments.doManageHeight: true;
		this.oninit = arguments.oninit || null;
		this.onshow = arguments.onshow || null;
		this.onsuccess = arguments.onsuccess || null;
		this.widthAdded = arguments.widthAdded || 0;
		this.widthScrollbar = (typeof arguments.widthScrollbar != "undefined")? arguments.widthScrollbar: 25;
		this.heightMax = arguments.heightMax || 500;
		this.url = arguments.url || null;

		this.elmDialog = null;
		//--derived attributes
		var fncThis = this;

		//--do something
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.HandlerDialog.prototype.initDialog = function(){
		if(!this.elmDialog){
			this.elmDialog = $("<div>");
			if(this.doManageHeight)
				this.elmDialog.css({overflow: "auto"});
			this.elmDialog.dialog(this.dialogArguments);
		}
	}
	__.classes.HandlerDialog.prototype.showWithContent = function(argContent){
		this.initDialog();
		var elmNewHTML = $(argContent);
		this.elmDialog.html(elmNewHTML);
		if(this.doManageWidth || this.doManageHeight){
			var elmNewHTMLClone = $("<div>").html(elmNewHTML.clone());
			elmNewHTMLClone.css({position: "absolute", left: "-9000px", top: "-9000px", display: "table"});
			$("body").append(elmNewHTMLClone);
			var widthNewHTML = elmNewHTMLClone.width();
			widthNewHTML += this.widthAdded;
			var heightNewHTML = elmNewHTMLClone.height();
			if(this.doManageHeight && heightNewHTML > this.heightMax){
				widthNewHTML += this.widthScrollbar;
			}
			elmNewHTMLClone.remove();
			if(this.doManageWidth)
				this.elmDialog.dialog("option", "width", widthNewHTML);
			if(this.doManageHeight){
				if(heightNewHTML > this.heightMax){
					this.elmDialog.dialog("option", "height", this.heightMax);
				}else
					this.elmDialog.dialog("option", "height", "auto");
			}
		}
		this.elmDialog.dialog("open");
		if(this.onshow)
			this.onshow.call(this);
	}
	__.classes.HandlerDialog.prototype.showForAjax = function(arguments){
		var fncThis = this;
		if(typeof arguments.url == "undefined")
			arguments.url = this.url;
		arguments.data = $.extend({}, this.ajaxData, (arguments.data || null));
		if(typeof arguments.success == "undefined")
			arguments.success = function(data){ fncThis.callbackAjaxSuccess(data, this) };

		$.ajax(arguments);
	}
	__.classes.HandlerDialog.prototype.callbackAjaxSuccess = function(argData, argContext){
		if(this.onsuccess)
			argData = this.onsuccess.call(this, argData) || argData;
		this.showWithContent(argData);
	}
