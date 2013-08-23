/*
Class: ItemNavigation
Generic handler of item navigation
*/
/* global __, jQuery */
/*-----
==Navigation
-----*/
__.classes.ItemNavigation = __.core.Classes.create({
	init: function(){
		this.__base(arguments);
		if(!this.container){
			this.container = jQuery('body');
		}
		if(!this.elements){
			this.elements = jQuery();
		}

		//--derived attributes
		this.elmCurrent = this.elements.filter('.' + this.classCurrent);
		if(this.elmCurrent.length < 1){
			this.elmCurrent = this.elements.first();
		}
	}
	,properties: {
		addElement: function(_element, elmItem){
			if(typeof elmItem == 'object'){
				_element.data('tjmNavigationItem', elmItem);
			}
			this.elements = this.elements.add(_element);
			this.wrapper.append(_element);
		}
		,bindActivate: function(_wrapper, _selector){
			var _this = this;
			var wrapper = _wrapper || this.wrapper;
			if(!_selector){
				_selector = this.itemSelector;
			}
			wrapper.on('click', _selector, function(argEvent){
				argEvent.preventDefault();
				_this.handleActivate(jQuery(this));
				return false;
			});
			wrapper.data(this.boundDataName, true);
		}
		,build: function(_options){
			var _this = this;
			_options = (jQuery || false) ? jQuery.extend({}, this, _options) : __.lib.merge(this, _options);
			if(!this.wrapper){
				this.wrapper = jQuery(this.wrapperMarkup);
				this.container.append(this.wrapper);
			}
			if(this.elements.length === 0){
				this.items.each(function(_index){
					var elmThis = jQuery(this);
					var element = _this.createElement(elmThis, _index);
					_this.addElement(element, elmThis);
				});
			}
			if(!this.wrapper.data(this.boundDataName)){
				this.bindActivate();
			}
		}
		,boundDataName: 'tjmNavigationBound'
		,classCurrent: 'current'
		,createElement: function(_item, _index){
			_index = _index + 1;
			_item = jQuery('<li class="navigationItem n' + _index + '"><a href="#/' + this.name + '/' + _index + '">' + _index + '</a></li>');
			return _item;
		}
		,container: undefined
		,elements: undefined
		,elmCurrent: undefined
		,getElementForItem: function(_item){
			return this.elements.filter(function(){
				return jQuery(this).data('tjmNavigationItem')[0] === _item[0];
			});
		}
		,handleActivate: function(_element){
			if(this.onActivate){
				this.onActivate.call(this, _element);
			}else{
				this.switche(_element);
			}
		}
		,items: null
		,itemSelector: '.navigationItem'
		,onActivate: null
		,onSwitch: null
		,name: 'navigation'
		,setTo: function(argElmNew){
			if(argElmNew[0] !== this.elmCurrent[0]){
				this.elmCurrent = argElmNew;
				this.setClasses();
				if(this.onSwitch){
					this.onSwitch.call(this);
				}
				this.inProgress = false;
			}
		}
		,setClasses: function(){
			if(this.elmCurrent){
				if(jQuery){
					this.elements.removeClass(this.classCurrent);
					this.elmCurrent.addClass(this.classCurrent);
				}
			}
		}
		,switche: function(argElmNew){
			if(!this.inProgress){
				this.inProgress = true;
				if(this.transition){
				}else{
					this.setTo(argElmNew);
				}
			}
		}
		,switchTo: function(){
			return this.switche.apply(this, arguments);
		}
		,transition: null
		,wrapper: null
		,wrapperMarkup: '<ul class="navigationList" role="navigation">'
	}
});
