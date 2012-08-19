/*-------------
depends on:
	tmlib
	animationqueue
	jquery

-----parameters
@param boot: extra storage for external/callback use
@param elmKeepDimensions: jquery element to maintain height on and animate to height of new image
@param elmList: for animation of type disolve, jquery element container to append new image to
@param htmlNewImage: html for creating new image
@param typeAnimation: named type of animation
	fadeoutfadein: default, fades out old image to nothing, fades in new image
	dissolve: creates new image behind old image, fades out old image

-----instantiation
__.imageSwitcher = new __.classes.imageSwitcher({elmsListItems:$('.photos .navigation li'), elmImage: $('.photos .mainimage img'), elmKeepDimensions: $('.photos .mainimage'),
		onpreselect: function(elmThis){ __.navGrayscaler.colorify(elmThis); elmThis.addClass('current'); },
		ondeselect: function(elmThis){ __.navGrayscaler.grayify(elmThis); },
		listItemUnselectedState:{fontSize:'12px'},listItemSelectedState:{fontSize:'16px'}, attrImageURL:'data-image-url', classSelected: 'current'}
);

*/


/*-------------
©imageswitcher
------------*/
__.classes.imageSwitcher = function(args){
		//--optional arguments
		this.attrImageURL = (args.attrImageURL)? args.attrImageURL:'href';
		this.attrKeepWidth = args.attrKeepWidth || null;
		this.attrKeepHeight = args.attrKeepHeight || null;
		this.boot = args.boot || null;
		this.classCurrent = (typeof args.classCurrent != 'undefined')? args.classCurrent: 'current';
		this.dimKeepDimensionsAddedWidth = args.dimKeepDimensionsAddedWidth || 0;
		this.dimKeepDimensionsAddedHeight = args.dimKeepDimensionsAddedHeight || 0;
		this.doAttachEvents = (typeof args.doAttachEvents != 'undefined')? args.doAttachEvents: true;
		this.duration = (args.duration)? args.duration: 500;
//		this.elmImage = (args.elmImage && args.elmImage.length > 0) ? args.elmImage : null;
		this.elmKeepDimensions = args.elmKeepDimensions || false;
		this.elmListImages = args.elmListImages || null;
		this.htmlNewImage = args.htmlNewImage || '<img alt="" />';
		this.listItemSelectedState = args.listItemSelectedState || null;
		this.listItemUnselectedState = args.listItemUnselectedState || null;
		this.ondeselect = args.ondeselect || null;
		this.oninit = args.oninit || null;
		this.onpredeselect = args.onpredeselect || null;
		this.onpreimageanimation = args.onpreimageanimation || null;
		this.onpreselect = args.onpreselect || null;
		this.onpostimageanimation = args.onpostimageanimation || null;
		this.onpreimageanimationfadeout = args.onpreimageanimationfadeout || null;
		this.onpreimageanimationkeepheight = args.onpreimageanimationkeepheight || null;
		this.onpreimageanimationfadein = args.onpreimageanimationfadein || null;
		this.onpreimageanimationpostkeepheight = args.onpreimageanimationpostkeepheight || null;
		this.onselect = args.onselect || null;
		this.onsetimage = args.onsetimage || null;
		this.onsetlistitems = args.onsetlistitems || null;
		this.selectorListItemContainer = (typeof args.selectorListItemContainer != 'undefined')? args.selectorListItemContainer:'li';
		this.selectorElmImageUrl = args.selectorElmImageUrl || 'a';
		this.typeAnimation = args.typeAnimation || 'fadeoutfadein';

		//--derived members
		this.inprogress=false;
		this.queue = new __.classes.animationQueue({name: 'image', autoDequeue: false});
		if(args.elmImage)
			this.setImage(args.elmImage);
		else
			this.elmImage = null;
		if(args.elmsListItems)
			this.setListItems(args.elmsListItems);
		else
			this.elmsListItems = null;

		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.imageSwitcher.prototype.findElmLIForURL = function(argURL){
		var selectorAttribute = '['+this.attrImageURL+'="'+jQuery.trim(argURL)+'"]';
		if(this.selectorElmImageUrl == 'this'){
			return this.elmsListItems.filter(selectorAttribute);
		}else{
			return this.elmsListItems.has(this.selectorElmImageUrl+selectorAttribute);
		}
	}
	__.classes.imageSwitcher.prototype.setImage = function(argElement){
		this.elmImage = argElement;
		this.urlCurrent = this.elmImage.attr('src');
		if(this.onsetimage)
			this.onsetimage.call(this);
	}
	__.classes.imageSwitcher.prototype.setListItems = function(argElements){
		this.elmsListItems = argElements;
		if(this.elmsListItems.length > 0){
			this.elmLICurrent = this.elmsListItems.filter(this.classCurrent);
			if(this.elmLICurrent.length < 1){
				this.elmLICurrent = this.findElmLIForURL(this.urlCurrent);
				this.elmLICurrent.addClass(this.classCurrent);
			}
			if(this.doAttachEvents)
				this.attachEvents();
			if(this.onsetlistitems)
				this.onsetlistitems.call(this);
		}
	}
	__.classes.imageSwitcher.prototype.attachEvents = function(){
		if(this.elmsListItems.length == 0) return false;
		var fncThis = this;
		fncThis.elmsListItems.children('a').on('click', function(event){
			if(event.preventDefault) event.preventDefault();

			var thisItem = jQuery(this).closest(fncThis.selectorListItemContainer);
			fncThis.switchToItem(thisItem);

			return false;
		});
	}
	__.classes.imageSwitcher.prototype.switchToNext = function(){
		var currentItem = this.elmsListItems.filter('.'+this.classCurrent);
		this.switchToItem(currentItem.next());
	}
	__.classes.imageSwitcher.prototype.switchToPrevious = function(){
		var currentItem = this.elmsListItems.filter('.'+this.classCurrent);
		this.switchToItem(currentItem.prev());
	}
	__.classes.imageSwitcher.prototype.switchToItem = function(elmNewItem){
		var currentItem = this.elmsListItems.filter('.'+this.classCurrent);
//->return
		if(elmNewItem[0] == currentItem[0] || elmNewItem.length < 1) return false;
		if(this.selectorElmImageUrl == 'this'){
			var newImageURL = elmNewItem.attr(this.attrImageURL);
		}else{
			var elmA = elmNewItem.find(this.selectorElmImageUrl);
			var newImageURL = elmA.attr(this.attrImageURL);
		}
		if(!newImageURL) newImageURL = elmNewItem.attr(this.attrImageURL);
//->return
		if(!newImageURL) return false;
		this.switche(newImageURL);
	}
	__.classes.imageSwitcher.prototype.switche = function(newImageURL, args){
		var fncThis = this;

//-> return
		if(fncThis.inprogress==true) return false;

		var oldLI = fncThis.elmsListItems.filter('.'+fncThis.classCurrent);
		var newLI = this.findElmLIForURL(jQuery.trim(newImageURL));
		var newA = newLI.find('a');

		fncThis.inprogress = true;

		//--run pre-animate callback
		if(fncThis.onpredeselect)
			fncThis.onpredeselect.call(fncthis, oldLI);
		if(fncThis.onpreselect)
			fncThis.onpreselect.call(fncThis, newLI);

		var elmTempImage = jQuery('<img class="tempimage" src="'+newImageURL+'" />').css({'position':'absolute', 'left':'-9000px', 'top':'-9000px'}).appendTo('body');

		if(fncThis.elmKeepDimensions){
			fncThis.elmKeepDimensions.css({'width': fncThis.elmImage.width() + fncThis.dimKeepDimensionsAddedWidth, 'height': fncThis.elmImage.height() + fncThis.dimKeepDimensionsAddedHeight});
			var widthNew = false, heightNew = false;
			if(fncThis.attrKeepWidth)
				widthNew = newLI.attr(fncThis.attrKeepWidth) || false;
			if(fncThis.attrKeepHeight)
				heightNew = newLI.attr(fncThis.attrKeepHeight) || false;

			var callbackGetNewWidthHeight = function(){
				if(!(widthNew || heightNew)){
					widthNew = widthNew || elmTempImage.width();
					heightNew = heightNew || elmTempImage.height();
				}
				if(widthNew && heightNew){
					widthNew += fncThis.dimKeepDimensionsAddedWidth;
					heightNew += fncThis.dimKeepDimensionsAddedHeight;
					fncThis.queue.dequeue('image');
				}else{
					elmTempImage.load(callbackGetNewWidthHeight);
				}
			}

			if(!(widthNew || heightNew)){
				fncThis.queue.queue({name: 'image', callback: callbackGetNewWidthHeight});
			}
		}

		var fncLocalVariables = {newLI: newLI, oldLI: oldLI};

		//--animate navigation
		fncThis.queue.queue({name: 'navigation', callback: function(){
			oldLI.children('a').animate(fncThis.listItemUnselectedState, fncThis.duration, function(){fncThis.queue.dequeue('navigation')});
		}});
		fncThis.queue.queue({name: 'navigation', callback: function(){
			oldLI.children('a').closest(fncThis.selectorListItemContainer).removeClass(fncThis.classCurrent);
			if(fncThis.ondeselect)
				fncThis.ondeselect.call(fncThis, oldLI);
			fncThis.queue.dequeue('navigation')
		}});

		fncThis.queue.dequeue({name: 'navigation'});

		//--animate image
		newLI.addClass(fncThis.classCurrent);
		if(fncThis.onpreimageanimation)
			fncThis.queue.queue({name: 'image', callback: function(){
				fncThis.onpreimageanimation.call(fncThis, fncLocalVariables);
			}});
		fncThis.queue.queue({name: 'image', callback: function(){
			if(newA.length > 0)
				newA.animate(fncThis.listItemSelectedState, fncThis.duration, function(){fncThis.queue.dequeue('image');});
			else
				fncThis.queue.dequeue('image');
		}});
		if(fncThis.typeAnimation == 'dissolve'){
			fncThis.queue.queue({name: 'image', callback: function(){
				fncThis.elmOldImage = fncThis.elmImage;
				fncThis.elmImage = jQuery(fncThis.htmlNewImage);
				fncThis.elmImage.attr('src', newImageURL);
				fncThis.elmListImages.prepend(fncThis.elmImage);
				if(fncThis.elmImage.width() > 0){
					fncThis.queue.dequeue('image');
				}else{
					fncThis.elmImage.on('load', function(){
						fncThis.queue.dequeue('image');
					});
				}
			}});
		}
		if(fncThis.onpreimageanimationfadeout)
			fncThis.queue.queue({name: 'image', callback: function(){
				fncThis.onpreimageanimationfadeout.call(fncThis, fncLocalVariables);
			}});
		fncThis.queue.queue({name: 'image', callback: function(){
			if(fncThis.typeAnimation == 'dissolve'){
				fncThis.elmOldImage.fadeOut(fncThis.duration, function(){fncThis.queue.dequeue('image');});
			}else{
				fncThis.elmImage.fadeOut(fncThis.duration, function(){fncThis.queue.dequeue('image');});
			}
		}});
		if(fncThis.onpreimageanimationkeepheight)
			fncThis.queue.queue({name: 'image', callback: function(){
				fncThis.onpreimageanimationkeepheight.call(fncThis, fncLocalVariables);
			}});
		fncThis.queue.queue({name: 'image', callback: function(){
			if(fncThis.elmKeepDimensions){
				fncThis.elmKeepDimensions.animate({'height':heightNew, 'width':widthNew}, function(){fncThis.queue.dequeue('image');});
			}else
				fncThis.queue.dequeue();
		}});
		if(fncThis.onpreimageanimationfadein)
			fncThis.queue.queue({name: 'image', callback: function(){
				fncThis.onpreimageanimationfadein.call(fncThis, fncLocalVariables);
			}});
		fncThis.queue.queue({name: 'image', callback: function(){
			if(fncThis.typeAnimation == 'dissolve'){
				fncThis.elmOldImage.fadeOut(fncThis.duration).remove();
			}else{
				fncThis.elmImage.attr('src', newImageURL).fadeIn(fncThis.duration);
			}
			elmTempImage.remove();

			if(fncThis.onselect)
				fncThis.onselect.call(fncThis, newLI);
			if(fncThis.elmKeepDimensions){
				fncThis.elmKeepDimensions.animate({'height':heightNew, 'width':widthNew}, function(){fncThis.queue.dequeue('image');});
			}else
				fncThis.queue.dequeue('image');
		}});
		if(fncThis.onpreimageanimationpostkeepheight)
			fncThis.queue.queue({name: 'image', callback: function(){
				fncThis.onpreimageanimationpostkeepheight.call(fncThis, fncLocalVariables);
			}});
		fncThis.queue.queue({name: 'image', callback: function(){
			if(fncThis.elmKeepDimensions)
				fncThis.elmKeepDimensions.css({'height':'auto', 'width':'auto'});
			fncThis.queue.dequeue('image');
		}});
		fncThis.queue.queue({name: 'image', callback: function(){
			fncThis.urlCurrent = fncThis.elmImage.attr('src');
			if(newLI && newLI.length > 0)
				fncThis.elmLICurrent = newLI;
			else
				fncThis.elmLICurrent = fncThis.findElmLIForURL(fncThis.urlCurrent);
			if(fncThis.onpostimageanimation)
				fncThis.onpostimageanimation.call(fncThis, fncLocalVariables);
			fncThis.inprogress = false;
		}});

		fncThis.queue.dequeue({name: 'image'});
	}
	__.classes.imageSwitcher.prototype.updateElements = function(args){
		this.elmImage = (args.elmImage)? args.elmImage:this.elmImage;
		if(args.elmsListItems){
			this.elmsListItems = args.elmsListItems;
			if(this.doAttachEvents)
				this.attachEvents();
		}
	}

