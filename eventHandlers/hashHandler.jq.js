/*
allows binding of events to hashchange, and will hashify urls so that they can be animated but still based on the non-javascript urls

-----parameters

-----instantiation
		__.hashHandler = new __.classes.hashHandler({elmsContainer: $("#topnavigationlist, #maindescription, #maindescriptionwrap, #logo")
			, onhashchange: function(argHash){
				var url = argHash;
				if(url.substring(0,1) == "#")
					url = url.substring(1, url.length - 1);
				if(!url)
					url = "/";
				__.router.callRoute({path: url, arguments: {url: url}});
			}
			,oninit: function(argHash){
				if(argHash){
					var fncThis = this;
					setTimeout(function(){fncThis.onhashchange.call(fncThis, argHash);}, 500);
				}
			}
		});
*/



/*-------
©hashHandler
-------- */
__.classes.hashHandler = function(arguments){
		//--required attributes
//->return
		//--optional attributes
		this.boot = arguments.boot || {};
		this.elmsContainer = arguments.elmsContainer || null;
		this.onhashchange = arguments.onhashchange || null;
		this.oninit = arguments.oninit || null;
		this.selectorAnchors = arguments.selectorAnchors || "a";
		this.selectorExclude = arguments.selectorExclude || null;
		this.selectorInclude = arguments.selectorInclude || null;

		//--derived attributes
		var fncThis = this;
		//--hashify urls
		if(this.elmsContainer)
			this.hashifyURLs(this.elmsContainer);
		
		//--attach listener for hash change
		if(this.onhashchange)
			jQuery(window).bind("hashchange", function(){
				var url = location.hash || "/";
				fncThis.onhashchange.call(fncThis, url);
			});
		
		if(this.oninit)
			this.oninit.call(fncThis, location.hash);
	}
	__.classes.hashHandler.prototype.hashifyURLs = function(argContainers){
		if(argContainers && argContainers.length > 0){
			var elmsAnchors = argContainers.find(this.selectorAnchors).add(argContainers.filter(this.selectorAnchors));
			if(this.selectorExclude)
				elmsAnchors = elmsAnchors.not(this.selectorExclude);
			else if(this.selectorInclude)
				elmsAnchors = elmsAnchors.filter(this.selectorInclude);
			elmsAnchors.each(function(){
				var elmThis = jQuery(this);
				var currentHref = elmThis.attr("href");
				if(currentHref && currentHref.substring(0,1) == "/")
					elmThis.attr("href", "#"+currentHref);
			});
		}
	}

