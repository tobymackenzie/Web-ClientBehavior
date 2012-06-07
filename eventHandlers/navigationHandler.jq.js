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
		if((!this.elmsItems || this.elmsItems.length < 1) && !args.selectorItem) return false;

		//--optional attributes
		this.attrData = args.attrData || "href";
		this.boot = args.boot || null;
		this.classCurrent = args.classCurrent || "current";
		this.doPreventDefault = (typeof args.doPreventDefault != "undefined")? args.doPreventDefault: true;
		this.elmItemsWrap = args.elmItemsWrap || jQuery('body');
		this.onpreswitch = args.onpreswitch || null;
		this.onpreswitchtest = args.onpreswitchtest || null;
		this.onpostswitch = args.onpostswitch || null;
		this.onswitch = args.onswitch || null;
		this.selectorElmForEvent = args.selectorElmForEvent || "a";
		this.selectorElmForData = args.selectorElmForData || "a";
		this.selectorItem = args.selectorItem || "li";

		//--derived attributes
		this.inprogress = false;
		this.queue = new __.classes.animationQueue();
		
		//--attach events
		this.attachEvents(this.elmsItems);
	}
	__.classes.navigationHandler.prototype.attachEvents = function(args){
		var fncThis = this;
		var fncCallback = function(argEvent){
//->return
			if(fncThis.inprogress == true)
				return false;
			var lcl = {elmThis: jQuery(this)};

			//--determine old and new item
			lcl.oldItem = (fncThis.elmsItems)
				? fncThis.elmsItems.filter("."+fncThis.classCurrent)
				: fncThis.elmItemsWrap.find(fncThis.selectorItem+"."+fncThis.classCurrent)
			;
			if(fncThis.selectorElmForEvent == "this"){
				lcl.newItem = lcl.elmThis;
			}else{
				lcl.newItem = lcl.elmThis.closest(fncThis.selectorItem);
			}
//->return
			if(lcl.oldItem[0] == lcl.newItem[0]) return false;

			//--get data
			if(fncThis.selectorElmForData == "this"){
				lcl.dataOld = lcl.oldItem.attr(fncThis.attrData);
				lcl.dataNew = lcl.newItem.attr(fncThis.attrData);
			}else{
				lcl.dataOld = lcl.oldItem.find(fncThis.selectorElmForData).attr(fncThis.attrData);
				lcl.dataNew = lcl.newItem.find(fncThis.selectorElmForData).attr(fncThis.attrData);
			}

			//--preswitchtest
//->return
			if(fncThis.onpreswitchtest && !fncThis.onpreswitchtest.call(fncThis, lcl)){
				if(fncThis.doPreventDefault){
					if(typeof argEvent.preventDefault != "undefined")
						argEvent.preventDefault();
					return false;
				}else{
					return true;
				}
			}
			fncThis.inprogress = true;	
			
			if(fncThis.doPreventDefault && typeof argEvent.preventDefault != "undefined")
				argEvent.preventDefault();
			
			if(fncThis.onpreswitch)
				fncThis.queue.queue(function(){
					fncThis.onpreswitch.call(fncThis, lcl);
				});

			fncThis.queue.queue(function(){
				lcl.oldItem.removeClass(fncThis.classCurrent);
				lcl.newItem.addClass(fncThis.classCurrent);
				if(fncThis.onswitch)
					fncThis.onswitch.call(fncThis, lcl);
				else
					fncThis.queue.dequeue();
			});

			if(fncThis.onpostswitch)
				fncThis.queue.queue(function(){
					fncThis.onpostswitch.call(fncThis, lcl);
				});
			fncThis.queue.queue(function(){
				fncThis.inprogress = false;
				fncThis.queue.dequeue();
			});
			
			fncThis.queue.dequeue();
			
			return (fncThis.doPreventDefault)? false: true;
		};
		if(fncThis.elmsItems){
			var fncItems = (fncThis.selectorElmForEvent == "this")
				? fncThis.elmsItems
				: fncThis.elmsItems.find(fncThis.selectorElmForEvent)
			;
			fncItems.bind("click touch", fncCallback);
		}else{
			var fncSelector = (fncThis.selectorElmForEvent == "this")
				? fncThis.selectorItem
				: fncThis.selectorItem + ' ' + fncThis.selectorElmForEvent
			;
			fncThis.elmItemsWrap.delegate(fncSelector, 'click touch', fncCallback)
		}
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

