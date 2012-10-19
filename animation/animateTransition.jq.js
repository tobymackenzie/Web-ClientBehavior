/*
animates transition between two elements
-----dependencies
tmlib: animationQueue
-----parameters
arguments:
	duration (integer || array[integers] || array[arrays[integers]]): duration of animation or of each animation step or for each item of each step
	stylesBefore (array[map of style properties and values]): styles to apply to elements before animation starts
	stylesTransition (array[stylemap || array[stylemap]]): styles to animate elements to
	stylesAfter (array[stylemap]): styles to apply to elements after animation
-----instantiation
		//--
		__.animateImage = new __.classes.AnimateTransition({
			stylesBefore: [
				{}
				,{left: __.bannerlist.width(), display: 'block'}
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
		__.animateLabel = new __.classes.AnimateTransition({
			doMultistep: true
			,duration: [this.boot.duration * 1/3, this.boot.duration *2/3]
			,stylesBefore: [
				{}
				,{bottom:  -(elmLabel.outerHeight()), display: 'block'}
			]
			,stylesTransition: [
				[
					{bottom: __.bannerlist.height()}
					,{}
				]
				,[
					{}
					,function(argElement){
						return {bottom: argElement.attr(this.boot.attrDataBottom)}
					}
				]
			]
			,stylesAfter: [
				{display: 'none'}
				,{}
			]
			,boot: {attrDataBottom: 'data-bottom'}
		})
-----html
-----css
*/

/*-------
©AnimateTransition
-------- */
__.classes.AnimateTransition = function(args){
		//--required attributes
//->return
		//--optional attributes
		this.boot = args.boot || null;
		this.callbackTransition = (typeof args.callbackTransition != 'undefined')? args.callbackTransition: this.defaultCallbackTransition;
		this.doMultistep = args.doMultistep || false;
		this.duration = args.duration || 500;
		this.stylesBefore = args.stylesBefore || null;
		this.stylesTransition = args.stylesTransition || null;
		this.stylesAfter = args.stylesAfter || null;
		this.onbefore = (typeof args.onbefore != 'undefined')? args.onbefore: this.defaultOnBefore;
		this.onafter = (typeof args.onafter != 'undefined')? args.onafter: this.defaultOnAfter;
		this.oninit = args.oninit || null;

		//--derived attributes
		this.inprogress = false;
		this.queue = new __.classes.animationQueue();
		//--do something
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.AnimateTransition.prototype.transitionForElements = function(args){
		if(typeof args.elements != 'undefined')
			var fncArgs = args;
		else
			var fncArgs = {elements: args};
		var fncThis = this;
		if(fncThis.onbefore)
			fncThis.queue.queue({callback: function(){
				fncThis.onbefore.call(fncThis, fncArgs);
			}});
		if(fncThis.callbackTransition){
			if(fncThis.doMultistep && fncThis.stylesTransition){
				for(var keyStep in fncThis.stylesTransition){
					if(fncThis.stylesTransition.hasOwnProperty(keyStep)){
						fncThis.queue.queue({callback: function(fncThis, keyStep){
							return function(){
								fncThis.callbackTransition.call(fncThis, fncArgs, keyStep);
							}
						}(fncThis, keyStep)});
					}
				}
			}else{
				fncThis.queue.queue({callback: function(){
					fncThis.callbackTransition.call(fncThis, fncArgs);
				}});
			}
		}
		if(fncThis.onafter)
			fncThis.queue.queue({callback: function(){
				fncThis.onafter.call(fncThis, fncArgs);
			}});
		fncThis.queue.dequeue();
	}
	__.classes.AnimateTransition.prototype.defaultCallbackTransition = function(args, argKeyStep){
		var fncElements = args.elements;
		var lcCountElements = fncElements.length;
		var fncThis = this;
		fncThis.countItemsCompleted = 0;
		var callbackDQ = (typeof argKeyStep != 'undefined')
			? function(){
				++fncThis.countItemsCompleted;
				if(fncThis.countItemsCompleted >= lcCountElements){
					fncThis.queue.dequeue();
				}
			}
			: function(){
				fncThis.queue.dequeue();
			}
		;
		for(var keyItem in fncElements){
			if(fncElements.hasOwnProperty(keyItem)){
				if(!this.stylesTransition){
					lopStylesTransition = null;
				}else if(typeof argKeyStep != 'undefined'){
					var lopStylesTransition = this.stylesTransition[argKeyStep][keyItem] || null;
					if(this.duration.constructor == Array){
						var lopDuration = this.duration[argKeyStep];
						if(lopDuration.constructor == Array){
							lopDuration = this.duration[argKeyStep][keyItem];
						}
					}else{
						var lopDuration = this.duration;
					}
				}else{
					var lopStylesTransition = fncThis.stylesTransition[keyItem] || null;
					var lopDuration = this.duration;
				}
				if(lopStylesTransition){
					if(typeof lopStylesTransition === 'function'){
						lopStylesTransition = lopStylesTransition.call(this, fncElements[keyItem], args);
					}
					var lopCallbackDQ = callbackDQ;
					fncElements[keyItem].animate(lopStylesTransition, lopDuration, lopCallbackDQ);
				}else{
					callbackDQ();
				}
			}
		}
	}
	__.classes.AnimateTransition.prototype.defaultOnBefore = function(args){
		var fncElements = args.elements;
		var fncThis = this;
		for(var keyItem in fncElements){
			if(fncElements.hasOwnProperty(keyItem)){
				var lopStylesBefore = (this.stylesBefore && this.stylesBefore[keyItem]) ? this.stylesBefore[keyItem] : null;
				if(lopStylesBefore){
					if(typeof lopStylesBefore === 'function'){
						lopStylesBefore = lopStylesBefore.call(this, fncElements[keyItem], args);
					}
					if(lopStylesBefore)
						fncElements[keyItem].css(lopStylesBefore);
				}
			}
		}
		this.queue.dequeue();
	}
	__.classes.AnimateTransition.prototype.defaultOnAfter = function(args){
		var fncElements = args.elements;
		for(var keyItem in fncElements){
			if(fncElements.hasOwnProperty(keyItem)){
				var lopStylesAfter = (this.stylesAfter && this.stylesAfter[keyItem]) ? this.stylesAfter[keyItem] : null;
				if(lopStylesAfter){
					if(typeof lopStylesAfter === 'function'){
						lopStylesAfter = lopStylesAfter.call(this, fncElements[keyItem], args);
					}
					if(lopStylesAfter){
						fncElements[keyItem].css(lopStylesAfter);
					}
				}
			}
		}
		this.queue.dequeue();
	}
