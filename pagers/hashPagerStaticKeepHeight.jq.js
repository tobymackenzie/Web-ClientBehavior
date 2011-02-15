/*------
dependencies: tmlib base, tmlib isiphone, jquery

style:
	.page{
		width: 100%; // width must be set to correct value when page is repositioned to get height
	}
	.pointer{
		position: absolute;
		top: -14px;
		height: -14px;
	}
	

// init
if(typeof $ != 'undefined'){
	$(function(){
		var elmsPages = $("#maincontent .homecolumns .page");
		if(elmsPages.length > 0)
			__.pager = new __.classes.hashPagerStaticKeepHeight({elmsPages: elmsPages, selectorNavigation: ".pager.navigation .topitem"
				,callbackInit: function(){
					var elmCurrentNavigation = this.elmsNavigation.filter("."+this.classCurrentNavigation);
					var newPosition = elmCurrentNavigation.position().left + elmCurrentNavigation.outerWidth()/2 - this.boot.elmPointer.outerWidth()/2;
					this.boot.elmPointer.css({left: newPosition});
				}
				,callbackPreSwitch: function(arguments){
					var newPosition = arguments.elmNextNavigation.position().left + arguments.elmNextNavigation.outerWidth()/2 - this.boot.elmPointer.outerWidth()/2;
					this.boot.elmPointer.animate({left: newPosition}, this.duration);
				}
				,boot: {elmPointer: $(".pager.navigation .pointer")}
			});
	});
}


------------*/


/*-------------
©pager
------------*/
__.classes.hashPagerStaticKeepHeight = function(arguments){
		this.elmsPages = arguments.elmsPages || false; if(!this.elmsPages || this.elmsPages.length < 1) return false;
//->return
		this.selectorNavigation = arguments.selectorNavigation || false;
			if(!this.selectorNavigation) return false;
//->return
			this.elmsNavigation = $(this.selectorNavigation);
			this.elmsNavigation = this.elmsNavigation.has("a[href^='#']");
		this.classCurrentNavigation = arguments.classCurrentNavigation || "current";
		this.classCurrentPage = arguments.classCurrentPage || "current";
		this.duration = (arguments.duration !== undefined) ? arguments.duration : 500;
		this.keepHeight = arguments.keepHeight || false;
		if(__.isIphone() == true) this.keepHeight = false;
		this.callbackInit = arguments.callbackInit || null;
		this.callbackPreSwitch = arguments.callbackPreSwitch || null;
		this.boot = arguments.boot || null;

		this.inProgress = true;
		
		// hide all, display first
		this.elmsPages.hide();
		var elmCurrentPage = this.elmsPages.filter("."+this.classCurrentPage);
		if(elmCurrentPage.length > 0){
			this.idCurrent = "#"+this.escapeHash(elmCurrentPage.attr("id"));
		}else{
			elmCurrentPage = this.elmsPages.first();
			this.idCurrent = "#"+this.escapeHash(elmCurrentPage.addClass(this.classCurrentPage).attr("id"));
		}
		elmCurrentPage.show();
		this.elmsNavigation.children("a").filter("[href='"+this.unescapeHash(this.idCurrent)+"']").closest(this.selectorNavigation).addClass(this.classCurrentNavigation);
		
		// attach listeners
		this.attachListeners(this.elmsNavigation);
		
		this.inProgress = false;
		
		if(this.callbackInit)
			this.callbackInit.call(this);
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
			
			if(fncThis.callbackPreSwitch)
				fncThis.callbackPreSwitch.call(this, {elmNextNavigation: elmNextNavigation, elmNextPage: elmNextPage, elmCurrentNavigation: elmCurrentNavigation, elmCurrentPage: elmCurrentPage});
			
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
	__.classes.hashPagerStaticKeepHeight.prototype.unescapeHash = function(hash){
		return hash.replace(/\\\//g, "\/");
	}





