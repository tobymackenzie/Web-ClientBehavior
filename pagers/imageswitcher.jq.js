/*-------------
depends on:
	tmlib
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
__.imageSwitcher = new __.classes.imageSwitcher({elmsListItems:$(".photos .navigation li"), elmImage: $(".photos .mainimage img"), elmKeepDimensions: $(".photos .mainimage"),
		onpreselect: function(elmThis){ __.navGrayscaler.colorify(elmThis); elmThis.addClass("current"); },
		ondeselect: function(elmThis){ __.navGrayscaler.grayify(elmThis); },
		listItemUnselectedState:{fontSize:"12px"},listItemSelectedState:{fontSize:"16px"}, attrImageURL:"data-image-url", classSelected: "current"}
);

*/


/*-------------
©imageswitcher
------------*/
__.classes.imageSwitcher = function(arguments){
		//--optional arguments
		this.attrImageURL = (arguments.attrImageURL)?arguments.attrImageURL:"href";
		this.attrKeepWidth = arguments.attrKeepWidth || null;
		this.attrKeepHeight = arguments.attrKeepHeight || null;
		this.boot = arguments.boot || null;
		this.classCurrent = (arguments.classCurrent)? arguments.classCurrent: "current";
		this.duration = (arguments.duration)? arguments.duration: 500;
//		this.elmImage = (arguments.elmImage && arguments.elmImage.length > 0) ? arguments.elmImage : null;
		this.elmKeepDimensions = arguments.elmKeepDimensions || false;
		this.elmListImages = arguments.elmListImages || null;
		this.htmlNewImage = arguments.htmlNewImage || "<img alt=\"\" />";
		this.listItemSelectedState = (arguments.listItemSelectedState)? arguments.listItemSelectedState: null;
		this.listItemUnselectedState = (arguments.listItemUnselectedState)? arguments.listItemUnselectedState: null;
		this.ondeselect = arguments.ondeselect || null;
		this.oninit = arguments.oninit || null;
		this.onpredeselect = arguments.onpredeselect || null;
		this.onpreimageanimation = arguments.onpreimageanimation || null;
		this.onpreselect = arguments.onpreselect || null;
		this.onpostimageanimation = arguments.onpostimageanimation || null;
		this.onpreimageanimationfadeout = arguments.onpreimageanimationfadeout || null;
		this.onpreimageanimationkeepheight = arguments.onpreimageanimationkeepheight || null;
		this.onpreimageanimationfadein = arguments.onpreimageanimationfadein || null;
		this.onpreimageanimationpostkeepheight = arguments.onpreimageanimationpostkeepheight || null;
		this.onselect = arguments.onselect || null;
		this.selectorListItemContainer = (arguments.selectorListItemContainer)?arguments.selectorListItemContainer:"li";
		this.typeAnimation = arguments.typeAnimation || "fadeoutfadein";
		
		//--derived members
		if(arguments.elmImage)
			this.setImage(arguments.elmImage);
		else
			this.elmImage = null;
		if(arguments.elmsListItems)
			this.setListItems(arguments.elmsListItems);
		else
			this.elmsListItems = null;
		this.inprogress=false;
		this.queue = new __.classes.animationQueue({name: "image", autoDequeue: false});
		
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.imageSwitcher.prototype.setImage = function(argElement){
		this.elmImage = argElement;
		this.urlCurrent = this.elmImage.attr("src");
	}
	__.classes.imageSwitcher.prototype.setListItems = function(argElements){
		this.elmsListItems = argElements;
		if(this.elmsListItems.length > 0){
			this.elmLICurrent = this.elmsListItems.filter(this.classCurrent);
			if(this.elmLICurrent.length < 1){
				this.elmLICurrent = this.elmsListItems.has("a[href='"+this.urlCurrent+"']");
				this.elmLICurrent.addClass(this.classCurrent);
			}
			this.attachEvents();
		}
	}
	__.classes.imageSwitcher.prototype.attachEvents = function(){
		if(this.elmsListItems.length == 0) return false;
		var fncThis = this;
		fncThis.elmsListItems.children("a").bind("click", function(event){
			if(event.preventDefault) event.preventDefault();

			var thisItem = $(this).closest(fncThis.selectorListItemContainer);
			fncThis.switchToItem(thisItem);
			
			return false;
		});
	}
	__.classes.imageSwitcher.prototype.switchToNext = function(){
		var currentItem = this.elmsListItems.filter("."+this.classCurrent);
		this.switchToItem(currentItem.next());
	}
	__.classes.imageSwitcher.prototype.switchToPrevious = function(){
		var currentItem = this.elmsListItems.filter("."+this.classCurrent);
		this.switchToItem(currentItem.prev());
	}
	__.classes.imageSwitcher.prototype.switchToItem = function(elmNewItem){
		var currentItem = this.elmsListItems.filter("."+this.classCurrent);
//->return
		if(elmNewItem[0] == currentItem[0] || elmNewItem.length < 1) return false;		
		var elmA = elmNewItem.find("a");
		var newImageURL = elmA.attr("href");
		if(!newImageURL) newImageURL = elmNewItem.attr(this.attrImageURL);
//->return
		if(!newImageURL) return false;
		this.switche(newImageURL);
	}
	__.classes.imageSwitcher.prototype.switche = function(newImageURL, arguments){
		var fncThis = this;

//-> return
		if(fncThis.inprogress==true) return false;		
		
		var oldLI = fncThis.elmsListItems.filter("."+fncThis.classCurrent);
		var newLI = fncThis.elmsListItems.has("a[href='"+$.trim(newImageURL)+"']");
		var newA = newLI.find("a");

		fncThis.inprogress = true;

		//--run pre-animate callback
		if(fncThis.onpredeselect)
			fncThis.onpredeselect.call(fncthis, oldLI);
		if(fncThis.onpreselect)
			fncThis.onpreselect.call(fncThis, newLI);
		
		var elmTempImage = $("<img class=\"tempimage\" src='"+newImageURL+"' />").css({"position":"absolute", "left":"-9000px", "top":"-9000px"}).appendTo("body");
		
		if(fncThis.elmKeepDimensions){
			fncThis.elmKeepDimensions.css({"height": fncThis.elmImage.height(), "width": fncThis.elmImage.width()});
			var widthNew = false, heightNew = false;
			if(fncThis.attrKeepWidth)
				widthNew = newLI.attr(fncThis.attrKeepWidth) || false;
			if(fncThis.attrKeepHeight)
				heightNew = newLI.attr(fncThis.attrKeepHeight) || false;
			if(!(widthNew || heightNew)){
				widthNew = widthNew || elmTempImage.width() || fncThis.elmImage.width();
				heightNew = heightNew || elmTempImage.height() || fncThis.elmImage.height();
			}
		}
		
		var fncLocalVariables = {newLI: newLI, oldLI: oldLI};

		//--animate navigation
		fncThis.queue.queue({name: "navigation", callback: function(){
			oldLI.children("a").animate(fncThis.listItemUnselectedState, fncThis.duration, function(){fncThis.queue.dequeue("navigation")});
		}});
		fncThis.queue.queue({name: "navigation", callback: function(){
			oldLI.children("a").closest(fncThis.selectorListItemContainer).removeClass(fncThis.classCurrent);
			if(fncThis.ondeselect)
				fncThis.ondeselect.call(fncThis, oldLI);
			fncThis.queue.dequeue("navigation")
		}});

		fncThis.queue.dequeue({name: "navigation"});
		
		//--animate image
		if(fncThis.onpreimageanimation)
			fncThis.queue.queue({name: "image", callback: function(){
				fncThis.onpreimageanimation.call(fncThis, fncLocalVariables);
			}});
		fncThis.queue.queue({name: "image", callback: function(){
			if(newA.length > 0)
				newA.animate(fncThis.listItemSelectedState, fncThis.duration, function(){fncThis.queue.dequeue("image");});
			else
				fncThis.queue.dequeue("image");
		}});
		if(fncThis.typeAnimation == "dissolve"){
			fncThis.queue.queue({name: "image", callback: function(){
				fncThis.elmOldImage = fncThis.elmImage;
				fncThis.elmImage = $(fncThis.htmlNewImage);
				fncThis.elmImage.attr("src", newImageURL);
				fncThis.elmListImages.prepend(fncThis.elmImage);
				if(fncThis.elmImage.width() > 0){
					fncThis.queue.dequeue("image");
				}else{
					fncThis.elmImage.bind("load", function(){
						fncThis.queue.dequeue("image");
					});
				}
			}});
		}
		if(fncThis.onpreimageanimationfadeout)
			fncThis.queue.queue({name: "image", callback: function(){
				fncThis.onpreimageanimationfadeout.call(fncThis, fncLocalVariables);
			}});
		fncThis.queue.queue({name: "image", callback: function(){
			newLI.addClass(fncThis.classCurrent);
			
			if(fncThis.typeAnimation == "dissolve"){
				fncThis.elmOldImage.fadeOut(fncThis.duration, function(){fncThis.queue.dequeue("image");});
			}else{
				fncThis.elmImage.fadeOut(fncThis.duration, function(){fncThis.queue.dequeue("image");});
			}
		}});
		if(fncThis.onpreimageanimationkeepheight)
			fncThis.queue.queue({name: "image", callback: function(){
				fncThis.onpreimageanimationkeepheight.call(fncThis, fncLocalVariables);
			}});
		fncThis.queue.queue({name: "image", callback: function(){
			if(fncThis.elmKeepDimensions){
				fncThis.elmKeepDimensions.animate({"height":heightNew, "width":widthNew}, function(){fncThis.queue.dequeue("image");});
			}else
				fncThis.queue.dequeue();
		}});
		if(fncThis.onpreimageanimationfadein)
			fncThis.queue.queue({name: "image", callback: function(){
				fncThis.onpreimageanimationfadein.call(fncThis, fncLocalVariables);
			}});
		fncThis.queue.queue({name: "image", callback: function(){
			if(fncThis.typeAnimation == "dissolve"){
				fncThis.elmOldImage.fadeOut(fncThis.duration).remove();
			}else{
				fncThis.elmImage.attr("src", newImageURL).fadeIn(fncThis.duration);
			}
			elmTempImage.remove();
			if(fncThis.elmKeepDimensions){
				fncThis.elmKeepDimensions.animate({"height":heightNew, "width":widthNew}, function(){fncThis.queue.dequeue("image");});
			}else
				fncThis.queue.dequeue("image");
			fncThis.elmLICurrent = newLI;
			if(fncThis.onselect)
				fncThis.onselect.call(fncThis, newLI);
		}});
		if(fncThis.onpreimageanimationpostkeepheight)
			fncThis.queue.queue({name: "image", callback: function(){
				fncThis.onpreimageanimationpostkeepheight.call(fncThis, fncLocalVariables);
			}});
		fncThis.queue.queue({name: "image", callback: function(){
			if(fncThis.elmKeepDimensions){
				fncThis.elmKeepDimensions.css({"height":"auto", "width":"auto"}, function(){fncThis.queue.dequeue("image");});
			}else
				fncThis.queue.dequeue("image");
		}});
		fncThis.queue.queue({name: "image", callback: function(){
			if(fncThis.onpostimageanimation)
				fncThis.onpostimageanimation.call(fncThis, fncLocalVariables);
			fncThis.inprogress = false;
		}});
		
		fncThis.queue.dequeue({name: "image"});
	}
	__.classes.imageSwitcher.prototype.updateElements = function(arguments){
		this.elmImage = (arguments.elmImage)?arguments.elmImage:this.elmImage;
		if(arguments.elmsListItems){
			this.elmsListItems = arguments.elmsListItems;
			this.attachEvents();
		}
	}

