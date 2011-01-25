/*------
external access

__.pager = new __.classes.hashPagerStatic({elmsPages: $(".pagecontentpieces .pagecontentpiece"), elmsNavigation: $(".pageswitcher li")});

------------*/


/*-------------
©pager
------------*/
__.classes.hashPagerStatic = function(arguments){
		this.elmsPages = arguments.elmsPages || false; if(!this.elmsPages || this.elmsPages.length < 1) return false;
		this.elmsNavigation = arguments.elmsNavigation || false;
			if(!this.elmsNavigation) return false;
			this.elmsNavigation = this.elmsNavigation.has("a[href^='#']");
		this.classCurrentNavigation = arguments.classCurrentNavigation || "current";
		this.classCurrentPage = arguments.classCurrentPage || "current";
		this.duration = (arguments.duration !== undefined) ? arguments.duration : 500;
		
		this.inProgress = true;
		
		// hide all, display first
		this.elmsPages.hide();
		var elmCurrentNavigation = this.elmsNavigation.filter("."+this.classCurrentNavigation);
		if(elmCurrentNavigation.length > 0){
			this.idCurrent = elmCurrentNavigation.find("a").attr("href");
		}else{
			this.idCurrent = this.elmsNavigation.first().addClass(this.classCurrentNavigation).find("a").attr("href");
		}
		this.elmsPages.filter(this.idCurrent).show().addClass(this.classCurrentPage);
		
		// attach listeners
		this.attachListeners(this.elmsNavigation);
		
		this.inProgress = false;
	}
	__.classes.hashPagerStatic.prototype.attachListeners = function(argElements){
		var fncThis = this;
		argElements.bind("click", function(event){
			if(event.preventDefault)
				event.preventDefault();
			fncThis.switche($(this).find("a").attr("href"));
			
			return false;
		});
	}
	__.classes.hashPagerStatic.prototype.switche = function(argID){
		if(this.inProgress == true || argID == this.idCurrent){
			return false;
		}else{
			var fncThis = this;
			var idNext = argID;
			var elmNextNavigation = this.elmsNavigation.has("a[href='"+argID+"']");
			var elmNextPage = this.elmsPages.filter(argID);
			var elmCurrentNavigation = this.elmsNavigation.filter("."+this.classCurrentNavigation);
			var elmCurrentPage = this.elmsPages.filter("."+this.classCurrentPage);

			fncThis.inProgress = true;

			elmNextNavigation.addClass(fncThis.classCurrentNavigation);
			elmCurrentPage.removeClass(fncThis.classCurrentPage).hide(this.duration, function(){
				elmCurrentNavigation.removeClass(fncThis.classCurrentNavigation);
				elmNextPage.show(fncThis.duration, function(){
					elmNextPage.addClass(fncThis.classCurrentPage);
					fncThis.idCurrent = idNext;
					fncThis.inProgress = false;
				});
			});
		}
	}


