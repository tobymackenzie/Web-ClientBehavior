/*
Class: MapList
List of ordered items with associated keys.

-@ http://stackoverflow.com/questions/3549894/javascript-data-structure-for-fast-lookup-and-ordered-looping
*/
define(['tmclasses/tmclasses', './List'], function(tmclasses, List){
	var __this = tmclasses.create({
		parent: List
		,init: function(_opts){
			//--set up `_keys` as Array if not provided
			if(!_opts._keys){
				this._keys = [];
			}

			//--set up `items` as object if not provided
			if(!_opts._items){
				this._items = {};
			}else if(!_opts._keys){
				//--add `_keys` if not supplied and we have items
				for(var _key in _opts._items){
					this._keys.push(_key);
				}
			}

			this.__parent(arguments);
		}
		,properties: {
			//==list

			/*
			Property: _keys
			Keys of map items sorted.
			*/
			_keys: undefined

			/*
			Property: type
			{{See List}}
			*/
			,type: 'map'

			/*
			Method: count
			{{See List}}
			*/
			,count: function(){
				return this._keys.length;
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
			Get item at index
			*/
			,getForIndex: function(_index){
				return this._items[this._keys[_index]];
			}

			/*
			Method: getIndexForKey
			Get index for item at key
			*/
			,getIndexForKey: function(_key){
				return this._keys.indexOf(_key);
			}

			/*
			Method: getKeyForIndex
			Get key for item at index
			*/
			,getKeyForIndex: function(_index){
				return this._keys[_index];
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
				var _index = this.getIndexForKey(_key);
				if(_index !== -1){
					this._keys.splice(_index, 1);
				}
				delete this._items[_key];

				//--make sure the iterator still points somewhere if we're removing the current item.
				if(this._index === _key){
					if(this._keysIndex < this.count()){
						//--point to what would've been next item if it exists
						this._index = this._keys[this._keysIndex];
						this.updateKeyForIndex();
					}
				}
			}

			/*
			Method: set
			{{See List}}
			*/
			,set: function(_key, _value){
				if(!this.has(_key)){
					this._keys.push(_key);
				}
				this._items[_key] = _value;
				return this;
			}
		}
	});
	return __this;
});
