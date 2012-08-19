/*
provides uniform interface for getting and (setting) "values" of an element, monitoring them for changes

-----dependencies
tmlib
jquery

-----parameters
@param dataSource(required string)
	[dataSourceValue] value of specified element attribute or data key
	[checked] boolean checked or not checked value of input[checkbox] or input[radiobutton]
	[value] value of input, select, or textarea
-----instantiation
$(document).ready(function(){
	var elmValueManagerPrice = new __.classes.elementValueManager({element:elmThis, dataSource: "attribute", dataSourceValue: "data-price"})
	var elmValueManagerQuantity = new __.classes.elementValueManager({element:elmThis.find("select"), dataSource: "value"})
}

-----html
-----css
*/


/*----------
©elementValueManager
----------*/
__.classes.elementValueManager = function(args){
		//--require attributes
		this.element = args.element || null; if(!this.element) return false; else if(this.element.length != 1) return false;

		//--optional attributes
		this.dataSourceValue = args.dataSourceValue || null;
		this.dataSource = args.dataSource || "value";
		this.event = args.event || "change";

		//--derived attributes
		fncThis = this;

/*
		if(this.event){
			this.element.on(this.event, function(event){
				fncThis.element.trigger("change", {value: fncThis.getValue(), manager: fncThis});
			});
		}
*/
	}
	__.classes.elementValueManager.prototype.val = function(){
		if(arguments.length == 0){
			return this.getValue.apply(this, arguments);
		}else{
			return this.setValue.apply(this, arguments);
		}
	}
	__.classes.elementValueManager.prototype.getValue = function(){
		var fncReturn = false;
		var fncDataSource = this.dataSource;
		if(fncDataSource.substr(0, 7) == "checked"){
			var newDataSource = fncDataSource.substr(7);
			if(fncReturn)
				fncDataSource = (newDataSource)? newDataSource: fncDataSource;
			else
				fncDataSource = false;
		}
		switch(fncDataSource){
			case "attribute":
				fncReturn = this.element.attr(this.dataSourceValue);
				break;
			case "data":
				fncReturn = this.element.data(this.dataSourceValue);
				break;
			case "value":
				fncReturn = this.element.val();
				break;
		}
		return fncReturn;
	}

	__.classes.elementValueManager.prototype.setValue = function(argValue){
		var fncDataSource = this.dataSource;
		if(fncDataSource.substr(0, 7) == "checked"){
			var newDataSource = fncDataSource.substr(7);
			if(newDataSource){
				this.element.attr("checked", "checked");
				if(argValue != "checked")
					fncDataSource = (newDataSource)? newDataSource: fncDataSource;
				else
					fncDataSource = false;
			}else{
				if(argValue == "checked"){
					this.element.attr("checked", "checked");
				}else{
					this.element.removeAttr("checked");
				}
				fncDataSource = false;
			}
		}
		switch(fncDataSource){
			case "attribute":
				this.element.attr(this.dataSourceValue, argValue);
				break;
			case "data":
				this.element.data(this.dataSourceValue, argValue);
				break;
			case "value":
				this.element.val(argValue);
				break;
		}

		this.element.trigger("change", {value: this.getValue(), manager: this});

		return this;
	}
	__.classes.elementValueManager.prototype.on = function(){
		this.element.on.apply(this.element, arguments);
	}

