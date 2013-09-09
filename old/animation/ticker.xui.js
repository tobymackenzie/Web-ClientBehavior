/*
Class: Ticker

Provides a ticker style animation for a container

Dependencies:
	tmlib
	xui

Example:
	x$(window).load(function(){
		__.elmTicker = x$('.ticker');
		if(__.elmTicker.length > 0){
			__.ticker = new __.classes.ticker({
				elmAnimated: __.elmTicker.find('.tickerlist')
				,elmContainer: __.elmTicker
				,elmsItems: __.elmTicker.find('.tickerlist>.item')
			});
		}
	}

*/
/* global __ */
__.classes.Ticker = function(_args){
		if(typeof _args == 'undefined'){
			_args = {};
		}

		//--optional attributes
		this.boot = _args.boot || null;
		this.duration = (typeof _args.duration != 'undefined')? _args.duration : 10000;
		this.elmAnimated = _args.elmAnimated || null;
		this.elmContainer = _args.elmContainer || null;
		this.elmsItems = _args.elmsItems || null;
		this.oninit = _args.oninit || null;
		this.styleAnimated = (typeof _args.styleAnimated != 'undefined')? _args.styleAnimated : {position: 'absolute', top: this.elmContainer[0].style.paddingTop, left: this.elmContainer[0].style.paddingLeft};
		this.styleItems = (typeof _args.styleItems != 'undefined')? _args.styleItems : {display: 'inline'};
		this.styleContainer = (typeof _args.styleContainer != 'undefined')? _args.styleContainer : {position: 'relative', overflow: 'hidden', 'white-space': 'nowrap', height: this.elmsItems[0].offsetHeight+'px'};

		//--derived attributes
		this.widthContainer = this.elmContainer[0].offsetWidth;
//		this.widthAnimated = this.elmAnimated[0].offsetWidth;

		//--items based duration
		if(this.elmsItems){
			this.fullduration = this.elmsItems.length * this.duration;
		}else{
			this.fullduration = this.duration;
		}

		//--set base styles
		if(this.styleAnimated && this.elmAnimated){
			this.elmAnimated.css(this.styleAnimated);
		}
		if(this.styleContainer && this.elmContainer){
			this.elmContainer.css(this.styleContainer);
		}
		if(this.styleItems && this.elmsItems){
			this.elmsItems.css(this.styleItems);
		}

		//--start animation
		this.animate();
	};
	__.classes.Ticker.prototype.animate = function(){
		var _this = this;
		var _animationOpts = {
			left: -(this.elmAnimated[0].offsetWidth)+'px'
			,duration: this.fullduration
			,easing: function(pos){
				return pos;
			}
		};
		_this.elmAnimated.css({left: _this.widthContainer+'px'}).tween(_animationOpts, function(){
			_this.animate();
		});
	};
