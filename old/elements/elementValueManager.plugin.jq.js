/*
Plugin: elementValueManager

*/
/* global jQuery */

(function(){
	var __pluginName = 'elementValueManager';
	var __methods = {
		init : function(){
			return this.each(function(_settings){
				var $this = jQuery(this);
				var _data = $this.data(__pluginName);

				var _defaultSettings = {
					dataSourceValue: null
					,dataSource: 'value'
					,event: 'change'
				};

				//--settings
				if(_defaultSettings){
					jQuery.extend(_defaultSettings, _settings);
				}

				//--initialize data if not already initialized
				if(!_data){
					$this.data(__pluginName, {
					});
				}

				$this.val = __methods.getSetValue;
			});
		}
		,destroy: function(){
			return this.each(function(){
				var $this = jQuery(this);
				$this.removeData(__pluginName);
			});
		}
		,getSetValue: function(){
			var _return = false;
			var _dataSource = this.data(__pluginName, 'dataSource');
			if(arguments.length === 0){
				if(_dataSource.substr(0, 7) == 'checked'){
					_return = ((this.filter(':checked').length > 0)? true: false);
					var newDataSource = _dataSource.substr(7);
					if(_return){
						_dataSource = (newDataSource)? newDataSource: _dataSource;
					}else{
						_dataSource = false;
					}
				}
				switch(_dataSource){
					case 'attribute':
						_return = this.attr(this.data(__pluginName, 'dataSourceValue'));
						break;
					case 'data':
						_return = this.data(this.data(__pluginName, 'dataSourceValue'));
						break;
					case 'value':
						_return = this.cloFnVal();
						break;
				}
				return _return;
			}else{

			}
		}
	};

	jQuery.fn[__pluginName] = function(_method){
		if(__methods[_method]){
			return __methods[_method].apply(this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof _method == 'object' || _method){
			return __methods.init.apply(this, arguments);
		}else{
			return __methods.init.apply(this);
		}
	};
})();
