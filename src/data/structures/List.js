/*
Class: List

-@ http://stackoverflow.com/questions/3549894/javascript-data-structure-for-fast-lookup-and-ordered-looping

Concepts
--------
- key: Used for accessing an item through `get()` or `set()`.  Form and usefulness depend on the type of list.
	ArrayList: the index of the array.  exactly the same as the index
	MapList: key of map object
	Range: not useful.  exactly the same as the value
	JQueryElms: the index of the jQuery object.  exactly the same as the index
- index: Used to access an item from the items as if it were an array.  Allows looping through by incrementing from 0 to one less than count, regardless of what form the keys are in.
- count: number of `items` if they were an array.  Straightforward for some types, but 'virtual' such as range types may have calculated counts.
- iteration: Methods are provided to iterate through the list with the same interface regardless of the type of list.  Object maintains a pointer to the index of the current item, and functions change the index.  `current` gets the value of the current item.
*/
define(['tmclasses/tmclasses', 'tmclasses/BaseClass'], function(tmclasses, BaseClass){
	var __this = tmclasses.create({
		parent: BaseClass
		,init: function(_opts){
			this.__parent(arguments);

			//--make sure iteration is on first item unless explicitely set
			if(typeof _opts._index === 'undefined'){
				this.first();
			}
		}
		,properties: {
			//==list

			/*
			Property: items
			Items of list.  `type` property defines what type of object this is.
			*/
			items: undefined

			/*
			Property: type
			What type items is.
			*/
			,type: undefined

			/*
			Method: count
			Get number of items
			*/
			,count: function(){
				throw '`count` method not implemented.';
			}

			/*
			Method: get
			Get item at key
			*/
			,get: function(_key){
				throw '`get` method not implemented.';
			}

			/*
			Method: getForIndex
			Get item at index
			*/
			,getForIndex: function(_index){
				throw '`getForIndex` method not implemented.';
			}

			/*
			Method: getIndexForKey
			Get index for item at key
			*/
			,getIndexForKey: function(_key){
				throw '`getIndexForKey` method not implemented.';
			}

			/*
			Method: getKeyForIndex
			Get key for item at index
			*/
			,getKeyForIndex: function(_index){
				throw '`getKeyForIndex` method not implemented.';
			}

			/*
			Method: has
			Determine if key exists
			*/
			,has: function(_key){
				throw '`has` method not implemented.';
			}

			/*
			Method: hasIndex
			Determine if index exists
			*/
			,hasIndex: function(_index){
				return (_index < this.count());
			}

			/*
			Method: remove
			Remove item at key
			*/
			,remove: function(_key){
				throw '`remove` method not implemented.';
			}

			/*
			Method: set
			Set item at key to value
			*/
			,set: function(_key, _value){
				throw '`set` method not implemented.';
			}

			/*
			Method: updateIndexForKey
			Set item at key to value
			*/
			,updateIndexForKey: function(){
				this._index = this.getIndexForKey(this._key);
				return this;
			}

			/*
			Method: updateKeyForIndex
			Set item at key to value
			*/
			,updateKeyForIndex: function(){
				this._key = this.getKeyForIndex(this._index);
				return this;
			}


			//==iteration

			/*
			Property: _index
			Stores current index for iteration
			*/
			,_index: undefined

			/*
			Property: _key
			Stores current key.  Used primarily to get the correct index if items are removed at a lower index.
			*/
			,_key: undefined

			/*
			Method: current
			Gets item at current key
			Returns:
				(Mixed) item at current key
			*/
			,current: function(){
				return this.get(this._key);
			}

			/*
			Method: each
			Iterates through list from current index, running callback on each item.  If callback returns `false`, loop will stop.
			*/
			,each: function(_callback){
				var _continue = true;
				var _item;
				var _key;
				var _startingKey = this._key;
				if(this.count()){
					this.first();
					while(_continue !== false && this.valid()){
						_item = this.current();
						_key = this.key();
						_continue = _callback.call(this, _item, _key);
						try{
							this.next();
						}catch(_e){
							break;
						}
					}
				}
				this.goTo(_startingKey);
				return this;
			}

			/*
			Method: first
			Moves index to first item.
			*/
			,first: function(){
				this._index = 0;
				this.updateKeyForIndex();
			}

			/*
			Method: goTo
			Moves to position of key
			*/
			,goTo: function(_key){
				this._key = _key;
				this.updateIndexForKey();
				return this;
			}

			/*
			Method: goToIndex
			Moves to position of key
			*/
			,goToIndex: function(_index){
				this._index = _index;
				this.updateKeyForIndex();
				return this;
			}

			/*
			Method: hasNext
			Whether or not there is another item after the current index.
			Returns:
				(Boolean)
			*/
			,hasNext: function(){
				return (this._index + 1 < this.count());
			}

			/*
			Method: hasPrev
			Whether or not there is another item before the current index.
			Returns:
				(Boolean)
			*/
			,hasPrev: function(){
				return (this._index > 1);
			}

			/*
			Method: index
			Returns the index of the current item.
			Returns
				(Integer) index of current item
			*/
			,index: function(){
				return this._index;
			}

			/*
			Method: key
			Returns the key of the current item.
			Returns
				(Mixed) key of current item
			*/
			,key: function(){
				return this._key;
			}

			/*
			Method: last
			Moves index to last item.
			*/
			,last: function(){
				this._index = this.count() - 1;
				this.updateKeyForIndex();
				return this;
			}

			/*
			Method: next
			Moves index to next item.
			*/
			,next: function(){
				if(this.hasNext()){
					++this._index;
					this.updateKeyForIndex();
				}else{
					throw 'No next item exists';
				}
				return this;
			}

			/*
			Method: prev
			Moves index to previous item.
			*/
			,prev: function(){
				if(this.hasPrev()){
					--this._index;
					this.updateKeyForIndex();
				}else{
					throw 'No previous item exists';
				}
				return this;
			}

			/*
			Method: valid
			Whether `_index` key exists
			*/
			,valid: function(){
				return this.hasIndex(this._index);
			}

			/*
			Method: value
			Get current value.  Alias for `current()`.
			*/
			,value: function(){
				return this.current();
			}
		}
	});
	return __this;
});
