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

/*-------
©classname
-------- */
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
        this.dialogArguments = {autoOpen: false, dialogClass: "popupbox"};
        this.dialogArguments = $.extend(this.dialogArguments, (arguments.dialogArguments || {}));
        this.oninit = arguments.oninit || null;
        this.onshow = arguments.onshow || null;
        this.onsuccess = arguments.onsuccess || null;
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
            this.elmDialog.dialog({dialogClass: "popupbox", autoOpen: false});
        }
    }
    __.classes.HandlerDialog.prototype.showWithContent = function(argContent){
        this.initDialog();
        this.elmDialog.html(argContent);
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
