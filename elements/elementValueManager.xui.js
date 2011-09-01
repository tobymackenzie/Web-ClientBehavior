/*
provides uniform interface for getting and (setting) "values" of an element, monitoring them for changes

-----dependencies
tmlib
xui
-----parameters
@param dataSource(required string)
	[attribute] value of specified element attribute
	[checked] boolean checked or not checked value of input[checkbox] or input[radiobutton]
	[value] value of input, select, or textarea
-----instantiation
x$(window).load(function(){
	var elmValueManagerPrice = new __.classes.elementValueManager({element:elmThis, dataSource: "attribute", attribute: "data-price"})
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
		this.dataSource = args.dataSource || null; if(!this.dataSource) return false;
		
		//--optional attributes
		this.attribute = args.attribute || null;
		this.event = args.event || "change";
		
		//--derived attributes
		fncThis = this;
/*
		
		if(this.event){
			this.element.on(this.event, function(event){
				fncThis.fire("change", {value: fncThis.getValue, manager: fncThis});
			});
		}
*/
	}
	__.classes.elementValueManager.prototype.getValue = function(){
		var fncReturn = false;
		switch(this.dataSource){
			case "attribute":
				fncReturn = this.element.attr(this.attribute);
				break;
			case "checked":
				fncReturn = ((this.element.has(":checked").length > 0)? true: false);
				break;
			case "value":
				fncReturn = this.element[0].value; //-bug- waiting for the attr version of this to 
				break;
		}

		return fncReturn;
	}
	__.classes.elementValueManager.prototype.setValue = function(argValue){
		
	}
	__.classes.elementValueManager.prototype.addChangeListener = function(argCallback){
		var fncThis = this;
		var fncCallback = argCallback;
		if(fncThis.event){
			fncThis.element.on(this.event, function(event){
				event.data = fncThis.getValue();
				fncCallback.call(fncThis, event);
			});
		}else return false;
	}

