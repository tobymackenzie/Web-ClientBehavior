/* --------
slides new "pages" into view while sliding old out
depends on: tmlib base, jquery

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

---init:
$(function(){
	var elmsBanners = $("#bannerbox .banners .banner");
	if(elmsBanners.length > 0){
		__.bannerPager = new __.classes.pagerSlidingHash({elmsPages:elmsBanners, itemSelector:".banner", elmNavigation: $("#bannerbox .navigation"), elmPreviousButton:$("#bannerbox .navigation .previous"), elmNextButton:$("#bannerbox .navigation .next"), elmsItemNavigation: $("#bannerbox .navigation li")
		});
	}
});
------- */
/*-----
©pagerSliding
-----*/
__.classes.pagerSliding = function(arguments){
		var fncThis = this;
		this.elmsPages = arguments.elmsPages || null;
		this.elmPreviousButton = arguments.elmPreviousButton || null;
		this.elmNextButton = arguments.elmNextButton || null;
		this.elmsItemNavigation = arguments.elmsItemNavigation || null;
		this.linkPathRegex = (arguments.linkPathRegex !== undefined)? arguments.linkPathRegex: /(\d+)/;
		this.itemSelector = (arguments.itemSelector !== undefined)? arguments.itemSelector: "item";
		this.classCurrentItem = (arguments.classCurrentItem !== undefined)? arguments.classCurrentItem: "selected";
		this.classPreviousItem = (arguments.classPreviousItem !== undefined)? arguments.classPreviousItem: "previous";
		this.nextClass = (arguments.nextClass !== undefined)? arguments.nextClass: "next";
		this.attrID = (arguments.attrID !== undefined)? arguments.attrID: "data-id";
		this.attrPreviousURL = (arguments.attrPreviousURL !== undefined)? arguments.attrPreviousURL: "data-previous-url";
		this.attrNextURL = (arguments.attrNextURL !== undefined)? arguments.attrNextURL: "data-next-url";
		this.duration = (arguments.duration !== undefined)? arguments.duration: 500;
		this.contentWidth = (arguments.contentWidth !== undefined)? arguments.contentWidth: 960;
		this.contentLeft = arguments.contentLeft || 0;
		this.elmNavigationPointer = arguments.elmNavigationPointer || null;
		this.elmNavigationOrientation = arguments.elmNavigationOrientation || "horizontal";
		
		this.elmCurrent = this.elmsPages.filter("."+this.classCurrentItem);
		this.pageOffsetLeft = (arguments.contentLeft)? 0: this.elmCurrent.offset().left;
		if(this.elmCurrent.length < 1)
			this.elmCurrent = elmsPages.first();
		if(!arguments.contentLeft){
			this.pageOffsetRight = (arguments.contentLeft)?false:jQuery("body").outerWidth();
			
		}
		this.elmsPages.filter("."+this.classPreviousItem).css({"left":0 - this.pageOffsetLeft - this.contentWidth, "display":"none"});
		this.elmsPages.filter("."+this.nextClass).css({"left":this.pageOffsetRight + this.contentWidth, "display":"none"});
		if(this.elmsItemNavigation && this.elmNavigationPointer){
			fncThis.pointToCurrentNavigation(this.elmsItemNavigation.filter(".selected").attr(fncThis.attrID));
			fncThis.elmNavigationPointer.css("display","block");
/* used if navigation items contain images with no specified widths, for Webkit to properly handle widths
			var currentItem = this.elmsItemNavigation.filter(".selected");
			var lastItemImage = this.elmsItemNavigation.last().find("img");
			var callback = function(){
				if(currentItem.width() > 0 && currentItem.height() > 0){
					fncThis.pointToCurrentNavigation(currentItem.attr(fncThis.attrID));
					fncThis.elmNavigationPointer.css("display","block");
				}
				else
					setTimeout(callback, 100);
			}
			lastItemImage.load(callback);
*/
		}
		
		this.inprogress = 0;
		
		this.attachEvents();
	}
	__.classes.pagerSliding.prototype.attachEvents = function(){
		var fncThis = this;
		if(fncThis.elmPreviousButton){
			fncThis.elmPreviousButton.children("a").bind("click", function(){
				if(fncThis.inprogress == 0){
					fncThis.inprogress = 1;
					if(!fncThis.switchPagesByID(fncThis.parsePath(fncThis.elmPreviousButton.children("a").attr("href"))))
						fncThis.inprogress = 0;
				}
				return false;
			});
		}
		if(fncThis.elmNextButton){
			fncThis.elmNextButton.children("a").bind("click", function(){
				if(fncThis.inprogress == 0){
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
					if(!fncThis.switchPagesByID(fncThis.parsePath(jQuery(this).children("a").attr("href"))))
						fncThis.inprogress = 0;
				}
				return false;
			});
		}
	}
	__.classes.pagerSliding.prototype.switchPagesByID = function(id){
		var elmNewPage = this.elmsPages.filter("["+this.attrID+"="+id+"]");
		return this.switchPages(elmNewPage);
	}
	__.classes.pagerSliding.prototype.switchPages = function(elmNewPage){
		if(elmNewPage[0] == this.elmCurrent[0]) return false;
		var fncThis = this;
		var callback = function(){
			fncThis.elmCurrent.removeClass(fncThis.classCurrentItem);
			elmNewPage.removeClass(fncThis.nextClass).removeClass(fncThis.classPreviousItem).addClass(fncThis.classCurrentItem);
			fncThis.elmCurrent = elmNewPage;
			
			var elmsPagesLength = fncThis.elmsPages.length;
			var elmIndexCurrent = fncThis.getPageIndex(elmNewPage);
			// set all previous elements to previous
			for(var i = 0; i < elmIndexCurrent; ++i){
				jQuery(fncThis.elmsPages[i]).removeClass(fncThis.nextClass).addClass(fncThis.classPreviousItem).css({"display":"none"});
			}
			// set all next elements to next
			for(var i = elmIndexCurrent + 1; i < elmsPagesLength; ++i){
				jQuery(fncThis.elmsPages[i]).addClass(fncThis.nextClass).removeClass(fncThis.classPreviousItem).css({"display":"none"});
			}
			
			//elmNewPage.prevAll(fncThis.itemSelector).removeClass(fncThis.nextClass).addClass(fncThis.classPreviousItem).css({"display":"none", "left":0 - this.pageOffsetLeft - this.contentWidth});
			//elmNewPage.nextAll(fncThis.itemSelector).addClass(fncThis.nextClass).removeClass(fncThis.classPreviousItem).css({"display":"none", "left":this.pageOffsetRight + this.contentWidth});
			fncThis.inprogress = 0;
		}
		if(elmNewPage.hasClass(fncThis.nextClass)){
			// animate left
			fncThis.elmCurrent.css({"display":"block"}).animate({left: 0 - fncThis.pageOffsetLeft - fncThis.contentWidth}, fncThis.duration)
			elmNewPage.css({"display":"block", "left":this.pageOffsetRight + this.contentWidth}).animate({left: fncThis.contentLeft}, fncThis.duration+1, callback);
		}
		else{
			// animate right
			fncThis.elmCurrent.css("display","block").animate({left: this.pageOffsetRight + this.contentWidth}, fncThis.duration)
			elmNewPage.css({"display":"block", "left":0 - this.pageOffsetLeft - this.contentWidth}).animate({left: fncThis.contentLeft}, fncThis.duration, callback);
		}
		var previousURL = elmNewPage.attr(fncThis.attrPreviousURL);
		var nextURL = elmNewPage.attr(fncThis.attrNextURL);
		if(previousURL)
			fncThis.elmPreviousButton.fadeIn(fncThis.duration).children("a").attr("href", previousURL);
		else
			fncThis.elmPreviousButton.fadeOut(fncThis.duration).children("a").attr("href", "");
		if(nextURL)
			fncThis.elmNextButton.fadeIn(fncThis.duration).children("a").attr("href", nextURL);
		else
			fncThis.elmNextButton.fadeOut(fncThis.duration).children("a").attr("href", "");
			
		if(fncThis.elmsItemNavigation){
			fncThis.pointToCurrentNavigation(elmNewPage.attr(this.attrID));
		}
		
		return true;
	}
	__.classes.pagerSliding.prototype.parsePath = function(path){
		var result = this.linkPathRegex.exec(path);
		return result[1];
	}
	__.classes.pagerSliding.prototype.getPageIndex = function(argElement){
		var arrayLength = this.elmsPages.length;
		for(i=0;i<arrayLength;++i){
			if(this.elmsPages[i] == argElement[0]){
				return i;
			}
		}
	}
	__.classes.pagerSliding.prototype.pointToCurrentNavigation = function(argID){
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
	/* notes:
	display changed for ie6 and 7 only so that scrollbar doesn't appear except on page change
	*/

