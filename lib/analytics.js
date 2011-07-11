/*-----
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
©googleAnalyticsTracker
------- */
__.classes.googleAnalyticsTracker = function(arguments){
		if(!arguments) arguments = {};
		if(typeof _gat == "undefined") return false;
//->die if analytics doesn't exist
		this.container = arguments.container || document.body;
		this.classname = (arguments.classname)? arguments.classname: "ga";
		this.defaultCategory = arguments.defaultCategory || false;
		this.attrAction = (arguments.attrAction)? arguments.attrAction: "data-ga-action";
		this.attrCategory = (arguments.attrCategory)? arguments.attrCategory: "data-ga-category";
		this.attrHrefNonAnchor = (arguments.attrHrefNonAnchor)? arguments.attrHrefNonAnchor: "data-ga-href";
		this.attrNoRedirect = (arguments.attrNoRedirect)? arguments.attrNoRedirect: "data-ga-noredirect";
		this.doTrackFacebook = (typeof arguments.doTrackFacebook != "undefined")? arguments.doTrackFacebook: true;
		this.doTrackTwitter = (typeof arguments.doTrackTwitter != "undefined")? arguments.doTrackTwitter: true;

		this.attachListenersToMatches(this.container);
		
		if(this.doTrackFacebook)
			this.trackFacebook();
		if(this.doTrackTwitter)
			this.trackTwitter();
	}
	__.classes.googleAnalyticsTracker.prototype.attachListenersToMatches = function(argContainer){
		var elmsLinks = __.getElementsByClassName({tagName: "a", className: this.classname, element: argContainer});
		this.attachListeners(elmsLinks);
	}
	__.classes.googleAnalyticsTracker.prototype.attachListeners = function(argElements){
		var fncThis = this;
		__.addListeners(argElements, "click", function(event){
			var elmThis = event.target;
			var fncHref = elmThis.href || elmThis.getAttribute(fncThis.attrHrefNonAnchor);
			var urlParsed = __.lib.urlParse(fncHref);
			var fncAction = elmThis.getAttribute(fncThis.attrAction);
			var fncCategory = elmThis.getAttribute(fncThis.attrCategory) || fncThis.defaultCategory || urlParsed.type;
			var fncNoRedirect = elmThis.getAttribute(fncThis.attrNoRedirect) || false;
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
				
			fncThis.recordClick(fncHref, fncCategory, fncAction, !fncNoRedirect);
		});
	}
	__.classes.googleAnalyticsTracker.prototype.trackFacebook = function(){
		if(typeof FB != "undefined"){
			FB.Event.subscribe('edge.create', function(targetUrl) {
				_gaq.push(['_trackSocial', 'facebook', 'like', targetUrl]);
			});
		}
	}
	__.classes.googleAnalyticsTracker.prototype.trackTwitter = function(){
		if(typeof twttr != "undefined"){
			twttr.events.bind('tweet', function(event){
				if(event){
					var targetUrl;
					if(event.target && event.target.nodeName == 'IFRAME'){
						targetUrl = extractParamFromUri(event.target.src, 'url');
					}
					_gaq.push(['_trackSocial', 'twitter', 'tweet', targetUrl]);
				}
			});
		}
	}
	//-@functionality from google
	__.classes.googleAnalyticsTracker.prototype.recordClick = function(link, category, action, argRedirect){
		_gat._getTrackerByName()._trackEvent(category, action);
		if(typeof argRedirect == "undefined" || argRedirect)
			setTimeout('document.location = "' + link.href + '"', 100);
	}

