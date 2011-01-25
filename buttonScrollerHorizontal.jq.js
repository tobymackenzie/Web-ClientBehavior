/*-----
©buttonScrollerHorizontal
adds buttons to scroll horizontally a div that can contain content wider than itself

-----dependsOn
tmlib base
jquery

-----init
if(typeof $ !== 'undefined')
	$(document).ready(function(){
		var elmCategoryImages = $("#page_portfolio_category #maincontent .images");
		if(elmCategoryImages.length > 0){
			__.scrollerCategoryImages = new __.classes.buttonScrollerHorizontal({
				elmWrapper: elmCategoryImages,
				elmContainer: elmCategoryImages.find(".imagelist"),
				htmlButtonContainer: '<div class="relativenavigation"><h3 class="screenreaderonly">Image Navigation</h3></div>',
				htmlButtonPrevious: '<div class="item previous"><a href="javascript://__scroll_to_previous_images"><span class="screenreaderonly">Previous</span></a></div>',
				htmlButtonNext: '<div class="item next"><a href="javascript://__scroll_to_next_images"><span class="screenreaderonly">Next</span></a></div>'
			});
		}
	});

-----*/

/* --------
©buttonScrollerHorizontal
------- */
__.classes.buttonScrollerHorizontal = function(arguments){
		this.elmWrapper = arguments.elmWrapper || null;
		this.elmContainer = arguments.elmContainer || null;
		this.htmlButtonContainer = arguments.htmlButtonContainer || null;
		this.htmlButtonPrevious = arguments.htmlButtonPrevious || null;
		this.htmlButtonNext = arguments.htmlButtonNext || null;
		this.duration = arguments.duration || 100;
		this.increment = arguments.increment || 100;
		
		//-init derived attributes
		var fncThis = this;
		this.widthWrapper = this.elmWrapper.outerWidth();
		this.widthContainer = this.elmContainer.outerWidth();
		
		//-create button navigation, bind handlers
		if(this.htmlButtonContainer){
			this.elmButtonContainer = $(this.htmlButtonContainer)
			this.elmWrapper.append(this.elmButtonContainer);
		}else{
			this.elmButtonContainer = this.elmWrapper;
		}
		if(this.htmlButtonPrevious){
			this.elmButtonPrevious = $(this.htmlButtonPrevious);
			this.elmButtonContainer.append(this.elmButtonPrevious);
			this.elmButtonPrevious.bind("click", function(){fncThis.scrollLeft()});
		}
		if(this.htmlButtonNext){
			this.elmButtonNext = $(this.htmlButtonNext);
			this.elmButtonContainer.append(this.elmButtonNext);
			this.elmButtonNext.bind("click", function(){fncThis.scrollRight()});
		}
		fncThis.toggleButtonEnable();
		
		//-adjust wrapper width on window resize
		$(window).bind("resize", function(){
			fncThis.widthWrapper = fncThis.elmWrapper.outerWidth();
			fncThis.toggleButtonEnable();
		});

		// must be done for browsers with slow image loading
		setTimeout(function(){
			fncThis.widthContainer = fncThis.elmContainer.outerWidth();
			fncThis.toggleButtonEnable();
		}, 500);
	}
	__.classes.buttonScrollerHorizontal.prototype.scrollLeft = function(){
		var fncThis = this;
		var currentPosition = this.elmContainer.position().left;
		if(currentPosition < 0){
			if(currentPosition < 0 - this.increment)
				var nextPosition = currentPosition + this.increment;
			else 
				var nextPosition = 0;			
			this.elmContainer.animate({left:  nextPosition }, this.duration, function(){fncThis.toggleButtonEnable();});
		}
		
	}
	__.classes.buttonScrollerHorizontal.prototype.scrollRight = function(){
		var fncThis = this;
		var currentPosition = this.elmContainer.position().left;
		var currentPositionRight = this.widthContainer + currentPosition - this.widthWrapper;
		if(currentPositionRight > 0){
			if(currentPositionRight > 0 + this.increment)
				var nextPosition = currentPosition - this.increment;
			else 
				var nextPosition = -(this.widthContainer - this.widthWrapper);
			this.elmContainer.animate({left:  nextPosition }, this.duration, function(){fncThis.toggleButtonEnable();});
		}
	}
	__.classes.buttonScrollerHorizontal.prototype.toggleButtonEnable = function(){
		var currentPosition = this.elmContainer.position().left;
		var currentPositionRight = this.widthContainer + currentPosition - this.widthWrapper;
		if(currentPosition >= 0){
			this.elmButtonPrevious.hide();
		}else{
			this.elmButtonPrevious.show();
		}
		if(currentPositionRight <= 0){
			this.elmButtonNext.hide();
		}else{
			this.elmButtonNext.show();
		}
		
	}
	__.classes.buttonScrollerHorizontal.prototype.whatever = function(){
	
	}

