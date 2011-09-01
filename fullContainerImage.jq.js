/*
makes image full width or height in container

----- css
html, body{ // for full body
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
}
#pagewrap{ // for full body
	min-width: 960px;
	height: 100%;
}
#fullheighter{ // for full body
	float: left;
	position: relative;
	z-index: -1;
	width: 1px;
	height: 100%;
}
#bgimage img{
	position: fixed;
	top: 0;
	left: 0;
}
#bgimage img.fitwidth{
	width: 100%;
	height: auto;
	min-height: 0;
}
#bgimage img.fitheight{
	width: auto;
	min-width: 0;
	height: 100%;
}
html.uaielte6 #bgimage img{
	position: absolute;
}

----- html
<body>
<div id="pagewrap">
	<div id="fullheighter"></div>
	<div id="generalcontent"></div>
</div>
<div id="bgimage"><img src="" alt="" /></div>
</body>
----- sources of information
-@http://css-tricks.com/perfect-full-page-background-image/
-@http://plugins.jquery.com/project/fullscreenr

*/



/*----------
©fullContainerImage
----------*/
__.classes.fullContainerImage = function(args){
		//--optional attributes
		this.boot = args.boot || null;
		this.elmContainer = args.elmContainer || jQuery(window);
		this.classFitWidth = args.classFitWidth || "fitwidth";
		this.classFitHeight = args.classFitHeight || "fitheight";
		this.doCenterHorizontally = args.doCenterHorizontally || false;
		this.doCenterVertically = args.doCenterVertically || false;
		this.oninit = args.oninit || null;
		
		//--derived attributes
		var fncThis = this;
		var fncElmImage = args.elmImage || null;
		this.setImage(fncElmImage);
		
		//--bind events
		this.elmContainer.bind("resize", function(){
			fncThis.setClass();
		});
		
		if(this.oninit)
			this.oninit.call(this);
	}
	__.classes.fullContainerImage.prototype.setClass = function(){
		if(this.elmImage.length > 0){
			if((this.elmContainer.width() / this.elmContainer.height()) < this.aspectRatioImage ){
				if(!this.elmImage.hasClass(this.classFitHeight)){
					this.elmImage.removeClass(this.classFitWidth).addClass(this.classFitHeight);
					if(this.doCenterVertically)
						this.elmImage.css("top", 0);
				}
				if(this.doCenterHorizontally)
					this.elmImage.css("left", -((this.elmImage.width() - this.elmContainer.width()) / 2));
			}else{
				if(!this.elmImage.hasClass(this.classFitWidth)){
					this.elmImage.removeClass(this.classFitHeight).addClass(this.classFitWidth);
					if(this.doCenterHorizontally)
						this.elmImage.css("left", 0);
				}
				if(this.doCenterVertically)
					this.elmImage.css("top", -((this.elmImage.height() - this.elmContainer.height()) / 2));
			}
		}
	}
	__.classes.fullContainerImage.prototype.setImage = function(argElmImage){
		var fncThis = this;
		this.elmImage = argElmImage;
		if(this.elmImage.length > 0){
			var fncCallback = function(){
				var fncWidthHeight = __.getHiddenElementWidthHeight(this.elmImage);
				this.aspectRatioImage = fncWidthHeight.width / fncWidthHeight.height;
				this.setClass();
			}
			if(this.elmImage.width() > 0){
				fncCallback.call(this);;
			}else{
				this.elmImage.bind("load", function(){
					fncCallback.call(fncThis);
				});
			}
		}else
			this.aspectRatio = false;

	}

