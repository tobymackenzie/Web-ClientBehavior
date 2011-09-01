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
__.classes.toggler = function(args){
		if(typeof args == "undefined") args = {};

		//--optional attributes
		this.boot = args.boot || null;
		this.classOpen = (typeof args.classOpen != "undefined")? args.classOpen : "open";
		this.classClosed = (typeof args.classClosed != "undefined")? args.classClosed : "closed";
		this.closeoninit = args.closeoninit || false;
		this.duration = (typeof args.duration != "undefined")? args.duration : 500;
		this.elmClickable = args.elmClickable || null;
		this.elmToToggle = args.elmToToggle || null;
		this.onopen = args.onopen || null;
		this.onclose = args.onclose || null;
		this.ontoggle = args.ontoggle || null;
		this.styleClosed = args.styleClosed || {display: "none"};
		this.styleOpened = args.styleOpened || {display: "block"};
		this.typeEvent = args.typeEvent || "click";

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

