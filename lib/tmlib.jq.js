/*
jquery dependent functions
*/

	tmlib.prototype.getHiddenElementWidthHeight = function(argElement){
		var originalSettings = {
			position: argElement.css("position"),
			left: argElement.css("left"),
			top: argElement.css("top")
		}

		argElement.css({"position":"absolute", "left":"-9000px", "top":"-1000px"})
		var width = argElement.outerWidth();
		var height = argElement.outerHeight();
		argElement.css(originalSettings);
		
		return {width: width, height: height};
	}
	tmlib.prototype.getRealWindowWidth = function(){
		this.getRealWindowWidthElement = jQuery("body").append("<div></div>");
		this.getRealWindowWidthElement.css({position:"absolute", top:"-1px", left:"0", width:"100%", height:"1px"});
		return this.getRealWindowWidthElement.width();
	}
//-@ https://github.com/brandonaaron/jquery-getscrollbarwidth/blob/master/jquery.getscrollbarwidth.js
//-@ http://www.alexandre-gomes.com/?p=115
	__.lib.getWidthScrollbar = function(){
		var elmDivInner = $("<div>").css({width: "100%", height: "200px"});
		var elmDivOuter = $("<div>").css({
			visibility: "hidden"
			,overflow: "auto"
			,position: "absolute"
			,top: "-9000px"
			,left: "-9000px"
			,width: "100px"
			,height: "100px"
		})
		.append(elmDivInner);
		$("body").append(elmDivOuter);
		var widthOuter = elmDivOuter.width();
		var widthInner = elmDivInner.width();
		var lclWidthScrollbar = widthOuter - widthInner;
		elmDivOuter.remove();

		return lclWidthScrollbar;
	}

/*
@param elmsItems
@param attrURLImage
*/
	__.lib.preloadImagesForElements = function(args){
		var fncArgs = args;
		fncArgs.imagePaths = new Array();
		if(typeof fncArgs.attrURLImage == "undefined")
			fncArgs.attrURLImage = "href";
		fncArgs.elmsItems.each(function(){
			fncArgs.imagePaths.push(jQuery(this).attr(fncArgs.attrURLImage));
		});
		__.lib.preloadImages(fncArgs);
	}
/*
@param elmsImages(jqueryElements anchors): anchors to grab hrefs for images from
@passthrough: all params for preloadImages
*/
	__.lib.preloadImagesForAnchors = function(args){
		var fncArgs = args;
		fncArgs.imagePaths = new Array();
		fncArgs.elmsAnchors.each(function(){
			fncArgs.imagePaths.push(jQuery(this).attr("href"));
		});
		__.lib.preloadImages(fncArgs);
	}
/*
@param imagePaths(array): array of image paths to preload
@param interval: time between image loads
*/
	__.lib.preloadImages = function(args){
		var fncArgs = args;
		if(typeof fncArgs.interval == "undefined")
			fncArgs.interval = 500;
		var nextTimeout = fncArgs.intervalInitial || fncArgs.interval;
		jQuery(args.imagePaths).each(function(){
			var fncThis = this;
			setTimeout(function(){
				jQuery("<img/>")[0].src = fncThis;
			}, nextTimeout);
			nextTimeout += fncArgs.interval;
		});
	}


