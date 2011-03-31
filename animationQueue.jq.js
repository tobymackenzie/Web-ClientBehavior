/*
used to place steps of jquery animation in order, wrapper for jquery's queue

@param autoDequeue (false): if autodequeue is true, automatically moves to next animation step once started, otherwise must dequeue in callback functions.  autoDequeu only useful for animations on one element

-----develompent notes
the "this" passed to the callback functions is not anything useful, seems to be the jquery queue object

-----example
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
__.classes.animationQueue = function(arguments){
		if(typeof arguments == "undefined") arguments = {};
		//--optional attributes
		this.name = arguments.name || "tmlib";
		this.autoDequeue = arguments.autoDequeue || false;
		
		//--derived attributes
		this.arrayAnimationSteps = $({});
	}
	__.classes.animationQueue.prototype.queue = function(arguments){
		var fncThis = this;
		var fncName = arguments.name || this.name;
		var fncCallback = arguments.callback || arguments; //-arguments is (assumed) the callback if not set explicitely
		var fncAutoDequeue = (typeof arguments.autoDequeue != "undefined")? arguments.autoDequeue: fncThis.autoDequeue;
		var fncQueueCallback = (fncAutoDequeue)
			?function(){
					var fncArguments = arguments;
					var internalThis = this;
					fncCallback.apply(internalThis, fncArguments);
					fncThis.dequeue();
				}
			:fncCallback
		;
		this.arrayAnimationSteps.queue(fncName, fncQueueCallback);
	}
	__.classes.animationQueue.prototype.dequeue = function(arguments){
		if(typeof arguments != "undefined")
			var fncName = arguments.name || arguments;
		else
			var fncName = this.name;
		this.arrayAnimationSteps.dequeue(fncName);
	}
	__.classes.animationQueue.prototype.clearQueue = function(arguments){
		if(typeof arguments != "undefined")
			var fncName = arguments.name || arguments;
		else
			var fncName = this.name;
		this.arrayAnimationSteps.clearQueue(fncName);
	}

