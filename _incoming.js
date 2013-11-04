idego: widget, form, button
ronwhite: ImageFlow


/*-------------
©objectMonitor
------------*/
__.classes.objectMonitor = function(args){
		//--optional arguments
		if(args.object)
			this.setObject(args.object);

		//--derived members
		this.rules = {};
	}
	__.classes.objectMonitor.prototype.setObject = function(argObject){
		this.object = args.object;
//->return no object
		if(!this.object) return false;

		//--set old rules to unapplied
		for(var key in localvars.rules){
			if(localvars.rules.hasOwnProperty(key){
				localvars.rules[key].applied = false;
			}
		}

		//--apply rules
		this.applyRules();
	}
	__.classes.objectMonitor.prototype.applyRules = function(args){
		var localvars = {};
		localvars.object = args.object || this.object;
		localvars.rules = args.rules || this.rules;
		for(var key in localvars.rules){
			if(localvars.rules.hasOwnProperty(key){
				var lopRule = localvars.rules[key];
				if(lopRule.applied == false){
					localvars.object.on(lopRule.event, lopRule.handler);
					localvars.rules[key].applied = true;
				}
			}
		}
	}
	__.classes.objectMonitor.prototype.addRule = function(args){
		if(!__.lib.isArray(args))
			var rules = new Array(args);
		else
			var rules = args;
		for(var key in rules){
//->return missing required arguments
			if(rules.hasOwnProperty(key) && typeof rules[key].event != 'undefined' || typeof rules[key].handler != 'undefined'){
				rules[key].applied = false;
				this.rules.push(rules[key]);
				this.applyRules(rules[key]);
			}
		}
	}

/*------
hovershow
uses jquery
-----*/
__.classes.hoverShow = function(arguments){
		this.elements = arguments.elements; if(!this.elements) return false;
		this.selectorShowElement = arguments.selectorShowElement || "show";
		this.duration = arguments.duration || 500;
		this.closeTime = arguments.closeTime || 1000;
		this.classClosed = arguments.classClosed || "closed";
		this.classOpen = arguments.classOpen || "open";

		this.timeout = false;
		this.elmCurrent = false;
		var fncThis = this;

		this.hide(this.elements, 0);

		this.elements.hover(function(){
				fncThis.show($(this));
			}
			, function(){
				var elmThis = $(this);

				clearTimeout(fncThis.timeout);

				fncThis.timeout = setTimeout(function(){
					fncThis.hide(elmThis);
					fncThis.timeout = false;
					fncThis.elmCurrent = false;
				}, fncThis.closeTime);
			});

		this.elements.focusin(function(){fncThis.show($(this));});
		this.elements.focusout(function(){fncThis.hide($(this));});
	}
	__.classes.hoverShow.prototype.show = function(argElement, argDuration){
		if(!argElement) return false;
		if(argElement[0] == this.elmCurrent[0]){
			clearTimeout(this.timeout);
			return false;
		}
		if(!argDuration) argDuration = this.duration;
		this.hide(this.elements.filter("."+this.classOpen), argDuration);
		argElement/* .find(this.selectorShowElement) */.animate({top: 0}, {duration: argDuration}).addClass(this.classOpen).removeClass(this.classClosed);
		this.elmCurrent = argElement;
	}
	__.classes.hoverShow.prototype.hide = function(argElement, argDuration){
		if(!argElement || argElement.length == 0) return false;
		if(argDuration === undefined) argDuration = this.duration;
		var offset = argElement.find(this.selectorShowElement).height();

		argElement/* .find(this.selectorShowElement) */.animate({top: -offset+"px"}, {duration: argDuration}).addClass(this.classClosed).removeClass(this.classOpen);
	}


/*=====
==javascript loaders
=====*/
//-@ http://api.jquery.com/jQuery.getScript/
__.lib.getCachedScript = function(__url, __options){
	var options = jQuery.extend(__options || {}, {
		cache: true
		,dataType: 'script'
		,url: __url
	});
	return jQuery.ajax(options);
}
//-@ http://stackoverflow.com/questions/1130921/is-the-callback-on-jquerys-getscript-unreliable-or-am-i-doing-something-wrong
/*
				__.lib.loadJS(
					'/scripts/klass.min.js'
					,function(){
						return (typeof klass == 'function');
					}
				).done(function(){
					__.lib.loadJS(
						'/scripts/code.photoswipe.jquery-3.0.5.js'
						,function(){
							return (typeof __.$portfolioListThumbnails.photoSwipe == 'function');
						}
					).done(function(){
						__.$portfolioListThumbnails.photoSwipe();
					});
				});
*/
__.lib.loadJS = function(__url, __loadTest, __options){
	var _loadTest = (typeof __loadTest == 'function') ? __loadTest : function(){ return true; };
	var _options = jQuery.extend(__options || {}, {
		interval: 200
	});
	var $script = jQuery('<script>').attr('src', __url).appendTo('head');
	var _deferred = new jQuery.Deferred();
	var _interval = setInterval(function(){
		if(_loadTest()){
			clearInterval(_interval);
			_deferred.resolve('loaded');
		}
	}, _options.interval);
	return _deferred.promise();
}
