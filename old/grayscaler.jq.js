/*
creates grayscale overlays for menu items, hides them on hover
must use callback in navigation handling functions to gray and degray new and old menu items respectively
*/

/*-------------
external access

	var elmsPhotoNavigation = $('#page_internal .photos .navigation li');
	__.navGrayscaler = new __.classes.navigationGrayscaler({elmsItems: elmsPhotoNavigation});
------------*/


/*------
©navigationGrayscaler
depends on:
	jquery
	grayscale.js: http://james.padolsey.com/javascript/grayscaling-in-non-ie-browsers/
------------*/
__.classes.navigationGrayscaler = function(args){
		// not needed in ie
		if(jQuery.browser.msie) return false;
		this.elmsItems = args.elmsItems || false; if(this.elmsItems.length < 1) return false;
		this.classCurrent = args.classCurrent || 'current';
		this.eventCurrentChange = args.eventCurrentChange || 'changeCurrent';
		this.classGrayed = args.classGrayed || 'grayed';
		this.duration = args.duration || 500;

		this.init(this.elmsItems)
	}
	__.classes.navigationGrayscaler.prototype.init = function(argElms){
		var fncThis = this;
		if(argElms.length > 0){
			argElms.each(function(){
				var elmThis = jQuery(this);
				if(elmThis.css('position') == 'static' || elmThis.css('position') == '')
					elmThis.css('position', 'relative');
				var elmClone = elmThis.find('img').clone().addClass(fncThis.classGrayed).attr('alt','').css({'position':'absolute', 'top':'0', 'left':'0', 'z-index':'10'});

				elmThis.append(elmClone);
				fncLoaded = function(){
					grayscale.prepare(elmClone);
					grayscale(elmClone);
					if(elmThis.hasClass(fncThis.classCurrent)){
						fncThis.colorify(elmThis, 0);
						elmClone.hide(); // for Safari only, colorify doesn't seem to take
					}
				}

				if(elmClone.height() > 0)
					fncLoaded();
				else
					elmClone.load(fncLoaded);
			});

			argElms.on('mouseenter focus', function(){
				var elmThis = jQuery(this);
				if(!elmThis.hasClass(fncThis.classCurrent))
					fncThis.colorify(elmThis, 0);
			});
			argElms.on('mouseleave blur', function(){
				var elmThis = jQuery(this);
				if(!elmThis.hasClass(fncThis.classCurrent))
					fncThis.grayify(elmThis, 0);
			});
		}
	}
	__.classes.navigationGrayscaler.prototype.grayify = function(argElms, argDuration){
		var fncElms = argElms.not('.'+this.classCurrent);
		if(fncElms.length > 0){
			var fncDuration = (argDuration === undefined) ? this.duration : argDuration;
			var fncElmsImages = fncElms.find('img.'+this.classGrayed);
			if(fncDuration == 0)
				fncElmsImages.show(fncDuration);
			else
				fncElmsImages.fadeIn(fncDuration);
		}
	}
	__.classes.navigationGrayscaler.prototype.colorify = function(argElms, argDuration){
			var fncDuration = (argDuration === undefined) ? this.duration : argDuration;
			var fncElmsImages = argElms.find('img.'+this.classGrayed);
			if(fncDuration == 0)
				fncElmsImages.hide(fncDuration);
			else
				fncElmsImages.fadeOut(fncDuration);
	}


