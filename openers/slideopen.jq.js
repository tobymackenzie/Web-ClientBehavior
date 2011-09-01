/*
slides open and closed specified element(s)
*/

/*-------------
---init
$(document).ready(function(){
	__.wishlistSlideOpen = new __.classes.slideOpen({element: elmMoreList, strToggler: "", strTogglerClosed: elmMoreList.attr("data-count")+" more&hellip;", strTogglerOpened: "Hide additional items"
		,callbackPlaceToggler: function(argElement){
			this.element.closest(".wishlist").children(".wishlistitems.primary").after(argElement);
		}
		,callbackInit: function(){
			var fncThis = this;
			var elmCloserWrap = $('<div class="closerwrap">');
			var elmCloser = $('<a class="closer" href="javascript://hideAdditionalInformation();">hide</a>');
			elmCloserWrap.append("(").append(elmCloser).append(")");
			this.element.find("h3.header").after(elmCloserWrap);
			elmCloser.bind("click touchstart", function(){
				fncThis.close();
			});
		}
	}));

});

------------*/


/*------
©slideOpen
depends on: jquery, tmlib
------------*/
__.classes.slideOpen = function(arguments){
		this.element = arguments.element || null; if(!this.element) return false;
		this.strToggler = (arguments.strToggler !== undefined)? arguments.strToggler: "more";
		this.strTogglerClosed = (arguments.strTogglerClosed !== undefined)? arguments.strTogglerClosed: "View ";
		this.strTogglerOpened = (arguments.strTogglerOpened !== undefined)? arguments.strTogglerOpened: "Hide ";
		this.classOpen = arguments.classOpen || "open";
		this.classClosed = arguments.classClosed || "closed";
		this.callbackInit = arguments.callbackInit || false;
		this.callbackPlaceToggler = arguments.callbackPlaceToggler || null;
		this.callbackOpen = arguments.callbackOpen || null;
		this.callbackClose = arguments.callbackClose || null;
		this.duration = arguments.duration || 500;
		
		var fncThis = this;
		this.element.css("display", "none").addClass(this.classClosed).removeClass(this.classOpen);
		// init toggle clickable
		this.elmToggler = jQuery('<div class="toggler"><a href="javascript://toggleContentDisplay();">'+this.strTogglerClosed+this.strToggler+'</a></div>');
		if(this.callbackPlaceToggler)
			this.callbackPlaceToggler.call(this, this.elmToggler);
		else
			this.element.after(this.elmToggler);
		this.elmTogglerAnchor = this.elmToggler.find("a");
		this.elmTogglerAnchor.click(function(){
			fncThis.toggle();
		});
		
		if(this.callbackInit)
			this.callbackInit.call(this);
	}
	__.classes.slideOpen.prototype.toggle = function(){
		if(this.element.hasClass(this.classOpen))
			this.close();
		else
			this.open();
	}
	__.classes.slideOpen.prototype.open = function(){
		this.element.slideDown(this.duration, this.callbackOpen).addClass(this.classOpen).removeClass(this.classClosed);
		this.elmTogglerAnchor.html(this.strTogglerOpened+this.strToggler);
	}
	__.classes.slideOpen.prototype.close = function(){
		this.element.slideUp(this.duration, this.callbackClose).addClass(this.classClosed).removeClass(this.classOpen);
		this.elmTogglerAnchor.html(this.strTogglerClosed+this.strToggler);
	}

	
