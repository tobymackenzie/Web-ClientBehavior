/*
Class: ResponsiveHandler
Monitor changes in breakpoints for responsive sites.
*/
/* global __, clearTimeout, jQuery, setTimeout, window */
__.classes.ResponsiveHandler = __.core.Classes.create({
	init: function(){
		var _this = this;
		this.__base(arguments);
		if(jQuery){
			jQuery(window).on('resize', function(_event){
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
			'nvp': 0
			,'wvp': 48
		}
		/*
		Property: container
		Element to get value for break point from
		*/
		,container: jQuery && jQuery('html')
		,current: null
		,delay: 100
		,handleResize: function(_event){
			var _this = this;
			clearTimeout(this.timeout);
			this.timeout = setTimeout(function(){
				var _newBreakPoint = _this.determineBreakPoint();
				if(_newBreakPoint !== _this.current){
					_this.pub('change', {
						breakPoint: _newBreakPoint
						,event: _event
						,lastBreakPoint: _this.current
					});
					_this.current = _newBreakPoint;
				}
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
					if(_currentValue >= _pointValue){
						_maxPoint = _point;
					}else{
						break;
					}
				}
			}
			return _maxPoint;
		}
		,timeout: null
	}
	,mixins: __.mixins.PubSub
});
