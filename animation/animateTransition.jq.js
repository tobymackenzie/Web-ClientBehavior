/*
animates transition between two elements
-----dependencies
tmlib: animationQueue
-----parameters
arguments:
	stylesBefore (array[map of style properties and values]): styles to apply to elements before animation starts
	stylesTransition (array[map of style properties and values]): styles to animate elemetns to
	stylesAfter (array[map of style properties and values]): styles to apply to elements after animation
-----instantiation
		animateImage: new __.classes.AnimateTransition({
			stylesBefore: [
				{}
				,{left: __.bannerlist.width(), display: "block"}
			]
			,stylesTransition: [
				{left: -(__.bannerlist.width())}
				,{left: 0}
			]
			,stylesAfter: [
				{}
				,{}
			]
		})
-----html
-----css
*/

/*-------
©AnimateTransition
-------- */
__.classes.AnimateTransition = function(arguments){
		//--required attributes
//->return
		//--optional attributes
		this.boot = arguments.boot || null;
		this.callbackTransition = (typeof arguments.callbackTransition != "undefined")? arguments.callbackTransition: this.defaultCallbackTransition;
		this.duration = arguments.duration || 500;
		this.stylesBefore = arguments.stylesBefore || null;
		this.stylesTransition = arguments.stylesTransition || null;
		this.stylesAfter = arguments.stylesAfter || null;
		this.onbefore = (typeof arguments.onbefore != "undefined")? arguments.onbefore: this.defaultOnBefore;
		this.onafter = (typeof arguments.onafter != "undefined")? arguments.onafter: this.defaultOnAfter;
		this.oninit = arguments.oninit || null;

		//--derived attributes
		this.inprogress = false;
		this.queue = new __.classes.animationQueue();
		//--do something
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.AnimateTransition.prototype.transitionForElements = function(arguments){
		if(typeof arguments.elements != "undefined")
			var fncArguments = arguments;
		else
			var fncArguments = {elements: arguments};
		var fncThis = this;

		if(fncThis.onbefore)
			fncThis.queue.queue({callback: function(){
				fncThis.onbefore.call(fncThis, fncArguments);
			}});
		if(fncThis.callbackTransition)
			fncThis.queue.queue({callback: function(){
				fncThis.callbackTransition.call(fncThis, fncArguments);
			}});
		if(fncThis.onafter)
			fncThis.queue.queue({callback: function(){
				fncThis.onafter.call(fncThis, fncArguments);
			}});
		fncThis.queue.dequeue();
	}
	__.classes.AnimateTransition.prototype.defaultCallbackTransition = function(arguments){
		var fncElements = arguments.elements;
		for(var key in fncElements){
			if(fncElements.hasOwnProperty(key)){
				var lopStylesTransition = this.stylesTransition[key] || null;
				if(lopStylesTransition){
					if(typeof lopStylesTransition === "function")
						lopStylesTransition = lopStylesTransition.call(this, fncElements[key]);
					fncElements[key].animate(lopStylesTransition, this.duration);
				}
			}
		}
		this.queue.dequeue();
	}
	__.classes.AnimateTransition.prototype.defaultOnBefore = function(arguments){
		var fncElements = arguments.elements;
		var fncThis = this;
		for(var key in fncElements){
			if(fncElements.hasOwnProperty(key)){
				var lopStylesBefore = this.stylesBefore[key] || null;
				if(lopStylesBefore){
					if(typeof lopStyleBefore === "function")
						lopStyleBefore = lopStyleBefore.call(this, fncElements[key]);
					fncElements[key].css(lopStylesBefore);
				}
			}
		}
		this.queue.dequeue();
	}
	__.classes.AnimateTransition.prototype.defaultOnAfter = function(arguments){
		var fncElements = arguments.elements;
		for(var key in fncElements){
			if(fncElements.hasOwnProperty(key)){
				var lopStylesAfter = this.stylesAfter[key] || null;
				if(lopStylesAfter){
					if(typeof lopStylesAfter === "function")
						lopStyleBefore = lopStylesAfter.call(this, fncElements[key]);
					fncElements[key].css(lopStylesAfter);
				}
			}
		}
		this.queue.dequeue();
	}

