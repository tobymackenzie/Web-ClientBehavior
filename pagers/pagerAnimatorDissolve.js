/*
generic dissolve animation between two elements

-----style
elements must be positioned over each other

-----dependencies
tmlib base
jquery

-----instantiation
	new __.classes.pagerAnimatorDissolve({cssZIndexBehind: -3, cssZIndexNormal: -2})
*/


/*-------------
©pagerAnimatorDissolve
------------*/
__.classes.pagerAnimatorDissolve = function(args){
		if(typeof args== "undefined") args = {};
		//--optional attribributes
		this.classCurrent = args.classCurrent || "current";
		this.cssZIndexBehind = args.cssZIndexBehind || -1;
		this.cssZIndexNormal = args.cssZIndexNormal || 0;
		this.duration = (typeof args.duration != "undefined")? args.duration: 500;
		this.oninit = args.oninit || null;
		this.onpreswitch = args.onpreswitch || null;
		this.onpostswitch = args.onpostswitch || null;
		this.boot = args.boot || null;
		
		//--derived attributes
		this.inprogress = false;
		this.queue = new __.classes.animationQueue();

		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.pagerAnimatorDissolve.prototype.switche = function(args){
		var fncThis = this;
//-> return
		if(fncThis.inprogress==true) return false;		

		fncThis.inprogress = true;

		var localVariables = {};
		localVariables.elmFrom = args.elmFrom;
		localVariables.elmTo = args.elmTo;

		//--set up queue
		if(fncThis.onpreswitch)
			fncThis.queue.queue({callback: function(){
				fncThis.onpreswitch.call(fncThis, localVariables);
			}});
		fncThis.queue.queue({callback: function(){
			localVariables.elmToZIndex = localVariables.elmTo.css("z-index") || fncThis.cssZIndexNormal;
			localVariables.elmTo.css("z-index", fncThis.cssZIndexBehind).show();
			localVariables.elmFrom.fadeOut(fncThis.duration, function(){
				fncThis.queue.dequeue();
			});
		}});
		fncThis.queue.queue({callback: function(){
			localVariables.elmTo.css("z-index", localVariables.elmToZIndex).addClass(fncThis.classCurrent);
			localVariables.elmFrom.removeClass(fncThis.classCurrent);
			fncThis.queue.dequeue();
		}});
		if(fncThis.onpostswitch)
			fncThis.queue.queue({callback: function(){
				fncThis.onpostswitch.call(fncThis, localVariables);
			}});
		fncThis.queue.queue({callback: function(){
			fncThis.inprogress = false;
			fncThis.queue.dequeue();
		}});

		//--start queue		
		fncThis.queue.dequeue();
	}

