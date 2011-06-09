/*
semi-generic pagemanager working with hashes with a simple built in animation or can use external animation

-----dependencies
tmlib base
jquery

-----instantiation
			var elmHomeBGContainer = $("#bgmainimages");
			
			if(elmHomeBGContainer.length > 0){
				__.homeBGPager = new __.classes.pagerManagerHash({elmsItems: elmHomeBGContainer.find(".bgmainpiece"), doUseHash: false, doShowHide: false
					,oninit: function(){
						this.elmsItems.hide();
						this.getPageCurrent().show();
					}
					,handlerAnimation: new __.classes.pagerAnimatorDissolve({cssZIndexBehind: -3, cssZIndexNormal: -2})
				});
				setInterval(function(){
					__.homeBGPager.switchToNext();
				}, 8000)
			}

*/

/*-------------
©pagerManagerHash
------------*/
__.classes.pagerManagerHash = function(arguments){
		//--required attributes
		this.elmsItems = arguments.elmsItems || false; if(!this.elmsItems || this.elmsItems.length < 1) return false;
//->return

		//--optional attributes
		this.handlerAnimation = arguments.handlerAnimation || null;
		this.handlerNavigation = arguments.handlerNavigation || null;
		this.classCurrent = arguments.classCurrent || "current";
		this.doCarousel = (typeof arguments.doCarousel != "undefined")? arguments.doCarousel: true;
		this.doShowHide = (typeof arguments.doShowHide != "undefined")? arguments.doShowHide: true;
		this.doUseHash = (typeof arguments.doUseHash != "undefined")? arguments.doUseHash: true;
		this.duration = (typeof arguments.duration != "undefined")? arguments.duration: 500;
		this.oninit = arguments.oninit || null;
		this.onpreswitch = arguments.onpreswitch || null;
		this.onpostswitch = arguments.onpostswitch || null;
		this.boot = arguments.boot || null;

		//--derived attributes
		var fncThis = this;
		this.inprogress = true;
		this.queue = new __.classes.animationQueue();
		
		//--hide all, display first
		if(window.location.hash && this.doUseHash){
			this.idCurrent = window.location.hash;
			this.elmsItems.removeClass(this.classCurrent);
			this.elmsItems.filter(__.lib.escapeHash(window.location.hash)).addClass(this.classCurrent);
		}else{
			var elmCurrentPage = this.getPageCurrent();
			if(elmCurrentPage && elmCurrentPage.length > 0){
			}else{
				elmCurrentPage = this.elmsItems.first();
				elmCurrentPage.addClass(this.classCurrent);
			}
			this.idCurrent = "#"+elmCurrentPage.attr("id");
		}
		if(this.doShowHide){
			this.elmsItems.hide();
			elmCurrentPage.show();
		}
				
		this.inprogress = false;
		
		//--set up event handlers for event manager
		if(this.handlerNavigation){
			this.handlerNavigation.onswitch = function(arguments){
				fncThis.switche(arguments.dataNew);
			}
		}
		
		//--set up animation handler
		if(this.handlerAnimation){
			this.handlerAnimation.onpostswitch = function(arguments){
				fncThis.inprogress = false;
				this.queue.dequeue();
				fncThis.idCurrent = "#"+arguments.elmTo.attr("id");
				fncThis.queue.dequeue();
			}
		}
		
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.pagerManagerHash.prototype.switchToPrevious = function(){
		if(this.handlerNavigation)
			this.handlerNavigation.switchToPrevious();
		else{
			var elmCurrent = this.getPageCurrent();
			if(elmCurrent){
				var elmPrevious = elmCurrent.prev();
				if(elmPrevious && elmPrevious.length < 1 && this.doCarousel){
					elmPrevious = this.elmsItems.last();
				}
			}else{
				var elmPrevious = this.elmsItems.last();
			}
			this.switche("#"+elmPrevious.attr("id"));
		}
	}
	__.classes.pagerManagerHash.prototype.switchToNext = function(){
		if(this.handlerNavigation)
			this.handlerNavigation.switchToNext();
		else{
			var elmCurrent = this.getPageCurrent();
			if(elmCurrent){
				var elmNext = elmCurrent.next();
				if(elmNext && elmNext.length < 1 && this.doCarousel){
					elmNext = this.elmsItems.first();
				}
			}else{
				var elmNext = this.elmsItems.first();
			}
			this.switche("#"+elmNext.attr("id"));
		}
	}
	__.classes.pagerManagerHash.prototype.switche = function(argID){
		if(this.inprogress == true || argID == this.idCurrent){
			return false;
		}else{
			var fncThis = this;
			var localVariables = {};
			localVariables.idNext = argID;
			localVariables.elmNext = this.elmsItems.filter(__.lib.escapeHash(localVariables.idNext));
			localVariables.elmCurrent = this.getPageCurrent();
//->return
			if(localVariables.elmNext.length < 1)
				return false;
			fncThis.inprogress = true;

			if(this.handlerAnimation)
				this.handlerAnimation.switche({elmFrom: localVariables.elmCurrent, elmTo: localVariables.elmNext});
			else{
				var callbackPostShowNext = function(){
					localVariables.elmNext.addClass(fncThis.classCurrent);
					fncThis.inprogress = false;
					if(fncThis.onpostswitch)
						fncThis.onpostswitch.call(fncThis, localVariables);
				}
				var callbackPostHideCurrent = function(){
				}
				
				//--set up queue
				if(fncThis.onpreswitch)
					fncThis.queue.queue({callback: function(){
						fncThis.onpreswitch.call(fncThis, localVariables);
					}});
				if(fncThis.doShowHide){
					fncThis.queue.queue({callback: function(){
							localVariables.elmCurrent.fadeOut(fncThis.duration, function(){
								fncThis.queue.dequeue();
							});
					}});
				}
				fncThis.queue.queue({callback: function(){
					localVariables.elmCurrent.removeClass(fncThis.classCurrent);
					fncThis.idCurrent = localVariables.idNext;
					fncThis.queue.dequeue();
				}});
				if(fncThis.doShowHide){
					fncThis.queue.queue({callback: function(){
						localVariables.elmNext.fadeIn(fncThis.duration, function(){
							fncThis.queue.dequeue();
						});
					}});
				}
				fncThis.queue.queue({callback: function(){
					localVariables.elmNext.addClass(fncThis.classCurrent);
					fncThis.queue.dequeue();
				}});
				if(fncThis.onpostswitch)
					fncThis.queue.queue({callback: function(){
						fncThis.onpostswitch.call(fncThis, localVariables);
					}});
				fncThis.queue.queue({callback: function(){
					fncThis.inprogress = false;
					fncThis.queue.dequeue();
				}});
		
				//--start queue		
				fncThis.queue.dequeue();
			}
		}
	}
	__.classes.pagerManagerHash.prototype.getPageCurrent = function(){
		var fncReturn = false;
		if(this.idCurrent)
			fncReturn = this.elmsItems.filter(__.lib.escapeHash(this.idCurrent));
		if(!fncReturn || (fncReturn && fncReturn.length < 1))
			fncReturn = this.elmsItems.filter("."+this.classCurrent);
		return (fncReturn && fncReturn.length > 0)? fncReturn: false;
	}

