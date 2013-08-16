/* global __, setTimeout */

__.mixins.PubSub = {
	properties: {
		getSubscriptions: function(_key){
			if(!(this.subscriptions instanceof Array)){
				this.subscriptions = [];
			}
			if(typeof _key === 'undefined'){
				return this.subscriptions;
			}else{
				if(typeof this.subscriptions[_key] == 'undefined'){
					this.subscriptions[_key] = [];
				}
				return this.subscriptions[_key];
			}
		}
		,pub: function(_eventName, _data){
			var _this = this;
			//-#publish in separate thread
			setTimeout(function(){
				var _i = 0;
				var _subscription;
				var _subscriptions = _this.getSubscriptions(_eventName);
				var _subscriptionsLength = _subscriptions.length;
				for(; _i < _subscriptionsLength; ++_i){
					_subscription = _subscriptions[_i];
					_subscription.call(_this, _data || null);
				}
			}, 0);
		}
		,sub: function(_eventName, _callback){
			var _subscriptions = this.getSubscriptions(_eventName);
			_subscriptions.push(_callback);
		}
		,subscriptions: null
		,unsub: function(){

		}
	}
};
