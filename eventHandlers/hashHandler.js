/*
allows binding of events to hashchange, and will hashify urls so that they can be animated but still based on the non-javascript urls
-----parameters
-----instantiation
*/



/*-------
©hashHandler
-------- */
__.classes.hashHandler = function(arguments){
		//--required attributes
//->return
		//--optional attributes
		this.elmsContainer = arguments.elmsContainer || null;
		this.onhashchange = arguments.onhashchange || null;
		this.oninit = arguments.oninit || null;
		this.selectorAnchors = arguments.selectorAnchors || "a";

		//--derived attributes
		var fncThis = this;
		//--hashify urls
		if(this.elmsContainer)
			this.hashifyURLs(this.elmsContainer);
		
		//--attach listener for hash change
		if(this.onhashchange)
			$(window).bind("hashchange", function(){
				var url = location.hash || "/";
				fncThis.onhashchange.call(fncThis, url);
			});
		
		if(this.oninit)
			this.oninit.call(fncThis, location.hash);
	}
	__.classes.hashHandler.prototype.hashifyURLs = function(argContainers){
		if(argContainers && argContainers.length > 0){
			argContainers.find(this.selectorAnchors).add(argContainers.filter(this.selectorAnchors)).each(function(){
				var elmThis = $(this);
				var currentHref = elmThis.attr("href");
				if(currentHref.substring(0,1) == "/")
					elmThis.attr("href", "#"+currentHref);
			});
		}
	}

