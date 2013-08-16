/*
Class: ItemNavigation
Generic handler of item navigation
*/
/*-----
==Navigation
-----*/
__.classes.ItemNavigation = function(args){
		this.boundDataName = args.boundDataName || 'tjmNavigationBound';
		this.classCurrent = args.classCurrent || 'current';
		if(typeof args.createElement == 'function'){
			this.createElement = args.createElement;
		}
		this.container = args.container || jQuery('body');
		this.elements = args.elements || jQuery();
		if(typeof args.getElementForItem == 'function'){
			this.getElementForItem = args.getElementForItem;
		}
		this.items = args.items || null;
		this.itemSelector = args.itemSelector || '.navigationItem';
		this.onActivate = args.onActivate || null;
		this.onSwitch = args.onSwitch || null;
		this.name = args.name || 'navigation';
		this.transition = args.transition || null;
		this.wrapper = args.wrapper || null;
		this.wrapperMarkup = args.wrapperMarkup || '<ul class="navigationList" role="navigation">';

		//--derived attributes
		this.elmCurrent = this.elements.filter('.' + this.classCurrent);
		if(this.elmCurrent.length < 1){
			this.elmCurrent = this.elements.first();
		}
	}
	__.classes.ItemNavigation.prototype.addElement = function(argElement, elmItem){
		if(typeof elmItem == 'object'){
			argElement.data('tjmNavigationItem', elmItem);
		}
		this.elements = this.elements.add(argElement);
		this.wrapper.append(argElement);
	}
	__.classes.ItemNavigation.prototype.bindActivate = function(argWrapper, argSelector){
		var lcThis = this;
		var wrapper = argWrapper || this.wrapper;
		var selector = argSelector || this.itemSelector;
		wrapper.on('click', selector, function(argEvent){
			if(argEvent.preventDefualt) argEvent.preventDefault();
			lcThis.handleActivate(jQuery(this));
			return false;
		});
		wrapper.data(this.boundDataName, true);
	}
	__.classes.ItemNavigation.prototype.build = function(argOptions){
		var lcThis = this;
		var options = (jQuery || false) ? jQuery.extend({}, this, argOptions) : __.lib.merge(this, argOptions);
		if(!this.wrapper){
			this.wrapper = jQuery(this.wrapperMarkup);
			this.container.append(this.wrapper);
		}
		if(this.elements.length == 0){
			this.items.each(function(argIndex){
				var elmThis = jQuery(this);
				var element = lcThis.createElement(elmThis, argIndex);
				lcThis.addElement(element, elmThis);
			});
		}
		if(!this.wrapper.data(this.boundDataName)){
			this.bindActivate();
		}
	}
	__.classes.ItemNavigation.prototype.createElement = function(argItem, argIndex){
		var index = argIndex + 1;
		var item = jQuery('<li class="navigationItem n' + index + '"><a href="#/' + this.name + '/' + index + '">' + index + '</a></li>');
		return item;
	}
	__.classes.ItemNavigation.prototype.getElementForItem = function(argItem){
		return this.elements.filter(function(){
			return jQuery(this).data('tjmNavigationItem')[0] === argItem[0];
		});
	}
	__.classes.ItemNavigation.prototype.handleActivate = function(argElement){
		if(this.onActivate){
			this.onActivate.call(this, argElement);
		}else{
			this.switche(argElement);
		}
	}
	__.classes.ItemNavigation.prototype.setTo = function(argElmNew){
		if(argElmNew[0] !== this.elmCurrent[0]){
			this.elmCurrent = argElmNew;
			this.setClasses();
			if(this.onSwitch){
				this.onSwitch.call(this);
			}
			this.inProgress = false;
		}
	}
	__.classes.ItemNavigation.prototype.setClasses = function(){
		if(this.elmCurrent){
			if(jQuery){
				this.elements.removeClass(this.classCurrent);
				this.elmCurrent.addClass(this.classCurrent);
			}
		}
	}
	__.classes.ItemNavigation.prototype.switche = function(argElmNew){
		if(!this.inProgress){
			this.inProgress = true;
			if(this.transition){
			}else{
				this.setTo(argElmNew);
			}
		}
	}
	__.classes.ItemNavigation.prototype.switchTo = __.classes.ItemNavigation.prototype.switche;
