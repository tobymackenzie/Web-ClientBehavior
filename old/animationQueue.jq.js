/*
Class: AnimationQueue
used to place steps of jquery animation in order, wrapper for jquery's queue

Develompent notes:
	the 'this' passed to the callback functions is not anything useful, seems to be the jquery queue object

Parameters:
	autoDequeue (false): if autodequeue is true, automatically moves to next animation step once started, otherwise must dequeue in callback functions.  autoDequeu only useful for animations on one element

Example:
	if(typeof $ !== 'undefined'){
		$(document).ready(function(){
			var elmErrorsbox = $('.phperrorsbox');
			if(elmErrorsbox.length > 0){
				__.AnimationQueue = new __.classes.AnimationQueue({autoDequeue: true});
				__.AnimationQueue.queue(function(){
					elmErrorsbox.fadeOut(1000);
				});
				__.AnimationQueue.queue(function(){
					elmErrorsbox.animate({'left': (elmErrorsbox.position().left + 100) + 'px'}, 1000);
				});
				__.AnimationQueue.queue(function(){
					elmErrorsbox.fadeIn(1000);
				});
				__.AnimationQueue.queue(function(){
					elmErrorsbox.animate({'left': (elmErrorsbox.position().left - 100) + 'px'}, 1000);
				});
				__.AnimationQueue.queue(function(){
					elmErrorsbox.animate({'left': (elmErrorsbox.position().left + 100) + 'px'}, 1000);
				});
				__.AnimationQueue.queue(function(){
					elmErrorsbox.animate({'left': (elmErrorsbox.position().left - 100) + 'px'}, 1000);
				});
				__.AnimationQueue.queue(function(){
					elmErrorsbox.animate({'left': (elmErrorsbox.position().left + 100) + 'px'}, 1000);
				});
				__.AnimationQueue.queue(function(){
					elmErrorsbox.animate({'left': (elmErrorsbox.position().left - 100) + 'px'}, 1000);
				});
				__.AnimationQueue.queue(function(){
					elmErrorsbox.animate({'left': (elmErrorsbox.position().left + 100) + 'px'}, 1000);
				});
				__.AnimationQueue.queue(function(){
					elmErrorsbox.animate({'left': (elmErrorsbox.position().left - 100) + 'px'}, 1000);
				});
				__.AnimationQueue.dequeue();
			}
		});
	}
*/
/* global __, jQuery */
__.classes.AnimationQueue = __.core.Classes.create({
	init: function(){
		this.__base(arguments);

		//--derived variables
		this.objQueue = jQuery({});
	}
	,properties: {
		autoDequeue:  false
		,clearQueue: function(_args){
			var _name;
			if(typeof _args !== 'undefined'){
				_name = _args.name || _args;
			}else{
				_name = this.name;
			}
			this.objQueue.clearQueue(_name);
		}
		,dequeue: function(_args){
			var _name;
			if(typeof _args!= 'undefined'){
				_name = _args.name || _args;
			}else{
				_name = this.name;
			}
			this.objQueue.dequeue(_name);
		}
		,name: 'tmlib'
		,objQueue: undefined
		,queue: function(_args){
			var fncThis = this;
			var _name = _args.name || this.name;
			var fncCallback = _args.callback || _args; //-arguments is (assumed) the callback if not set explicitely
			var fncAutoDequeue = (typeof _args.autoDequeue != 'undefined')? _args.autoDequeue: fncThis.autoDequeue;
			var fncQueueCallback = (fncAutoDequeue)
				?function(){
						var fncArgs= _args;
						var internalThis = this;
						fncCallback.apply(internalThis, fncArgs);
						fncThis.dequeue();
					}
				:fncCallback
			;
			this.objQueue.queue(_name, fncQueueCallback);
		}
		,unshift: function(_args){
			if(typeof _args === 'undefined'){
				_args = {};
			}
			var fncCallback = _args.callback || _args;
			var _name = _args.name || this.name;
			if(typeof fncCallback == 'undefined' || !fncCallback){
				return false;
			}
//->return
			var fncQueue = this.objQueue.queue(_name);
			fncQueue.unshift(fncCallback);
		}
	}
});
