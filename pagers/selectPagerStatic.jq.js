/*------
dependencies: tmlib base, tmlib isiphone, jquery

style:
.galleryswitch select{
	display: none; /* if select is to not be used by for non javascript applications 
}
.page{
	width: 890px; /* width must be specified so that height will be the same when page goes off screen
}



// init
if(typeof $ !== "undefined"){
	$(document).ready(function(){
		//--gallery pager
		var elmsPagesGallery = $("#page_gallerynew #maincontent .page");
		if(elmsPagesGallery.length > 0){
			__.pagerGallery = new __.classes.selectPagerStatic({elmsPages: elmsPagesGallery, elmSelect: $(".galleryswitch select"), keepHeight: $("#maincontent .contentwrap"),
				callbackSetHashForValue: function(argValue){
					return "/"+argValue;
				}
			});
		}
	});
}



------------*/




/*-------------
©selectpager
------------*/
__.classes.selectPagerStatic = function(args){
		this.elmsPages = args.elmsPages || false; if(!this.elmsPages || this.elmsPages.length < 1) return false;
//-> return
		this.elmSelect = args.elmSelect || false; if(!this.elmSelect) return false;
//-> return
		this.classCurrentPage = args.classCurrentPage || "current";
		this.duration = (args.duration !== undefined) ? args.duration : 500;
		this.keepHeight = args.keepHeight || false;
		if(__.isIphone() == true) this.keepHeight = false;
		this.callbackSetHashForValue = args.callbackSetHashForValue || function(argValue){
			return "/"+argValue;
		}

		this.inProgress = true;
		
		//--hide all, display first
		this.elmsPages.hide();
		this.elmsPages.filter(this.getSelectedPageID()).show().addClass(this.classCurrentPage);
		
		//--show select
		this.elmSelect.show();

		//--attach listeners
		this.attachListeners();
		
		this.inProgress = false;
	}
	__.classes.selectPagerStatic.prototype.attachListeners = function(){
		var fncThis = this;
		fncThis.elmSelect.bind("change", function(event){
			if(event.preventDefault)
				event.preventDefault();
			fncThis.switche(fncThis.getSelectedPageID());
			
			return false;
		});
	}
	__.classes.selectPagerStatic.prototype.switche = function(argID){
		if(this.inProgress == true || argID == this.idCurrent){
			return false;
		}else{
			var fncThis = this;
			var elmNextPage = this.elmsPages.filter(argID);
			var elmCurrentPage = this.elmsPages.filter("."+this.classCurrentPage);

			fncThis.inProgress = true;

			if(fncThis.keepHeight){
				fncThis.keepHeight.css("height", elmCurrentPage.outerHeight());
				var nextOriginalSettings = {
					position: elmNextPage.css("position"),
					left: elmNextPage.css("left"),
					top: elmNextPage.css("top")
				}
				var heightNew = elmNextPage.css({"position":"absolute", "left":"-9000px", "top":"-1000px"}).outerHeight();
				elmNextPage.css(nextOriginalSettings);
			}
			
			elmCurrentPage.removeClass(fncThis.classCurrentPage).fadeOut(this.duration, function(){
				var callbackFadeIn = function(){
					elmNextPage.fadeIn(fncThis.duration, function(){
						elmNextPage.addClass(fncThis.classCurrentPage);
						fncThis.inProgress = false;
					});
				}
				
				if(fncThis.keepHeight){
					fncThis.keepHeight.animate({height: heightNew}, fncThis.duration, callbackFadeIn);
				}else
					callbackFadeIn.call();

			});
		}
	}
	__.classes.selectPagerStatic.prototype.getSelectedPageID = function(){
		var elmSelected = this.elmSelect.find(":selected");
		return "#"+this.callbackSetHashForValue(elmSelected.attr("value")).replace(/\//g, "\\/");
	}

