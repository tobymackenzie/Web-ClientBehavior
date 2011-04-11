/*
used to associate various actions with names and/or paths so they can be called given a name or path
-----parameters
-----instantiation
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
		for(key in this.routes){
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

