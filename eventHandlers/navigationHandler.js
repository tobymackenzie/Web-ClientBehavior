/*
handles clicks on a selection of elements

-----parameters

-----instantiation
__.scrOnload = function(){
	var videoNavGrid = document.getElementById(__.cfg.idVideoNavGrid);		
	if(videoNavGrid){
		__.mainnavigationHandler = new __.classes.navigationHandler({
			elmsItems: videoNavGrid.getElementsByTagName("a")
			,doPreventDefault: false
			,oninit: function(){
				this.boot.elmVideoPlayerYoutube.style.left = __.cfg.offscreen;
			}
			,onswitch: function(arguments){

				var fncThis = this;
				var elmThis = arguments.elmThis;
				var elmID = elmThis.getAttribute(fncThis.boot.attrID);
				if(elmThis.getAttribute(fncThis.boot.attrType) == "youtube"){
					fncThis.boot.elmVideoPlayerLocal.style.left = __.cfg.offscreen;
					fncThis.boot.elmVideoPlayerYoutube.style.left = "0";
				}else{
					fncThis.boot.elmVideoPlayerLocal.style.left = "0";
					fncThis.boot.elmVideoPlayerYoutube.style.left = __.cfg.offscreen;
 				}
				highlightVideo(__.cfg.idVideoNavGrid,'video'+elmID);			
			}
			,boot: {elmVideoBox: document.getElementById(__.cfg.idVideoBox), elmVideoPlayerLocal: document.getElementById(__.cfg.idVideoPlayerLocal), elmVideoPlayerYoutube: document.getElementById(__.cfg.idVideoPlayerYoutube), attrType: "data-type", attrID: "data-id"}
		});
	}
}
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
		this.oninit = arguments.oninit || null;
		this.onpreswitch = arguments.onpreswitch || null;
		this.onpreswitchtest = arguments.onpreswitchtest || null;
		this.onpostswitch = arguments.onpostswitch || null;
		this.onswitch = arguments.onswitch || null;

		//--derived attributes
		this.inprogress = false;

		//--attach events
		this.attachEvents(this.elmsItems);
		
		//--init
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.navigationHandler.prototype.attachEvents = function(arguments){
		var fncThis = this;
		
		var fncCallback = function(event, arg2, arg3, arg4){
//->return
			if(fncThis.inprogress == true)
				return false;

			var fncEvent = event;
			var localVariables = {elmThis: this, event: event};
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

//-*add set class stuff
//			localVariables.oldItem.removeClass(fncThis.classCurrent);
//			localVariables.newItem.addClass(fncThis.classCurrent);

			if(fncThis.onswitch)
				fncThis.onswitch.call(fncThis, localVariables);

			if(fncThis.onpostswitch)
				fncThis.onpostswitch.call(fncThis, localVariables);

			fncThis.inprogress = false;
			
			return (fncThis.doPreventDefault)? false: true;
		}		

		__.addListeners(fncThis.elmsItems, "mouseup", fncCallback);
		__.addListeners(fncThis.elmsItems, "touch", fncCallback);
	}

