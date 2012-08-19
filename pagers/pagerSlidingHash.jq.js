/*
slides new 'pages' into view while sliding old out

depends on:
tmlib base: isIphone, getHiddenElementHeight
jquery

-----parameters
arguments array: array of arguments
		elmsNavigation($element): container of navigation, supply only to auto-display on init, allowing hiding for non-js browsers

---css:
.container{
	overflow: hidden;
	position: relative; /*- non static
	width: 100px;
	height: 100px;
}
.page{
	position: absolute;
	top: 0;
	left: 0;
	width: 100px; /- same as above
	height: 100%;
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
//		__.pageid = $('body').attr('id');
		var elmsBanners = $('#banner .banners .banner');
		if(elmsBanners.length > 0)
			__.bannerPager = new __.classes.pagerSlidingHash({elmsPages:elmsBanners, itemSelector:'.banner', elmPreviousButton:$('#banner .navigation .previous'), elmNextButton:$('#banner .navigation .next'), elmsItemNavigation: $('#banner .navigation li'), regexHash: {find: /(#[\w-_])/, replace: '$1'}, onpreslide: function(elmNewPage){
					var fncThis = this;
					var newTitle = elmNewPage.attr('data-title');
					this.boot.elmTitle.fadeOut(this.duration, function(){
						fncThis.boot.elmTitle.html(newTitle).fadeIn(fncThis.duration);
					});
				}
			});
	});

*/


/*--------
©pagerSlidingHash
-------*/
__.classes.pagerSlidingHash = function(args){
		var fncThis = this;
		this.elmsPages = args.elmsPages || null;
		this.elmNavigation = args.elmNavigation || null;
		this.elmPreviousButton = args.elmPreviousButton || null;
		this.elmNextButton = args.elmNextButton || null;
		this.elmsItemNavigation = args.elmsItemNavigation || null;
		this.elmKeepHeight = args.elmKeepHeight || false;
			if(__.ua.isIphone() == true) this.elmKeepHeight = false;
		this.itemSelector = (args.itemSelector !== undefined)? args.itemSelector: 'item';
		this.classCurrentItem = (args.classCurrentItem !== undefined)? args.classCurrentItem: 'current';
		this.classPreviousItem = (args.classPreviousItem !== undefined)? args.classPreviousItem: 'previous';
		this.classNextItem = (args.classNextItem !== undefined)? args.classNextItem: 'next';
		this.classCurrentNavItem = args.classCurrentNavItem || 'current';
		this.classDisabled = args.classDisabled || 'disabled';
		this.classEnabled = args.classEnabled || 'enabled';
		this.regexHash = args.regexHash || false;
		this.duration = (args.duration !== undefined)? args.duration: 500;
		this.contentWidth = (args.contentWidth !== undefined)? args.contentWidth: 960;
		this.contentLeft = args.contentLeft || 0;
		this.elmNavigationPointer = args.elmNavigationPointer || null;
		this.elmNavigationOrientation = args.elmNavigationOrientation || 'horizontal';
		this.oninit = args.oninit || null;
		this.onpreslide = args.onpreslide || null;
		this.onpostslide = args.onpostslide || null;
		this.boot = args.boot || null;

		//--set up current pages
		if(window.location.hash){
			this.elmCurrent = this.elmsPages.filter(this.parsePath(window.location.hash)).addClass(this.classCurrentItem);
		}else{
			this.elmCurrent = this.elmsPages.filter('.'+this.classCurrentItem);
			if(this.elmCurrent.length < 1){
				this.elmCurrent = this.elmsPages.first();
				this.elmCurrent.addClass(this.classCurrentItem);
			}
		}

		if(this.elmKeepHeight){
			this.elmKeepHeight.css('height', __.getHiddenElementHeight(this.elmCurrent));
		}

		//--show navigation
		if(this.elmNavigation)
			this.elmNavigation.show();

		//--set up page offsets
/* for whole body
		this.pageOffsetLeft = (args.contentLeft)? 0: this.elmCurrent.offset().left;
		if(!args.contentLeft){
			this.pageOffsetRight = (args.contentLeft)?false:$('body').outerWidth();

		}
*/
		this.pageOffsetLeft = args.pageOffsetLeft || 0;
		this.pageOffsetRight = args.pageOffsetRight || 0;

		//--set up non-current pages
		var elmsPrevious = this.elmsPages.filter('.'+this.classCurrentItem).prevAll()
		elmsPrevious.addClass(this.classPreviousItem);
		var elmsNext = this.elmsPages.filter('.'+this.classCurrentItem).nextAll()
		elmsNext.addClass(this.classNextItem);
		elmsPrevious.css({'left':0 - this.pageOffsetLeft - this.contentWidth, 'display':'none'});
		elmsNext.css({'left':this.pageOffsetRight + this.contentWidth, 'display':'none'});

		//--set up relative navigation
		this.updateRelativeNavigation(0);

		this.inprogress = 0;

		this.attachEvents();

		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.pagerSlidingHash.prototype.attachEvents = function(){
		var fncThis = this;
		if(fncThis.elmPreviousButton){
			fncThis.elmPreviousButton.children('a').on('click', function(){
				if(fncThis.inprogress == 0 && jQuery(this).attr('href')){
					fncThis.inprogress = 1;
					if(!fncThis.switchPagesByID(fncThis.parsePath(fncThis.elmPreviousButton.children('a').attr('href'))))
						fncThis.inprogress = 0;
				}
				return false;
			});
		}
		if(fncThis.elmNextButton){
			fncThis.elmNextButton.children('a').on('click', function(){
				if(fncThis.inprogress == 0 && jQuery(this).attr('href')){
					fncThis.inprogress = 1;
					if(!fncThis.switchPagesByID(fncThis.parsePath(fncThis.elmNextButton.children('a').attr('href'))))
						fncThis.inprogress = 0;
				}
				return false;
			});
		}
		if(fncThis.elmsItemNavigation){
			fncThis.elmsItemNavigation.on('click', function(){
				if(fncThis.inprogress == 0){
					fncThis.inprogress = 1;
					if(!fncThis.switchPagesByID(fncThis.parsePath(jQuery(this).children('a').attr('href'))))
						fncThis.inprogress = 0;
				}
				return false;
			});
		}
	}
	__.classes.pagerSlidingHash.prototype.switchPagesByID = function(id){
		var elmNewPage = this.elmsPages.filter('#'+id);
		return this.switchPages(elmNewPage);
	}
	__.classes.pagerSlidingHash.prototype.switchPagesToPrevious = function(){
		var elmPrevious = this.elmCurrent.previous();
		if(elmPrevious.length > 0)
			this.switchPages(elmPrevious);
		else
			this.switchPages(this.elmsPages.last());
	}
	__.classes.pagerSlidingHash.prototype.switchPagesToNext = function(){
		var elmNext = this.elmCurrent.next();
		if(elmNext.length > 0)
			this.switchPages(elmNext);
		else
			this.switchPages(this.elmsPages.first());
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
			//-set all previous elements to previous
			for(var i = 0; i < elmIndexCurrent; ++i){
				jQuery(fncThis.elmsPages[i]).removeClass(fncThis.classNextItem).addClass(fncThis.classPreviousItem).css({'display':'none'});
			}
			//-set all next elements to next
			for(var i = elmIndexCurrent + 1; i < elmsPagesLength; ++i){
				jQuery(fncThis.elmsPages[i]).addClass(fncThis.classNextItem).removeClass(fncThis.classPreviousItem).css({'display':'none'});
			}

			if(fncThis.onpostslide)
				fncThis.onpostslide.call(fncThis, this);

			fncThis.updateRelativeNavigation();

			fncThis.inprogress = 0;
		}

		//--call preslide callback
		if(fncThis.onpreslide)
			fncThis.onpreslide.call(this, elmNewPage);

		//--animate new height
		if(fncThis.elmKeepHeight){
			fncThis.elmKeepHeight.animate({height: __.getHiddenElementHeight(elmNewPage)}, fncThis.duration);
		}

		//--swap pieces
		if(elmNewPage.hasClass(fncThis.classNextItem)){
			//--animate left
			fncThis.elmCurrent.css({'display':'block'}).animate({left: 0 - fncThis.pageOffsetLeft - fncThis.contentWidth}, fncThis.duration)
			elmNewPage.css({'display':'block', 'left':this.pageOffsetRight + this.contentWidth}).animate({left: fncThis.contentLeft}, fncThis.duration+1, callback);
		}
		else{
			//--animate right
			fncThis.elmCurrent.css('display','block').animate({left: this.pageOffsetRight + this.contentWidth}, fncThis.duration)
			elmNewPage.css({'display':'block', 'left':0 - this.pageOffsetLeft - this.contentWidth}).animate({left: fncThis.contentLeft}, fncThis.duration, callback);
		}


		return true;
	}
	__.classes.pagerSlidingHash.prototype.updateRelativeNavigation = function(argDuration){
		var fncDuration = (typeof argDuration !== 'undefined')? argDuration: this.duration;

		if(this.elmPreviousButton){
			var previousURL = '#'+this.elmCurrent.prev(this.itemSelector).attr('id');
			if(previousURL != '#undefined')
				this.elmPreviousButton.removeClass(this.classDisabled).addClass(this.classEnabled).children('a').attr('href', previousURL);
			else
				this.elmPreviousButton.removeClass(this.classEnabled).addClass(this.classDisabled).children('a').attr('href', '');
		}
		if(this.elmNextButton){
		var nextURL = '#'+this.elmCurrent.next(this.itemSelector).attr('id');
			if(nextURL != '#undefined')
				this.elmNextButton.removeClass(this.classDisabled).addClass(this.classEnabled).children('a').attr('href', nextURL);
			else
				this.elmNextButton.removeClass(this.classEnabled).addClass(this.classDisabled).children('a').attr('href', '');
		}


		//-set up current navigation item
		if(this.elmsItemNavigation)
			this.elmsItemNavigation.removeClass(this.classCurrentNavItem).has('[href="#'+this.elmCurrent.attr('id')+'"]').addClass(this.classCurrentNavItem);
		if(this.elmsItemNavigation && this.elmNavigationPointer){
			fncThis.pointToCurrentNavigation(this.elmsItemNavigation.filter('.'+this.classCurrentNavItem));
			fncThis.elmNavigationPointer.css('display','block');
		}
	}
	__.classes.pagerSlidingHash.prototype.getPageIndex = function(argElement){
		var arrayLength = this.elmsPages.length;
		for(var i=0;i<arrayLength;++i){
			if(this.elmsPages[i] == argElement[0]){
				return i;
			}
		}
	}
	__.classes.pagerSlidingHash.prototype.pointToCurrentNavigation = function(argID){
		if(this.elmsItemNavigation){
			var currentItem = this.elmsItemNavigation.filter('['+this.attrID+'="'+argID+'"]');
			this.elmsItemNavigation.filter('.'+this.classCurrentNavItem).removeClass(this.classCurrentNavItem);
			currentItem.addClass(this.classCurrentNavItem);
			if(this.elmNavigationPointer){
				switch(this.elmNavigationOrientation){
					case 'horizontal':
						this.elmNavigationPointer.animate({left: currentItem.position().left + currentItem.width()/2}, this.duration);
						break;
					case 'vertical':
						this.elmNavigationPointer.animate({top: currentItem.position().top + currentItem.height()/2}, this.duration);
						break;
				}
			}
		}
	}
	__.classes.pagerSlidingHash.prototype.parsePath = function(path){
		if(this.regexHash)
			path = path.replace(this.regexHash.find, this.regexHash.replace);
		return __.lib.escapeHash(path);
	}

	/*---notes:
	display changed for ie6 and 7 only so that scrollbar doesn't appear except on page change
	*/


