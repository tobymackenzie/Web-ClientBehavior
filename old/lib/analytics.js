/*-----
adds tracking for google analytics outbound links given links with a given class name
can attach to arbitrary elements as well with proper data set

-----dependsOn
tmlib base

-----init
__.scrOnload = function(){
	__.gaTracker = new __.classes.gaOutboundLinkTracker();
	__.gaTracker.attachListeners(document.getElementById('thediv'));
}

*/
/* --------
©googleAnalyticsTracker
------- */
__.classes.googleAnalyticsTracker = function(args){
		if(!args) args= {};
		if(typeof _gat == 'undefined') return false;
//->die if analytics doesn't exist
		this.container = args.container || document.body;
		this.classname = (args.classname)? args.classname: 'ga';
		this.defaultCategory = args.defaultCategory || false;
		this.attrAction = (args.attrAction)? args.attrAction: 'data-ga-action';
		this.attrCategory = (args.attrCategory)? args.attrCategory: 'data-ga-category';
		this.attrHrefNonAnchor = (args.attrHrefNonAnchor)? args.attrHrefNonAnchor: 'data-ga-href';
		this.attrNoRedirect = (args.attrNoRedirect)? args.attrNoRedirect: 'data-ga-noredirect';
		this.doTrackFacebook = (typeof args.doTrackFacebook != 'undefined')? args.doTrackFacebook: true;
		this.doTrackTwitter = (typeof args.doTrackTwitter != 'undefined')? args.doTrackTwitter: true;

		this.attachListenersToMatches(this.container);

		if(this.doTrackFacebook)
			this.trackFacebook();
		if(this.doTrackTwitter)
			this.trackTwitter();
	}
	__.classes.googleAnalyticsTracker.prototype.attachListenersToMatches = function(argContainer){
		var elmsLinks = __.lib.getElementsByClassName({tagName: 'a', className: this.classname, element: argContainer});
		this.attachListeners(elmsLinks);
	}
	__.classes.googleAnalyticsTracker.prototype.attachListeners = function(argElements){
		var fncThis = this;
		__.lib.addListeners(argElements, 'click', function(event){
			var elmThis = event.target;
			var fncHref = elmThis.href || elmThis.getAttribute(fncThis.attrHrefNonAnchor);
			var urlParsed = __.lib.urlParse(fncHref);
			var fncAction = elmThis.getAttribute(fncThis.attrAction);
			var fncCategory = elmThis.getAttribute(fncThis.attrCategory) || fncThis.defaultCategory || urlParsed.type;
			var fncNoRedirect = elmThis.getAttribute(fncThis.attrNoRedirect) || false;
			if(!fncAction){
				switch(urlParsed.type){
					case 'external':
					case 'mailto':
						fncAction = urlParsed.host;
						break;
					case 'tel':
					case 'fax':
						fncAction = urlParsed.n;
						break;
					case 'internal':
					default:
						fncAction = urlParsed.href;
						break;
				}
			}

			fncThis.recordClick(fncHref, fncCategory, fncAction, !fncNoRedirect);
		});
	}
	__.classes.googleAnalyticsTracker.prototype.trackFacebook = function(){
		if(typeof FB != 'undefined'){
			FB.Event.subscribe('edge.create', function(targetUrl) {
				_gaq.push(['_trackSocial', 'facebook', 'like', targetUrl]);
			});
		}
	}
	__.classes.googleAnalyticsTracker.prototype.trackTwitter = function(){
		if(typeof twttr != 'undefined'){
			twttr.events.on('tweet', function(event){
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
		if(typeof argRedirect == 'undefined' || argRedirect)
			setTimeout('document.location = '' + link.href + ''', 100);
	}

