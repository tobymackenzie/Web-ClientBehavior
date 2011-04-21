/*
used to associate various actions with names and/or paths so they can be called given a name or path

-----parameters

-----instantiation
if(typeof $ !== 'undefined'){
	$(document).ready(function(){	
		__.router = new __.classes.router({boot: {
			fncBasicLoadURL: function(argURL){
				__.imageSwitcher.boot.urlToLoad = argURL;
				this.boot.ajaxURLLoader.loadAjax({url: argURL});
				this.boot.ajaxImageNavigationLoader.loadAjax({url: argURL});
			}
			,elmNavigationBar: $("#navigationbar")
			,animateNavigationbarNormal: function(){
				if(this.boot.elmNavigationBar.attr("bottom") != __.cfg.bottomNavigationBarNormal)
					this.boot.elmNavigationBar.animate({bottom: __.cfg.bottomNavigationBarNormal}, this.duration);
			}
			,ajaxURLLoader: new __.classes.pagerAjax({
					data: {ajaxtype: "backgroundimage"}
					,onpreajaxcall: function(arguments){
						var fncThis = this;
						var fncAjaxParameters = arguments;
						if(this.elmWrapForAnimation && this.elmWrapForAnimation.length > 0){
							this.elmWrapForAnimation.fadeOut(fncThis.duration, function(){
								fncThis.loadAjaxData(fncAjaxParameters);
							});
						}else
							fncThis.loadAjaxData(fncAjaxParameters);
					}
					,onsuccess: function(argData){
						__.imageSwitcher.switche(argData);
//						__.mainnavigationHandler.queue.dequeue();
					}
			})
			,ajaxImageNavigationLoader: new __.classes.pagerAjax({
					data: {ajaxtype: "backgroundimagenavigation"}
					,elmContainer: $("#navigationbar")
					,elmWrap: $("#imagenavigationcontainer")
					,htmlWrap: '<div id="imagenavigationcontainer"><div id="imagenavigationwrapouter"><div id="imagenavigationwrapinner"></div></div></div>'
					,selectorWrapForAnimation: "#imagenavigationcontainer"
					,selectorWrapForContent: "#imagenavigationwrapinner"
					,oninit: function(){
						//--help out scrollerCategoryImages, seems unecessary now though
						if(typeof __.scrollerCategoryImages != "undefined"){
							__.scrollerCategoryImages.setWrapper($(__.cfg.selectorImageNavigationWrapper));
							if(__.scrollerCategoryImages.boot.elmWrapOuter.length < 1)
								__.scrollerCategoryImages.boot.elmWrapOuter = $("#imagenavigationwrapouter");
							if(__.scrollerCategoryImages.boot.elmWrapInner.length < 1)
								__.scrollerCategoryImages.boot.elmWrapInner = $("#imagenavigationwrapinner");
						}
					}
					,onpreajaxcall: function(arguments){
						var fncThis = this;
						var fncAjaxParameters = arguments;
						if(this.elmWrapForAnimation && this.elmWrapForAnimation.length > 0){
							this.elmWrapForAnimation.slideUp(fncThis.duration, function(){
								fncThis.loadAjaxData(fncAjaxParameters);
							});
						}else
							fncThis.loadAjaxData(fncAjaxParameters);
						__.imageSwitcher.boot.urlToLoad = fncAjaxParameters.url;
					}
					,onsuccess: function(argData){
						var fncThis = this;
						if($.trim(argData) != ""){
							fncThis.elmWrapForContent.html(argData);
							__.scrollerCategoryImages.setContainer(fncThis.elmWrapForContent.find(__.cfg.selectorScrollerContainer));
							__.imageSwitcher.setListItems($(__.imageSwitcher.boot.selectorImageNavigationItems));
							fncThis.elmWrapForAnimation.slideDown(fncThis.duration, function(){
								setTimeout(function(){__.scrollerCategoryImages.resize();}, 1500);
							});
						}
						return true;
					}
			})
		}});
		
		//--routes
		__.router.addRoute({name: "products", path: /\/products\/[0-9]+\/?/, action: "loadPageList"});
		__.router.addRoute({name: "designers", path: "/designers", action: "loadPageZone"});
		__.router.addRoute({name: "blog", path: /\/blog/, action: "loadPageZone"});
		__.router.addRoute({name: "about", path: "/about", action: "loadPageZone"});
		__.router.addRoute({name: "visit", path: "/visit", action: "loadPageZone"});
		__.router.addRoute({name: "home", path: "/", action: "loadPageHome"});
		
		//--route actions
		__.router.addAction({name: "loadPageZone", callback: function(arguments){
			this.boot.animateNavigationbarNormal.call(this);
			__.contentPager.boot.pagetypeToLoad = "zone";
			this.boot.fncBasicLoadURL.call(this, arguments.url);
		}});
		__.router.addAction({name: "loadPageList", callback: function(arguments){
			this.boot.animateNavigationbarNormal.call(this);
			__.contentPager.boot.pagetypeToLoad = "list";
			this.boot.fncBasicLoadURL.call(this, arguments.url);
		}});
		__.router.addAction({name: "loadPageHome", callback: function(arguments){
			this.boot.elmNavigationBar.animate({bottom: __.cfg.bottomNavigationbarHome}, this.duration);
			__.contentPager.boot.pagetypeToLoad = "list";
			this.boot.fncBasicLoadURL.call(this, arguments.url);
		}});

*/
/*-------
©router
-------- */
__.classes.router = function(arguments){
		//--required attributes
		//--optional attributes
		this.boot = arguments.boot || null;
		this.currentRoot = arguments.currentRoot || "null";
		
		//--derived attributes
		this.routes = [];
		this.actions = [];
		
		//--do something
	}
	__.classes.router.prototype.addAction = function(arguments){
		var fncName = arguments.name;
		var fncCallback = arguments.callback;
		this.actions[fncName] = fncCallback;
	}
/*
@param action (function): action to be performed by callroute for this route
@param name: name for access by callroute
@param path (optional): path regex to check
*/
	__.classes.router.prototype.addRoute = function(arguments){
		var fncName = arguments.name;
		var fncArguments = arguments;
		this.routes[fncName] = fncArguments;
	}
	__.classes.router.prototype.callRoute = function(arguments){
		var localvars = {};
		if(typeof arguments == "string"){
			localvars.name = arguments;
		}else{
			localvars = arguments;
		}
		if(typeof localvars.scope == "undefined")
			localvars.scope = this;
		if(typeof localvars.arguments == "undefined")
			localvars.arguments = {};

		if(typeof localvars.name != "undefined"){
			localvars.arguments.route = this.routes[localvars.name];
			this.actions[this.routes[localvars.name].action].call(localvars.scope, localvars.arguments);
		}else{
			this.callRouteForPath(localvars);
		}
	}
	__.classes.router.prototype.callRouteForPath = function(arguments){
		var localvars = arguments;
		if(typeof localvars.path == "undefined")
			return false;
//->return
		if(typeof localvars.scope == "undefined")
			localvars.scope = this;
		if(typeof localvars.arguments == "undefined")
			localvars.arguments = {};

		var fncRoute = this.routeLookup(localvars.path);
		if(fncRoute){
			localvars.arguments.route = fncRoute;
			this.actions[fncRoute.action].call(localvars.scope, localvars.arguments)
		}
	}
	__.classes.router.prototype.routeLookup = function(argPath){
		var fncReturn = false;
		for(var key in this.routes){
			var route = this.routes[key];
			if(this.routes.hasOwnProperty(key) && typeof route.path != "undefined"){
				if(typeof route.path == "string"){
					if(route.path == argPath || route.path+"/" == argPath || route.path == argPath+"/"){
						fncReturn = route;
						break;
					}
				}else{ //-assumed a regex
					if(argPath.match(route.path)){
						fncReturn = route;
						break;
					}
				}
			}
		}
		return fncReturn;
	}

