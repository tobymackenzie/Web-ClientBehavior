/*
basic pager with navigation and pages collection
-----dependencies
tmlib addClass, removeClass
-----parameters
-----instantiation
__.pager = new __.classes.Pager({elmsPages: jQuery("#maincontent .tabpage"), elmsNavigation: jQuery("#maincontent .tab")});
-----html
-----css
*/

/*-------
©Pager
-------- */
__.classes.Pager = function(arguments){
		//--required attributes
//->return
		//--optional attributes
		this.attrId = arguments.attrId || "id";
		this.boot = arguments.boot || {};
		this.callbackGetNavigationForID = arguments.callbackGetNavigationForID || this.defaultCallbackGetNavigationForID;
		this.callbackGetPageForID = arguments.callbackGetPageForID || this.defaultCallbackGetPageForID;
		this.classCurrentNavigation = arguments.classCurrentNavigation || "current";
		this.classCurrentPage = arguments.classCurrentPage || "current";
		this.doCarousel = (typeof arguments.doCarousel != "undefined")? arguments.doCarousel: true;
		this.elmsNavigation = arguments.elmsNavigation || null;
		this.elmsPages = arguments.elmsPages || null;
		this.idInitial = arguments.idInitial || null;
		this.oninit = arguments.oninit || null;
		this.onswitch = arguments.onswitch || null;

		//--derived attributes
		this.inProgress = true;
		if(this.idInitial !== null){
			this.elmNavigationCurrent = this.callbackGetNavigationForID(this.idInitial);
			this.elmPageCurrent = this.callbackGetPageForID(this.idInitial);
		}else{
			if(this.elmsNavigation)
				this.elmCurrentNavigation = elmsNavigation.hasClass(this.classCurrentNavigation);
		}
		if(!this.elmPageCurrent)
			this.elmPageCurrent = this.elmsPages.first();
		if(!this.elmNavigationCurrent && this.elmsNavigation)
			this.elmNavigationCurrent = this.callbackGetNavigationForID(this.elmPageCurrent.id);
		this.setClasses();
			
		//--do something
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.Pager.prototype.setClasses = function(){
		if(this.elmsNavigation){
			this.elmsNavigation.removeClass(this.classCurrentNavigation);
			if(this.elmNavigationCurrent)
				this.elmNavigationCurrent.addClass(this.classCurrentNavigation);
		}
		if(this.elmsPages){
			this.elmsPages.removeClass(this.classCurrentPage);
			if(this.elmPageCurrent)
				this.elmPageCurrent.addClass(this.classCurrentPage);
		}
	}
	__.classes.Pager.prototype.switche = function(arguments){
		var localvars = arguments || {};
		if(this.onswitch)
			this.onswitch.call(this, localvars);
		else{
			this.elmNavigationCurrent = localvars.elmNavigationNext;
			this.elmPageCurrent = localvars.elmPageNext;
			this.setClasses();
		}
	}
	__.classes.Pager.prototype.switchToID = function(argId){
		var localvars = {};
		localvars.elmNavigationNext = this.callbackGetNavigationForID(argId);
		localvars.elmPageNext = this.callbackGetPageForID(argId);
		this.switche(localvars);
	}
	__.classes.Pager.prototype.switchToPrevious = function(){
		var localvars = {};
		localvars.elmPageNext = this.elmPageCurrent.prev();
		if(localvars.elmPageNext.length == 0 && this.doCarousel)
			localvars.elmPageNext = this.elmsPages.last();
		if(localvars.elmPageNext.length > 0){
			localvars.elmNavigationNext = this.callbackGetNavigationForID(localvars.elmPageNext.attr(this.attrId));
			this.switche(localvars);
			return true;
		}else
			return false;

	}
	__.classes.Pager.prototype.switchToNext = function(){
		var localvars = {};
		localvars.elmPageNext = this.elmPageCurrent.next();
		if(localvars.elmPageNext.length == 0 && this.doCarousel)
			localvars.elmPageNext = this.elmsPages.first();
		if(localvars.elmPageNext.length > 0){
			localvars.elmNavigationNext = this.callbackGetNavigationForID(localvars.elmPageNext.attr(this.attrId));
			this.switche(localvars);
			return true;
		}else
			return false;

	}
	__.classes.Pager.prototype.defaultCallbackGetNavigationForID = function(argId){
		if(this.elmsNavigation){
			var fncThis = this;
			var fncReturn = jQuery(this.elmsNavigation.filter("[href='#"+__.lib.escapeHash(argId)+"']"));
			return (fncReturn.length > 0)? fncReturn: false;
		}
		return false;
	}
	__.classes.Pager.prototype.defaultCallbackGetPageForID = function(argId){
		if(this.elmsPages){
			if(this.attrId == "id"){
				return document.getElementById(argId);
			}else{
				var fncReturn = this.elmsPages.filter("["+this.attrId+"='"+argId+"']");
				return (fncReturn.length > 0)? fncReturn: false;
			}
		}
	}

