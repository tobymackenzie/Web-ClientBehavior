/*-------------
depends on:
	tmlib
	jquery

@param elmKeepDimensions: jquery element to maintain height on and animate to height of new image
@param elmList: for animation of type disolve, jquery element container to append new image to
@param htmlNewImage: html for creating new image
@param typeAnimation: named type of animation
	fadeoutfadein: default, fades out old image to nothing, fades in new image
	dissolve: creates new image behind old image, fades out old image

-----external access
__.imageSwitcher = new __.classes.imageSwitcher({elmsListItems:$(".photos .navigation li"), elmImage: $(".photos .mainimage img"), elmKeepDimensions: $(".photos .mainimage"),
		onpreselect: function(elmThis){ __.navGrayscaler.colorify(elmThis); elmThis.addClass("current"); },
		ondeselect: function(elmThis){ __.navGrayscaler.grayify(elmThis); },
		listItemUnselectedState:{fontSize:"12px"},listItemSelectedState:{fontSize:"16px"}, attrImageURL:"data-image-url", classSelected: "current"}
);

*/


/*-------------
©imageswitcher
------------*/
/*-------------
©imageswitcher
------------*/
__.classes.imageSwitcher = function(arguments){
		//--required arguments
//->return
		this.elmsListItems = (arguments.elmsListItems && arguments.elmsListItems.length > 0)?arguments.elmsListItems:null;
			if(!this.elmsListItems) return false;
		this.elmImage = (arguments.elmImage && arguments.elmImage.length > 0) ? arguments.elmImage : null;
			if(!this.elmImage) return false;

		//--optional arguments
		this.attrImageURL = (arguments.attrImageURL)?arguments.attrImageURL:"href";
		this.attrKeepWidth = arguments.attrKeepWidth || null;
		this.attrKeepHeight = arguments.attrKeepHeight || null;
		this.classCurrent = (arguments.classCurrent)? arguments.classCurrent: "current";
		this.duration = (arguments.duration)? arguments.duration: 500;
		this.elmKeepDimensions = arguments.elmKeepDimensions || false;
		this.elmListImages = arguments.elmListImages || null;
		this.htmlNewImage = arguments.htmlNewImage || "<img alt=\"\" />";
		this.listItemSelectedState = (arguments.listItemSelectedState)? arguments.listItemSelectedState: null;
		this.listItemUnselectedState = (arguments.listItemUnselectedState)? arguments.listItemUnselectedState: null;
		this.onpredeselect = arguments.onpredeselect || null;
		this.onpreselect = arguments.onpreselect || null;
		this.ondeselect = arguments.ondeselect || null;
		this.onselect = arguments.onselect || null;
		this.selectorListItemContainer = (arguments.selectorListItemContainer)?arguments.selectorListItemContainer:"li";
		this.typeAnimation = arguments.typeAnimation || "fadeoutfadein";
		
		//--derived members
		this.inprogress=0;
		this.urlCurrent = this.elmImage.attr("src");
		this.elmLICurrent = this.elmsListItems.filter(this.classCurrent);
		if(this.elmLICurrent.length < 1){
			this.elmLICurrent = this.elmsListItems.has("a[href='"+this.urlCurrent+"']");
			this.elmLICurrent.addClass(this.classCurrent);
		}
		this.attachEvents();
	}
	__.classes.imageSwitcher.prototype.attachEvents = function(){
		if(this.elmsListItems.length == 0) return false;
		var fncThis = this;
		fncThis.elmsListItems.children("a").bind("click", function(){
//-> return
			if(fncThis.inprogress==1) return false;
			var currentLI = fncThis.elmsListItems.filter("."+fncThis.classCurrent);
			var thisLI = $(this).closest(fncThis.selectorListItemContainer);
//-> return
			if(thisLI[0] == currentLI[0]) return false;
			var thisA = thisLI.find("a");
			var newImageURL = thisA.attr("href");
			if(!newImageURL) newImageURL = thisLI.attr(fncThis.attrImageURL);
//-> return
			if(!newImageURL) return false;

			fncThis.inprogress = 1;

			//--run pre-animate callback
			if(fncThis.onpredeselect)
				fncThis.onpredeselect(currentLI);
			if(fncThis.onpreselect)
				fncThis.onpreselect(thisLI);
			
			var elmTempImage = $("<img src='"+newImageURL+"' />").css({"position":"absolute", "left":"-9000px", "top":"-1000px"}).appendTo("body");
			
			if(fncThis.elmKeepDimensions){
				fncThis.elmKeepDimensions.css({"height": fncThis.elmImage.height(), "width": fncThis.elmImage.width()});
				var widthNew = false, heightNew = false;
				if(fncThis.attrKeepWidth)
					widthNew = thisLI.attr(fncThis.attrKeepWidth) || false;
				if(fncThis.attrKeepHeight)
					heightNew = thisLI.attr(fncThis.attrKeepHeight) || false;
				if(!(widthNew || heightNew)){
					widthNew = widthNew || elmTempImage.width() || fncThis.elmImage.width();
					heightNew = heightNew || elmTempImage.height() || fncThis.elmImage.height();
				}
			}

			// animate
			currentLI.children("a").animate(fncThis.listItemUnselectedState, fncThis.duration, function(){
				$(this).closest(fncThis.selectorListItemContainer).removeClass(fncThis.classCurrent);
				if(fncThis.ondeselect)
					fncThis.ondeselect(currentLI);
			});
			thisA.animate(fncThis.listItemSelectedState, fncThis.duration, function(){
				thisLI.addClass(fncThis.classCurrent);

				var callbackAnimateStep2 =  function(){
					var fncSized = function(){
						var fncLoaded = function(){
							if(fncThis.typeAnimation == "dissolve"){
								fncThis.elmOldImage.fadeOut(fncThis.duration).remove();
							}else{
								fncThis.elmImage.attr("src", newImageURL).fadeIn(fncThis.duration);
							}
							elmTempImage.remove();
							fncThis.inprogress = 0;
							if(fncThis.elmKeepDimensions){
								fncThis.elmKeepDimensions.animate({"height":heightNew, "width":widthNew}, function(){
									fncThis.elmKeepDimensions.css({"height":"auto", "width":"auto"});
								});
							}
							fncThis.elmLICurrent = thisLI;
							if(fncThis.onselect)
								fncThis.onselect(thisLI);
						}
						if($.browser.msie){
							fncLoaded();
							thisLI.children("a").blur().focus(); // ie8 only, causes change of rotated element to take effect
						}
						else{
							// get around image caching issue with .load
							if(elmTempImage.height() > 0)
								fncLoaded();
							else
								$(elmTempImage).load(fncLoaded);
						}
					}
					
					if(fncThis.elmKeepDimensions){
						fncThis.elmKeepDimensions.animate({"height":heightNew, "width":widthNew}, fncSized);
					}else{
						fncSized();
					}
				}
				
				if(fncThis.typeAnimation == "dissolve"){
					fncThis.elmOldImage = fncThis.elmImage;
					fncThis.elmImage = $(fncThis.htmlNewImage);
					fncThis.elmImage.attr("src", newImageURL);
					fncThis.elmListImages.prepend(fncThis.elmImage);
					fncThis.elmOldImage.fadeOut(fncThis.duration, callbackAnimateStep2);
				}else{
					fncThis.elmImage.fadeOut(fncThis.duration, callbackAnimateStep2);
				}
			});
				
			return false;
		});
	}
	__.classes.imageSwitcher.prototype.updateElements = function(arguments){
		this.elmImage = (arguments.elmImage)?arguments.elmImage:this.elmImage;
		if(arguments.elmsListItems){
			this.elmsListItems = arguments.elmsListItems;
			this.attachEvents();
		}
	}




