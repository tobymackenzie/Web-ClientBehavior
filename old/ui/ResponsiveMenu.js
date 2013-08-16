/*
Class: ResponsiveMenu
Menu widget to convert menu into a slide down menu when screen size reaches certain breakpoint.
*/
/* global __ */
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

		//--set to initial breakpoint
		this.switchBreakpoint(this.responsiveHandler.determineBreakPoint());

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
		,showList: function(){
			return this.toggleList('show');
		}
		,hideList: function(){
			return this.toggleList('hide');
		}
		,toggleList: function(_action){
			var _this = this;
			var _isStartingVisible, _method;
			switch(_action){
				case 'show':
					_isStartingVisible = false;
					_method = 'slideDown';
				break;
				case 'hide':
					_isStartingVisible = true;
					_method = 'slideUp';
				break;
				default:
					_isStartingVisible = _this.$list.is(':visible');
					_method = 'slideToggle';
				break;
			}
			if(!_isStartingVisible){
				_this.$.addClass(_this.openedClass).removeClass(_this.closedClass);
			}
			_this.$list[_method](function(){
				if(_isStartingVisible){
					_this.$.removeClass(_this.openedClass).addClass(_this.closedClass);
				}
			});
			return this;
		}
		,state: null
		,switchBreakpoint: function(_breakpoint){
			if(_breakpoint !== this.state){
				if(_breakpoint === this.nvpBreakPoints){
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
		}
		,switchToWVP: function(){
			//--hide action
			this.$action.hide();
			//--show menu
			this.$list.show();
		}
	}
});

