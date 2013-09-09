/*
Classes: Collection

manages collection of items that has both numeric and named indexes, with an ability to attach arbitrary data to each

-----dependencies
-----parameters
-----instantiation
-----html
-----css
*/
/* global __ */
__.classes.Collection = function(_args){
		if(typeof _args == 'undefined'){
			_args = {};
		}
		//--required attributes

		//--optional attributes
		this.boot = _args.boot || {};
		this.doStoreData = _args.doStoreData || false;
		this.onadd = _args.onadd || null;
		this.oninit = _args.oninit || null;

		//--derived attributes
		this.items = Array();
		this.itemsNames = Array();
		if(this.doStoreData){
			this.itemsData = Array();
		}
		this.length = 0;

		//--do something
		if(this.oninit){
			this.oninit.call(this);
		}
	};
/*
	__.classes.CollectionElementValueManager.prototype.on = function(){
		this.jq.on.apply(this.jq, arguments);
	}
*/
	__.classes.Collection.prototype.add = function(_item, _name, _data){
//		var fncThis = this;
		var _lcData = {};
		var _index = this.items.push(_lcData.item);
		_lcData.item = _item;
		_lcData.name = _name || _index;
		_lcData.data = _data || {};

		this.itemsNames.push(_lcData.name);
		if(this.doStoreData){
			this.itemsData.push(_lcData.data);
		}
		++this.length;

		if(this.onadd){
			this.onadd.call(this, _lcData);
		}
/*
		fncItem.on('change', function(event){
			fncThis.jq.trigger('change');
		});
		this.jq.trigger('change');
*/
		return this;
	};
	__.classes.Collection.prototype.getIndexForNameOrIndex = function(_nameOrIndex){
		var _index;
		if(__.lib.isInteger(_nameOrIndex)){
			_index = _nameOrIndex;
		}else{
			_index = __.lib.arraySearch(_nameOrIndex, this.itemsNames);
		}
		if(typeof this.items[_index] != 'undefined'){
			return _index;
		}else{
			return false;
		}
	};
	__.classes.Collection.prototype.get = function(_nameOrIndex){
		var _index = this.getIndexForNameOrIndex(_nameOrIndex);
		if(_index !== false){
			return this.items[_index];
		}else{
			return undefined;
		}
	};
	__.classes.Collection.prototype.getData = function(_nameOrIndex){
		if(this.doStoreData){
			var _index = this.getIndexForNameOrIndex(_nameOrIndex);
			if(_index !== false){
				return this.itemsData[_index];
			}else{
				return undefined;
			}
		}else{
			return undefined;
		}
	};
	__.classes.Collection.prototype.each = function(_callback){
		var _callbackData;
		for(var _key in this.items){
			_callbackData = {index: _key, name: this.itemsNames[_key]};
			if(this.doStoreData){
				_callbackData.data = this.itemsData[_key];
			}
			_callback.call(this.items[_key], _callbackData);
		}
	};
