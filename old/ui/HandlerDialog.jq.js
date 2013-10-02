/*
Class: HandlerDialog
Handler for dialog to use single dialog with changing content, passed directly or via ajax call

Dependencies:
	tmlib: getWidthScrollbar, AjaxForm(if selectorAjaxForm), __.lib.isNumeric
	jquery
	jqueryui: dialog

*/
/* global __, jQuery, window */
__.classes.HandlerDialog = __.core.Classes.create({
	init: function(){
		this.__base(arguments);
		var _this = this;

		this.arrAjaxForms = [];
		if(typeof this.dialogArguments === 'undefined'){
			this.dialogArguments = {
				autoOpen: false
				,close: function(){
					if(_this.request){
						_this.request.abort();
						_this.request = null;
					}
				}
			};
		}
		if(typeof this.widthScrollbar === 'undefined'){
			this.widthScrollbar = __.lib.getWidthScrollbar();
		}

		//--prevent scrolling of document
		if(this.doManageHeight && this.heightMax == 'viewport'){
			this.elmHTML = jQuery('html');
			this.valueHTMLOverflow = this.elmHTML.css('overflow');
			this.initDialog();
			this.elmDialog.on('dialogopen', function(){
				_this.elmHTML.css('overflow', 'hidden');
			});
			this.elmDialog.on('dialogclose', function(){
				_this.elmHTML.css('overflow', _this.valueHTMLOverflow);
			});
		}

		if(this.oninit){
			this.oninit.call(this);
		}
	}
	,properties: {
		ajaxData: undefined
		,arrAjaxForms: undefined
		,bindAjaxForm: function(argElmsForm){
			var lclThis = this;
			if(typeof argElmsForm == 'undefined'){
				argElmsForm = this.elmDialog.find(this.selectorAjaxForm);
			}
			argElmsForm.each(function(){
				lclThis.arrAjaxForms.push(new __.classes.AjaxForm({
					elmForm: jQuery(this)
					,onsuccess: function(){
						lclThis.clbHandleFormSuccess.apply(lclThis, arguments);
					}
				}));
			});
		}
		,callbackAjaxSuccess: function(argData){
			if(this.onsuccess){
				argData = this.onsuccess.call(this, argData) || argData;
			}
			this.showWithContent(argData);
			this.elmDialog.removeClass(this.classLoading);
			this.dialog('option', 'position', this.dialog('option', 'position'));
			this.request = null;
		}
		,classLoading: 'loading'
		,clbHandleFormSuccess: function(argData, argStatus, argXHR){
			var lclContentType = argXHR.getResponseHeader('content-type');
			if(lclContentType.indexOf('text/html') > -1){
				if(this.clbHandleFormSuccessHTML){
					this.clbHandleFormSuccessHTML.call(this, argData);
				}else{
					this.showWithContent(argData);
				}
			}else{
				if(this.clbHandleFormSuccessJSON){
					this.clbHandleFormSuccessJSON.call(this, argData);
				}else{
					this.dialog('close');
				}
			}
			if(this.onhandleformsuccess){
				this.onhandleformsuccess.call(this);
			}
		}
		,clbHandleFormSuccessHTML: undefined
		,clbHandleFormSuccessJSON: undefined
		,clbManageWidthHeight: function(argElmNewHTML){
			var lcl = {};
			lcl.elmNewHTMLClone = jQuery('<div class="ui-dialog">').html(argElmNewHTML.clone());
			lcl.elmNewHTMLClone.addClass('ui-dialog-content '+this.dialogArguments.dialogClass);
			lcl.elmNewHTMLClone.css({position: 'absolute', left: '-9000px', top: '-9000px', display: 'table'});
			jQuery('body').append(lcl.elmNewHTMLClone);
			lcl.widthNewHTML = lcl.elmNewHTMLClone.width();
			lcl.widthNewHTML += this.widthModifierContent;
			lcl.heightNewHTML = lcl.elmNewHTMLClone.height();
			lcl.heightNewHTML += this.heightModifierContent;
			lcl.elmNewHTMLClone.remove();

			if(this.doManageHeight){
				if(this.heightMax == 'viewport'){
					lcl.heightMax = jQuery(window).height() + this.heightModifierContainer;
				}else if(__.lib.isNumeric(this.heightMax)){
					lcl.heightMax = this.heightMax;
				}else{
					lcl.heightMax = false;
				}
				if(lcl.heightMax && lcl.heightNewHTML > lcl.heightMax){
					this.isLimitingHeight = true;
					this.elmDialog.dialog('option', 'height', lcl.heightMax);
				}else{
					this.isLimitingHeight = false;
					this.dialog('option', 'height', 'auto');
				}
			}
			if(this.doManageWidth){
				if(this.isLimitingHeight){
					lcl.widthNewHTML += this.widthScrollbar;
				}
				this.dialog('option', 'width', lcl.widthNewHTML);
			}
		}
		,dialog: function(){
			return this.elmDialog.dialog.apply(this.elmDialog, arguments);
		}
		,dialogArguments: undefined
		,displayLoading: function(){
			var lclHtmlLoading;
			if(__.lib.isFunction(this.htmlLoading)){
				lclHtmlLoading = this.htmlLoading.call(this);
			}else{
				lclHtmlLoading = this.htmlLoading;
			}
			this.elmDialog.addClass(this.classLoading).html(lclHtmlLoading);
		}
		,doManageHeight: true
		,doManageWidth: true
		,elmDialog: undefined
		,heightMax: 'viewport'
		,heightModifierContainer: -40
		,heightModifierContent: 0
		,htmlLoading: ''
		,initDialog: function(){
			if(!this.elmDialog){
				this.elmDialog = jQuery('<div>');
				if(this.doManageHeight){
					this.elmDialog.css({overflow: 'auto'});
				}
				this.elmDialog.dialog(this.dialogArguments);
			}
		}
		,isLimitingHeight: false
		,onhandleformsuccess: undefined
		,oninit: undefined
		,onshow: undefined
		,onsuccess: undefined
		,request: undefined
		,selectorAjaxForm: ''
		,showForAjax: function(_args){
			var _this = this;
			this.initDialog();
			if(typeof _args.url == 'undefined'){
				_args.url = this.url;
			}
			_args.data = jQuery.extend({}, this.ajaxData, (_args.data || null));
			if(typeof _args.success == 'undefined'){
				_args.success = function(data){ _this.callbackAjaxSuccess(data, this); };
			}

			if(this.doManageWidth){
				this.dialog('option', 'width', 'auto');
			}
			if(this.doManageHeight){
				this.dialog('option', 'height', 'auto');
				this.isLimitingHeight = false;
			}

			this.dialog('option', 'closeText', this.dialogArguments.closeText);
			this.displayLoading();
			this.elmDialog.dialog('open');

			this.request = jQuery.ajax(_args);
		}
		,showWithContent: function(argContent){
			this.initDialog();
			var elmNewHTML = jQuery(argContent);
			this.elmDialog.html(elmNewHTML);
			if(this.doManageWidth || this.doManageHeight){
				this.clbManageWidthHeight.call(this, elmNewHTML);
			}
			this.dialog('option', 'closeText', this.dialogArguments.closeText);
			this.dialog('open');
			if(this.selectorAjaxForm){
				this.bindAjaxForm();
			}
			if(this.onshow){
				this.onshow.call(this);
			}
		}
		,widthModifierContent: 0
		,widthScrollbar: undefined
		,url: undefined
	}
});
