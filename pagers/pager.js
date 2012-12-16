/*
Basic pager with pages collection and plenty of unimplemented funcionality.  Can work with both jQuery and non-jQuery situations

-----dependencies
tmlib
	lib: isElement, isInteger
	non jquery:
		lib: addClass, removeClass
	jquery:
		fn: random

-----parameters
-----instantiation
*/
//--no jquery
__.pager = new __.classes.pager({elmsPages: document.getElementById('maincontent').getElementsByClassName('tabpage'), elmsNavigation: document.getElementById('maincontent').getElementsByClassName('tab')});
//--jquery
__.pager = new __.classes.pager({elmsPages: jQuery('.bannerList .bannerItem')})
/*

-----html
-----css
*/

/*-------
©pager
-------- */
__.classes.pager = function(args){
		var lcThis = this;
		//--required attributes
//->return
		//--optional attributes
		this.boot = args.boot || {};
		this.classCurrent = args.classCurrent || 'current';
		this.cycler = args.cycler || null;
		this.doCarousel = (typeof args.doCarousel != 'undefined') ? args.doCarousel : true;
		this.elmCurrent = args.elmCurrent || null;
		this.elmsPages = args.elmsPages || null;
		this.oninit = args.oninit || null;
		this.onswitch = args.onswitch || null;
		this.navigation = args.navigation || null;
		this.transition = args.transition || null;
		if(!this.transition.onafter){
			this.transition.onafter = function(args){
				lcThis.setTo(args.elements[0]);
			}
		}

		//--derived attributes
		this.inProgress = true;
		if(!this.elmCurrent)
			this.elmCurrent = (this.elmsPages.first) ? this.elmsPages.first() : this.elmsPages[0];
		if(this.navigation){
			this.navigation.setTo(this.navigation.getElementForItem(this.elmCurrent));
			if(!this.navigation.onActivate){
				this.navigation.onActivate = function(argNavElement){
					lcThis.switchTo(argNavElement.data('tjmNavigationItem'));
					lcThis.cycle('stop');
				}
			}
		}

		//--do something
		this.setClasses();
		this.inProgress = false;

		if(this.oninit)
			this.oninit.call(fncThis);
	}
	__.classes.pager.prototype.cycle = function(argAction, argOptions){
		var action = (typeof argAction == 'string') ? argAction : 'init';
		var options = (typeof argAction == 'object') ? argAction : argOptions;
		if(!options){
			options = (action == 'init') ? {} : [];
		}
		if(action == 'init'){
			var cyclerOptions = {
				'method': 'switchTo'
				,'methodArguments': ['next']
				,'object': this
			};
			if(jQuery || false){
				jQuery.extend(cyclerOptions, options);
			}else{

			}
			this.cycler = new __.classes.Cycler(cyclerOptions);
		}else{
			this.cycler[action].apply(this.cycler, options);
		}
	}
	__.classes.pager.prototype.setTo = function(argElmNew){
		if(argElmNew[0] !== this.elmCurrent[0]){
			if(this.navigation && !this.inProgress){
				this.navigation.setTo(this.navigation.getElementForItem(this.elmCurrent));
			}
			this.elmCurrent = argElmNew;
			this.setClasses();
			if(this.onswitch){
				this.onswitch.call(this);
			}
			this.inProgress = false;
		}
	}
	__.classes.pager.prototype.setClasses = function(){
		if(this.elmsNavigation){
			if(jQuery){
				this.elmsNavigation.removeClass(this.classCurrentNavigation);
				this.elmNavigationCurrent.addClass(this.classCurrentNavigation);
			}else{
				for(var key in this.elmsNavigation){
					if(this.elmsNavigation.hasOwnProperty(key) && this.elmsNavigation[key].getElementsByTagName){
						__.lib.removeClass(this.elmsNavigation[key], this.classCurrentNavigation);
					}
				}
				if(this.elmNavigationCurrent){
					__.lib.addClass(this.elmNavigationCurrent, this.classCurrentNavigation);
				}
			}
		}
		if(this.elmsPages){
			if(jQuery){
				this.elmsPages.removeClass(this.classCurrent);
				this.elmCurrent.addClass(this.classCurrent);
			}else{
				for(var key in this.elmsPages){
					if(this.elmsPages.hasOwnProperty(key) && this.elmsPages[key].getElementsByTagName){
						__.lib.removeClass(this.elmsPages[key], this.classCurrent);
					}
				}
				if(this.elmCurrent){
					__.lib.addClass(this.elmCurrent, this.classCurrent);
				}
			}
		}
	}
	__.classes.pager.prototype.switchTo = function(argTo){
		if(argTo instanceof jQuery || __.lib.isElement(argTo)){
			this.switche(argTo);
		}else if(__.lib.isInteger(argTo)){
			if(this.elmsPages.eq){
				this.switche(this.elmsPages.eq(argTo));
			}else{
				this.switche(this.elmsPages[argTo]);
			}
		}else if(typeof argTo == 'string'){
			switch(argTo){
				case 'previous':
					if(this.elmsPages.prev){ //--jQuery
						var elmPagePrevious = this.elmCurrent.prev();
						if(elmPagePrevious.length < 1 && this.doCarousel){
							elmPagePrevious = this.elmsPages.last();
						}
						if(elmPagePrevious.length > 0){
							this.switche(elmPagePrevious);
						}
					}
				break;
				case 'random':
					var newElement = null;
					if(this.elmsPages.length > 0){
						if(this.elmsPages.random){
							do{
								newElement = this.elmsPages.random();
							}while(this.elmCurrent && newElement[0] == this.elmCurrent[0]);
							this.switche(newElement);
						}
					}
				break;
				case 'next':
				default:
					if(this.elmsPages.next){ //--jQuery
						var elmPageNext = this.elmCurrent.next();
						if(elmPageNext.length < 1 && this.doCarousel){
							elmPageNext = this.elmsPages.first();
						}
						if(elmPageNext.length > 0){
							this.switche(elmPageNext);
						}
					}
				break;
			}
		}
		return this;
	}
	__.classes.pager.prototype.switche = function(argElmNew){
		if(!this.inProgress && argElmNew[0] !== this.elmCurrent[0]){
			this.inProgress = true;
			if(this.navigation){
				this.navigation.switchTo(this.navigation.getElementForItem(argElmNew));
			}
			if(this.transition){
				if(typeof this.transition == 'string'){
					//-! unimplemented, will presumably have named transitions prebuilt
				}else{
					var transition = this.transition;
				}
				var transitionElements = [
					this.elmCurrent
					,argElmNew
				];
				if(this.elmsNavigation){
					transitionElements.push(this.elmNavigationCurrent);
					transitionElements.push(elmNavigationNew);
				}
				if(typeof transition == 'object'){
					var transitionArgs = {
						elements: transitionElements
					};
					transition.transitionForElements(transitionArgs);
				}else if(typeof transition == 'function'){
					transition.apply(this, transitionElements);
				}
			}else{
				this.setTo(argElmNew);
			}
		}
	}
