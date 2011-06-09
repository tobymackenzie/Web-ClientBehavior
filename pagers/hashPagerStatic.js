/*------
-----dependencies
tmlib: addclass, removeclass, hasclass, attachListeners
-----instantiation
__.pager = new __.classes.hashPagerStatic({elmsPages: $(".pagecontentpieces .pagecontentpiece"), elmsNavigation: $(".pageswitcher li")});

------------*/


/*-------------
©pager
------------*/
__.classes.hashPagerStatic = function(arguments){
		this.elmsPages = arguments.elmsPages || false; if(!this.elmsPages || this.elmsPages.length < 1) return false;
		this.elmsNavigation = arguments.elmsNavigation || false;
			if(!this.elmsNavigation) return false;
//!			this.elmsNavigation = this.elmsNavigation.has("a[href^='#']");

		//--optional attributes
		this.boot = arguments.boot || {};	
		this.classCurrentNavigation = arguments.classCurrentNavigation || "current";
		this.classCurrentPage = arguments.classCurrentPage || "current";
		this.doUseHash = (typeof arguments.doUseHash != "undefined")? arguments.doUseHash: true;

		//--derived attributes
		this.inProgress = true;
		
		//--hide all, display first
		var elmCurrentNavigation = false;
		if(window.location.hash && this.doUseHash){
			this.idCurrent = window.location.hash;
			if(this.idCurrent.indexOf("#") == 0)
				this.idCurrent = this.idCurrent.substring(1);
			var elmCurrentNavigation = this.getElmNavigationForId(this.idCurrent);
			__.addClass(elmCurrentNavigation, this.classCurrentNavigation);

		}else{
			for(var key in this.elmsNavigation){
				if(this.elmsNavigation.hasOwnProperty(key) && __.hasClass(this.elmsNavigation[key], this.classCurrentNavigation))
					elmCurrentNavigation = this.elmsNavigation[key];
			}
		}
		if(!elmCurrentNavigation){
			elmCurrentNavigation = this.elmsNavigation[0];
			__.addClass(elmCurrentNavigation, this.classCurrentNavigation);
		}
		if(!this.idCurrent){
			this.idCurrent = this.getIDForElement(elmCurrentNavigation);
		}
		var elmPageCurrent = document.getElementById(this.idCurrent);
//!		elmCurrentPage.display = "block";
		__.addClass(elmPageCurrent, this.classCurrentPage);
		
		//--attach listeners
		this.attachListeners(this.elmsNavigation);
		
		this.inProgress = false;
	}
	__.classes.hashPagerStatic.prototype.attachListeners = function(argElements){
		var fncThis = this;
		for(var key in argElements){
			if(this.elmsNavigation.hasOwnProperty(key)){
				var elmAnchor = argElements[key].getElementsByTagName("a")[0];
				__.addListeners(elmAnchor, "click", function(event){
					if(event.preventDefault)
						event.preventDefault();
					if(!event.target)
						event.target = event.srcElement;
					fncThis.switche(fncThis.getIDForElement(event.target));
					
					return false;
				});
			}
		}
	}
	__.classes.hashPagerStatic.prototype.switche = function(argID){
		if(this.inProgress == true || argID == this.idCurrent){
			return false;
		}else{
			var fncThis = this;
			var idNext = argID;
			var elmNextNavigation = this.getElmNavigationForId(argID);
			var elmNextPage = document.getElementById(argID);
			var elmCurrentNavigation = this.getElmNavigationForId(this.idCurrent);
			var elmCurrentPage = document.getElementById(this.idCurrent);

			fncThis.inProgress = true;

			__.addClass(elmNextNavigation, fncThis.classCurrentNavigation);
//!			elmCurrentPage.display = "none";
			__.removeClass(elmCurrentPage, fncThis.classCurrentPage);
			__.removeClass(elmCurrentNavigation, fncThis.classCurrentNavigation);
//!			elmNextPage.display = "block"
			__.addClass(elmNextPage, fncThis.classCurrentPage);
			fncThis.idCurrent = idNext;
			fncThis.inProgress = false;
		}
	}
	__.classes.hashPagerStatic.prototype.getElmNavigationForId = function(argID){
		for(var key in this.elmsNavigation){
			if(this.elmsNavigation.hasOwnProperty(key) && this.getIDForElement(this.elmsNavigation[key]) == argID)
				return this.elmsNavigation[key];
		}
		return false;
	}
	__.classes.hashPagerStatic.prototype.getIDForElement = function(argElement){
		if(/^[aA]$/.test(argElement.tagName)){
			var fncElement = argElement;
		}else{
			var fncElement = argElement.getElementsByTagName("a")[0];
		}
		var fncHref = fncElement.href;
		var fncHrefSplit = fncHref.split("#");
		if(fncHrefSplit[1].indexOf("#") == 0)
			var fncReturn = fncHrefSplit[1].substring(1);
		else
			fncReturn = fncHrefSplit[1];
		return fncReturn;
	}

