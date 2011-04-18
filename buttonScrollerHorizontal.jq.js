/*-----
©buttonScrollerHorizontal
adds buttons to scroll horizontally a div that can contain content wider than itself

-----dependsOn
tmlib base
jquery

-----parameters
@param doUpdateWidth: update width of wrapper on window resize?

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

/*-----------
©buttonScrollerHorizontal
----------*/
__.classes.buttonScrollerHorizontal = function(arguments){
		//--optional arguments
		this.boot = arguments.boot || null;
		this.doUpdateWidthOnWindowResize = arguments.doUpdateWidthOnWindowResize || false;
		this.duration = arguments.duration || 100;
		if(arguments.elmWrapper)
			this.setWrapper(arguments.elmWrapper);
		else
			this.elmWrapper = null;
		this.htmlButtonContainer = arguments.htmlButtonContainer || null;
		this.htmlButtonPrevious = arguments.htmlButtonPrevious || null;
		this.htmlButtonNext = arguments.htmlButtonNext || null;
		this.increment = arguments.increment || 100;
		this.oninit = arguments.oninit || null;
		this.onresize = arguments.onresize || null;
		
		//--derived members
		var fncThis = this;
		
		//--create button navigation, bind handlers
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
		
		//--adjust wrapper width on window resize
		if(fncThis.doUpdateWidthOnWindowResize){
			$(window).bind("resize", function(){
				fncThis.resize();
			});
		}
		
		//--set container
		if(arguments.elmContainer)
			this.setContainer(arguments.elmContainer);
		else
			this.elmContainer = null;
		
		//-*must be done for browsers with slow image loading
//		setTimeout(function(){fncThis.resize();}, 500);

		if(fncThis.oninit)
			fncThis.oninit.call(this);
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
	__.classes.buttonScrollerHorizontal.prototype.resize = function(){
		if(this.onresize){
			this.onresize.call(this);		
		}else{
			this.widthWrapper = this.elmWrapper.outerWidth();
			this.toggleButtonEnable();
		}
	}
	__.classes.buttonScrollerHorizontal.prototype.setContainer = function(argElement){
		var fncThis = this;
		this.elmContainer = argElement;
		if(this.elmContainer.length > 0){
			setTimeout(function(){
				fncThis.widthContainer = fncThis.elmContainer.outerWidth();
				fncThis.resize();
			}, 1500);
		}
	}
	__.classes.buttonScrollerHorizontal.prototype.setWrapper = function(argElement){
		this.elmWrapper = argElement;
		this.widthWrapper = this.elmWrapper.outerWidth();
	}

