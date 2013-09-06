/*
Class: ResponsiveMenu
Menu widget to convert menu into a slide down menu when screen size reaches certain breakpoint.
*/
/* global __, jQuery */
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

		//--attach action listener
		this.$action.on('click', function(){
			_this.toggleList();
		});
	}
	,properties: {
		$: null
		,$action: '.siteMainNavTitle'
		,$list: '.siteMainNavList'
		,closedClass: 'hasClosedMenu'
		,openedClass: 'hasOpenMenu'
		,nvpBreakPoints: 'nvp'
		,responsiveHandler: null
		,responsiveSubscription: null
		,state: null
		,switchBreakpoint: function(_breakpoint){
			if(_breakpoint !== this.state){
				if(jQuery.inArray(_breakpoint, this.nvpBreakPoints) > -1){
					this.switchToNVP();
				}else{
					this.switchToWVP();
					// __.topnavigationDropdownhandler.sizeAndCenter2();
				}
				this.state = _breakpoint;
			}
		}
		,switchToNVP: function(){
			//--show action
			this.$action.show();
			//--hide menu
			this.$list.hide();

			this.isOpen = false;
		}
		,switchToWVP: function(){
			//--hide action
			this.$action.show().css('display', '');
			//--show menu
			this.$list.show().css('display', '');

			this.isOpen = undefined;
		}
		,closeList: function(){
			if(this.isOpen){
				var _this = this;
				this.$list.slideUp(function(){
					_this.$.removeClass(_this.openedClass).addClass(_this.closedClass);
					_this.isOpen = false;
				});
			}
		}
		,openList: function(){
			if(!this.isOpen){
				this.$.addClass(this.openedClass).removeClass(this.closedClass);
				this.$list.slideDown();
				this.isOpen = true;
			}
		}
		,isOpen: undefined
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
	}
});
