/*-----
Class: ButtonScrollerHorizontal

adds buttons to scroll horizontally a div that can contain content wider than itself

Dependencies:
	tmlib base
	jquery

Parameters:
	doUpdateWidth: update width of wrapper on window resize?

Styles:
	//-# disables for IE 7 and lower.  can work for simple inlineable items, but not for block style items, unless they are moved into table cells or some other thing allowing them to be inline and not wrap
	.hasjavascript .buttonScrollerWrap{
		position: relative; //-# make a positioning parent
		height: -!repHeightOfContent!-px; //-# must be a fixed height that can show content
		overflow: hidden; //-# hide part of list extending outside of wrapper
	}
	.uaielte7.hasjavascript .buttonScrollerWrap{
		height: auto;
	}
	.hasjavascript .buttonScrollerList{
		position: absolute; //-# position list absolutely so it can be full width and moved
		top: 0;
		left: 0;
		white-space: nowrap; //-# ensure items don't wrap
	}
	.uaielte7.hasjavascript .buttonScrollerList{
		position: static;
	}
	.hasjavascript .buttonScrollerItem{
		display: inline;
		display: inline-block; //-# display inline instead of float to take advantage of the 'nowrap' 'white-space'
		float: none;
		white-space: normal; //-# reset 'white-space' for content
	}
	.uaielte7.hasjavascript .buttonScrollerItem{
		display: inline;
	}

	//===navigation
	.buttonScrollerNavigationItem{
		position: absolute; //-# allow moving into position
		top: 50%; //-# halfway from the top of the container
		margin-top: --!repHalfHeightOfButton!-px; //-# then back up half the height of the button
	}
	.buttonScrollerNavigationItem.previous{
		left: -!repOffsetPreviousButton!-; //-# on the left
	}
	.buttonScrollerNavigationItem.next{
		right: -!repOffsetNextButton!-; //-# on the right
	}
	.buttonScrollerNavigationItem a{
		display: block; //-# replace text with icon
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

Example:
	if(typeof $ !== 'undefined'){
		$(document).ready(function(){
			var elmCategoryImages = $('#page_portfolio_category #maincontent .images');
			if(elmCategoryImages.length > 0){
				__.scrollerCategoryImages = new __.classes.ButtonScrollerHorizontal({
					elmWrapper: elmCategoryImages
					,elmContainer: elmCategoryImages.find('.imageList')
					,htmlButtonContainer: '<div class="buttonScrollerNavigation"><h3 class="screenReaderOnly">Image Navigation</h3></div>'
					,htmlButtonPrevious: '<div class="buttonScrollerNavigationItem previous"><a href="javascript:/* scroll to previous images * /"><span class="screenReaderOnly">Previous</span></a></div>'
					,htmlButtonNext: '<div class="buttonScrollerNavigationItem next"><a href="javascript:/* scroll to next images* /"><span class="screenReaderOnly">Next</span></a></div>'
				});
			}
		});
	}

*/
/* global __, clearInterval, jQuery, setInterval, setTimeout, window */

__.classes.ButtonScrollerHorizontal = function(_args){
		//--optional arguments
		this.boot = _args.boot || null;
		this.doAutoAdvance = _args.doAutoAdvance || false;
		this.doStopAdvanceOnNavigate = (typeof _args.doStopAdvanceOnNavigate != 'undefined') ? _args.doStopAdvanceOnNavigate : true;
		this.doUpdateWidthOnWindowResize = _args.doUpdateWidthOnWindowResize || false;
		this.duration = _args.duration || 100;
		if(_args.elmWrapper){
			this.setWrapper(_args.elmWrapper);
		}else{
			this.elmWrapper = null;
		}
		this.htmlButtonContainer = _args.htmlButtonContainer || null;
		this.htmlButtonPrevious = _args.htmlButtonPrevious || null;
		this.htmlButtonNext = _args.htmlButtonNext || null;
		this.increment = _args.increment || 100;
		this.oninit = _args.oninit || null;
		this.onresize = _args.onresize || null;
		this.timeAutoAdvanceWait = (typeof _args.timeAutoAdvanceWait != 'undefined') ? _args.timeAutoAdvanceWait : 2000;
		this.timeAutoAdvancePause = (typeof _args.timeAutoAdvancePause != 'undefined') ? _args.timeAutoAdvancePause : 5000;

		//--derived members
		var _this = this;

		//--create button navigation, bind handlers
		if(this.htmlButtonContainer){
			this.elmButtonContainer = jQuery(this.htmlButtonContainer);
			this.elmWrapper.append(this.elmButtonContainer);
		}else{
			this.elmButtonContainer = this.elmWrapper;
		}
		if(this.htmlButtonPrevious){
			this.elmButtonPrevious = jQuery(this.htmlButtonPrevious);
			this.elmButtonContainer.append(this.elmButtonPrevious);
			this.elmButtonPrevious.on('click', function(){
				_this.scrollLeft();
				if(_this.intervalAutoAdvance && _this.doStopAdvanceOnNavigate){
					clearInterval(_this.intervalAutoAdvance);
				}
			});
		}
		if(this.htmlButtonNext){
			this.elmButtonNext = jQuery(this.htmlButtonNext);
			this.elmButtonContainer.append(this.elmButtonNext);
			this.elmButtonNext.on('click', function(){
				_this.scrollRight();
				if(_this.intervalAutoAdvance && _this.doStopAdvanceOnNavigate){
					clearInterval(_this.intervalAutoAdvance);
				}
			});
		}

		//--adjust wrapper width on window resize
		if(_this.doUpdateWidthOnWindowResize){
			jQuery(window).on('resize', function(){
				_this.resize();
			});
		}

		//--set container
		if(_args.elmContainer){
			this.setContainer(_args.elmContainer);
		}else{
			this.elmContainer = null;
		}

		//-*must be done for browsers with slow image loading
//		setTimeout(function(){_this.resize();}, 500);

		//--start auto advance
		if(this.doAutoAdvance){
			setTimeout(function(){
				_this.intervalAutoAdvance = setInterval(function(){
					_this.advance.call(_this);
				}, _this.timeAutoAdvancePause);
			}, this.timeAutoAdvanceWait);
		}else{
			this.intervalAutoAdvance = null;
		}

		if(_this.oninit){
			_this.oninit.call(this);
		}
	};
	__.classes.ButtonScrollerHorizontal.prototype.advance = function(){
		var _currentPosition = this.elmContainer.position().left;
		var _currentPositionRight = this.widthContainer + _currentPosition - this.widthWrapper;
		if(_currentPositionRight > 0){
			this.scrollRight();
		}else{
			clearInterval(this.intervalAutoAdvance);
		}
	};
	__.classes.ButtonScrollerHorizontal.prototype.scrollLeft = function(){
		var _this = this;
		var _currentPosition = this.elmContainer.position().left;
		if(_currentPosition < 0){
			var _nextPosition;
			if(_currentPosition < 0 - this.increment){
				_nextPosition = _currentPosition + this.increment;
			}else{
				_nextPosition = 0;
			}
			this.elmContainer.animate({left:  _nextPosition }, this.duration, function(){_this.toggleButtonEnable();});
		}

	};
	__.classes.ButtonScrollerHorizontal.prototype.scrollRight = function(){
		var _this = this;
		var _currentPosition = this.elmContainer.position().left;
		var _currentPositionRight = this.widthContainer + _currentPosition - this.widthWrapper;
		var _nextPosition;
		if(_currentPositionRight > 0){
			if(_currentPositionRight > 0 + this.increment){
				_nextPosition = _currentPosition - this.increment;
			}else{
				_nextPosition = -(this.widthContainer - this.widthWrapper);
			}
			this.elmContainer.animate({left:  _nextPosition }, this.duration, function(){_this.toggleButtonEnable();});
		}
	};
	__.classes.ButtonScrollerHorizontal.prototype.toggleButtonEnable = function(){
		var _currentPosition = this.elmContainer.position().left;
		var _currentPositionRight = this.widthContainer + _currentPosition - this.widthWrapper;
		if(_currentPosition >= 0){
			this.elmButtonPrevious.hide();
		}else{
			this.elmButtonPrevious.show();
		}
		if(_currentPositionRight <= 0){
			this.elmButtonNext.hide();
		}else{
			this.elmButtonNext.show();
		}

	};
	__.classes.ButtonScrollerHorizontal.prototype.resize = function(){
		if(this.onresize){
			this.onresize.call(this);
		}else{
			this.widthWrapper = this.elmWrapper.width();
			this.toggleButtonEnable();
		}
	};
	__.classes.ButtonScrollerHorizontal.prototype.setContainer = function(_element){
		var _this = this;
		this.elmContainer = _element;
		if(this.elmContainer.length > 0){
			setTimeout(function(){
				_this.widthContainer = _this.elmContainer.outerWidth();
				_this.resize();
			}, 1500);
		}
	};
	__.classes.ButtonScrollerHorizontal.prototype.setWrapper = function(_element){
		this.elmWrapper = _element;
		this.widthWrapper = this.elmWrapper.width();
	};
