/*
Class: ResponsiveMenu

Menu widget to convert menu into a slide down menu when screen size reaches certain breakpoint.
*/
/* global __, clearTimeout, jQuery, setTimeout, window */
__.classes.ResponsiveMenu = __.core.Classes.create({
	init: function(){
		var _this = this;
		this.__base(arguments);
		if(typeof this.$action === 'string'){
			this.$action = this.$.find(this.$action);
		}
		if(typeof this.$list === 'string'){
			this.$list = this.$.find(this.$list);
		}
		if(!this.responsiveHandler){
			this.responsiveHandler = new __.classes.ResponsiveHandler();
		}
		if(!this.responsiveSubscription){
			this.responsiveSubscription = this.responsiveHandler.sub('change', function(_data){
				_this.switchBreakpoint(_data.breakPoint);
			});
		}
		if(!__.lib.isArray(this.nvpBreakPoints)){
			var _bpArray = [this.nvpBreakPoints];
			this.nvpBreakPoints = _bpArray;
		}

		//--set to initial breakpoint
		this.switchBreakpoint(this.responsiveHandler.getBreakPoint());
	}
	,properties: {
		$: null
		,$action: '.siteMainNavTitle'
		,$list: '.siteMainNavList'
		,closedClass: 'hasClosedMenu'
		,handleClick: function(_event){
			_event.preventDefault();
		}
		,handleMouseEnter: function(){
			clearTimeout(this.hoverTimeout);
			if(!this.isOpen){
				this.$list.show();
				this.$.addClass(this.hoverClass);
				this.setIsOpen(true);
				this.pub('mouseEnter');
			}
		}
		,handleMouseLeave: function(){
			var _this = this;
			clearTimeout(this.hoverTimeout);
			this.hoverTimeout = setTimeout(function(){
				if(_this.isOpen){
					_this.$list.hide();
					_this.$.removeClass(_this.hoverClass);
					_this.pub('close');
					_this.setIsOpen(false);
				}
			}, this.hoverDelay);
		}
		,handleTouch: function(){
			this.toggleList();
		}
		,hoverClass: 'selected'
		,hoverDelay: 750
		,hoverTimeout: undefined
		,openedClass: 'hasOpenMenu'
		,closeList: function(){
			if(this.isActive && this.isOpen){
				var _this = this;
				this.$list.slideUp(function(){
					_this.$.removeClass(_this.openedClass).addClass(_this.closedClass);
					_this.pub('close');
					_this.setIsOpen(false);
				});
			}
		}
		,openList: function(){
			if(this.isActive && !this.isOpen){
				this.$.addClass(this.openedClass).removeClass(this.closedClass);
				this.$list.slideDown();
				this.setIsOpen(true);
			}
		}
		,isOpen: undefined
		,setIsOpen: function(_val){
			if(this.isOpen !== _val){
				if(this.isActive){
					this.pub((_val) ? 'open' : 'close');
				}
				this.isOpen = _val;
			}
		}
		,supportsTouch: ('ontouchstart' in window || window.navigator.msPointerEnabled)
		,toggleList: function(){
			if(typeof this.isOpen === 'undefined'){
				this.isOpen = this.$list.is(':visible');
			}
			if(this.isOpen){
				this.closeList();
			}else{
				this.openList();
			}
		}

		//==active state
		,activate: function(){
			if(!this.isActive){
				//--attach action listeners
				this.$action.on({
					click: jQuery.proxy(this.handleClick, this)
				});
				if(this.supportsTouch){
					this.$action.on({
						click: jQuery.proxy(this.handleTouch, this)
					});
				}
				if(!this.supportsTouch){
					this.$action.add(this.$list).on({
						'mouseenter focus': jQuery.proxy(this.handleMouseEnter, this)
						,'mouseleave blur': jQuery.proxy(this.handleMouseLeave, this)
					});
				}
				this.isActive = true;
			}
		}
		,deactivate: function(){
			if(this.isActive){
				this.$action.off({
					click: jQuery.proxy(this.handleClick, this)
				});
				if(this.supportsTouch){
					this.$action.off({
						click: jQuery.proxy(this.handleTouch, this)
					});
				}
				if(!this.supportsTouch){
					this.$action.add(this.$list).off({
						'mouseenter focus': jQuery.proxy(this.handleMouseEnter, this)
						,'mouseleave blur': jQuery.proxy(this.handleMouseLeave, this)
					});
				}
				this.isActive = false;
			}
		}
		,isActive: false

		//==responsiveness
		,nvpBreakPoints: 'nvp'
		,responsiveHandler: null
		,responsiveSubscription: null
		,breakpoint: null
		,switchBreakpoint: function(_breakpoint){
			if(_breakpoint !== this.breakpoint){
				if(jQuery.inArray(_breakpoint, this.nvpBreakPoints) > -1){
					this.switchToNVP();
				}else{
					this.switchToWVP();
					// __.topnavigationDropdownhandler.sizeAndCenter2();
				}
				this.breakpoint = _breakpoint;
			}
		}
		,switchToNVP: function(){
			this.activate();
			//--show action
//				this.$action.show();
			//--hide menu
			this.$list.hide();

			this.setIsOpen(false);
		}
		,switchToWVP: function(){
			this.deactivate();
			//--hide action
//				this.$action.hide().css('display', '');
			//--show menu
			this.$list.show().css('display', '');

			this.setIsOpen(undefined);
		}
	}
	,mixins: __.mixins.PubSub
});
