/*-------------
purpose:
	adds toggling capabilities to a selection of items on click, simply adding an open or closed class to them
depends on:
	jquery
	tmlib
*/

if(typeof $ !== 'undefined'){
	$(document).ready(function(){
		var toggleItems = $("#leftbar.products .box.further_selection");
		if(toggleItems.length > 0)
			new __.classes.Toggler({"elmsItems":toggleItems, "selectorElmClick":"h3", closeoninit: true});
	});
}


/* ******
©toggler
********* */
__.classes.Toggler = function(arguments){
		this.elmsItems = arguments.elmsItems || null;
		this.classOpen = arguments.classOpen || "open";
		this.classClosed = arguments.classClosed || "closed";
		this.event = arguments.event || "click";
		this.closeoninit = arguments.closeoninit || false;
		this.onopen = arguments.onopen || null;
		this.onclose = arguments.onclose || null;
		this.ontoggle = arguments.ontoggle || null;
		this.selectorElmClick = arguments.selectorElmClick || null;
		
		if(this.closeoninit)
			this.elmsItems.not("."+this.classClosed).not("."+this.classOpen).addClass(this.classClosed);
//			this.close(this.elmsItems.not("."+this.classClosed).not("."+this.classOpen));
		else
			this.elmsItems.not("."+this.classClosed).not("."+this.classOpen).addClass(this.classOpen);
//			this.open(this.elmsItems.not("."+this.classClosed).not("."+this.classOpen));
		
		this.attachListeners(this.elmsItems);
	}
	__.classes.Toggler.prototype.attachListeners = function(argElements){
		var fncThis = this;
		argElements.each(function(){
			var elmParent = $(this);
			elmParent.find(fncThis.selectorElmClick).css("cursor", "pointer").bind(fncThis.event, function(event){
				fncThis.toggle(elmParent);
				if(event.preventDefault)
					event.preventDefault();
				return false;
			});
		});
	}
	__.classes.Toggler.prototype.toggle = function(argElement){
		if(argElement.hasClass(this.classOpen)){
			this.close(argElement);
			if(this.ontoggle) this.ontoggle.call(this);
		}
		else{
			this.open(argElement);
			if(this.ontoggle) this.ontoggle.call(this);
		}
	}
	__.classes.Toggler.prototype.open = function(argElement){
		argElement.removeClass(this.classClosed).addClass(this.classOpen);
		if(this.onopen) this.onopen.call(this);
	}
	__.classes.Toggler.prototype.close = function(argElement){
		argElement.removeClass(this.classOpen).addClass(this.classClosed);
		if(this.onclose) this.onclose.call(this);
	}

