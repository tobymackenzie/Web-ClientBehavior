/*
pulls in data through jquery ajax function and by default animates a wrapper and replaces its content with the ajax result

-----depends on:
tmlib
jquery

-----instantiation
		__.contentPager = new __.classes.pagerAjax({url: '/products/'
			,duration: 1000
			,elmWrap: $('#maindescriptionwrap')
			,htmlWrap: '<div id="maindescriptionwrap"><div id="maindescription"></div></div>'
			,selectorWrapForAnimation: '#maindescription'
			,selectorWrapForContent: '#maindescription'
			,onpreajaxcall: function(args){
				var fncThis = this;
				var fncAjaxParameters = args;
				var callbackMaincontent = function(){};
				var callbackMaindescription = function(){};
				var callback = function(){
					fncThis.loadAjaxData(fncAjaxParameters);
				}

				if(fncThis.boot.pagetypeToLoad == 'zone')
					callbackMaincontent = callback;
				else
					callbackMaindescription = callback;

				fncThis.boot.elmMaincontentWrapForAnimation.fadeOut(fncThis.duration, callbackMaincontent);
				fncThis.elmWrapForAnimation.fadeOut(fncThis.duration, callbackMaindescription);
			}
			,onsuccess: function(argData){
				var fncThis = this;
				var fncTextContent = argData;
				if($.trim(fncTextContent)){
					if(fncThis.boot.pagetypeToLoad == 'zone'){
						fncThis.boot.elmMaincontentWrapForContent.html(fncTextContent);
						__.hashHandler.hashifyURLs(fncThis.boot.elmMaincontentWrapForContent);
						fncThis.boot.elmMaincontentWrapForAnimation.fadeIn(fncThis.duration);
					}else{
						fncThis.elmWrapForContent.html(fncTextContent);
						__.hashHandler.hashifyURLs(fncThis.elmWrapForContent);
						fncThis.elmWrapForAnimation.fadeIn(fncThis.duration);
					}
				}
				fncThis.boot.pagetypeToLoad = false;
				__.imageSwitcher.queue.dequeue('image');
			}
			,oninit: function(){
				//--ensure main container  is visible, will otherwise not be if created automatically
				this.elmWrap.show();
				this.elmWrapForAnimation.hide();

				//--set or create other content holder
				this.boot.elmMaincontentWrapForAnimation = $(this.boot.selectorMaincontentWrapForAnimation);
				if(this.boot.elmMaincontentWrapForAnimation.length < 1){
					this.boot.elmMaincontentWrap = $(this.boot.htmlMaincontentWrap);
					this.boot.elmMaincontentWrap.hide();
					this.boot.elmFullheighter.after(this.boot.elmMaincontentWrap);
				}else
					this.boot.elmMaincontentWrap = this.boot.elmMaincontentWrapForAnimation;
				this.boot.elmMaincontentWrapForAnimation = $(this.boot.selectorMaincontentWrapForAnimation);
				this.boot.elmMaincontentWrapForContent = $(this.boot.selectorMaincontentWrapForContent);
			}
			,boot: {
				pagetypeToLoad: false
				,htmlMaincontentWrap: '<div id="maincontentwrap"><div id="maincontent"></div></div>'
				,elmFullheighter: $('#fullheighter')
				,selectorMaincontentWrapForAnimation: '#maincontentwrap'
				,selectorMaincontentWrapForContent: '#maincontent'
			}
		});

*/

/*-------
©pagerAjax
-------- */
__.classes.pagerAjax = function(args){
		//--required arguments

		//--optional arguments
		this.boot = args.boot || null;
		this.data = args.data || {};
		this.duration = args.duration || 500;
		this.elmContainer = args.elmContainer || jQuery('body');
		this.elmWrap = args.elmWrap || null;
		this.selectorWrapForAnimation = args.selectorWrapForAnimation || null;
		this.selectorWrapForContent = args.selectorWrapForContent || null;
		this.htmlWrap = args.htmlWrap || null;
		this.oninit = args.oninit || null;
		this.onpreajaxcall = (typeof args.onpreajaxcall != 'undefined')? args.onpreajaxcall: this.animationBasicPreCall;
		this.onsuccess = (args.onsuccess)? args.onsuccess: this.animationBasicOnSuccess;
		this.paramAjax = args.paramAjax || 'ajaxcall';
		this.url = args.url || null;

		//--derived members
		if((!this.elmWrap || this.elmWrap.length < 1) && this.htmlWrap){
			this.elmWrap = jQuery(this.htmlWrap);
			this.elmWrap.hide();
			this.elmContainer.append(this.elmWrap);
		}
		this.elmWrapForAnimation = jQuery(this.selectorWrapForAnimation);
		this.elmWrapForContent = jQuery(this.selectorWrapForContent);

		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.pagerAjax.prototype.loadAjax = function(args){
		var fncThis = this;
		var fncAjaxParameters = args;

		if(this.onpreajaxcall)
			this.onpreajaxcall.call(fncThis, fncAjaxParameters);
		else
			this.loadAjaxData(fncAjaxParameters);
	}
	__.classes.pagerAjax.prototype.loadAjaxData = function(args){
		var fncAjaxParameters = args;

		//--set default parameters
		if(!fncAjaxParameters.success)
			fncAjaxParameters.success = function(data){
				this.onsuccess.call(this, data);
			}
		if(!fncAjaxParameters.context)
			fncAjaxParameters.context = this;
		var oldData = args.data;
		fncAjaxParameters.data = this.data;
		if(typeof args.data != 'undefined'){
			for(var key in oldData){
				if(oldData.hasOwnProperty(key)){
					fncAjaxParameters.data[key] = oldData[key];
				}
			}
		}

		fncAjaxParameters.data[this.paramAjax] = 1;
		if(!fncAjaxParameters.url)
			fncAjaxParameters.url = this.url;

		jQuery.ajax(fncAjaxParameters);
	}
	__.classes.pagerAjax.prototype.animationBasicPreCall = function(args){
		var fncThis = this;
		var fncAjaxParameters = args;
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

		if(jQuery.trim(fncTextContent)){
			fncThis.elmWrapForContent.html(fncTextContent);
			fncThis.elmWrapForAnimation.fadeIn(fncThis.duration);
		}
	}

