/*------
dependencies: tmlib base, tmlib isiphone, jquery

style:
	.page{
		width: 100%; // width must be set to correct value when page is repositioned to get height
	}



// init
		__.pager = new __.classes.hashPagerStaticKeepHeight({elmsPages: elmsPages, elmsNavigation: $(".articlenav li"), keepHeight: $(".articlelist")});


------------*/


/*-------------
©pager
------------*/
__.classes.hashPagerStaticKeepHeight = function(arguments){
		this.elmsPages = arguments.elmsPages || false; if(!this.elmsPages || this.elmsPages.length < 1) return false;
		this.elmsNavigation = arguments.elmsNavigation || false;
			if(!this.elmsNavigation) return false;
			this.elmsNavigation = this.elmsNavigation.has("a[href^='#']");
		this.classCurrentNavigation = arguments.classCurrentNavigation || "current";
		this.classCurrentPage = arguments.classCurrentPage || "current";
		this.duration = (arguments.duration !== undefined) ? arguments.duration : 500;
		this.keepHeight = arguments.keepHeight || false;
		if(__.isIphone() == true) this.keepHeight = false;
		
		this.inProgress = true;
		
		// hide all, display first
		this.elmsPages.hide();
		var elmCurrentPage = this.elmsPages.filter("."+this.classCurrentPage);
		if(elmCurrentPage.length > 0){
			this.idCurrent = this.escapeHash(elmCurrentPage.attr("id"));
		}else{
			elmCurrentPage = this.elmsPages.first();
			this.idCurrent = this.escapeHash(elmCurrentPage.addClass(this.classCurrentPage).attr("id"));
		}
		elmCurrentPage.show();
		this.elmsNavigation.filter(this.idCurrent).addClass(this.classCurrentNavigation);
		
		// attach listeners
		this.attachListeners(this.elmsNavigation);
		
		this.inProgress = false;
	}
	__.classes.hashPagerStaticKeepHeight.prototype.attachListeners = function(argElements){
		var fncThis = this;
		argElements.bind("click", function(event){
			if(event.preventDefault)
				event.preventDefault();
			fncThis.switche(fncThis.escapeHash($(this).find("a").attr("href")));
			
			return false;
		});
	}
	__.classes.hashPagerStaticKeepHeight.prototype.switche = function(argID){
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

			if(fncThis.keepHeight){
				fncThis.keepHeight.css("height", elmCurrentPage.outerHeight());
				var nextOriginalSettings = {
					position: elmNextPage.css("position"),
					left: elmNextPage.css("left"),
					top: elmNextPage.css("top")
				}
				var heightNew = elmNextPage.css({"position":"absolute", "left":"-9000px", "top":"-1000px"}).outerHeight();
				elmNextPage.css(nextOriginalSettings);
			}
			
			elmCurrentNavigation.removeClass(fncThis.classCurrentNavigation);
			elmNextNavigation.addClass(fncThis.classCurrentNavigation);
			elmCurrentPage.removeClass(fncThis.classCurrentPage).fadeOut(this.duration, function(){
				var callbackFadeIn = function(){
					elmNextPage.fadeIn(fncThis.duration, function(){
						elmNextPage.addClass(fncThis.classCurrentPage);
						fncThis.idCurrent = idNext;
						fncThis.inProgress = false;
					});
				}
				
				if(fncThis.keepHeight){
					fncThis.keepHeight.animate({height: heightNew}, fncThis.duration, callbackFadeIn);
				}else
					callbackFadeIn.call();

			});
		}
	}
	// allows using slashes in the hash
	__.classes.hashPagerStaticKeepHeight.prototype.escapeHash = function(hash){
		return hash.replace(/\//g, "\\/");
	}




