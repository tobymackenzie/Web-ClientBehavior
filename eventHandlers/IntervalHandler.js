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
__.classes.IntervalHandler = function(args){
		//--required attributes
//->return
		//--optional attributes
		this.callback = args.callback || null;
		this.delay = args.delay || 1000;

		//--derived attributes
		this.interval = false;
		
		//--do something
		this.startInterval();
	}
	__.classes.IntervalHandler.prototype.startInterval = function(args){
		if(this.interval)
			this.interval.clearInterval();
		if(this.callback){
			var fncThis = this;
			this.interval = this.setInterval(function(){
				fncThis.callback.call(fncThis);
			}, this.delay);
		}
	}

