/*-------------
©animationQueue
------------*/
__.classes.animationQueue = function(arguments){
		if(typeof arguments == "undefined") arguments = {};
		//--optional variables
		this.name = arguments.name || "tmlib";
		
		//--derived variables
		this.arrayAnimationSteps = $({});
	}
	__.classes.animationQueue.prototype.queue = function(callback){
		var fncThis = this;
		this.arrayAnimationSteps.queue(this.name, callback);
	}
	__.classes.animationQueue.prototype.dequeue = function(){
		this.arrayAnimationSteps.dequeue(this.name);
	}

