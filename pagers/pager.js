/*
basic pager with navigation and pages collection
-----dependencies
tmlib addClass, removeClass
-----parameters
-----instantiation
__.pager = new __.classes.pager({elmsPages: document.getElementById("maincontent").getElementsByClassName("tabpage"), elmsNavigation: document.getElementById("maincontent").getElementsByClassName("tab")});
-----html
-----css
*/

/*-------
©pager
-------- */
__.classes.pager = function(args){
		//--required attributes
//->return
		//--optional attributes
		this.attrId = args.attrId || "id";
		this.boot = args.boot || {};
		this.callbackGetCurrentNavigation = args.callbackGetCurrentNavigation || this.defaultCallbackGetCurrentNavigation;
		this.callbackGetCurrentPage = args.callbackGetCurrentPage || this.defaultCallbackGetCurrentPage;
		this.classCurrentNavigation = args.classCurrentNavigation || "current";
		this.classCurrentPage = args.classCurrentPage || "current";
		this.elmsNavigation = args.elmsNavigation || null;
		this.elmsPages = args.elmsPages || null;
		this.idInitial = args.idInitial || null;
		this.oninit = args.oninit || null;
		this.onswitch = args.onswitch || null;

		//--derived attributes
		this.inProgress = true;
		if(this.idInitial !== null){
			this.elmNavigationCurrent = this.callbackGetCurrentNavigation(this.idInitial);
			this.elmPageCurrent = this.callbackGetCurrentPage(this.idInitial);
		}else{
			for(var key in this.elmsNavigation){
				if(this.elmsNavigation.hasOwnProperty(key) && __.hasClass(this.elmsNavigation[key], this.classCurrentNavigation))
					this.elmNavigationCurrent = this.elmsNavigation[key];
			}
		}
		if(!this.elmPageCurrent)
			this.elmPageCurrent = this.elmsPages[0];
		if(!this.elmNavigationCurrent && this.elmsNavigation)
			this.elmNavigationCurrent = this.callbackGetCurrentNavigation(this.elmPageCurrent.id);
		this.setClasses();
			
		//--do something
		if(this.oninit)
			this.oninit.call(fncThis);
	}
	__.classes.pager.prototype.setClasses = function(){
		if(this.elmsNavigation){
			for(var key in this.elmsNavigation){
				if(this.elmsNavigation.hasOwnProperty(key) && this.elmsNavigation[key].getElementsByTagName){
					__.removeClass(this.elmsNavigation[key], this.classCurrentNavigation);
				}
			}
			if(this.elmNavigationCurrent)
				__.addClass(this.elmNavigationCurrent, this.classCurrentNavigation);
		}
		if(this.elmsPages){
			for(var key in this.elmsPages){
				if(this.elmsPages.hasOwnProperty(key) && this.elmsPages[key].getElementsByTagName){
					__.removeClass(this.elmsPages[key], this.classCurrentPage);
				}
			}
			if(this.elmPageCurrent)
				__.addClass(this.elmPageCurrent, this.classCurrentPage);
		}
	}
	__.classes.pager.prototype.switche = function(argId){
		this.elmNavigationCurrent = this.callbackGetCurrentNavigation(argId);
		this.elmPageCurrent = this.callbackGetCurrentPage(argId);
		if(this.onswitch)
			this.onswitch.call(this);
		else
			this.setClasses();
	}
	__.classes.pager.prototype.defaultCallbackGetCurrentNavigation = function(argId){
		if(this.elmsNavigation){
			for(var key in this.elmsNavigation){
				if(this.elmsNavigation.hasOwnProperty(key) && this.elmsNavigation[key].getElementsByTagName){
					var fncHref = this.getIDForNavigation(this.elmsNavigation[key]);
					if(fncHref == argId)
						return this.elmsNavigation[key];
				}
			}
		}
		return false;
	}
	__.classes.pager.prototype.defaultCallbackGetCurrentPage = function(argId){
		if(this.elmsPages){
			if(this.attrId == "id"){
				return document.getElementById(argId);
			}else{
				for(var key in this.elmsPages){
					if(this.elmsPages.hasOwnProperty(key) && typeof this.elmsPages[key].id != "undefined"){
						var fncId = this.elmsPages[key].getAttribute(this.attrId);
						if(fncId == argId)
							return this.elmsPages[key];
					}
				}
			}
		}
	}
	__.classes.pager.prototype.getIDForNavigation = function(argElement){
		if(argElement.href)
			var fncElement = argElement;
		else
			var fncElement = argElement.getElementsByTagName("a")[0];
		var fncHrefSplit = fncElement.href.split("#");
		if(fncHrefSplit[1].indexOf("#") == 0)
			var fncReturn = fncHrefSplit[1].substring(1);
		else
			fncReturn = fncHrefSplit[1];
		return fncReturn;
	}

