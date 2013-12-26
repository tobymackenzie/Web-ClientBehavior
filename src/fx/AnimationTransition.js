/*
Class: AnimationTransition

Animates transition between two elements

Parameters:
	duration (integer || array[integers] || array[arrays[integers]]): duration of animation or of each animation step or for each item of each step
	stylesBefore (array[map of style properties and values]): styles to apply to elements before animation starts
	stylesTransition (array[stylemap || array[stylemap]]): styles to animate elements to
	stylesAfter (array[stylemap]): styles to apply to elements after animation

-----instantiation
		//--
		__.animateImage = new __AnimationTransition({
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
		__.animateLabel = new __AnimationTransition({
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
/* global define, jQuery, setTimeout */
define(['jquery', 'tmclasses/tmclasses', 'tmlib/fx/AnimationQueue', 'tmlib/core/isArray'], function(__jQuery, __tmclasses, __AnimationQueue, __isArray){
	var __AnimationTransition = __tmclasses.create({
		init: function(){
			this.__parent(arguments);

			//--derived attributes
			if(typeof this.doMultistep === 'undefined'){
				this.doMultistep = (this.stylesTransition && this.stylesTransition.length && __isArray(this.stylesTransition[0]));
			}
			this.queue = new __AnimationQueue();

			//--do something
			if(this.onInit){
				this.onInit.call(this);
			}
		}
		,properties: {
			animateStep: function(_args, _stepKey){
				var _elms = _args.elements || this.elms;
				var _countElms = _elms.length;
				var _countElements = 0;
				var _iElms;
				var _this = this;
				var _countItemsCompleted = 0;
				var _dqCallback = function(){
					++_countItemsCompleted;
					if(_countItemsCompleted >= _countElements){
						_this.queue.dequeue();
					}
				};
				var _stepOpts;
				var _stepAnimationPieces = [];

				//--build step animation pieces and count all elements instead of just elements in array so that calls to _callbackDQ will happen the proper number of times
				for(_iElms = 0; _iElms < _countElms; ++_iElms){
					var _duration;
					var _styles;
					var _elm = _elms[_iElms];

					if(!(_elm && this.stylesTransition)){
						_styles = null;
					}else if(typeof _stepKey != 'undefined'){
						_styles = this.stylesTransition[_stepKey][_iElms] || null;
						if(__isArray(this.duration)){
							_duration = this.duration[_stepKey];
							if(__isArray(_duration)){
								_duration = this.duration[_stepKey][_iElms];
							}
						}else{
							_duration = this.duration;
						}
					}else{
						_styles = _this.stylesTransition[_iElms] || null;
						_duration = this.duration;
						if(__isArray(_duration)){
							_duration = this.duration[_iElms];
						}
					}
					if(_styles){
						//--count all elements, since each 'elm' could contain multiple elements
						_countElements += _elm.length;
						if(typeof _styles === 'function'){
							_styles = _styles.call(this, _elm, _args);
						}
						_stepAnimationPieces.push({
							duration: _duration
							,elm: _elm
							,styles: _styles
						});

						// _addStepAnimationPiece(_elm, _styles, _duration, _dqCallback);
					}
				}
				if(_countElements){
					//--run animations
					for(var _iPieces = 0; _iPieces < _stepAnimationPieces.length; ++_iPieces){
						_stepOpts = _stepAnimationPieces[_iPieces];
						_stepOpts.elm.animate(_stepOpts.styles, _stepOpts.duration, _dqCallback);
					}
				}else{
					_dqCallback();
				}
			}
			,doMultistep: undefined
			,duration: 500
			,elms: undefined
			,onAfter: function(_args){
				var _this = this;
				//-# in timeout since post animation values were overwriting onAfter values
				setTimeout(function(){
					var _elms = _args.elements;
					var _styles;
					for(var _iElms in _elms){
						if(_elms.hasOwnProperty(_iElms) && _elms[_iElms]){
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
					if(_elms.hasOwnProperty(_iElms) && _elms[_iElms]){
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
				if(__isArray(_args)){
					_args = {elements: _args};
				}
				var _this = this;
				if(this.onBefore){
					this.queue.queue({callback: function(){
						_this.onBefore.call(_this, _args);
					}});
				}
				if(this.animateStep && this.stylesTransition){
					if(this.doMultistep){
						var _createCallback = function(_this, _keyStep){
							return function(){
								_this.animateStep.call(_this, _args, _keyStep);
							};
						};
						var _keyStep = 0;
						var _stylesLength = this.stylesTransition.length;
						for(; _keyStep < _stylesLength; ++_keyStep){
							this.queue.queue({callback: _createCallback(this, _keyStep)});
						}
					}else{
						this.queue.queue({callback: function(){
							_this.animateStep.call(_this, _args);
						}});
					}
				}
				if(this.onAfter){
					this.queue.queue({callback: function(){
						_this.onAfter.call(_this, _args);
					}});
				}
				if(_args.after){
					this.queue.queue({callback: function(){
						_args.after.call(_this, _args);
					}});
				}
				this.queue.dequeue();
			}
		}
	});
	return __AnimationTransition;
});
