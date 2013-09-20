/*
Class: AnimateTransition

Animates transition between two elements

Dependencies:
tmlib: __.lib.isArray, animationQueue

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
/* global __, jQuery, setTimeout */
__.classes.AnimateTransition = __.core.Classes.create({
	init: function(){
		this.__base(arguments);

		//--derived attributes
		if(typeof this.doMultistep === 'undefined'){
			this.doMultistep = (this.stylesTransition && this.stylesTransition.length && __.lib.isArray(this.stylesTransition[0]));
		}
		this.queue = new __.classes.AnimationQueue();

		//--do something
		if(this.onInit){
			this.onInit.call(this);
		}
	}
	,properties: {
		animateStep: function(_args, _stepKey){
			var _elms = _args.elements || this.elms;
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
		}
		,doMultistep: undefined
		,duration: 500
		,elms: undefined
		,onAfter: function(_args){
			var _this = this;
			setTimeout(function(){
				var _elms = _args.elements;
				var _styles;
				for(var _iElms in _elms){
					if(_elms.hasOwnProperty(_iElms)){
						_styles = (_this.stylesAfter && _this.stylesAfter[_iElms]) ? _this.stylesAfter[_iElms] : null;
						if(_styles){
							if(typeof _styles === 'function'){
								_styles = _styles.call(this, _elms[_iElms], _args);
							}
							if(_styles && !jQuery.isEmptyObject(_styles)){
								_elms[_iElms].css(_styles);
							}
						}
					}
				}
				_this.pub('after', _args);
				_this.queue.dequeue();
			}, 0);
		}
		,onBefore: function(_args){
			var _elms = _args.elements;
			var _styles;
			for(var _iElms in _elms){
				if(_elms.hasOwnProperty(_iElms)){
					_styles = (this.stylesBefore && this.stylesBefore[_iElms]) ? this.stylesBefore[_iElms] : null;
					if(_styles){
						if(typeof _styles === 'function'){
							_styles = _styles.call(this, _elms[_iElms], _args);
						}
						if(_styles && !jQuery.isEmptyObject(_styles)){
							_elms[_iElms].css(_styles);
						}
					}
				}
			}
			this.pub('before', _args);
			this.queue.dequeue();
		}
		,onInit: undefined
		,stylesBefore: null
		,stylesTransition: null
		,stylesAfter: null
		,transitionForElements: function(_args){
			if(__.lib.isArray(_args)){
				_args = {elements: _args};
			}
			var _this = this;
			if(_this.onBefore){
				_this.queue.queue({callback: function(){
					_this.onBefore.call(_this, _args);
				}});
			}
			if(_this.animateStep){
				if(_this.doMultistep && _this.stylesTransition){
					for(var _keyStep in _this.stylesTransition){
						if(_this.stylesTransition.hasOwnProperty(_keyStep)){
							_this.queue.queue({callback: function(_this, _keyStep){
								return function(){
									_this.animateStep.call(_this, _args, _keyStep);
								};
							}(_this, _keyStep)});
						}
					}
				}else{
					_this.queue.queue({callback: function(){
						_this.animateStep.call(_this, _args);
					}});
				}
			}
			if(_this.onAfter){
				_this.queue.queue({callback: function(){
					_this.onAfter.call(_this, _args);
				}});
			}
			_this.queue.dequeue();
		}
	}
	,mixins: __.mixins.PubSub
});
