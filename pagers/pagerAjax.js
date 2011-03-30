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
		this.duration = arguments.duration || 500;
		this.elmContainer = arguments.elmContainer || $("body");
		this.elmWrap = arguments.elmWrap || null;
		this.selectorWrapForAnimation = arguments.selectorWrapForAnimation || null;
		this.selectorWrapForContent = arguments.selectorWrapForContent || null;
		this.htmlWrap = arguments.htmlButtonContainer || null;
		this.onsuccess = (arguments.onsuccess)? arguments.onsuccess: this.animationBasic;
		this.paramAjax = arguments.paramAjax || "ajaxcall";
		this.url = arguments.url || null;

		//--derived members
		if(!this.elmWrap && this.htmlWrap){
			this.elmWrap = $(this.htmlWrap);
			this.elmContainer.append(this.elmWrap);
		}
		this.elmWrapForAnimation = $(this.selectorWrapForAnimation);
		this.elmWrapForContent = $(this.selectorWrapForContent);
	}
	__.classes.pagerAjax.prototype.loadAjax = function(arguments){
		var fncAjaxParameters = arguments;
		
		//--set default parameters
		if(!fncAjaxParameters.success)
			fncAjaxParameters.success = function(data){
				this.onsuccess(data);
			}
		if(!fncAjaxParameters.context)
			fncAjaxParameters.context = this;
		if(!fncAjaxParameters.data)
			fncAjaxParameters.data = {};
		fncAjaxParameters.data[this.paramAjax] = 1;
		if(!fncAjaxParameters.url)
			fncAjaxParameters.url = this.url;
		
		$.ajax(fncAjaxParameters);
	}
	__.classes.pagerAjax.prototype.animationBasic = function(argData){
		var fncThis = this;
		var fncTextContent = argData;
		this.elmWrapForAnimation.fadeOut(fncThis.duration, function(){
			if(fncTextContent){
				fncThis.elmWrapForContent.html(fncTextContent);
				fncThis.elmWrapForAnimation.fadeIn(fncThis.duration);
			}
		});
	}

