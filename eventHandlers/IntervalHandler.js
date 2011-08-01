/*
description
-----dependencies
-----parameters
-----instantiation
-----html
-----css
*/

/*-------
©IntervalHandler
-------- */
__.classes.IntervalHandler = function(arguments){
		//--required attributes
//->return
		//--optional attributes
		this.callback = arguments.callback || null;
		this.delay = arguments.delay || 1000;

		//--derived attributes
		this.interval = false;
		
		//--do something
		this.startInterval();
	}
	__.classes.IntervalHandler.prototype.startInterval = function(arguments){
		if(this.interval)
			this.interval.clearInterval();
		if(this.callback){
			var fncThis = this;
			this.interval = this.setInterval(function(){
				fncThis.callback.call(fncThis);
			}, this.delay);
		}
	}

