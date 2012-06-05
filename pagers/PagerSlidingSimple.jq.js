/*
Slider with no hash link, no direct navigation, only next and previous

//=======instantiation
*/
__.elmsPagePortfolioList = jQuery('.pageportfoliolist');
if(__.elmsPagePortfolioList.length > 1){
	$('#maincontent').append(
		'<div class="paginationnavigation" role="navigation">'
		+	'<div class="wrappaginationlink previous">'
		+		'<a class="paginationlink previous" href="javascript:/*see previous galleries*/">Previous</a>'
		+	'</div>'
		+	'<div class="wrappaginationlink next">'
		+		'<a class="paginationlink next" href="javascript:/*see more galleries*/">More</a>'
		+	'</div>'
		+ '</div>'
	);
	__.portfolioPager = new __.classes.pagerSlidingSimple({
		contentWidth: jQuery('#mainwrap').width()
		,elmsPages: __.elmsPagePortfolioList
		,itemSelector:'.pageportfoliolist'
		,elmPreviousButton:$('.paginationnavigation .paginationlink.previous')
		,elmNextButton:$('.paginationnavigation .paginationlink.next')
	});
}

/*-----
©pagerSlidingSimple
-----*/
__.classes.pagerSlidingSimple = function(args){
		var fncThis = this;
		this.doCarousel = args.doCarousel || false;
		this.elmsPages = args.elmsPages || null;
		this.elmPreviousButton = args.elmPreviousButton || null;
		this.elmNextButton = args.elmNextButton || null;
		this.itemSelector = (args.itemSelector !== undefined)? args.itemSelector: 'item';
		this.classCurrentItem = (args.classCurrentItem !== undefined)? args.classCurrentItem: 'current';
		this.duration = (args.duration !== undefined)? args.duration: 500;
		this.contentWidth = (args.contentWidth !== undefined)? args.contentWidth: 'element';
		
		this.elmCurrent = this.elmsPages.filter('.'+this.classCurrentItem);
		if(this.elmCurrent.length < 1){
			this.elmCurrent = this.elmsPages.first();
			this.elmCurrent.addClass(this.classCurrentItem);
		}
		this.elmsPages.hide();
		this.elmCurrent.show();
		this.pageOffsetLeft = (args.contentLeft)? 0: this.elmCurrent.offset().left;
		
		this.inprogress = false;
		
		this.attachEvents();
		this.handleNavigation();
	}
	__.classes.pagerSlidingSimple.prototype.attachEvents = function(){
		var fncThis = this;
		if(fncThis.elmPreviousButton){
			fncThis.elmPreviousButton.bind('click', function(){
				fncThis.switchToPrevious();
				return false;
			});
		}
		if(fncThis.elmNextButton){
			fncThis.elmNextButton.bind('click', function(){
				fncThis.switchToNext();
				return false;
			});
		}
	}
	__.classes.pagerSlidingSimple.prototype.switchToPrevious = function(){
		var elmPrevious = this.elmCurrent.prev(this.itemSelector);
		if(elmPrevious.length > 0)
			this.switchPages(elmPrevious, 'right');
		else
			this.switchPages(this.elmsPages.last(), 'left');
	}	
	__.classes.pagerSlidingSimple.prototype.switchToNext = function(){
		var elmNext = this.elmCurrent.next(this.itemSelector);
		if(elmNext.length > 0)
			this.switchPages(elmNext, 'left');
		else
			this.switchPages(this.elmsPages.first(), 'right');
	}	
	__.classes.pagerSlidingSimple.prototype.switchPages = function(elmNewPage, argDirection){
		if(this.inprogress) return false;
		if(elmNewPage[0] == this.elmCurrent[0]) return false;
		this.inprogress = true;
		var fncThis = this;
		var elmCurrent = this.elmCurrent;
		var width = (this.contentWidth == 'element') ? elmCurrent.width() : this.contentWidth;
		var callbackPostAnimationCurrent = function(){
			elmCurrent.hide().removeClass(fncThis.classCurrentItem);
		};
		var callbackPostAnimationNew = function(){
			elmNewPage.addClass(fncThis.classCurrentItem);
			fncThis.elmCurrent = elmNewPage;
			fncThis.handleNavigation();
			fncThis.inprogress = false;
		};
		switch(argDirection){
			case "right":
				elmCurrent.animate({'left': width+'px'}, fncThis.duration, callbackPostAnimationCurrent);
				elmNewPage.show().css({'left': '-'+width+'px'}).animate({'left': 0}, fncThis.duration, callbackPostAnimationNew);
			break;
			case "left":
				elmCurrent.animate({'left': '-'+width+'px'}, fncThis.duration, callbackPostAnimationCurrent);
				elmNewPage.show().css({'left': width+'px'}).animate({'left': 0}, fncThis.duration, callbackPostAnimationNew);
			break;
		}
		return true;
	}
	__.classes.pagerSlidingSimple.prototype.handleNavigation = function(){
		if(!this.doCarousel){
			var elmPrevious = this.elmCurrent.prev(this.itemSelector);
			if(elmPrevious.length < 1) this.elmPreviousButton.hide();
			else this.elmPreviousButton.show();
			var elmNext = this.elmCurrent.next(this.itemSelector);
			if(elmNext.length < 1) this.elmNextButton.hide();
			else this.elmNextButton.show();
		}
	}

