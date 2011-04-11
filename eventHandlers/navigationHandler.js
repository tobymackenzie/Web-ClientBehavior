/*
handles clicks on a selection of elements

@param typeItems (parent): type of elmsItems for finding necessary data
	parent, atomic
@param selectorChildren (a): selector of children of elmsItems that hold necessary data if type is parent
*/

/*-------
©navigationHandler
-------- */
__.classes.navigationHandler = function(arguments){
		//--required attributes
		this.elmsItems = arguments.elmsItems || null;
//->return
		if(!this.elmsItems || this.elmsItems.length < 1) return false;

		//--optional attributes
		this.attrData = arguments.attrData || "href";
		this.boot = arguments.boot || null;
		this.classCurrent = arguments.classCurrent || "current";
		this.doPreventDefault = (typeof arguments.doPreventDefault != "undefined")? arguments.doPreventDefault: true;
		this.onpreswitch = arguments.onpreswitch || null;
		this.onpreswitchtest = arguments.onpreswitchtest || null;
		this.onpostswitch = arguments.onpostswitch || null;
		this.onswitch = arguments.onswitch || null;
		this.selectorChildren = arguments.selectorChildren || "a";
		this.selectorListItemContainer = arguments.selectorListItemContainer || "li";
		this.typeItems = arguments.typeItems || "parent";

		//--derived attributes
		this.inprogress = false;
		this.queue = new __.classes.animationQueue();
		
		//--attach events
		this.attachEvents(this.elmsItems);
	}
	__.classes.navigationHandler.prototype.attachEvents = function(arguments){
		var fncThis = this;
		
		fncThis.elmsItems.bind("click touch", function(event){
//->return
			if(fncThis.inprogress == true)
				return false;
			var fncEvent = event;
			var localVariables = {elmThis: $(this)};
			if(fncThis.typeItems == "parent"){
				localVariables.oldItem = fncThis.elmsItems.filter("."+fncThis.classCurrent);
				localVariables.newItem = localVariables.elmThis.closest(fncThis.selectorListItemContainer);
			}else{
				localVariables.oldItem = fncThis.elmsItems.filter("."+fncThis.classCurrent);
				localVariables.newItem = localVariables.elmThis;
			}
//->return
			if(localVariables.oldItem[0] == localVariables.newItem[0]) return false;
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


