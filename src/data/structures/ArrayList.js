/*
Class: ArrayList
List of ordered items.
*/
define(['tmclasses/tmclasses', './List'], function(tmclasses, List){
	var __this = tmclasses.create({
		parent: List
		,init: function(_opts){
			//--set up `items` as Array if not provided
			if(!_opts._items){
				this._items = [];
			}

			this.__parent(arguments);
		}
		,properties: {
			//==list

			/*
			Property: type
			{{See List}}
			*/
			type: 'array'

			/*
			Method: add
			Add an item to the list.  Proxy to `push()` on `items`.
			*/
			,add: function(_value){
				this._items.push(_value);
				return this;
			}

			/*
			Method: count
			{{See List}}
			*/
			,count: function(){
				return this._items.length;
			}

			/*
			Method: get
			{{See List}}
			*/
			,get: function(_key){
				return this._items[_key];
			}

			/*
			Method: getForIndex
			{{See List}}
			*/
			,getForIndex: function(_key){
				return this._items[_key];
			}

			/*
			Method: getIndexForKey
			Get index for item at key
			*/
			,getIndexForKey: function(_key){
				return _key;
			}

			/*
			Method: getKeyForIndex
			{{See List}}
			*/
			,getKeyForIndex: function(_index){
				return _index;
			}

			/*
			Method: has
			{{See List}}
			*/
			,has: function(_key){
				return (_key in this._items);
			}

			/*
			Method: remove
			{{See List}}
			*/
			,remove: function(_key){
				if(this.has(_key)){
					this._items.splice(_key, 1);
				}
				//-# `_index` will automatically point to next item if it exists
			}

			/*
			Method: set
			{{See List}}

			Only allow setting if item exists or is one above current.  Otherwise would create empty items.  Throw `Exception` instead.  Use `add()` if you want to add.
			*/
			,set: function(_key, _value){
				//--set only if item exists or is one above current
				if(this.has(_key) || _key === this.count()){
					this._items[_key] = _value;
				}else{
					throw 'Can\'t set random undefined index for Array';
				}
				return this;
			}
		}
	});
	return __this;
});
