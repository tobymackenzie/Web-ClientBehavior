/*------
-----dependencies
tmlib (un)escapehash, isiphone
jquery

-----style
	.page{
		width: 100%; // width must be set to correct value when page is repositioned to get height
	}
	.pointer{
		position: absolute;
		top: -14px;
		height: -14px;
	}
	

-----instantiation
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
__.classes.hashPagerStaticKeepHeight = function(args){
		this.elmsPages = args.elmsPages || false; if(!this.elmsPages || this.elmsPages.length < 1) return false;
//->return
		this.selectorNavigation = args.selectorNavigation || false;
			if(!this.selectorNavigation) return false;
//->return
		this.elmsNavigation = jQuery(this.selectorNavigation);
		this.elmsNavigation = this.elmsNavigation.has("a[href^='#']");
		this.classCurrentNavigation = args.classCurrentNavigation || "current";
		this.classCurrentPage = args.classCurrentPage || "current";
		this.dimKeepDimensionsAddedHeight = args.dimKeepDimensionsAddedHeight || 0;
		this.duration = (args.duration !== undefined) ? args.duration : 500;
		this.keepHeight = args.keepHeight || false;
		if(__.ua.isIphone() == true) this.keepHeight = false;
		this.callbackInit = args.callbackInit || null;
		this.callbackPreSwitch = args.callbackPreSwitch || null;
		this.boot = args.boot || {};

		this.inProgress = true;
		
		// hide all, display first
		this.elmsPages.hide();
		if(window.location.hash){
			this.idCurrent = window.location.hash;
			var elmCurrentPage = this.elmsPages.filter(__.lib.escapeHash(window.location.hash));
		}else{
			var elmCurrentPage = this.elmsPages.filter("."+this.classCurrentPage);
			if(elmCurrentPage.length > 0){
				this.idCurrent = "#"+elmCurrentPage.attr("id");
			}else{
				elmCurrentPage = this.elmsPages.first();
				this.idCurrent = "#"+elmCurrentPage.attr("id");
			}
		}
		this.elmsPages.removeClass(this.classCurrentPage);
		elmCurrentPage.show().addClass(this.classCurrentPage);
		this.elmsNavigation.children("a").closest(this.selectorNavigation).removeClass(this.classCurrentNavigation)
		this.elmsNavigation.children("a").filter("[href='"+this.idCurrent+"']").closest(this.selectorNavigation).addClass(this.classCurrentNavigation);
		
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

			var elmThis = jQuery(this);
			if(elmThis.is("a"))
				var elmA = elmThis;
			else
				var elmA = elmThis.find("a");
			
			fncThis.switche(elmA.attr("href"));

			
			return false;
		});
	}
	__.classes.hashPagerStaticKeepHeight.prototype.switchToPrevious = function(){
		var elmCurrentNavigation = this.elmsNavigation.filter("."+this.classCurrentNavigation);
		var elmPreviousNavigation = elmCurrentNavigation.prev();
		if(elmPreviousNavigation.length > 0){
			var elmNavigationToSwitchTo = elmPreviousNavigation;
		}else{
			var elmNavigationToSwitchTo = this.elmsNavigation.last();
		}
		this.switche(elmNavigationToSwitchTo.find("a").attr("href"));
	}
	__.classes.hashPagerStaticKeepHeight.prototype.switchToNext = function(){
		var elmCurrentNavigation = this.elmsNavigation.filter("."+this.classCurrentNavigation);
		var elmNextNavigation = elmCurrentNavigation.next();
		if(elmNextNavigation.length > 0){
			var elmNavigationToSwitchTo = elmNextNavigation;
		}else{
			var elmNavigationToSwitchTo = this.elmsNavigation.first();
		}
		this.switche(elmNavigationToSwitchTo.find("a").attr("href"));
	}
	__.classes.hashPagerStaticKeepHeight.prototype.switche = function(argID){
		if(this.inProgress == true || argID == this.idCurrent){
			return false;
		}else{
			var fncThis = this;
			var idNext = argID;
			var elmNextNavigation = this.elmsNavigation.has("a[href='"+argID+"']");
			var elmNextPage = this.elmsPages.filter(__.lib.escapeHash(argID));
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
				var heightNew = elmNextPage.css({"position":"absolute", "left":"-9000px", "top":"-1000px"}).outerHeight() + fncThis.dimKeepDimensionsAddedHeight;
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

