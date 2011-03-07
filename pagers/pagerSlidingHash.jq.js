/*
slides new "pages" into view while sliding old out

depends on: tmlib base, jquery
params: arguments array: array of arguments
		elmsNavigation $element: container of navigation, supply only to auto-display on init, allowing hiding for non-js browsers

---css:
.container{
	position: relative; /*- non static
	width: 100px;
	height: 100px;
}
.page{
	display: none;
	position: absolute;
	top: 0;
	left: 0;
	width: 100px; /- same as above
	height: 100%;
}
.page.current{
	display: block;
}
.navigation{
	display: none;
}
body.hasjavascript .navigation{
	display: block;
}


---init
if(typeof $ !== 'undefined')
	$(document).ready(function(){
//		__.pageid = $("body").attr("id");
		var elmsBanners = $("#banner .banners .banner");
		if(elmsBanners.length > 0)
			__.bannerPager = new __.classes.pagerSlidingHash({elmsPages:elmsBanners, itemSelector:".banner", elmPreviousButton:$("#banner .navigation .previous"), elmNextButton:$("#banner .navigation .next"), elmsItemNavigation: $("#banner .navigation li"), regexHash: {find: /(#[\w-_])/, replace: "$1"}, callbackPreSlide: function(elmNewPage){
					var fncThis = this;
					var newTitle = elmNewPage.attr("data-title");
					this.boot.elmTitle.fadeOut(this.duration, function(){
						fncThis.boot.elmTitle.html(newTitle).fadeIn(fncThis.duration);
					});
				}
			});
	});

*/


/* --------
©pagerSlidingHash
------- */
__.classes.pagerSlidingHash = function(arguments){
		var fncThis = this;
		this.elmsPages = arguments.elmsPages || null;
		this.elmNavigation = arguments.elmNavigation || null;
		this.elmPreviousButton = arguments.elmPreviousButton || null;
		this.elmNextButton = arguments.elmNextButton || null;
		this.elmsItemNavigation = arguments.elmsItemNavigation || null;
		this.itemSelector = (arguments.itemSelector !== undefined)? arguments.itemSelector: "item";
		this.classCurrentItem = (arguments.classCurrentItem !== undefined)? arguments.classCurrentItem: "selected";
		this.classPreviousItem = (arguments.classPreviousItem !== undefined)? arguments.classPreviousItem: "previous";
		this.classNextItem = (arguments.classNextItem !== undefined)? arguments.classNextItem: "next";
		this.classCurrentNavItem = arguments.classCurrentNavItem || "current";
		this.classDisabled = arguments.classDisabled || "disabled";
		this.classEnabled = arguments.classEnabled || "enabled";
		this.regexHash = arguments.regexHash || false;
		this.duration = (arguments.duration !== undefined)? arguments.duration: 500;
		this.contentWidth = (arguments.contentWidth !== undefined)? arguments.contentWidth: 960;
		this.contentLeft = arguments.contentLeft || 0;
		this.elmNavigationPointer = arguments.elmNavigationPointer || null;
		this.elmNavigationOrientation = arguments.elmNavigationOrientation || "horizontal";
		this.callbackPreSlide = arguments.callbackPreSlide || null;
		this.callbackPostSlide = arguments.callbackPostSlide || null;
		this.boot = arguments.boot || null;
		
		// set up current pages
		if(window.location.hash){
			this.elmCurrent = this.elmsPages.filter(this.parsePath(window.location.hash)).addClass(this.classCurrentItem);
		}else{
			this.elmCurrent = this.elmsPages.filter("."+this.classCurrentItem);
			if(this.elmCurrent.length < 1){
				this.elmCurrent = this.elmsPages.first();
				this.elmCurrent.addClass(this.classCurrentItem);
			}
		}
		
		// show navigation
		if(this.elmNavigation)
			this.elmNavigation.show();
		
		// set up page offsets
/* for whole body
		this.pageOffsetLeft = (arguments.contentLeft)? 0: this.elmCurrent.offset().left;
		if(!arguments.contentLeft){
			this.pageOffsetRight = (arguments.contentLeft)?false:$("body").outerWidth();
			
		}
*/
		this.pageOffsetLeft = arguments.pageOffsetLeft || 0;
		this.pageOffsetRight = arguments.pageOffsetRight || 0;
		
		// set up non-current pages
		var elmsPrevious = this.elmsPages.filter("."+this.classCurrentItem).prevAll()
		elmsPrevious.addClass(this.classPreviousItem);
		var elmsNext = this.elmsPages.filter("."+this.classCurrentItem).nextAll()
		elmsNext.addClass(this.classNextItem);
		elmsPrevious.css({"left":0 - this.pageOffsetLeft - this.contentWidth, "display":"none"});
		elmsNext.css({"left":this.pageOffsetRight + this.contentWidth, "display":"none"});
		
		// set up relative navigation
		this.updateRelativeNavigation(0);
		
		this.inprogress = 0;
		
		this.attachEvents();
	}
	__.classes.pagerSlidingHash.prototype.attachEvents = function(){
		var fncThis = this;
		if(fncThis.elmPreviousButton){
			fncThis.elmPreviousButton.children("a").bind("click", function(){
				if(fncThis.inprogress == 0 && $(this).attr("href")){
					fncThis.inprogress = 1;
					if(!fncThis.switchPagesByID(fncThis.parsePath(fncThis.elmPreviousButton.children("a").attr("href"))))
						fncThis.inprogress = 0;
				}
				return false;
			});
		}
		if(fncThis.elmNextButton){
			fncThis.elmNextButton.children("a").bind("click", function(){
				if(fncThis.inprogress == 0 && $(this).attr("href")){
					fncThis.inprogress = 1;
					if(!fncThis.switchPagesByID(fncThis.parsePath(fncThis.elmNextButton.children("a").attr("href"))))
						fncThis.inprogress = 0;
				}
				return false;
			});
		}
		if(fncThis.elmsItemNavigation){
			fncThis.elmsItemNavigation.bind("click", function(){
				if(fncThis.inprogress == 0){
					fncThis.inprogress = 1;
					if(!fncThis.switchPagesByID(fncThis.parsePath($(this).children("a").attr("href"))))
						fncThis.inprogress = 0;
				}
				return false;
			});
		}
	}
	__.classes.pagerSlidingHash.prototype.switchPagesByID = function(id){
		var elmNewPage = this.elmsPages.filter("#"+id);
		return this.switchPages(elmNewPage);
	}
	__.classes.pagerSlidingHash.prototype.switchPages = function(elmNewPage){
		if(elmNewPage[0] == this.elmCurrent[0]) return false;
		var fncThis = this;
		var callback = function(){
			fncThis.elmCurrent.removeClass(fncThis.classCurrentItem);
			elmNewPage.removeClass(fncThis.classNextItem).removeClass(fncThis.classPreviousItem).addClass(fncThis.classCurrentItem);
			fncThis.elmCurrent = elmNewPage;
			
			var elmsPagesLength = fncThis.elmsPages.length;
			var elmIndexCurrent = fncThis.getPageIndex(elmNewPage);
			// set all previous elements to previous
			for(var i = 0; i < elmIndexCurrent; ++i){
				$(fncThis.elmsPages[i]).removeClass(fncThis.classNextItem).addClass(fncThis.classPreviousItem).css({"display":"none"});
			}
			// set all next elements to next
			for(var i = elmIndexCurrent + 1; i < elmsPagesLength; ++i){
				$(fncThis.elmsPages[i]).addClass(fncThis.classNextItem).removeClass(fncThis.classPreviousItem).css({"display":"none"});
			}

			if(fncThis.callbackPostSlide)
				fncThis.callbackPostSlide.call(this);

			fncThis.updateRelativeNavigation();
			
			fncThis.inprogress = 0;
		}
		
		// call preslide callback
		if(fncThis.callbackPreSlide)
			fncThis.callbackPreSlide.call(this, elmNewPage);
		
		// swap pieces
		if(elmNewPage.hasClass(fncThis.classNextItem)){
			// animate left
			fncThis.elmCurrent.css({"display":"block"}).animate({left: 0 - fncThis.pageOffsetLeft - fncThis.contentWidth}, fncThis.duration)
			elmNewPage.css({"display":"block", "left":this.pageOffsetRight + this.contentWidth}).animate({left: fncThis.contentLeft}, fncThis.duration+1, callback);
		}
		else{
			// animate right
			fncThis.elmCurrent.css("display","block").animate({left: this.pageOffsetRight + this.contentWidth}, fncThis.duration)
			elmNewPage.css({"display":"block", "left":0 - this.pageOffsetLeft - this.contentWidth}).animate({left: fncThis.contentLeft}, fncThis.duration, callback);
		}
		
		
		return true;
	}
	__.classes.pagerSlidingHash.prototype.updateRelativeNavigation = function(argDuration){
		fncDuration = (typeof argDuration !== 'undefined')? argDuration: this.duration;

		if(this.elmPreviousButton){
			var previousURL = "#"+this.elmCurrent.prev(this.itemSelector).attr("id");
			if(previousURL != "#undefined")
				this.elmPreviousButton.removeClass(this.classDisabled).addClass(this.classEnabled).children("a").attr("href", previousURL);
			else
				this.elmPreviousButton.removeClass(this.classEnabled).addClass(this.classDisabled).children("a").attr("href", "");
		}
		if(this.elmNextButton){
		var nextURL = "#"+this.elmCurrent.next(this.itemSelector).attr("id");
			if(nextURL != "#undefined")
				this.elmNextButton.removeClass(this.classDisabled).addClass(this.classEnabled).children("a").attr("href", nextURL);
			else
				this.elmNextButton.removeClass(this.classEnabled).addClass(this.classDisabled).children("a").attr("href", "");
		}

		
		// set up current navigation item
		if(this.elmsItemNavigation)
			this.elmsItemNavigation.removeClass(this.classCurrentNavItem).has("[href=#"+this.elmCurrent.attr("id")+"]").addClass(this.classCurrentNavItem);
		if(this.elmsItemNavigation && this.elmNavigationPointer){
			fncThis.pointToCurrentNavigation(this.elmsItemNavigation.filter("."+this.classCurrentNavItem));
			fncThis.elmNavigationPointer.css("display","block");
		}
	}
	__.classes.pagerSlidingHash.prototype.getPageIndex = function(argElement){
		var arrayLength = this.elmsPages.length;
		for(i=0;i<arrayLength;++i){
			if(this.elmsPages[i] == argElement[0]){
				return i;
			}
		}
	}
	__.classes.pagerSlidingHash.prototype.pointToCurrentNavigation = function(argID){
		if(this.elmsItemNavigation){
			var currentItem = this.elmsItemNavigation.filter("["+this.attrID+"="+argID+"]");
			this.elmsItemNavigation.filter(".selected").removeClass("selected");
			currentItem.addClass("selected");
			if(this.elmNavigationPointer){
				switch(this.elmNavigationOrientation){
					case "horizontal":
						this.elmNavigationPointer.animate({left: currentItem.position().left + currentItem.width()/2}, this.duration);
						break;
					case "vertical":
						this.elmNavigationPointer.animate({top: currentItem.position().top + currentItem.height()/2}, this.duration);
						break;
				}
			}
		}
	}
	__.classes.pagerSlidingHash.prototype.parsePath = function(path){
		if(this.regexHash)
			path = path.replace(this.regexHash.find, this.regexHash.replace);
		return this.parsePath(path);
	}
	// allows using slashes in the hash
	__.classes.pagerSlidingHash.prototype.escapeHash = function(hash){
		return hash.replace(/\//g, "\\/");
	}
	__.classes.pagerSlidingHash.prototype.unescapeHash = function(hash){
		return hash.replace(/\\\//g, "\/");
	}

	/* notes:
	display changed for ie6 and 7 only so that scrollbar doesn't appear except on page change
	*/


