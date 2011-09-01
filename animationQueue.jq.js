/*
used to place steps of jquery animation in order, wrapper for jquery's queue

-----develompent notes
the "this" passed to the callback functions is not anything useful, seems to be the jquery queue object

-----parameters
@param autoDequeue (false): if autodequeue is true, automatically moves to next animation step once started, otherwise must dequeue in callback functions.  autoDequeu only useful for animations on one element

-----instantiation
if(typeof $ !== 'undefined'){
	$(document).ready(function(){
		var elmErrorsbox = $(".phperrorsbox");
		if(elmErrorsbox.length > 0){
			__.animationQueue = new __.classes.animationQueue({autoDequeue: true});
			__.animationQueue.queue(function(){
				elmErrorsbox.fadeOut(1000);
			});
			__.animationQueue.queue(function(){
				elmErrorsbox.animate({"left": (elmErrorsbox.position().left + 100) + "px"}, 1000);
			});
			__.animationQueue.queue(function(){
				elmErrorsbox.fadeIn(1000);
			});
			__.animationQueue.queue(function(){
				elmErrorsbox.animate({"left": (elmErrorsbox.position().left - 100) + "px"}, 1000);
			});
			__.animationQueue.queue(function(){
				elmErrorsbox.animate({"left": (elmErrorsbox.position().left + 100) + "px"}, 1000);
			});
			__.animationQueue.queue(function(){
				elmErrorsbox.animate({"left": (elmErrorsbox.position().left - 100) + "px"}, 1000);
			});
			__.animationQueue.queue(function(){
				elmErrorsbox.animate({"left": (elmErrorsbox.position().left + 100) + "px"}, 1000);
			});
			__.animationQueue.queue(function(){
				elmErrorsbox.animate({"left": (elmErrorsbox.position().left - 100) + "px"}, 1000);
			});
			__.animationQueue.queue(function(){
				elmErrorsbox.animate({"left": (elmErrorsbox.position().left + 100) + "px"}, 1000);
			});
			__.animationQueue.queue(function(){
				elmErrorsbox.animate({"left": (elmErrorsbox.position().left - 100) + "px"}, 1000);
			});
			__.animationQueue.dequeue();
		}
	});
}
*/
/*-------------
©animationQueue
------------*/
__.classes.animationQueue = function(args){
		if(typeof args== "undefined") args= {};
		//--optional variables
		this.name = args.name || "tmlib";
		this.autoDequeue = args.autoDequeue || false;
		
		//--derived variables
		this.objQueue = jQuery({});
	}
	__.classes.animationQueue.prototype.queue = function(args){
		var fncThis = this;
		var fncName = args.name || this.name;
		var fncCallback = args.callback || args; //-arguments is (assumed) the callback if not set explicitely
		var fncAutoDequeue = (typeof args.autoDequeue != "undefined")? args.autoDequeue: fncThis.autoDequeue;
		var fncQueueCallback = (fncAutoDequeue)
			?function(){
					var fncArgs= args;
					var internalThis = this;
					fncCallback.apply(internalThis, fncArgs);
					fncThis.dequeue();
				}
			:fncCallback
		;
		this.objQueue.queue(fncName, fncQueueCallback);
	}
	__.classes.animationQueue.prototype.dequeue = function(args){
		if(typeof args!= "undefined")
			var fncName = args.name || args;
		else
			var fncName = this.name;
		this.objQueue.dequeue(fncName);
	}
	__.classes.animationQueue.prototype.unshift = function(args){
		if(typeof args!= "undefined"){
			var fncCallback = args.callback || args;
			var fncName = args.name || this.name;
		}
		if(typeof fncCallback == "undefined" || !fncCallback) return false;
//->return
		var fncQueue = this.objQueue.queue(fncName);
		fncQueue.unshift(fncCallback);
	}
	__.classes.animationQueue.prototype.clearQueue = function(args){
		if(typeof args != "undefined")
			var fncName = args.name || args;
		else
			var fncName = this.name;
		this.objQueue.clearQueue(fncName);
	}

