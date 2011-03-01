/*-----
©gaOutboundLinkTracker
adds tracking for google analytics outbound links given links with a given class name
can attach to arbitrary elements as well with proper data set

-----dependsOn
tmlib base

-----init
__.scrOnload = function(){
	__.gaTracker = new __.classes.gaOutboundLinkTracker();
	__.gaTracker.attachListeners(document.getElementById("thediv"));
}

*/
/* --------
©gaOutboundLinkTracker
------- */
__.classes.gaOutboundLinkTracker = function(arguments){
		if(!arguments) arguments = {};
		if(typeof _gat == "undefined") return false;
//->die if analytics doesn't exist
		this.container = arguments.container || document.body;
		this.classname = (arguments.classname)? arguments.classname: "ga";
		this.defaultCategory = arguments.defaultCategory || false;
		this.attrHrefNonAnchor = (arguments.attrHrefNonAnchor)? arguments.attrHrefNonAnchor: "data-ga-href";
		this.attrCategory = (arguments.attrCategory)? arguments.attrCategory: "data-ga-category";
		this.attrAction = (arguments.attrAction)? arguments.attrAction: "data-ga-action";
		
		this.attachListenersToMatches(this.container);
		
	}
	__.classes.gaOutboundLinkTracker.prototype.attachListenersToMatches = function(argContainer){
		var elmsLinks = __.getElementsByClassName({tagName: "a", className: this.classname, element: argContainer});
		this.attachListeners(elmsLinks);
	}
	__.classes.gaOutboundLinkTracker.prototype.attachListeners = function(argElements){
		var fncThis = this;
		__.addListeners(argElements, "click", function(event){
			var elmThis = event.target;
			var fncHref = elmThis.href || elmThis.getAttribute(fncThis.attrHrefNonAnchor);
			var urlParsed = __.lib.urlParse(fncHref);
			var fncCategory = elmThis.getAttribute(fncThis.attrCategory) || fncThis.defaultCategory || urlParsed.type;
			var fncAction = elmThis.getAttribute(fncThis.attrAction);
			if(!fncAction){
				switch(urlParsed.type){
					case "external":
					case "mailto":
						fncAction = urlParsed.host;
						break;
					case "tel":
					case "fax":
						fncAction = urlParsed.n;
						break;
					case "internal":
					default:
						fncAction = urlParsed.href;
						break;
				}
			}
				
			fncThis.recordClick(fncHref, fncCategory, fncAction);
		});
	}
	//-@functionality from google
	__.classes.gaOutboundLinkTracker.prototype.recordClick = function(link, category, action){
		_gat._getTrackerByName()._trackEvent(category, action);
		setTimeout('document.location = "' + link.href + '"', 100);
	}


