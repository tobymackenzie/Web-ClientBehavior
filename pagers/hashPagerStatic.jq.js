/*------
external access

__.pager = new __.classes.hashPagerStatic({elmsPages: $(".pagecontentpieces .pagecontentpiece"), elmsNavigation: $(".pageswitcher li")});

------------*/


/*-------------
©pager
------------*/
__.classes.hashPagerStatic = function(args){
		this.boot = args.boot || {};
		this.elmsPages = args.elmsPages || false; if(!this.elmsPages || this.elmsPages.length < 1) return false;
		this.elmsNavigation = args.elmsNavigation || false;
			if(!this.elmsNavigation) return false;
			this.elmsNavigation = this.elmsNavigation.has("a[href^='#']");
		this.classCurrentNavigation = args.classCurrentNavigation || "current";
		this.classCurrentPage = args.classCurrentPage || "current";
		this.duration = (args.duration !== undefined) ? args.duration : 500;
		this.onpreswitch = args.onpreswitch || false;
		this.onpostswitch = args.onpostswitch || false;
		
		this.inProgress = true;
		
		// hide all, display first
		this.elmsPages.hide();
		if(window.location.hash){
			this.idCurrent = window.location.hash;
			this.elmsNavigation.has("a[href="+window.location.hash+"]").addClass(this.classCurrentNavigation);
		}else{
			var elmCurrentNavigation = this.elmsNavigation.filter("."+this.classCurrentNavigation);
			if(elmCurrentNavigation.length > 0){
				this.idCurrent = elmCurrentNavigation.find("a").attr("href");
			}else{
				this.idCurrent = this.elmsNavigation.first().addClass(this.classCurrentNavigation).find("a").attr("href");
			}
		}
		this.elmsPages.filter(__.lib.escapeHash(this.idCurrent)).show().addClass(this.classCurrentPage);
		
		// attach listeners
		this.attachListeners(this.elmsNavigation);
		
		this.inProgress = false;
	}
	__.classes.hashPagerStatic.prototype.attachListeners = function(argElements){
		var fncThis = this;
		argElements.bind("click", function(event){
			if(event.preventDefault)
				event.preventDefault();
			fncThis.switche(jQuery(this).find("a").attr("href"));
			
			return false;
		});
	}
	__.classes.hashPagerStatic.prototype.switche = function(argID){
		if(this.inProgress == true || argID == this.idCurrent){
			return false;
		}else{
			var fncThis = this;
			var localvars = {};
			localvars.idNext = argID;
			localvars.elmNextNavigation = this.elmsNavigation.has("a[href='"+argID+"']");
			localvars.elmNextPage = this.elmsPages.filter(__.lib.escapeHash(argID));
			localvars.elmCurrentNavigation = this.elmsNavigation.filter("."+this.classCurrentNavigation);
			localvars.elmCurrentPage = this.elmsPages.filter("."+this.classCurrentPage);

			fncThis.inProgress = true;

			if(this.onpreswitch)
				this.onpreswitch.call(this, localvars);

			localvars.elmNextNavigation.addClass(fncThis.classCurrentNavigation);
			localvars.elmCurrentPage.removeClass(fncThis.classCurrentPage).hide(this.duration, function(){
				localvars.elmCurrentNavigation.removeClass(fncThis.classCurrentNavigation);
				localvars.elmNextPage.show(fncThis.duration, function(){
					localvars.elmNextPage.addClass(fncThis.classCurrentPage);
					fncThis.idCurrent = localvars.idNext;
					fncThis.inProgress = false;
					if(fncThis.onpostswitch)
						fncThis.onpostswitch.call(fncThis, localvars);
				});
			});
		}
	}

