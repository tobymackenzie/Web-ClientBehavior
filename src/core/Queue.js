/*
Class: Queue
Use jQuery promises to queue operations.

Source:
	http://samarskyy.blogspot.com/2011/10/jquery-deferred-queues.html
*/
/* global Exception, define */
define(['jquery', 'tmclasses/tmclasses'], function(jQuery, tmclasses){
	var __This = tmclasses.create({
		init: function(){
			this._current = jQuery(this).promise();
		}
		,properties: {
			_current: undefined
			,add: function(){
				var _args = arguments;
				var _this = this;
				if(_args.length < 1){
					throw new Exception('Must pass one or more arguments to add.');
				}
				var _autoPromise = _this.autoPromise;
				if(typeof _args[0] === 'boolean'){
					_autoPromise = _args[0];
				}

				if(jQuery.isArray(_args[0])){
					jQuery.each(_args[0], function(_i, _item){
						var _method = (jQuery.isArray(_item)) ? 'apply' : 'call';
						_this.add[_method](_this, _item);
					});
				}else{
					var _fnOrPromise = _args[0];
					if(_fnOrPromise && typeof _fnOrPromise === 'function'){
						_args = Array.prototype.slice.call(_args, 1);
						_this._current = _this._current.pipe(function(){
							if(_this.autoPromise){
								return jQuery.Deferred(function(){
									try{
										return _fnOrPromise.apply(this, _args);
									}catch(_e){
										this.reject(_e);
										_this._current = jQuery(_this).promise();
										return _this._current;
									}
								}).promise();
							}else{
								var _result = _fnOrPromise.apply(this, _args);
								return (_result.promise) ? _result.promise() : _result;
							}
						});
					}else{
						_this._current = _fnOrPromise;
					}
				}
				return _this;
			}
			,autoPromise: false
			,pipe: function(){
				this.add.apply(this, arguments);
				return this;
			}
			,then: function(){
				this.add.apply(this, arguments);
				return this;
			}
			,done: function(){
				this._current.done.apply(this._current.promise, arguments);
				return this;
			}
			,fail: function(){
				this._current.fail.apply(this._current.promise, arguments);
				return this;
			}
		}
	});

//	var queue = new __This();
//	queue.add(function(){
//clog('queue added function run', this, arguments);
//		//var _this = this;
//		var _this = new jQuery.Deferred();
//		setTimeout(function(){
//clog('queue step complete');
//			_this.resolve();
//		}, 1000);
//		return _this;
//	});
//	queue.add(function(){
//clog('queue added function run', this, arguments);
//		//var _this = this;
//		var _this = new jQuery.Deferred();
//		setTimeout(function(){
//clog('queue step complete');
//			_this.resolve();
//		}, 1000);
//		return _this;
//	});
//	queue.add(function(){
//clog('queue added function run', this, arguments);
//		//var _this = this;
//		var _this = new jQuery.Deferred();
//		setTimeout(function(){
//clog('queue step complete');
//			_this.resolve();
//		}, 1000);
//		return _this;
//	});
//	queue.add([
//		function(){
//clog('queue array added function run', this, arguments);
//			//var _this = this;
//			var _this = new jQuery.Deferred();
//			setTimeout(function(){
//clog('queue array step complete');
//				_this.resolve();
//			}, 1000);
//			return _this;
//		}
//		,function(){
//clog('queue array added function run', this, arguments);
//			//var _this = this;
//			var _this = new jQuery.Deferred();
//			setTimeout(function(){
//clog('queue array step complete');
//				_this.resolve();
//			}, 1000);
//			return _this;
//		}
//		,function(){
//clog('queue array added function run', this, arguments);
//			//var _this = this;
//			var _this = new jQuery.Deferred();
//			setTimeout(function(){
//clog('queue array step complete, failing');
//				_this.reject();
//			}, 1000);
//			return _this;
//		}
//	]);
//	queue.add(function(){
//clog('queue final added function run', this, arguments);
//		//var _this = this;
//		var _this = new jQuery.Deferred();
//		setTimeout(function(){
//clog('queue final step complete');
//			_this.resolve();
//		}, 1000);
//		return _this;
//	});

//	queue.done(function(){
//clog('queue done');
//	}).fail(function(){
//clog('queue failed');
//	});
//clog('queue set up');
	return __This;
});
