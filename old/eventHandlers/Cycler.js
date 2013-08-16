/*
Class: Cycler
Used to automatically run an object method or function at a set interval, with an ability to stop and start
Parameters:
	autoStart(Boolean): Start automatically on init
	method(String|Function): Applied directly if a function.  Key of this.object is applied if a string
	methodArguments(Array): Arguments to pass to this.method
	object(Object): Object to run this.method on if this.method is a string
	interval(integer): time in milliseconds between each run of this.method
*/
/*-----
==cycler
-----*/
__.classes.Cycler = function(args){
		this.autoStart = (typeof args.autoStart != 'undefined') ? args.autoStart : true;
		this.method = args.method || 'next';
		this.methodArguments = args.methodArguments || [];
		this.object = args.object || null;
		this.interval = args.interval || 4000;

		this.intervalObject = null;

		if(this.autoStart){
			this.start();
		}
	}
	__.classes.Cycler.prototype.start = function(){
		var lcThis = this;
		this.intervalObject = setInterval(function(){
			var methodArguments = (typeof lcThis.methodArguments == 'function')
				? lcThis.methodArguments.apply(lcThis)
				: lcThis.methodArguments
			;
			if(typeof lcThis.method == 'function'){
				lcThis.method.apply(lcThis, methodArguments);
			}else{
				lcThis.object[lcThis.method].apply(lcThis.object, methodArguments);
			}
		}, this.interval);
	}
	__.classes.Cycler.prototype.stop = function(){
		clearInterval(this.intervalObject);
	}
