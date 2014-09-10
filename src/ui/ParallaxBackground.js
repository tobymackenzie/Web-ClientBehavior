/* global define, window */
define(['jquery', 'tmclasses/tmclasses'], function(jQuery, tmclasses){
	var __ParallaxBackground = tmclasses.create({
		init: function(){
			this.__parent(arguments);
			if(this.elm){
				this.constructor.window.on('load resize scroll', jQuery.proxy(this._changeHandler, this));
			}
		}
		,properties: {
			elm: undefined
			,movementRatio: 0.8
			,_changeHandler: function(){
				var _viewportHeight = this.constructor.window.height();
				var _viewportTop = this.constructor.window.scrollTop();
				var _elmHeight = this.elm.outerHeight();
				var _elmTop = this.elm.offset().top;
				var _range = _elmHeight + _viewportHeight;
				var _calcOffset = _elmTop - _viewportHeight;
				var _diff = -((_viewportTop - _calcOffset) - _range);
				var _bgPosition;
				if(_diff > _range){
					_bgPosition = 100;
				}else if(_diff < 0){
					_bgPosition = 0;
				}else{
					_bgPosition = (_diff / _range) * 100;
				}
				_bgPosition = _bgPosition - 50;
				_bgPosition = 50 + _bgPosition * this.movementRatio;

				this.elm.css('background-position', 'center ' + _bgPosition + '%');
			}
		}
		,statics: {
			window: jQuery(window)
		}
	});
	return __ParallaxBackground;
});
