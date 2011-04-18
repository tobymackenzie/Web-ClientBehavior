/*
handles clicks on a selection of elements

-----parameters
@param typeItems (parent): type of elmsItems for finding necessary data
	parent, atomic
@param selectorChildren (a): selector of children of elmsItems that hold necessary data if type is parent

-----instantiation
		var mainnavigationItems = $("#topnavigationlist .topitem, #logo");
		if(mainnavigationItems.length > 0){
			__.mainnavigationHandler = new __.classes.navigationHandler({
				elmsItems: mainnavigationItems
				,onpreswitch: function(arguments){
					var fncThis = this;
					var urlAjax = arguments.newItem.find(this.selectorChildren).attr(this.attrData);
					if(urlAjax.substring(0,1) == "#")
						urlAjax = urlAjax.substring(1, urlAjax.length - 1);
					var pagetype = arguments.newItem.attr(this.boot.attrType);
					__.router.callRoute({path: urlAjax, arguments: {url: urlAjax}});
				}
				,boot: {attrType: "data-pagetype"}
			});
		}
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

