/*
manages collection of items that has both numeric and named indexes, with an ability to attach arbitrary data to each
-----dependencies
-----parameters
-----instantiation
-----html
-----css
*/

/*----------
©collection
----------*/
__.classes.collection = function(args){
		if(typeof args == "undefined") var args = {};
		//--required attributes

		//--optional attributes
		this.boot = args.boot || {};
		this.doStoreData = args.doStoreData || false;
		this.onadd = args.onadd || null;
		this.oninit = args.oninit || null;

		//--derived attributes
/* 		this.jq = jQuery({}); */
		this.items = Array();
		this.itemsNames = Array();
		if(this.doStoreData)
			this.itemsData = Array();
		this.length = 0;

		//--do something
		if(this.oninit)
			this.oninit.call(this);
	}
/*
	__.classes.collectionElementValueManager.prototype.bind = function(){
		this.jq.bind.apply(this.jq, arguments);
	}
*/
	__.classes.collection.prototype.add = function(argItem, argName, argData){
//		var fncThis = this;
		var loc = {};
		loc.item = argItem;
		loc.name = argName || index;
		loc.data = argData || {};

		var index = this.items.push(loc.item);
		this.itemsNames.push(loc.name);
		if(this.doStoreData)
			this.itemsData.push(loc.data);
		++this.length;

		if(this.onadd)
			this.onadd.call(this, loc);
/*
		fncItem.bind("change", function(event){
			fncThis.jq.trigger("change");
		});	
		this.jq.trigger("change");
*/
		return this;
	}
	__.classes.collection.prototype.getIndexForNameOrIndex = function(argNameOrIndex){
		if(__.isInteger(argNameOrIndex))
			var index = argNameOrIndex;
		else
			var index = __.lib.arraySearch(argNameOrIndex, this.itemsNames);
		if(typeof this.items[index] != "undefined")
			return index;
		else
			return false;
	}
	__.classes.collection.prototype.get = function(argNameOrIndex){
		var index = this.getIndexForNameOrIndex(argNameOrIndex);
		if(index !== false)
			return this.items[index];
		else
			return undefined;
	}
	__.classes.collection.prototype.getData = function(argNameOrIndex){
		if(this.doStoreData){
			var index = this.getIndexForNameOrIndex(argNameOrIndex);
			if(index !== false){
				return this.itemsData[index];
			}else
				return undefined;
		}else
			return undefined;
	}
	__.classes.collection.prototype.each = function(argCallback){
	   for(var key in this.items){
		   var dataCallback = {index: key, name: this.itemsNames[key]};
		   if(this.doStoreData)
			   dataCallback.data = this.itemsData[key];
	       argCallback.call(this.items[key], dataCallback);
	   }
	}

