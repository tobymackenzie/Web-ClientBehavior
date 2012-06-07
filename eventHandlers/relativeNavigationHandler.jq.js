/*
handle relative navigation buttons (next and previous)

-----instantiation
*/
		__.relativeNavigationImages = new __.classes.relativeNavigationHandler({
			elmWrapper: elmImageNavigationWrapper
			,htmlButtonContainer: '<div class="relativenavigation"><h3 class="screenreaderonly">Image Navigation</h3></div>'
			,htmlButtonPrevious: '<div class="item previous"><a href="javascript:/*__go_to_previous_image*/"><span class="screenreaderonly">Previous</span></a></div>'
			,htmlButtonNext: '<div class="item next"><a href="javascript:/*__go_to_next_image*/"><span class="screenreaderonly">Next</span></a></div>'
			,selectorElmForLinkManagement: "a"
		});
/*
*/


/*----------
©relativeNavigationHandler
---------*/
__.classes.relativeNavigationHandler = function(args){
		//--optional arguments
		this.attrData = args.attrData || "href";
		this.boot = args.boot || null;
		this.elmWrapper = args.elmWrapper || null;
		this.eventsBindTo = (args.eventsBindTo)? args.eventsBindTo: "click touch";
		this.elmButtonPrevious = args.elmButtonPrevious || null;
		this.elmButtonNext = args.elmButtonNext || null;
		this.htmlButtonContainer = args.htmlButtonContainer || null;
		this.htmlButtonPrevious = args.htmlButtonPrevious || null;
		this.htmlButtonNext = args.htmlButtonNext || null;
		this.onactivateprevious = args.onactivateprevious || null;
		this.onactivatenext = args.onactivatenext || null;
		this.oninit = args.oninit || null;
		this.selectorElmForLinkManagement = args.selectorElmForLinkManagement || 'this';
		this.testShowNext = args.testShowNext || function(){return true;};
		this.testShowPrevious = args.testShowPrevious || function(){return true;};


		//--derived members
		var fncThis = this;
		//-create button navigation
		if(this.htmlButtonContainer){
			this.elmButtonContainer = jQuery(this.htmlButtonContainer)
			this.elmWrapper.append(this.elmButtonContainer);
		}else{
			this.elmButtonContainer = this.elmWrapper;
		}
		if(args.elmButtonNext && args.elmButtonNext.length > 0){
			this.elmButtonNext = args.elmButtonNext;
		}else if(this.htmlButtonNext){
			this.elmButtonNext = jQuery(this.htmlButtonNext);
			this.elmButtonContainer.append(this.elmButtonNext);
		}
		if(args.elmButtonPrevious && args.elmButtonPrevious.length > 0){
			this.elmButtonPrevious = args.elmButtonPrevious;
		}else if(this.htmlButtonPrevious){
			this.elmButtonPrevious = jQuery(this.htmlButtonPrevious);
			if(this.elmButtonNext)
				this.elmButtonNext.before(this.elmButtonPrevious)
			else
				this.elmButtonContainer.prepend(this.elmButtonPrevious);
		}

		//--bind actions
		if(this.elmButtonPrevious && this.elmButtonPrevious.length > 0)
			this.bindActionPrevious(this.elmButtonPrevious);
		if(this.elmButtonNext && this.elmButtonNext.length > 0)
			this.bindActionNext(this.elmButtonNext)

		this.handleButtonShowHide();

		//--oninit
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.relativeNavigationHandler.prototype.bindActionPrevious = function(argElement){
		var fncThis = this;
		if(fncThis.onactivateprevious)
			argElement.bind(this.eventsBindTo, function(argEvent){return fncThis.onactivateprevious.call(fncThis, this, argEvent)});
	}
	__.classes.relativeNavigationHandler.prototype.bindActionNext = function(argElement){
		var fncThis = this;
		if(fncThis.onactivatenext)
			argElement.bind(this.eventsBindTo, function(argEvent){return fncThis.onactivatenext.call(fncThis, this, argEvent)});
	}
	__.classes.relativeNavigationHandler.prototype.handleButtonShowHide = function(){
		if(this.testShowPrevious()){
			this.elmButtonPrevious.show();
		}else{
			this.elmButtonPrevious.hide();
		}
		if(this.testShowNext()){
			this.elmButtonNext.show();
		}else{
			this.elmButtonNext.hide();
		}
	}
	__.classes.relativeNavigationHandler.prototype.setPreviousLink = function(argLink){
		if(this.selectorElmForLinkManagement){
			if(this.selectorElmForLinkManagement == "this")
				var elmForLinkManagement = this.elmButtonPrevious;
			else
				var elmForLinkManagement = this.elmButtonPrevious.find(this.selectorElmForLinkManagement);
			if(argLink)
				elmForLinkManagement.attr(this.attrData, argLink);
			else
				elmForLinkManagement.removeAttr(this.attrData);
			if(argLink){
				this.elmButtonPrevious.show();
			}else{
				this.elmButtonPrevious.hide();
			}
		}else
			return false;
	}
	__.classes.relativeNavigationHandler.prototype.setNextLink = function(argLink){
		if(this.selectorElmForLinkManagement){
			if(this.selectorElmForLinkManagement == "this")
				var elmForLinkManagement = this.elmButtonNext;
			else
				var elmForLinkManagement = this.elmButtonNext.find(this.selectorElmForLinkManagement);
			if(argLink)
				elmForLinkManagement.attr(this.attrData, argLink);
			else
				elmForLinkManagement.removeAttr(this.attrData);
			if(argLink){
				this.elmButtonNext.show();
			}else{
				this.elmButtonNext.hide();
			}
		}else
			return false;
	}

