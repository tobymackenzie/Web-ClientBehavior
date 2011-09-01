/*----------
©elementValueManager
----------*/
(function(){
	var cloFnVal = jQuery.fn.val;
	var cloNamePlugin = "elementValueManager";
	var cloMethods = {
		init : function(argSettings){
			return this.each(function(argSettings){
				var fncThis = jQuery(this);
				var fncData = fncThis.data(cloNamePlugin);

				var fncSettingsDefault = {
					dataSourceValue: null
					,dataSource: "value"
					,event: "change"
				};

				//--settings
				if(fncSettingsDefault)
					jQuery.extend(fncSettingsDefault, argSettings);

				//--initialize data if not already initialized
				if(!fncData){
					fncThis.data(cloNamePlugin, {
					});
				}

				fncThis.val = cloMethods.getSetValue;
			});
		}
		,destroy: function(){
			return this.each(function(){
				var fncThis = jQuery(this);
				var fncData = fncThis.data(cloNamePlugin);
				fncThis.removeData(cloNamePlugin);
			});
		}
		,getSetValue: function(){
			var fncReturn = false;
			var fncDataSource = this.data(cloNamePlugin, "dataSource");
			if(arguments.length == 0){
				if(fncDataSource.substr(0, 7) == "checked"){
					fncReturn = ((this.filter(":checked").length > 0)? true: false);
					var newDataSource = fncDataSource.substr(7);
					if(fncReturn)
						fncDataSource = (newDataSource)? newDataSource: fncDataSource;
					else
						fncDataSource = false;
				}
				switch(fncDataSource){
					case "attribute":
						fncReturn = this.attr(this.data(cloNamePlugin, "dataSourceValue"));
						break;
					case "data":
						fncReturn = this.data(this.data(cloNamePlugin, "dataSourceValue"));
						break;
					case "value":
						fncReturn = this.cloFnVal();
						break;
				}
				return fncReturn;
			}else{
				
			}
		}
	};

	jQuery.fn[cloNamePlugin] = function(argMethod){
		if(cloMethods[argMethod]){
			return cloMethods[argMethod].apply(this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof argMethod == "object" || argMethod){
			return cloMethods.init.apply(this, arguments);
		}else{
			return cloMethods.init.apply(this);
		}
	};
})();

