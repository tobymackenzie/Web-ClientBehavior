/*
pulls in data through jquery ajax function and by default animates a wrapper and replaces its content with the ajax result

-----depends on:
	tmlib
	jquery

*/

/*-------
©pagerAjax
-------- */
__.classes.pagerAjax = function(arguments){
		//--required arguments

		//--optional arguments
		this.boot = arguments.boot || null;
		this.data = arguments.data || {};
		this.duration = arguments.duration || 500;
		this.elmContainer = arguments.elmContainer || $("body");
		this.elmWrap = arguments.elmWrap || null;
		this.selectorWrapForAnimation = arguments.selectorWrapForAnimation || null;
		this.selectorWrapForContent = arguments.selectorWrapForContent || null;
		this.htmlWrap = arguments.htmlWrap || null;
		this.oninit = arguments.oninit || null;
		this.onpreajaxcall = (typeof arguments.onpreajaxcall != "undefined")? arguments.onpreajaxcall: this.animationBasicPreCall;
		this.onsuccess = (arguments.onsuccess)? arguments.onsuccess: this.animationBasicOnSuccess;
		this.paramAjax = arguments.paramAjax || "ajaxcall";
		this.url = arguments.url || null;

		//--derived members
		if((!this.elmWrap || this.elmWrap.length < 1) && this.htmlWrap){
			this.elmWrap = $(this.htmlWrap);
			this.elmWrap.hide();
			this.elmContainer.append(this.elmWrap);
		}
		this.elmWrapForAnimation = $(this.selectorWrapForAnimation);
		this.elmWrapForContent = $(this.selectorWrapForContent);
		
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.pagerAjax.prototype.loadAjax = function(arguments){
		var fncThis = this;
		var fncAjaxParameters = arguments;
		
		if(this.onpreajaxcall)
			this.onpreajaxcall.call(fncThis, fncAjaxParameters);
		else
			this.loadAjaxData(fncAjaxParameters);
	}
	__.classes.pagerAjax.prototype.loadAjaxData = function(arguments){
		var fncAjaxParameters = arguments;
		
		//--set default parameters
		if(!fncAjaxParameters.success)
			fncAjaxParameters.success = function(data){
				this.onsuccess.call(this, data);
			}
		if(!fncAjaxParameters.context)
			fncAjaxParameters.context = this;
		var oldData = arguments.data;
		fncAjaxParameters.data = this.data;
		if(typeof arguments.data != "undefined"){
			for(var key in oldData){
				if(oldData.hasOwnProperty(key)){
					fncAjaxParameters.data[key] = oldData[key];
				}
			}
		}
			
		fncAjaxParameters.data[this.paramAjax] = 1;
		if(!fncAjaxParameters.url)
			fncAjaxParameters.url = this.url;
		
		$.ajax(fncAjaxParameters);
	}
	__.classes.pagerAjax.prototype.animationBasicPreCall = function(arguments){
		var fncThis = this;
		var fncAjaxParameters = arguments;
		if(this.elmWrapForAnimation && this.elmWrapForAnimation.length > 0){
			this.elmWrapForAnimation.fadeOut(fncThis.duration, function(){
				fncThis.loadAjaxData(fncAjaxParameters);
			});
		}else
			fncThis.loadAjaxData(fncAjaxParameters);
	}
	__.classes.pagerAjax.prototype.animationBasicOnSuccess = function(argData){
		var fncThis = this;
		var fncTextContent = argData;

		if($.trim(fncTextContent)){
			fncThis.elmWrapForContent.html(fncTextContent);
			fncThis.elmWrapForAnimation.fadeIn(fncThis.duration);
		}
	}





