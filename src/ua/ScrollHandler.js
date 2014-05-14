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
			deinit: function(){
				this.window.off('scroll', jQuery.proxy(this.handleChange, this));
			}
			,delay: 200
			,handleChange: function(){
				var _this = this;
				clearTimeout(this.shortTimeout);
				this.shortTimeout = setTimeout(function(){
					_this.pub('scroll');
				}, this.shortDelay);
				clearTimeout(this.timeout);
				this.timeout = setTimeout(function(){
					_this.pub('change');
				}, this.delay);
			}
			,shortDelay: 40
			,shortTimeout: undefined
			,timeout: undefined
			,window: undefined
		}
	});
	return __this;
});
