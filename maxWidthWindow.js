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



__.classes.maxWidthWindow = function(args){
		this.element = args.element; if(!this.element) return false;
		this.handleWidth = args.handleWidth || false;
		this.maxWidth = args.maxWidth || null; // pixels
		this.minWidth = args.minWidth || null; // pixels
		this.subtractWidth = args.subtractWidth || 0; // pixels less than container
		this.handleHeight = args.handleHeight || false;
		this.maxHeight = args.maxHeight || null; // pixels
		this.subtractHeight = args.subtractHeight || 0; // pixels less than container
		this.pageWidth = args.pageWidth || null;
		this.bodyMarginWidth = args.bodyMarginWidth || 0;
		this.bodyMarginHeight = args.bodyMarginHeight || 0;
		
		
		var fncThis = this;	
		this.update();
		__.lib.addListeners(window, "resize", function(){ fncThis.update() });
	}
	__.classes.maxWidthWindow.prototype.update = function(){
		var fncThis = this;
		if(fncThis.handleWidth){
			if(typeof jQuery === 'undefined')
				var windowWidth = window.innerWidth || document.documentElement.clientWidth;
			else
				var windowWidth = __.lib.getRealWindowWidth();
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


