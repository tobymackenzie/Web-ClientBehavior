/*-----
©buttonScrollerHorizontal
adds buttons to scroll horizontally a div that can contain content wider than itself

-----dependsOn
tmlib base
jquery

-----parameters
@param doUpdateWidth: update width of wrapper on window resize?

-----styling
disables for IE 7 and lower.  can work for simple inlineable items, but not for block style items, unless they are moved into table cells or some other thing allowing them to be inline and not wrap
*/
/*==buttonScroller */
.hasjavascript .buttonScrollerWrap{
	position: relative; /* make a positioning parent */
	height: -!repHeightOfContent!-px; /* must be a fixed height that can show content */
	overflow: hidden; /* hide part of list extending outside of wrapper */
}
.uaielte7.hasjavascript .buttonScrollerWrap{
	height: auto;
}
.hasjavascript .buttonScrollerList{
	position: absolute; /* position list absolutely so it can be full width and moved */
	top: 0;
	left: 0;
	white-space: nowrap; /* ensure items don't wrap */
}
.uaielte7.hasjavascript .buttonScrollerList{
	position: static;
}
.hasjavascript .buttonScrollerItem{
	display: inline;
	display: inline-block; /* display inline instead of float to take advantage of the 'nowrap' 'white-space' */
	float: none;
	white-space: normal; /* reset 'white-space' for content */
}
.uaielte7.hasjavascript .buttonScrollerItem{
	display: inline;
}

/*===navigation */
.buttonScrollerNavigationItem{
	position: absolute; /* allow moving into position */
	top: 50%; /* halfway from the top of the container */
	margin-top: --!repHalfHeightOfButton!-px; /* then back up half the height of the button */
}
.buttonScrollerNavigationItem.previous{
	left: -!repOffsetPreviousButton!-; /* on the left */
}
.buttonScrollerNavigationItem.next{
	right: -!repOffsetNextButton!-; /* on the right */
}
.buttonScrollerNavigationItem a{
	display: block; /* replace text with icon */
	width: -!repWidthOfImageSlice!-px;
	height: -!repHeightOfImageSlice!-px;
	background-image: url('-!repPathToImageSliceFile!-');
	background-repeat: none;
}
.buttonScrollerNavigationItem.previous a{
	background-position: -!repOffsetOfPreviousSlice!-px top;
}
.buttonScrollerNavigationItem.next a{
	background-position: -!repOffsetOfNextSlice!- top;
}

/*
-----init
*/
if(typeof $ !== 'undefined')
	$(document).ready(function(){
		var elmCategoryImages = $('#page_portfolio_category #maincontent .images');
		if(elmCategoryImages.length > 0){
			__.scrollerCategoryImages = new __.classes.buttonScrollerHorizontal({
				elmWrapper: elmCategoryImages
				,elmContainer: elmCategoryImages.find('.imageList'),
				,htmlButtonContainer: '<div class="buttonScrollerNavigation"><h3 class="screenReaderOnly">Image Navigation</h3></div>'
				,htmlButtonPrevious: '<div class="buttonScrollerNavigationItem previous"><a href="javascript:/* scroll to previous images */"><span class="screenReaderOnly">Previous</span></a></div>'
				,htmlButtonNext: '<div class="buttonScrollerNavigationItem next"><a href="javascript:/* scroll to next images*/"><span class="screenReaderOnly">Next</span></a></div>'
			});
		}
	});

/*-----*/

/*-----------
©buttonScrollerHorizontal
----------*/
__.classes.buttonScrollerHorizontal = function(args){
		//--optional arguments
		this.boot = args.boot || null;
		this.doAutoAdvance = args.doAutoAdvance || false;
		this.doStopAdvanceOnNavigate = (typeof args.doStopAdvanceOnNavigate != 'undefined') ? args.doStopAdvanceOnNavigate : true;
		this.doUpdateWidthOnWindowResize = args.doUpdateWidthOnWindowResize || false;
		this.duration = args.duration || 100;
		if(args.elmWrapper)
			this.setWrapper(args.elmWrapper);
		else
			this.elmWrapper = null;
		this.htmlButtonContainer = args.htmlButtonContainer || null;
		this.htmlButtonPrevious = args.htmlButtonPrevious || null;
		this.htmlButtonNext = args.htmlButtonNext || null;
		this.increment = args.increment || 100;
		this.oninit = args.oninit || null;
		this.onresize = args.onresize || null;
		this.timeAutoAdvanceWait = (typeof args.timeAutoAdvanceWait != 'undefined') ? args.timeAutoAdvanceWait : 2000;
		this.timeAutoAdvancePause = (typeof args.timeAutoAdvancePause != 'undefined') ? args.timeAutoAdvancePause : 5000;

		//--derived members
		var fncThis = this;

		//--create button navigation, bind handlers
		if(this.htmlButtonContainer){
			this.elmButtonContainer = jQuery(this.htmlButtonContainer)
			this.elmWrapper.append(this.elmButtonContainer);
		}else{
			this.elmButtonContainer = this.elmWrapper;
		}
		if(this.htmlButtonPrevious){
			this.elmButtonPrevious = jQuery(this.htmlButtonPrevious);
			this.elmButtonContainer.append(this.elmButtonPrevious);
			this.elmButtonPrevious.on('click', function(){
				fncThis.scrollLeft();
				if(fncThis.intervalAutoAdvance && fncThis.doStopAdvanceOnNavigate){
					clearInterval(fncThis.intervalAutoAdvance);
				}
			});
		}
		if(this.htmlButtonNext){
			this.elmButtonNext = jQuery(this.htmlButtonNext);
			this.elmButtonContainer.append(this.elmButtonNext);
			this.elmButtonNext.on('click', function(){
				fncThis.scrollRight();
				if(fncThis.intervalAutoAdvance && fncThis.doStopAdvanceOnNavigate){
					clearInterval(fncThis.intervalAutoAdvance);
				}
			});
		}

		//--adjust wrapper width on window resize
		if(fncThis.doUpdateWidthOnWindowResize){
			jQuery(window).on('resize', function(){
				fncThis.resize();
			});
		}

		//--set container
		if(args.elmContainer)
			this.setContainer(args.elmContainer);
		else
			this.elmContainer = null;

		//-*must be done for browsers with slow image loading
//		setTimeout(function(){fncThis.resize();}, 500);

		//--start auto advance
		if(this.doAutoAdvance){
			setTimeout(function(){
				fncThis.intervalAutoAdvance = setInterval(function(){
					fncThis.advance.call(fncThis);
				}, fncThis.timeAutoAdvancePause);
			}, this.timeAutoAdvanceWait);
		}else{
			this.intervalAutoAdvance = null;
		}

		if(fncThis.oninit)
			fncThis.oninit.call(this);
	}
	__.classes.buttonScrollerHorizontal.prototype.advance = function(){
		var currentPosition = this.elmContainer.position().left;
		var currentPositionRight = this.widthContainer + currentPosition - this.widthWrapper;
		if(currentPositionRight > 0){
			this.scrollRight();
		}else{
			clearInterval(this.intervalAutoAdvance);
		}
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
			this.widthWrapper = this.elmWrapper.width();
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
		this.widthWrapper = this.elmWrapper.width();
	}
