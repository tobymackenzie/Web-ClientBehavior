/*
provides a ticker style animation for a container

-----dependencies
tmlib
xui

-----parameters
-----instantiation
x$(window).load(function(){
	__.elmTicker = x$(".ticker");
	if(__.elmTicker.length > 0){
		__.ticker = new __.classes.ticker({
			elmAnimated: __.elmTicker.find(".tickerlist")
			,elmContainer: __.elmTicker
			,elmsItems: __.elmTicker.find(".tickerlist>.item")
		});
	}
}
-----html
-----css

*/

/*----------
©ticker
----------*/
__.classes.ticker = function(arguments){
		if(typeof arguments == "undefined") arguments = {};
		//--optional attributes
		this.boot = arguments.boot || null;
		this.duration = (typeof arguments.duration != "undefined")? arguments.duration : 10000;
		this.elmAnimated = arguments.elmAnimated || null;
		this.elmContainer = arguments.elmContainer || null;
		this.elmsItems = arguments.elmsItems || null;
		this.oninit = arguments.oninit || null;
		this.styleAnimated = (typeof arguments.styleAnimated != "undefined")? arguments.styleAnimated : {position: "absolute", top: this.elmContainer[0].style.paddingTop, left: this.elmContainer[0].style.paddingLeft};
		this.styleItems = (typeof arguments.styleItems != "undefined")? arguments.styleItems : {display: "inline"};
		this.styleContainer = (typeof arguments.styleContainer != "undefined")? arguments.styleContainer : {position: "relative", overflow: "hidden", "white-space": "nowrap", height: this.elmsItems[0].offsetHeight+"px"};
		
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
		if(this.styleAnimated && this.elmAnimated)
			this.elmAnimated.css(this.styleAnimated);
		if(this.styleContainer && this.elmContainer)
			this.elmContainer.css(this.styleContainer);
		if(this.styleItems && this.elmsItems)
			this.elmsItems.css(this.styleItems);
			
		//--start animation
		this.animate();
	}
	__.classes.ticker.prototype.animate = function(){
		var fncThis = this;
		var paramsAnimation = {
			left: -(this.elmAnimated[0].offsetWidth)+"px"
			,duration: this.fullduration
			,easing: function(pos){
				return pos;
			}
		};
		fncThis.elmAnimated.css({left: fncThis.widthContainer+"px"}).tween(paramsAnimation, function(){
			fncThis.animate();
		});
	}

