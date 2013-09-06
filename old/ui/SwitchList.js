/*
Class: SwitchList

*/
/* global __, clearInterval, setInterval */
__.classes.SwitchList = __.core.Classes.create({
	init: function(){
		this.__base(arguments);
		if(typeof this.items === 'string' && this.$){
			this.items = this.$.find(this.items);
		}
		if(!this.queue){
			this.queue = new __.classes.animationQueue();
		}

		if(typeof this.items === 'object' && this.items.length){
			if(!this.current){
				this.current = this.items.first();
			}
			this.setInterval();
		}
	}
	,properties: {
		$: undefined
		,current: undefined
		,deinit: function(){
			clearInterval(this._interval);
			delete this.current;
			delete this.items;
			delete this.navigation;
			this.__parent();
		}
		,duration: 1000
		,_interval: undefined
		,interval: 4000
		,items: '.switchItem'
		,preSwitch: undefined
		,queue: undefined
		,setInterval: function(){
			var _this = this;
			if(typeof this.items === 'object' && this.items.length > 1){
				this._interval = setInterval(function(){
					_this.switchToNext();
				}, this.interval);
			}
		}
		,switchToItem: function(_item){
			var _this = this;
			if(_item && _item.length){
				if(this.preSwitch){
					this.preSwitch(_item);
				}
				this.queue.queue(function(){
					_this.current.fadeOut(500, function(){
						_this.queue.dequeue();
					});
				});
				this.queue.queue(function(){
					_item.fadeIn(function(){
						_this.current = _item;
						_this.queue.dequeue();
					});
				});
				this.queue.dequeue();
			}
		}
		,switchToNext: function(){
			var _nextItem = this.current.next();
			if(!_nextItem.length){
				_nextItem = this.items.first();
			}
			if(_nextItem.length){
				this.switchToItem(_nextItem);
			}
		}
	}
});
