/* global define, window */
define(['jquery', 'tmclasses/tmclasses'], function(jQuery, tmclasses){
	var __ParallaxBackground = tmclasses.create({
		init: function(){
			this.__parent(arguments);
			//-# dirty hack for now: bail on IE9 minus for centered start, because jQuery doesn't seem to be able to get at a usable value for their `background-position`
			if(
				this.calcType === 'centeredStart'
				//-@ http://www.pinlady.net/PluginDetect/IE/
				&& new Function("return/*@cc_on!@*/!1")()
				//-@ http://stackoverflow.com/questions/15657614/identify-ie9-ie10-using-jquery
				&& !window.requestAnimationFrame
			){
				return undefined;
			}
			if(this.elm){
				var _callback = jQuery.proxy(this._changeHandler, this);
				this.constructor.window.on('load resize scroll', _callback);
				jQuery(_callback);
			}
		}
		,properties: {
			elm: undefined
			,calcType: 'centeredStart'
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
				switch(this.calcType){
					case 'centered':
						_bgPosition = 50 + (_bgPosition - 50) * this.movementRatio;
					break;
					case 'centeredStart':
						if(typeof this._startOffset === 'undefined'){
							var _startingPosition = this.elm.css('background-position-y');
							//-- FF doesn't return the 'background-position-y', derive from regular 'background-position'
							if(typeof _startingPosition === 'undefined'){
								_startingPosition = this.elm.css('background-position').split(' ');
								_startingPosition = (_startingPosition.length === 1)
									? _startingPosition[0]
									: _startingPosition[1]
								;
							}
							if(_startingPosition.indexOf('%') !== -1){
								_startingPosition = parseInt(_startingPosition,10);
							}else if(_startingPosition.indexOf('px') !== -1){
								//-# dirty hack for now: just disable everything if pixels, not sure how to handle that.  happens IE8 regardless of what is specified in CSS
								this.constructor.window.off('resize scroll', jQuery.proxy(this._changeHandler, this));
								this._changeHandler = function(){};
								return false;
							}

							this._startOffset = -1 * (50 + (_bgPosition - 50) * this.movementRatio - _startingPosition);
						}
						_bgPosition = 50 + (_bgPosition - 50) * this.movementRatio + this._startOffset;
					break;
				}

				this.elm.css('background-position', 'center ' + _bgPosition + '%');
			}
			,_startOffset: undefined
		}
		,statics: {
			window: jQuery(window)
		}
	});
	return __ParallaxBackground;
});
