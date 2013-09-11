/*
Class: FullContainerImage

makes image full width or height in container

Styles:
	html, body{ // for full body
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}
	#.pageWrap{ // for full body
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
	.bgImage{
		position: fixed;
		top: 0;
		left: 0;
	}
	.bgImage.fitwidth{
		width: 100%;
		height: auto;
		min-height: 0;
	}
	.bgImage.fitheight{
		width: auto;
		min-width: 0;
		height: 100%;
	}
	html.ua-ie-lte6 .bgImage{
		position: absolute;
	}

Markup:
	<body>
	<div id=".pageWrap">
		<div id="fullheighter"></div>
		<div id="generalcontent"></div>
	</div>
	<div class="bgImageWrap"><img class="bgImage" src="" alt="" /></div>
	</body>

Info:
	-@http://css-tricks.com/perfect-full-page-background-image/
	-@http://plugins.jquery.com/project/fullscreenr
*/
/* global __, clearTimeout, jQuery, setTimeout, window */
__.classes.FullContainerImage = __.core.Classes.create({
	init: function(_args){
		this.__base(arguments);
		if(!this.$){
			this.$ = jQuery(window);
		}

		//--derived attributes
		if(this.$image){
			this.setImage(this.$image);
		}

		//--bind events
		var _this = this;
		var _timeout = null;
		jQuery(window).on('resize', function(){
			clearTimeout(_timeout);
			_timeout = setTimeout(function(){
				_this.setClass();
			}, 200);
		});

		if(this.oninit){
			this.oninit.call(this);
		}
	}
	,properties: {
		$: undefined
		,classFitWidth: 'fitwidth'
		,classFitHeight: 'fitheight'
		,doCenterHorizontally: false
		,doCenterVertically: false
		,oninit: null
		,setClass: function(){
			if(this.$image.length > 0){
				if((this.$.width() / this.$.height()) < this.aspectRatioImage ){
					if(!this.$image.hasClass(this.classFitHeight)){
						this.$image.removeClass(this.classFitWidth).addClass(this.classFitHeight);
						if(this.doCenterVertically){
							this.$image.css('top', 0);
						}
					}
					if(this.doCenterHorizontally){
						this.$image.css('left', -((this.$image.width() - this.$.width()) / 2));
					}
				}else{
					if(!this.$image.hasClass(this.classFitWidth)){
						this.$image.removeClass(this.classFitHeight).addClass(this.classFitWidth);
						if(this.doCenterHorizontally){
							this.$image.css('left', 0);
						}
					}
					if(this.doCenterVertically){
						this.$image.css('top', -((this.$image.height() - this.$.height()) / 2));
					}
				}
			}
		}
		,setImage: function($image){
			var _this = this;
			this.$image = $image;
			if(this.$image.length > 0){
				var _callback = function(){
					var _widthHeight = __.lib.getHiddenElementWidthHeight(this.$image);
					this.aspectRatioImage = _widthHeight.width / _widthHeight.height;
					this.setClass();
				};
				if(this.$image.width() > 0){
					_callback.call(this);
				}else{
					this.$image.on('load', function(){
						_callback.call(_this);
					});
				}
			}else{
				this.aspectRatio = false;
			}
		}
	}
});
