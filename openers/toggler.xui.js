/*
description
-----parameters
-----instantiation
x$(window).load(function(){
	__.elmsEventArticles = x$("#page_calendar .eventlist article");
	if(__.elmsEventArticles.length > 0){
		__.articleHandlers = new Array();
		__.elmsEventArticles.each(function(argElementHTML, argIndex, argElements){
			var fncElement = x$(argElementHTML);
			__.articleHandlers.push(new __.classes.toggler({
				elmClickable: fncElement
				,elmToToggle: fncElement.find(".description")
				,closeoninit: true
				,onclose: function(argElement){
					var fncThis = this;
					var elmThis = argElement;
					elmThis.fadeOut(fncThis.duration, function(){
						elmThis.css(fncThis.styleClosed);
					});
				}
				,onopen: function(argElement){
					var fncThis = this;
					var elmThis = argElement;
					elmThis.css(fncThis.styleOpened).fadeIn(fncThis.duration, function(){
					});
				}
				,styleClosed: {display: "none", opacity: 0}
				,styleOpened: {display: "block"}
			}));
		});
	}
}
-----html
-----css
*/

/*----------
©toggler
----------*/
__.classes.toggler = function(arguments){
		if(typeof arguments == "undefined") arguments = {};

		//--optional attributes
		this.boot = arguments.boot || null;
		this.classOpen = (typeof arguments.classOpen != "undefined")? arguments.classOpen : "open";
		this.classClosed = (typeof arguments.classClosed != "undefined")? arguments.classClosed : "closed";
		this.closeoninit = arguments.closeoninit || false;
		this.duration = (typeof arguments.duration != "undefined")? arguments.duration : 500;
		this.elmClickable = arguments.elmClickable || null;
		this.elmToToggle = arguments.elmToToggle || null;
		this.onopen = arguments.onopen || null;
		this.onclose = arguments.onclose || null;
		this.ontoggle = arguments.ontoggle || null;
		this.styleClosed = arguments.styleClosed || {display: "none"};
		this.styleOpened = arguments.styleOpened || {display: "block"};
		this.typeEvent = arguments.typeEvent || "click";

		//--close elements on init
		if(this.closeoninit)
			this.elmToToggle/* .not("."+this.classClosed).not("."+this.classOpen) */.addClass(this.classClosed).css(this.styleClosed);
		else{
			this.elmToToggle/* .not("."+this.classClosed).not("."+this.classOpen) */.addClass(this.classOpen).css(this.styleOpened);
		}
		
		this.attachListeners(this.elmClickable);

	}
	__.classes.toggler.prototype.attachListeners = function(argElements){
		var fncThis = this;
		if(argElements && argElements.length > 0){
			argElements.on(this.typeEvent, function(event){
				fncThis.toggle(fncThis.elmToToggle);
				if(event.preventDefault)
					event.preventDefault();
				return false;
			});
		}
	}
	__.classes.toggler.prototype.toggle = function(argElement){
		if(argElement.hasClass(this.classOpen)){
			this.close(argElement);
		}else{
			this.open(argElement);
		}
		if(this.ontoggle) this.ontoggle.call(this, argElement);
	}
	__.classes.toggler.prototype.open = function(argElement){
		if(!argElement)
			argElement = this.elmToToggle;
		argElement.removeClass(this.classClosed).addClass(this.classOpen);
		if(this.onopen) this.onopen.call(this, argElement);
	}
	__.classes.toggler.prototype.close = function(argElement){
		if(!argElement)
			argElement = this.elmToToggle;
		argElement.removeClass(this.classOpen).addClass(this.classClosed);
		if(this.onclose) this.onclose.call(this, argElement);
	}

