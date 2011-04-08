/*
opens and closes element with built toggle button

-----instantiation
__.scrOnload = function(){
	var elmFormKeuring = document.getElementById("keuringform");
	if(elmFormKeuring){
		__.keuringOpener = new __.classes.opener({
			element: elmFormKeuring
			,strToggler: ""
			,strTogglerClosed: "Add a keuring"
			,strTogglerOpened: "Close add form"
		});
	}
};

*/

/*------
©opener
------------*/
__.classes.opener = function(arguments){
		//--required attributes
		this.element = arguments.element || null; if(!this.element) return false;
//->return

		//--optional attributes
		this.boot = arguments.boot || null;
		this.callbackPlaceToggler = arguments.callbackPlaceToggler || null;
		this.classOpened = arguments.classOpened || "open";
		this.classClosed = arguments.classClosed || "closed";
		this.classesToggler = arguments.classesToggler || "toggler";
		this.elmContainer = arguments.elmContainer || false;
		this.insertPosition = arguments.insertPosition || "after";
		this.oninit = arguments.oninit || null;
		this.onopen = arguments.onopen || null;
		this.onclose = arguments.onclose || null;
		this.stateInitial = arguments.stateInitial || "closed";
		this.strToggler = (arguments.strToggler !== undefined)? arguments.strToggler: "more";
		this.strTogglerClosed = (arguments.strTogglerClosed !== undefined)? arguments.strTogglerClosed: "View ";
		this.strTogglerOpened = (arguments.strTogglerOpened !== undefined)? arguments.strTogglerOpened: "Hide ";
		
		//--derived attributes
		var fncThis = this;
		this.cssDisplayElement = this.element.style.display;
		if(this.cssDisplayElement == "none")
			this.cssDisplayElement = "block";
		
		//--show or hide element
		if(this.stateInitial == "closed"){
			this.close();
		}else{
			this.open();
		}
		
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.opener.prototype.initToggler = function(){
		var fncThis = this;
		//--create elements
		this.elmToggler = document.createElement("div");
		__.addClass(this.elmToggler, this.classesToggler);
		this.elmTogglerAnchor = document.createElement("a");
		this.elmTogglerAnchor.setAttribute("href", "javascript://toggleContentDisplay();");
		this.elmToggler.appendChild(this.elmTogglerAnchor);

		//--add to DOM
		if(this.callbackPlaceToggler)
			this.callbackPlaceToggler.call(this, this.elmToggler);
		else{
			if(this.elmContainer)
				this.elmContainer.appendChild(this.elmToggler);
			else{
				var elmBefore = false;
				if(this.insertPosition == "after")
					elmBefore = __.lib.getNextSibling(this.element);
				if(this.insertPosition == "before" || !elmBefore)
					elmBefore = this.element;
				__.lib.insertBefore(this.elmToggler, elmBefore);
			}
		
		}

		//--add listener
		__.addListeners(this.elmTogglerAnchor, "click", function(){
			fncThis.toggle();
		});
	}
	__.classes.opener.prototype.toggle = function(){
		if(__.hasClass(this.element, this.classOpened))
			this.close();
		else
			this.open();
	}
	__.classes.opener.prototype.open = function(){
		this.element.style.display = this.cssDisplayElement;
		__.removeClass(this.element, this.classClosed);
		__.addClass(this.element, this.classOpened);
		this.setMessage(this.strTogglerOpened+this.strToggler);
		if(this.onopen)
			this.onopen.call(this);
	}
	__.classes.opener.prototype.close = function(){
		this.element.style.display = "none";
		__.removeClass(this.element, this.classOpened);
		__.addClass(this.element, this.classClosed);
		this.setMessage(this.strTogglerClosed+this.strToggler);
		if(this.onclose)
			this.onclose.call(this);
	}
	__.classes.opener.prototype.setMessage = function(argMessage){
		if(typeof this.elmTogglerAnchor == "undefined")
			this.initToggler();
		this.elmTogglerAnchor.innerHTML = argMessage;
	}

