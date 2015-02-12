/*
Class: ScrollHandler
Monitor changes in scroll position
*/
/* global clearTimeout, define, setTimeout, window */
define(['jquery', 'tmclasses/tmclasses'], function(jQuery, __tmclasses){
	var __this = __tmclasses.create({
		init: function(){
			this.__parent(arguments);
			if(!this.window){
				this.window = jQuery(window);
			}
			this.window.on('scroll', jQuery.proxy(this.handleChange, this));
		}
		,properties: {
			debounceTimeout: undefined
			,deinit: function(){
				this.window.off('scroll', jQuery.proxy(this.handleChange, this));
			}
			,delay: 200
			,handleChange: function(){
				var _this = this;

				//--throttle publishing of scroll
				var _now = new Date();
				if(_this.throttleLast && _now < _this.throttleLast){
					clearTimeout(_this.throttleTimeout);
					_this.throttleTimeout = setTimeout(function(){
						_this.throttleLast = _now;
						_this.pub('scroll');
					});
				}else{
					_this.throttleLast = _now;
					_this.pub('scroll');
				}

				//--debounce publishing of change
				clearTimeout(_this.debounceTimeout);
				_this.debounceTimeout = setTimeout(function(){
					_this.pub('change');
				}, _this.delay);
			}
			,throttleLast: undefined
			,throttleDelay: 40
			,throttleTimeout: undefined
			,window: undefined
		}
	});
	return __this;
});
