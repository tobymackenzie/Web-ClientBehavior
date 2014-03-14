/*
Class: ResponsiveHandler
Monitor changes in breakpoints for responsive sites.
*/
/* global define, clearTimeout, setTimeout, window */
define(['jquery', 'tmclasses/tmclasses'], function(__jQuery, __tmclasses){
	var __ResponsiveHandler = __tmclasses.create({
		init: function(){
			var _this = this;
			this.__parent(arguments);
			if(__jQuery){
				__jQuery(window).on('resize', function(_event){
					_this.handleResize(_event);
				});
			}
			this.current = this.determineBreakPoint();
		}
		,properties: {
			/*
			Property: breakpoints
			Map of break point names to values.  Must be in order from smallest to greatest.
			*/
			breakpoints: {
				'nvp': 48
				,'wvp': 100
			}
			/*
			Property: container
			Element to get value for break point from
			*/
			,container: __jQuery && __jQuery('html')
			,current: null
			,delay: 100
			,getBreakPoint: function(_re){
				var _breakpoint;
				if(_re || !this.current){
					_breakpoint = this.determineBreakPoint();
					if(this.current !== _breakpoint){
						this.current = this.determineBreakPoint();
					}
				}
				return this.current;
			}
			,getResizeData: function(_re){
				var _current = this.current;
				return {
					breakPoint: this.getBreakPoint(_re)
					,lastBreakPoint: _current
				};
			}
			,handleResize: function(_event){
				var _this = this;
				clearTimeout(this.timeout);
				this.timeout = setTimeout(function(){
					var _resizeData = _this.getResizeData(true);
					if(_resizeData.breakPoint !== _resizeData.lastBreakPoint){
						_resizeData.event = _event;
						_this.pub('change', _resizeData);
					}
					_this.pub('resize');
				}, this.delay);
			}
			,method: 'lineHeight'
			,determineBreakPoint: function(){
				var _currentValue, _maxPoint, _point, _pointValue;
				switch(this.method){
					case 'lineHeight':
						_currentValue = this.container.css('line-height');
						if(_currentValue.indexOf('px') > -1){
							_currentValue = parseFloat(_currentValue, 10) / 10;
						}
					break;
					case 'width':
						_currentValue = this.container.width();
						if(_currentValue.indexOf('px') > -1){
							_currentValue = parseFloat(_currentValue, 10);
						}
					break;
				}
				for(_point in this.breakpoints){
					if(this.breakpoints.hasOwnProperty(_point)){
						_pointValue = this.breakpoints[_point];
						if(_currentValue <= _pointValue){
							_maxPoint = _point;
							break;
						}
					}
				}
				return _maxPoint;
			}
			,timeout: null
		}
	});
	return __ResponsiveHandler;
});
