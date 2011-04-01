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
		this.getRealWindowWidthElement = $("body").append("<div></div>");
		this.getRealWindowWidthElement.css({position:"absolute", top:"-1px", left:"0", width:"100%", height:"1px"});
		return this.getRealWindowWidthElement.width();
	}
/*
@param elmsImages(jqueryElements anchors): anchors to grab hrefs for images from
@passthrough: all params for preloadImages
*/
	__.lib.preloadImagesForAnchors = function(arguments){
		var fncArguments = arguments;
		fncArguments.imagePaths = new Array();
		fncArguments.elmsAnchors.each(function(){
			fncArguments.imagePaths.push($(this).attr("href"));
		});
		__.lib.preloadImages(fncArguments);
	}
/*
@param imagePaths(array): array of image paths to preload
@param interval: time between image loads
*/
	__.lib.preloadImages = function(arguments){
		var fncArguments = arguments;
		if(typeof fncArguments.interval == "undefined")
			fncArguments.interval = 500;
		var nextTimeout = fncArguments.intervalInitial || fncArguments.interval;
		$(arguments.imagePaths).each(function(){
			var fncThis = this;
			setTimeout(function(){
				$("<img/>")[0].src = fncThis;
			}, nextTimeout);
			nextTimeout += fncArguments.interval;
		});
	}


