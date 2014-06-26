/*
Class: RangeList
List that uses a `Range` as a virtual list of values.
*/
define(['tmclasses/tmclasses', './List'], function(__tmclasses, __List){
	var __this = __tmclasses.create({
		parent: __List
		,properties: {
			//==list

			/*
			Property: type
			{{See List}}
			*/
			type: 'range'

			/*
			Method: count
			{{See List}}
			*/
			,count: function(){
				return (this._items.max - this._items.min) / this._items.increment;
			}

			/*
			Method: get
			{{See List}}
			*/
			,get: function(_key){
				return _key;
			}

			/*
			Method: getForIndex
			{{See List}}
			*/
			,getForIndex: function(_index){
				return this._items.min + this._items.increment * _index;
			}

			/*
			Method: getIndexForKey
			{{See List}}
			*/
			,getIndexForKey: function(_key){
				return (_key / this._items.increment) - this._items.min;
			}

			/*
			Method: getKeyForIndex
			{{See List}}
			*/
			,getKeyForIndex: function(_index){
				return this.getForIndex(_index);
			}

			/*
			Method: has
			{{See List}}
			*/
			,has: function(_key){
				return _key >= this._items.min && _key <= this._items.max;
			}

			///*
			//Method: hasIndex
			//{{See List}}
			//*/
			//,hasIndex: function(_key){
			//	var _value = this.get(_key);
			//	return _value >= this._items.min && _value <= this._items.max;
			//}
		}
	});
	return __this;
});
