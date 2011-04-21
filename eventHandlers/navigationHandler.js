/*
handles clicks on a selection of elements

-----parameters

-----instantiation
*/

/*-------
©navigationHandler
-------- */
__.classes.navigationHandler = function(arguments){
		//--optional attributes
		this.elmsItems = arguments.elmsItems || null;
		this.attrData = arguments.attrData || "href";
		this.boot = arguments.boot || null;
		this.classCurrent = arguments.classCurrent || "current";
		this.doPreventDefault = (typeof arguments.doPreventDefault != "undefined")? arguments.doPreventDefault: true;
		this.onpreswitch = arguments.onpreswitch || null;
		this.onpreswitchtest = arguments.onpreswitchtest || null;
		this.onpostswitch = arguments.onpostswitch || null;
		this.onswitch = arguments.onswitch || null;

		//--derived attributes
		this.inprogress = false;
		
		//--attach events
		this.attachEvents(this.elmsItems);
	}
	__.classes.navigationHandler.prototype.attachEvents = function(arguments){
		var fncThis = this;
		
		var fncCallback = function(event){
//->return
			if(fncThis.inprogress == true)
				return false;

			var fncEvent = event;
			var localVariables = {elmThis: this};
//-*add in stuff to find old and new elements
//->return
//			if(localVariables.oldItem[0] == localVariables.newItem[0]) return false;
//->return
			if(fncThis.onpreswitchtest && !fncThis.onpreswitchtest.call(fncThis, localVariables)){
				if(fncThis.doPreventDefault){
					if(typeof event.preventDefault != "undefined")
						event.preventDefault();
					return false;
				}else{
					return true;
				}
			}
			fncThis.inprogress = true;	
			
			if(fncThis.doPreventDefault && typeof event.preventDefault != "undefined")
				event.preventDefault();
			
			if(fncThis.onpreswitch)
				fncThis.onpreswitch.call(fncThis, localVariables);

/*-*add set class stuff
			localVariables.oldItem.removeClass(fncThis.classCurrent);
			localVariables.newItem.addClass(fncThis.classCurrent);
*/
			if(fncThis.onswitch)
				fncThis.onswitch.call(fncThis, localVariables);

			if(fncThis.onpostswitch)
				fncThis.onpostswitch.call(fncThis, localVariables);

			fncThis.inprogress = false;
			
			return (fncThis.doPreventDefault)? false: true;
		}		

		__.addListeners(fncThis.elmsItems, "click", fncCallback);
		__.addListeners(fncThis.elmsItems, "touch", fncCallback);
	}

