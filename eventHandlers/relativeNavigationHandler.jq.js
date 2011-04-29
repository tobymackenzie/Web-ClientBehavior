/*
handle relative navigation buttons (next and previous)

-----instantiation
		__.relativeNavigationImages = new __.classes.relativeNavigationHandler({
			elmWrapper: elmImageNavigationWrapper
			,htmlButtonContainer: '<div class="relativenavigation"><h3 class="screenreaderonly">Image Navigation</h3></div>'
			,htmlButtonPrevious: '<div class="item previous"><a href="javascript://__go_to_previous_image"><span class="screenreaderonly">Previous</span></a></div>'
			,htmlButtonNext: '<div class="item next"><a href="javascript://__go_to_next_image"><span class="screenreaderonly">Next</span></a></div>'
			,selectorElmForLinkManagement: "a"
		});

*/


/*----------
©relativeNavigationHandler
---------*/
__.classes.relativeNavigationHandler = function(arguments){
		//--optional arguments
		this.attrForLinkManagement = arguments.attrForLinkManagement || "href";
		this.boot = arguments.boot || null;
		this.elmWrapper = arguments.elmWrapper || null;
		this.eventsBindTo = (arguments.eventsBindTo)? arguments.eventsBindTo: "click touch";
		this.elmButtonPrevious = arguments.elmButtonPrevious || null;
		this.elmButtonNext = arguments.elmButtonNext || null;
		this.htmlButtonContainer = arguments.htmlButtonContainer || null;
		this.htmlButtonPrevious = arguments.htmlButtonPrevious || null;
		this.htmlButtonNext = arguments.htmlButtonNext || null;
		this.onactivateprevious = arguments.onactivateprevious || null;
		this.onactivatenext = arguments.onactivatenext || null;
		this.oninit = arguments.oninit || null;
		this.selectorElmForLinkManagement = arguments.selectorElmForLinkManagement || null;
		this.testShowNext = arguments.testShowNext || function(){return true;};
		this.testShowPrevious = arguments.testShowPrevious || function(){return true;};
		
		
		//--derived members
		var fncThis = this;
		//-create button navigation
		if(this.htmlButtonContainer){
			this.elmButtonContainer = $(this.htmlButtonContainer)
			this.elmWrapper.append(this.elmButtonContainer);
		}else{
			this.elmButtonContainer = this.elmWrapper;
		}
		if(arguments.elmButtonPrevious){
			this.elmButtonPrevious = arguments.elmButtonPrevious;
		}else if(this.htmlButtonPrevious){
			this.elmButtonPrevious = $(this.htmlButtonPrevious);
			this.elmButtonContainer.append(this.elmButtonPrevious);
		}
		if(arguments.elmButtonNext){
			this.elmButtonNext = arguments.elmButtonNext;
		}else if(this.htmlButtonNext){
			this.elmButtonNext = $(this.htmlButtonNext);
			this.elmButtonContainer.append(this.elmButtonNext);
		}
		
		//--bind actions
		if(this.elmButtonPrevious && this.elmButtonPrevious.length > 0)
			this.bindActionPrevious(this.elmButtonPrevious);
		if(this.elmButtonNext && this.elmButtonNext.length > 0)
			this.bindActionNext(this.elmButtonNext)
		
		this.handleButtonShowHide();	
	}
	__.classes.relativeNavigationHandler.prototype.bindActionPrevious = function(argElement){
		var fncThis = this;
		if(fncThis.onactivateprevious)
			argElement.bind(this.eventsBindTo, function(){fncThis.onactivateprevious.call(fncThis)});
	}
	__.classes.relativeNavigationHandler.prototype.bindActionNext = function(argElement){
		var fncThis = this;
		if(fncThis.onactivatenext)
			argElement.bind(this.eventsBindTo, function(){fncThis.onactivatenext.call(fncThis)});
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
				elmForLinkManagement.attr(this.attrForLinkManagement, argLink);
			else
				elmForLinkManagement.removeAttr(this.attrForLinkManagement);
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
				elmForLinkManagement.attr(this.attrForLinkManagement, argLink);
			else
				elmForLinkManagement.removeAttr(this.attrForLinkManagement);
			if(argLink){
				this.elmButtonNext.show();
			}else{
				this.elmButtonNext.hide();
			}
		}else
			return false;
	}

