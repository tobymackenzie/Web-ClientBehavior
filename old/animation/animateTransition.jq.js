/*
Class: AnimateTransition

Animates transition between two elements

Dependencies:
tmlib: animationQueue

Parameters:
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
*/
/* global __ */
__.classes.AnimateTransition = function(_args){
		//--required attributes
//->return
		//--optional attributes
		this.boot = _args.boot || null;
		this.callbackTransition = (typeof _args.callbackTransition != 'undefined')? _args.callbackTransition: this.defaultCallbackTransition;
		this.doMultistep = _args.doMultistep || false;
		this.duration = _args.duration || 500;
		this.stylesBefore = _args.stylesBefore || null;
		this.stylesTransition = _args.stylesTransition || null;
		this.stylesAfter = _args.stylesAfter || null;
		this.onbefore = (typeof _args.onbefore != 'undefined')? _args.onbefore: this.defaultOnBefore;
		this.onafter = (typeof _args.onafter != 'undefined')? _args.onafter: this.defaultOnAfter;
		this.oninit = _args.oninit || null;

		//--derived attributes
		this.inprogress = false;
		this.queue = new __.classes.animationQueue();
		//--do something
		if(this.oninit){
			this.oninit.call(this);
		}
	};
	__.classes.AnimateTransition.prototype.transitionForElements = function(_args){
		if(typeof _args.elements === 'undefined'){
			_args = {elements: _args};
		}
		var _this = this;
		if(_this.onbefore){
			_this.queue.queue({callback: function(){
				_this.onbefore.call(_this, _args);
			}});
		}
		if(_this.callbackTransition){
			if(_this.doMultistep && _this.stylesTransition){
				for(var _keyStep in _this.stylesTransition){
					if(_this.stylesTransition.hasOwnProperty(_keyStep)){
						_this.queue.queue({callback: function(_this, _keyStep){
							return function(){
								_this.callbackTransition.call(_this, _args, _keyStep);
							};
						}(_this, _keyStep)});
					}
				}
			}else{
				_this.queue.queue({callback: function(){
					_this.callbackTransition.call(_this, _args);
				}});
			}
		}
		if(_this.onafter){
			_this.queue.queue({callback: function(){
				_this.onafter.call(_this, _args);
			}});
		}
		_this.queue.dequeue();
	};
	__.classes.AnimateTransition.prototype.defaultCallbackTransition = function(_args, _stepKey){
		var _elms = _args.elements;
		var _countElms = _elms.length;
		var _this = this;
		_this.countItemsCompleted = 0;
		var callbackDQ = function(){
			++_this.countItemsCompleted;
			if(_this.countItemsCompleted >= _countElms){
				_this.queue.dequeue();
			}
		};
		for(var _iElms in _elms){
			if(_elms.hasOwnProperty(_iElms)){
				var lopDuration;
				var lopStylesTransition;
				if(!this.stylesTransition){
					lopStylesTransition = null;
				}else if(typeof _stepKey != 'undefined'){
					lopStylesTransition = this.stylesTransition[_stepKey][_iElms] || null;
					if(this.duration.constructor == Array){
						lopDuration = this.duration[_stepKey];
						if(lopDuration.constructor == Array){
							lopDuration = this.duration[_stepKey][_iElms];
						}
					}else{
						lopDuration = this.duration;
					}
				}else{
					lopStylesTransition = _this.stylesTransition[_iElms] || null;
					lopDuration = this.duration;
					if(lopDuration.constructor == Array){
						lopDuration = this.duration[_iElms];
					}
				}
				if(lopStylesTransition){
					if(typeof lopStylesTransition === 'function'){
						lopStylesTransition = lopStylesTransition.call(this, _elms[_iElms], _args);
					}
					var lopCallbackDQ = callbackDQ;
					_elms[_iElms].animate(lopStylesTransition, lopDuration, lopCallbackDQ);
				}else{
					callbackDQ();
				}
			}
		}
	};
	__.classes.AnimateTransition.prototype.defaultOnBefore = function(_args){
		var _elms = _args.elements;
		var _styles;
		for(var _iElms in _elms){
			if(_elms.hasOwnProperty(_iElms)){
				_styles = (this.stylesBefore && this.stylesBefore[_iElms]) ? this.stylesBefore[_iElms] : null;
				if(_styles){
					if(typeof _styles === 'function'){
						_styles = _styles.call(this, _elms[_iElms], _args);
					}
					if(_styles){
						_elms[_iElms].css(_styles);
					}
				}
			}
		}
		this.queue.dequeue();
	};
	__.classes.AnimateTransition.prototype.defaultOnAfter = function(_args){
		var _elms = _args.elements;
		var _styles
		for(var _iElms in _elms){
			if(_elms.hasOwnProperty(_iElms)){
				_styles = (this.stylesAfter && this.stylesAfter[_iElms]) ? this.stylesAfter[_iElms] : null;
				if(_styles){
					if(typeof _styles === 'function'){
						_styles = _styles.call(this, _elms[_iElms], _args);
					}
					if(_styles){
						_elms[_iElms].css(_styles);
					}
				}
			}
		}
		this.queue.dequeue();
	};
