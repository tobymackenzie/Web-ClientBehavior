/*-------------
external access


__.imageSwitcher = new __.classes.imageSwitcher({elmsListItems:$(".photos .navigation li"), elmImage: $(".photos .mainimage img"), elmKeepDimensions: $(".photos .mainimage"),
		onpreselect: function(elmThis){ __.navGrayscaler.colorify(elmThis); elmThis.addClass("current"); },
		ondeselect: function(elmThis){ __.navGrayscaler.grayify(elmThis); },
		listItemUnselectedState:{fontSize:"12px"},listItemSelectedState:{fontSize:"16px"}, attrImageURL:"data-image-url", classSelected: "current"}
	);

*/


/*-------------
©imageswitcher
depends on: jquery

@param elmKeepDimensions: element to maintain height on and animate to height of new image
------------*/
__.classes.imageSwitcher = function(arguments){
		this.elmsListItems = (arguments.elmsListItems && arguments.elmsListItems.length > 0)?arguments.elmsListItems:null;
			if(!this.elmsListItems) return false;
		this.selectorListItemContainer = (arguments.selectorListItemContainer)?arguments.selectorListItemContainer:"li";
		this.elmImage = (arguments.elmImage && arguments.elmImage.length > 0) ? arguments.elmImage : null;
			if(!this.elmImage) return false;
		this.classSelected = (arguments.classSelected)? arguments.classSelected: "selected";
		this.duration = (arguments.duration)? arguments.duration: 500;
		this.listItemUnselectedState = (arguments.listItemUnselectedState)? arguments.listItemUnselectedState: null;
		this.listItemSelectedState = (arguments.listItemSelectedState)? arguments.listItemSelectedState: null;
//		this.attrImageURL = (arguments.attrImageURL)?arguments.attrImageURL:"href";
		this.onpreselect = arguments.onpreselect || null;
		this.onpredeselect = arguments.onpredeselect || null;
		this.onselect = arguments.onselect || null;
		this.ondeselect = arguments.ondeselect || null;
		this.elmKeepDimensions = arguments.elmKeepDimensions || false;
		
		this.inprogress=0;
		this.elmLICurrent = this.elmsListItems.hasClass(this.classSelected);
		this.urlCurrent = this.elmImage.attr("href");
		
		this.attachEvents();
	}
	__.classes.imageSwitcher.prototype.attachEvents = function(){
		if(this.elmsListItems.length == 0) return false;
		var fncThis = this;
		fncThis.elmsListItems.children("a").bind("click", function(){
			if(fncThis.inprogress==1) return false;
//-> return
			var thisLI = $(this).closest(fncThis.selectorListItemContainer);
			var thisA = thisLI.find("a");
//			var newImageURL = thisLI.attr(fncThis.attrImageURL);
			var newImageURL = thisLI.find("a").attr("href");
			if(!newImageURL) newImageURL = thisA.attr(fncThis.attrImageURL);
			if(!newImageURL/*  || thisLI == fncThis.elmLICurrent */) return false;
//-> return
			var currentLI = fncThis.elmsListItems.filter("."+fncThis.classSelected);
			if(thisLI[0] == currentLI[0]) return false;
//-> return

			fncThis.inprogress = 1;

			// run pre-animate callback
			if(fncThis.onpredeselect)
				fncThis.onpredeselect(currentLI);
			if(fncThis.onpreselect)
				fncThis.onpreselect(thisLI);
			
			var elmTempImage = $("<img src='"+newImageURL+"' />").css({"position":"absolute", "left":"-9000px", "top":"-1000px"}).appendTo("body");
			
			if(fncThis.elmKeepDimensions){
				fncThis.elmKeepDimensions.css({"height": fncThis.elmImage.height(), "width": fncThis.elmImage.width()});
				var heightNew = elmTempImage.height() || fncThis.elmImage.height();
				var widthNew = elmTempImage.width() || fncThis.elmImage.width();
			}
			// animate
			currentLI.children("a").animate(fncThis.listItemUnselectedState, fncThis.duration, function(){
				$(this).closest(fncThis.selectorListItemContainer).removeClass(fncThis.classSelected);
				if(fncThis.ondeselect)
					fncThis.ondeselect(currentLI);
			});
			thisA.animate(fncThis.listItemSelectedState, fncThis.duration, function(){
				thisLI.addClass(fncThis.classSelected);
				fncThis.elmImage.fadeOut(fncThis.duration, function(){
					var fncSized = function(){
						var fncLoaded = function(){
							fncThis.elmImage.attr("src", newImageURL).fadeIn(fncThis.duration);
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
				});
			});
				
			return false;
		});
	}
	__.classes.imageSwitcher.prototype.updateElements = function(arguments){
		this.elmsListItems = (arguments.elmsListItems)?arguments.elmsListItems:this.elmsListItems;
		this.elmImage = (arguments.elmImage)?arguments.elmImage:this.elmImage;
		this.attachEvents();
	}



