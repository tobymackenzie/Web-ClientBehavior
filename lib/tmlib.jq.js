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

