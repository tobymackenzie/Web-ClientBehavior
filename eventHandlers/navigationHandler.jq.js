/*
handles clicks on a selection of elements

-----parameters
@param typeItems (parent): type of elmsItems for finding necessary data
	parent, atomic
@param selectorElmForData (a): selector of children of elmsItems that hold necessary data if type is parent

-----instantiation
		var mainnavigationItems = $("#topnavigationlist .topitem, #logo");
		if(mainnavigationItems.length > 0){
			__.mainnavigationHandler = new __.classes.navigationHandler({
				elmsItems: mainnavigationItems
				,onpreswitch: function(args){
					var fncThis = this;
					var urlAjax = args.newItem.find(this.selectorElmForData).attr(this.attrData);
					if(urlAjax.substring(0,1) == "#")
						urlAjax = urlAjax.substring(1, urlAjax.length - 1);
					var pagetype = args.newItem.attr(this.boot.attrType);
					__.router.callRoute({path: urlAjax, arguments: {url: urlAjax}});
				}
				,boot: {attrType: "data-pagetype"}
			});
		}
*/

/*---------
©navigationHandler
----------*/
__.classes.navigationHandler = function(args){
		//--required attributes
		this.elmsItems = args.elmsItems || null;
//->return
		if(!this.elmsItems || this.elmsItems.length < 1) return false;

		//--optional attributes
		this.attrData = args.attrData || "href";
		this.boot = args.boot || null;
		this.classCurrent = args.classCurrent || "current";
		this.doPreventDefault = (typeof args.doPreventDefault != "undefined")? args.doPreventDefault: true;
		this.onpreswitch = args.onpreswitch || null;
		this.onpreswitchtest = args.onpreswitchtest || null;
		this.onpostswitch = args.onpostswitch || null;
		this.onswitch = args.onswitch || null;
		this.selectorElmForEvent = args.selectorElmForEvent || "a";
		this.selectorElmForData = args.selectorElmForData || "a";
		this.selectorItemContainer = args.selectorListItemContainer || "li";

		//--derived attributes
		this.inprogress = false;
		this.queue = new __.classes.animationQueue();
		
		//--attach events
		this.attachEvents(this.elmsItems);
	}
	__.classes.navigationHandler.prototype.attachEvents = function(args){
		var fncThis = this;
		
		if(fncThis.selectorElmForEvent == "this"){
			var fncItems = fncThis.elmsItems;
		}else{
			var fncItems = fncThis.elmsItems.find(fncThis.selectorElmForEvent);
		}

		fncItems.bind("click touch", function(event){
//->return
			if(fncThis.inprogress == true)
				return false;
			var fncEvent = event;
			var localVariables = {elmThis: jQuery(this)};

			//--determine old and new item
			localVariables.oldItem = fncThis.elmsItems.filter("."+fncThis.classCurrent);
			if(fncThis.selectorElmForEvent == "this"){
				localVariables.newItem = localVariables.elmThis;
			}else{
				localVariables.newItem = localVariables.elmThis.closest(fncThis.selectorListItemContainer);
			}
//->return
			if(localVariables.oldItem[0] == localVariables.newItem[0]) return false;

			//--get data
			if(fncThis.selectorElmForData == "this"){
				localVariables.dataOld = localVariables.oldItem.attr(fncThis.attrData);
				localVariables.dataNew = localVariables.newItem.attr(fncThis.attrData);
			}else{
				localVariables.dataOld = localVariables.oldItem.find(fncThis.selectorElmForData).attr(fncThis.attrData);
				localVariables.dataNew = localVariables.newItem.find(fncThis.selectorElmForData).attr(fncThis.attrData);
			}

			//--preswitchtest
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
				fncThis.queue.queue(function(){
					fncThis.onpreswitch.call(fncThis, localVariables);
				});

			fncThis.queue.queue(function(){
				localVariables.oldItem.removeClass(fncThis.classCurrent);
				localVariables.newItem.addClass(fncThis.classCurrent);
				if(fncThis.onswitch)
					fncThis.onswitch.call(fncThis, localVariables);
				else
					fncThis.queue.dequeue();
			});

			if(fncThis.onpostswitch)
				fncThis.queue.queue(function(){
					fncThis.onpostswitch.call(fncThis, localVariables);
				});
			fncThis.queue.queue(function(){
				fncThis.inprogress = false;
				fncThis.queue.dequeue();
			});
			
			fncThis.queue.dequeue();
			
			return (fncThis.doPreventDefault)? false: true;
		});
	}
	__.classes.navigationHandler.prototype.switchToPrevious = function(){
		var elmPrevious = this.elmsItems.filter(this.classCurrent).prev();
		if(elmPrevious.length < 1 && this.doSwitchCarousel)
			elmPrevious = this.elmsItems.last();
		if(elmPrevious.length > 0)
			this.switchToElm(elmPrevious);
		else
			return false;
	}
	__.classes.navigationHandler.prototype.switchToNext = function(){
		var elmNext = this.elmsItems.filter(this.classCurrent).next();
		if(elmNext.length < 1 && this.doSwitchCarousel)
			elmNext = this.elmsItems.first();
		if(elmNext.length > 0)
			this.switchToElm(elmNext);
		else
			return false;
	}


