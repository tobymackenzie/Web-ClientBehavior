/*
function: limits the width and or height of an object that needs to but up against the right or bottom of the window at all times, an off center type item
requires: tmlib base, tmlib.addlistener, tmlib getRealWindowWidth

// instantiation sample
__.scrOnload = function(){
	var elmSidebar = document.getElementById("sidebar");
	if(elmSidebar){
		__.sidebarWidthHandler = new __.classes.maxWidthWindow({element: elmSidebar, handleWidth: true, subtractWidth: 840, pageWidth: 960, minWidth: 120});
	}
}


*/



__.classes.maxWidthWindow = function(arguments){
		this.element = arguments.element; if(!this.element) return false;
		this.handleWidth = arguments.handleWidth || false;
		this.maxWidth = arguments.maxWidth || null; // pixels
		this.minWidth = arguments.minWidth || null; // pixels
		this.subtractWidth = arguments.subtractWidth || 0; // pixels less than container
		this.handleHeight = arguments.handleHeight || false;
		this.maxHeight = arguments.maxHeight || null; // pixels
		this.subtractHeight = arguments.subtractHeight || 0; // pixels less than container
		this.pageWidth = arguments.pageWidth || null;
		this.bodyMarginWidth = arguments.bodyMarginWidth || 0;
		this.bodyMarginHeight = arguments.bodyMarginHeight || 0;
		
		
		var fncThis = this;	
		this.update();
		__.addListener(window, "resize", function(){ fncThis.update() });
	}
	__.classes.maxWidthWindow.prototype.update = function(){
		var fncThis = this;
		if(fncThis.handleWidth){
			if(typeof $ === 'undefined')
				var windowWidth = window.innerWidth || document.documentElement.clientWidth;
			else
				var windowWidth = __.getRealWindowWidth();
			var bodyWidth = document.body.outerWidth|| document.body.clientWidth;
			bodyWidth += fncThis.bodyMarginWidth;
			var newContainerWidth = (windowWidth > bodyWidth)? windowWidth : bodyWidth;
			if(fncThis.pageWidth){
				var newWidth = fncThis.pageWidth + ((newContainerWidth - fncThis.pageWidth)/2) - fncThis.subtractWidth;
			}else{
				var newWidth = newContainerWidth - fncThis.subtractWidth;
			}
			if(fncThis.minWidth && newWidth < fncThis.minWidth)
				newWidth = fncThis.minWidth;
			if(fncThis.maxWidth && newWidth > fncThis.maxWidth)
				newWidth = fncThis.maxWidth;
			fncThis.element.style.width = newWidth+"px";
		}
		if(fncThis.handleHeight){
			var windowHeight = window.innerHeight || document.documentElement.clientHeight;
			var bodyHeight = document.body.outerHeight|| document.body.clientHeight;
			bodyHeight += fncThis.bodyMarginHeight;
			var newContainerHeight = (windowHeight > bodyHeight)? windowHeight : bodyHeight;
			var newHeight = newContainerHeight - fncThis.subtractHeight;
			if(fncThis.maxHeight && newHeight > fncThis.maxHeight)
				newHeight = fncThis.maxHeight;
			fncThis.element.style.height = newHeight+"px";
		}
	}


