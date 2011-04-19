/*
opens up tab contents horizontally when clicked

----- notes
very dependent on css
not for ie 6 or less currently

----- css
// genericly taken from neil leeson, -!TODO widdle away unnecessary stuff-
.section_portfolio .portfoliolist{
	clear: both;
	margin: 40px 0 0;
	padding: 0;
	list-style: none;
}
.section_portfolio .imagelist, body.imagelistpage .imagelist{
	overflow: hidden;
	margin: 0;
	padding: 0 0 0 2px;
	height: 100px;
	white-space: nowrap;
	list-style: none;
}
.section_portfolio .imagelist li, body.imagelistpage .imagelist li{
	display: inline;
	margin: 0;
	padding-right: 2px;
	line-height: 0;
}
.section_portfolio .imagelist a, body.imagelistpage .imagelist a{
	display: inline-block;
}
.portfolioimage, , body.imagelistpage .imagelist li{
	margin: 0;
	padding: 0;
	list-style: none;
}

.section_portfolio .portfolioitem{
	float: left;
	position: relative;
	margin-right: 2px;
	width: 18px;
	height: 100px;
}
.section_portfolio .portfolioitem .tab{
	position: absolute;
	top: 41px;
	left: -43px;
	background: #ddd;
	color: #666;
	padding: 0 3px;
	width: 95px;

	transform: rotate(-90deg);
	-moz-transform: rotate(-90deg);
	-webkit-transform: rotate(-90deg);
	-o-transform: rotate(-90deg);
	filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
}
.section_portfolio .portfolioitem .tab:hover, .section_portfolio .portfolioitem .tab:focus{
	text-decoration: none;
}
.section_portfolio .portfolioitem h2{
	margin: 0;
	font-weight: 300;
	font-family: "Helvetica Neue Light", "HelveticaNeue-Light", "Helvetica Neue", Arial, Helvetica, sans-serif;	
}

.section_portfolio .portfolioitem  .imagelistwrap{
	margin-right: 3px;
}
.section_portfolio .portfolioitem .head{
	display: none;
}
.section_portfolio .portfolioitem.current{
	width: auto;
}
.section_portfolio .portfolioitem.current .tab{
	display: none;
}
.section_portfolio .portfolioitem.current .head{
	display: block;
}
.section_portfolio .portfolioitem .head{
	position: absolute;
	bottom: -2em;
	left: 0;
	white-space: nowrap;
}
.section_portfolio .portfolioitem h2{
	display: inline;
	padding-right: 10px;
}
.section_portfolio .portfolioitem .head .name{
	display: inline;
	position: static;
	padding: 0;
	background: transparent;
	color: #000;
}
.section_portfolio .portfolioitem h2 .suffix{
	display: inline;
}
.section_portfolio .portfolioitem .head .more{
	display: inline;
}
#page_portfolio .imagelist{
	display: block;
}
.section_portfolio .color_lime .imagelist{
	background: #9c0;
}
.section_portfolio .color_lime .head .more{
	color: #9c0;
}
.section_portfolio .color_blue .imagelist{
	background: #0023c4;
}
.section_portfolio .color_blue .head .more{
	color: #0023c4;
}
.section_portfolio .color_orange .imagelist{
	background: #f6934b;
}
.section_portfolio .color_orange .head .more{
	color: #f6934b;
}

#page_portfolio #maincontent{
	height: 439px;
}
#page_portfolio .portfoliolist{
	position: absolute;
	min-width: 936px;
	min-width: 980px;
}
#page_portfolio .portfoliolist.n1{
	top: 18px;
	left: 40px;
}
#page_portfolio .portfoliolist.n2{
	top: 183px;
	left: 174px;
}
#page_portfolio .portfoliolist.n3{
	top: 345px;
	left: -21px;
}
#page_portfolio .imagelist{
	margin-left: 20px;
}
#page_portfolio .current .imagelist{
	margin-left: 0;
}



----- instantiation
$(function(){
	//--init portfolio tab sliders
	//-not for ie6 at the moment
	if(!($.browser.msie && $.browser.version < 7)){
		var elmsPortfolios = [
			$(".portfoliolist.n1")
			,$(".portfoliolist.n2")
			,$(".portfoliolist.n3")
		];
		var callbackPreOpen = function(argElement){
			argElement.find(this.selectorTab).fadeOut(this.duration);
			argElement.find(".head").fadeIn(this.duration);
			argElement.find(".imagelist").animate({"margin-left": 0}, this.duration);
		}
		var callbackPreClose = function(argElement){
			argElement.find(".head").fadeOut(this.duration);
			argElement.find(this.selectorTab).fadeIn(this.duration);
			argElement.find(".imagelist").animate({"margin-left": "20px"}, this.duration);
			if($.browser.msie){
				argElement.find(this.selectorTab).css({filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)"});
			}
		}
		var callbackPostOpen = function(argElement){
			//-set cookie based on change
			if(typeof this.boot.cookie != "undefined" && typeof page.portfolioType != "undefined" && page.portfolioType){
				var arrNewValues = new Array();
				var portfolios = this.boot.elmsPortfolios
				for(var i = 0; i < portfolios.length; ++i){
					var portfolio = portfolios[i];
					arrNewValues.push(portfolio.find(this.selectorItems+"."+this.classCurrent).attr(this.boot.attrUnid));
				}
				
				try{
					var oldCookieValue = $.parseJSON(__.lib.cookies.get(this.boot.cookie));
				}catch(e){
					oldCookieValue = {};
				}
				if(!oldCookieValue)
					oldCookieValue = {};
				oldCookieValue[page.portfolioType] = arrNewValues/;
				__.lib.cookies.set({name: this.boot.cookie, value: $.toJSON(oldCookieValue), expires: 180});
			}
			//-ajax submit change in selection
			
		}
		var callbackPostClose = function(argElement){
		}
		var parmSlidetabAll = {
			selectorItems: ".portfolioitem",
			selectorTab: ".tab",
			widthTabMin: "18px",
			selectorContent: ".imagelist",
			callbackPreOpen: callbackPreOpen, 
			callbackPreClose: callbackPreClose, 
			callbackPostOpen: callbackPostOpen, 
			callbackPostClose: callbackPostClose,
			boot: {cookie: "selectedportfolios", elmsPortfolios: elmsPortfolios, attrUnid: "data-unid"}
		}
		__.slidetabs = new Array();
		for(var i = 0; i < elmsPortfolios.length; ++i){
			if(elmsPortfolios[i].length > 0){
				parmSlidetabAll.elmContainer = elmsPortfolios[i];
				__.slidetabs[i] = new __.classes.slidetab(parmSlidetabAll);
				parmSlidetabAll.elmContainer = null;
			}
		}
	}
});

*/



/*------
©slidetab
-------*/
__.classes.slidetab = function(arguments){
		/*--optional attributes */
		this.elmContainer = arguments.elmContainer || null;
		this.selectorItems = arguments.selectorItems || null;
		this.selectorTab = arguments.selectorTab || null;
		this.selectorContentWrap = arguments.selectorContentWrap || null;
		this.selectorContent = arguments.selectorContent || null;
		this.classCurrent = arguments.classCurrent || "current";
		this.cookie = arguments.cookie || false;
		this.duration = arguments.duration || 1500;
		this.callbackPreOpen = arguments.callbackPreOpen || null;
		this.callbackPreClose = arguments.callbackPreClose || null;
		this.callbackPostOpen = arguments.callbackPostOpen || null;
		this.callbackPostClose = arguments.callbackPostClose || null;
		this.widthTabMin = arguments.widthTabMin || 0;
		this.boot = arguments.boot || null;
		
		/*--derived attributes */
		var fncThis = this;
		this.elmsItems = this.elmContainer.find(this.selectorItems);
		this.inProgress = false;
		
		/*--show first if not shown */
		var elmCurrent = this.elmsItems.filter("."+this.classCurrent);
		if(elmCurrent.length < 1){
			this.elmsItems.first().addClass(this.classCurrent);
		}	
		
		/*--construct */
		//--attach listeners to tabs
		this.elmsItems.find(this.selectorTab).bind("click focus", function(event){
			event.preventDefault();
			
			fncThis.switchTo($(this).closest(fncThis.selectorItems));
			return false;	
		});
	}
	__.classes.slidetab.prototype.switchTo = function(argElement){
		if(this.inProgress == true) return false;
//-> return		
		if(argElement.hasClass(this.classCurrent)) return false;
//-> return
		var fncThis = this;
		this.inProgress = true;
		var elmCurrent = this.elmsItems.filter("."+this.classCurrent);
		var elmNext = argElement;
		
		this.close(elmCurrent, function(){fncThis.open(elmNext);});
	}
	__.classes.slidetab.prototype.open = function(argElement, argCallback){
		var fncThis = this;
		var fncElement = argElement;
		var fncCallback = argCallback;
		if(this.selectorContentWrap)
			var elmContentWrap = argElement.find(this.selectorContentWrap);
		else
			var elmContentWrap = argElement;
		var elmContent = argElement.find(this.selectorContent);	
		var newWidthHeight = __.getHiddenElementWidthHeight(elmContent);

		var callback = function(){
			fncElement.addClass(fncThis.classCurrent);
			fncThis.inProgress = false;
			if(fncCallback)
				fncCallback.call();
			if(fncThis.callbackPostOpen)
				fncThis.callbackPostOpen.call(fncThis, fncElement);
		};
		if(fncThis.callbackPreOpen)
			fncThis.callbackPreOpen.call(fncThis, fncElement);
		elmContentWrap.animate({width: newWidthHeight.width}, {duration: this.duration, complete: callback});
	}
	__.classes.slidetab.prototype.close = function(argElement, argCallback){
		var fncThis = this;
		var fncElement = argElement;
		var fncCallback = argCallback;
		if(this.selectorContentWrap)
			var elmContentWrap = argElement.find(this.selectorContentWrap);
		else
			var elmContentWrap = argElement;
		var elmContent = argElement.find(this.selectorContent);	
		
		var callback = function(){
			fncElement.removeClass(fncThis.classCurrent);
			if(fncCallback)
				fncCallback.call();
			if(fncThis.callbackPostClose)
				fncThis.callbackPostClose.call(fncThis, fncElement);
		};
		
		if(fncThis.callbackPreClose)
			fncThis.callbackPreClose.call(fncThis, fncElement);		
		elmContentWrap.animate({width: this.widthTabMin}, {duration: this.duration, complete: callback});
	}

