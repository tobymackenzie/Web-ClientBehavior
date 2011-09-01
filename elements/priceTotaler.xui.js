/*
easy monitoring of sets of elements, usually form fields that singly or aggregately contain the values used for calculating prices of individual items, to be totalled for a total cost, with the ability to display this information in an element

-----dependencies
tmlib
xui
elementManager

-----parameters
-----instantiation
x$(window).load(function(){
	__.elmPrice = x$('<div class="formitem pricetotal showvalue"><span class="label">Total Cost</span> $</div>');
	__.elmPriceValue = x$('<span class="value">Init</span>');
	__.elmPrice.bottom(__.elmPriceValue);
	x$("#frm_donatationdetails>:last-child").after(__.elmPrice);
	__.priceManager = new __.classes.priceTotaler({
		elmPrice: __.elmPriceValue
		,boot: {
			elmInputRequired: x$("form[name='mobilegearorder'] input[name='req_fields']")
			,requiredFieldsBase: "firstname(first name),lastname(last name),email"
			,requiredFieldsCC: "address1(address),city,state,zip(zip code),phone1,custom_1(employer's name),custom_2(employer's city),custom_3(employer's state)"
		}
		,doUpdate: false
		,onchange: function(argTotal){
			var fncTotal = (typeof argTotal != "undefined")? argTotal: this.getTotal();
			if(fncTotal > 0){
				this.boot.elmInputRequired[0].value = this.boot.requiredFieldsBase+","+this.boot.requiredFieldsCC; //-bug- xui
				__.ccInfoToggler.open();
			}else{
				this.boot.elmInputRequired[0].value = this.boot.requiredFieldsStarting; //-bug- xui
				__.ccInfoToggler.close();
			}
		}
		,oninit: function(){
			var fncThis = this;
			
			setTimeout(function(){
				fncThis.doUpdate = true;
				fncThis.updateTotal();
			}, 500);
		}
	});

	//--add price items
	//-order items
	x$("#maincontent .orderlist .orderitem").each(function(element, index, xui){
		var elmThis = x$(this);
		__.priceManager.addPriceItem({
			elmValueManagerPrice: new __.classes.elementValueManager({element:elmThis, dataSource: "attribute", attribute: "data-price"})
			,elmValueManagerQuantity: new __.classes.elementValueManager({element:elmThis.find("select"), dataSource: "value"})
		});
	});
	//-donation
	var elmWrapDonation = x$();
	__.priceManager.addPriceItem({
		elmValueManagerPrice: new __.classes.elementValueManager({element:x$("#maincontent select[name='donationamount']"), dataSource: "value"})
		,elmValueManagerBoolean: new __.classes.elementValueManager({element: x$("#fldwilldonate"), dataSource: "checked"})
	});
}

-----html
-----css
*/

/*----------
©priceTotaler
----------*/
__.classes.priceTotaler = function(args){
		//--required attributes
		//--optional attributes
		this.boot = args.boot || null;
		this.doUpdate = (typeof args.doUpdate != "undefined")? args.doUpdate: true;
		this.elmPrice = args.elmPrice || null;
		this.onchange = args.onchange || null;
		this.oninit = args.oninit || null;
				
		//--derived attributes
		this.priceItems = new Array();
		
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.priceTotaler.prototype.addPriceItem = function(argItemArguments){
		var fncThis = this;
		var fncPriceItem = new this.classes.priceItem(argItemArguments);
		this.priceItems.push(fncPriceItem);
		fncPriceItem.addChangeListener(function(event){
			fncThis.updateTotal();
		});
		
		this.updateTotal();
	}
	__.classes.priceTotaler.prototype.getTotal = function(){
		var fncThis = this;
		var fncPrice = 0;
		for(var key in fncThis.priceItems){
			if(fncThis.priceItems.hasOwnProperty(key)){
				fncPrice += fncThis.priceItems[key].getPrice();
			}
		}
		return fncPrice;
	}
	__.classes.priceTotaler.prototype.updateTotal = function(){
		if(this.doUpdate){
			var fncTotal = this.getTotal();
			if(this.elmPrice){
				this.elmPrice.html(fncTotal);
			}
			if(this.onchange)
				this.onchange.call(this, fncTotal);
		}
	}
__.classes.priceTotaler.prototype.classes = {};
__.classes.priceTotaler.prototype.classes.priceItem = function(args){
		//--required attributes
		this.elmValueManagerPrice = args.elmValueManagerPrice || null; if(!this.elmValueManagerPrice) return false;
		
		//--optional attributes
		this.elmValueManagerQuantity = args.elmValueManagerQuantity || null;
		this.elmValueManagerBoolean = args.elmValueManagerBoolean || null;
		
		//--derived attributes
		var fncThis = this;
		
		//--watch elements for price changes
		var callback = function(event){
			fncThis.updatePrice();
		}
	}
	__.classes.priceTotaler.prototype.classes.priceItem.prototype.getPrice = function(){
			var localvar = {};
			localvar.price = this.elmValueManagerPrice.getValue();
			localvar.quantity = (this.elmValueManagerQuantity)? this.elmValueManagerQuantity.getValue(): 1;
			localvar.boolean = (this.elmValueManagerBoolean)? this.elmValueManagerBoolean.getValue(): true;
			
			return (localvar.boolean)? (localvar.price * localvar.quantity): 0;
		}	
	__.classes.priceTotaler.prototype.classes.priceItem.prototype.addChangeListener = function(argCallback){
		var fncThis = this;
		var fncArgCallback = argCallback;
		var fncCallback = function(event){
			fncArgCallback.call(fncThis, event);
		}
		this.elmValueManagerPrice.addChangeListener(fncCallback);
		if(this.elmValueManagerQuantity)
			this.elmValueManagerQuantity.addChangeListener(fncCallback);
		if(this.elmValueManagerBoolean)
			this.elmValueManagerBoolean.addChangeListener(fncCallback);
	}

