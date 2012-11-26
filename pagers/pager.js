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
		//--required attributes
//->return
		//--optional attributes
		this.boot = args.boot || {};
		this.classCurrentNavigation = args.classCurrentNavigation || 'current';
		this.classCurrentPage = args.classCurrentPage || 'current';
		this.elmNavigationCurrent = args.elmNavigationCurrent || null;
		this.elmsNavigation = args.elmsNavigation || null;
		this.elmPageCurrent = args.elmPageCurrent || null;
		this.elmsPages = args.elmsPages || null;
		this.transition = args.transition || null;
		this.oninit = args.oninit || null;
		this.onswitch = args.onswitch || null;

		//--overridden methods
		if(args.getCurrentNavigationItem){
			this.getCurrentNavigationItem = args.getCurrentNavigationItem;
		}

		//--derived attributes
		this.inProgress = true;
		if(!this.elmPageCurrent)
			this.elmPageCurrent = (this.elmsPages.first) ? this.elmsPages.first() : this.elmsPages[0];
		if(!this.elmNavigationCurrent && this.elmsNavigation)
			this.elmNavigationCurrent = this.getCurrentNavigationItem(this.elmPageCurrent);
		this.setClasses();

		//--do something
		if(this.oninit)
			this.oninit.call(fncThis);
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
				this.elmsPages.removeClass(this.classCurrentPage);
				this.elmPageCurrent.addClass(this.classCurrentPage);
			}else{
				for(var key in this.elmsPages){
					if(this.elmsPages.hasOwnProperty(key) && this.elmsPages[key].getElementsByTagName){
						__.lib.removeClass(this.elmsPages[key], this.classCurrentPage);
					}
				}
				if(this.elmPageCurrent){
					__.lib.addClass(this.elmPageCurrent, this.classCurrentPage);
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
					//-!unimplemented
				break;
				case 'random':
					var newElement = null;
					if(this.elmsPages.length > 0){
						if(this.elmsPages.random){
							do{
								newElement = this.elmsPages.random();
							}while(this.elmPageCurrent && newElement[0] == this.elmPageCurrent[0]);
							this.switche(newElement);
						}
					}
				break;
				case 'next':
				default:
					//-!unimplemented
				break;
			}
		}
	}
	__.classes.pager.prototype.switche = function(argElmNew){
		if(this.elmsNavigation){
			var elmNavigationNew = this.getNavigationItemForPageItem(argElmNew);
		}
		if(this.transition){
			//--unimplemented
		}else{
			if(this.elmsNavigation){
				this.elmNavigationCurrent = elmNavigationNew;
			}
			this.elmPageCurrent = argElmNew;
			this.setClasses();
			if(this.onswitch){
				this.onswitch.call(this);
			}
		}
	}
/*
-!unimpemented
	__.classes.pager.prototype.getCurrentNavigationItem = function(){
		return this.getNavigationItemForPageItem(this.elmCurrentPage);
	}
	__.classes.pager.prototype.getNavigationItemForPageItem = function(argItem){
		if(this.elmsNavigation){
			if(this.elmsNavigation.each){
				this.elmsNavigation.each(function(){

				});
			}else{
				for(var key in this.elmsNavigation){
					if(this.elmsNavigation.hasOwnProperty(key) && this.elmsNavigation[key].getElementsByTagName){
						var fncHref = this.getIDForNavigation(this.elmsNavigation[key]);
						if(fncHref == argId)
							return this.elmsNavigation[key];
					}
				}
			}
		}
		return false;
	}
	__.classes.pager.prototype.getIDForNavigation = function(argElement){
		if(argElement.href)
			var fncElement = argElement;
		else
			var fncElement = argElement.getElementsByTagName('a')[0];
		var fncHrefSplit = fncElement.href.split('#');
		if(fncHrefSplit[1].indexOf('#') == 0)
			var fncReturn = fncHrefSplit[1].substring(1);
		else
			fncReturn = fncHrefSplit[1];
		return fncReturn;
	}
*/
