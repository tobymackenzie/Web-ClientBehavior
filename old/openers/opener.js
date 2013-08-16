/*
opens and closes element with built toggle button

-----instantiation
__.scrOnload = function(){
	var elmFormKeuring = document.getElementById('keuringform');
	if(elmFormKeuring){
		__.keuringOpener = new __.classes.opener({
			element: elmFormKeuring
			,strToggler: ''
			,strTogglerClosed: 'Add a keuring'
			,strTogglerOpened: 'Close add form'
		});
	}
};

*/

/*------
©opener
------------*/
__.classes.opener = function(args){
		//--required attributes
		this.element = args.element || null; if(!this.element) return false;
//->return

		//--optional attributes
		this.boot = args.boot || null;
		this.callbackPlaceToggler = args.callbackPlaceToggler || null;
		this.classOpened = args.classOpened || 'open';
		this.classClosed = args.classClosed || 'closed';
		this.classesToggler = args.classesToggler || 'toggler';
		this.elmContainer = args.elmContainer || false;
		this.insertPosition = args.insertPosition || 'after';
		this.oninit = args.oninit || null;
		this.onopen = args.onopen || null;
		this.onclose = args.onclose || null;
		this.stateInitial = args.stateInitial || 'closed';
		this.strToggler = (args.strToggler !== undefined)? args.strToggler: 'more';
		this.strTogglerClosed = (args.strTogglerClosed !== undefined)? args.strTogglerClosed: 'View ';
		this.strTogglerOpened = (args.strTogglerOpened !== undefined)? args.strTogglerOpened: 'Hide ';

		//--derived attributes
		var fncThis = this;
		this.cssDisplayElement = this.element.style.display;
		if(this.cssDisplayElement == 'none')
			this.cssDisplayElement = 'block';

		//--show or hide element
		if(this.stateInitial == 'closed'){
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
		this.elmToggler = document.createElement('div');
		__.lib.addClass(this.elmToggler, this.classesToggler);
		this.elmTogglerAnchor = document.createElement('a');
		this.elmTogglerAnchor.setAttribute('href', 'javascript:/*toggleContentDisplay()*/');
		this.elmToggler.appendChild(this.elmTogglerAnchor);

		//--add to DOM
		if(this.callbackPlaceToggler)
			this.callbackPlaceToggler.call(this, this.elmToggler);
		else{
			if(this.elmContainer)
				this.elmContainer.appendChild(this.elmToggler);
			else{
				var elmBefore = false;
				if(this.insertPosition == 'after')
					elmBefore = __.lib.getNextSibling(this.element);
				if(this.insertPosition == 'before' || !elmBefore)
					elmBefore = this.element;
				__.lib.insertBefore(this.elmToggler, elmBefore);
			}

		}

		//--add listener
		__.lib.addListeners(this.elmTogglerAnchor, 'click', function(){
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
		__.lib.removeClass(this.element, this.classClosed);
		__.lib.addClass(this.element, this.classOpened);
		this.setMessage(this.strTogglerOpened+this.strToggler);
		if(this.onopen)
			this.onopen.call(this);
	}
	__.classes.opener.prototype.close = function(){
		this.element.style.display = 'none';
		__.lib.removeClass(this.element, this.classOpened);
		__.lib.addClass(this.element, this.classClosed);
		this.setMessage(this.strTogglerClosed+this.strToggler);
		if(this.onclose)
			this.onclose.call(this);
	}
	__.classes.opener.prototype.setMessage = function(argMessage){
		if(typeof this.elmTogglerAnchor == 'undefined')
			this.initToggler();
		this.elmTogglerAnchor.innerHTML = argMessage;
	}

