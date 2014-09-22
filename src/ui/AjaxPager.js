/*
Class: AjaxPager
Load content via link click, slide it in to replace previously loaded content if it exists, or into place if none exists.

-! not generalized enough


Styles:
	``` scss
	.ajaxLoaderContent{
		margin-bottom: 2em;
		*overflow: hidden;
		position: relative;
	}
	.ajaxLoaderWrap{
		overflow: hidden;
	}
	.ajaxPage{
		left: 0;
		top: 0;
		.ajaxLoaderWrap-initialized &{
			position: absolute;
			width: 100%;
		}
	}
	```

*/
/* global define */
define([
	'jquery'
	,'tmclasses/tmclasses'
	,'tmlib/fx/AnimationTransition'
],function(
	jQuery
	,tmclasses
	,_AnimationTransition
){
	var __getElmDimensions = function(_elm){
		var _data = {};
		if(_elm){
			var _originalCSS = {
				position: _elm.css('position'),
				visibility: _elm.css('visibility')
			};

			_elm.css({position: 'absolute', visibility: 'hidden'});
			_data.width = _elm.outerWidth();
			_data.height = _elm.outerHeight();
			_elm.css(_originalCSS);
		}

		return _data;
	};

	var AjaxPager = tmclasses.create({
		init: function(){
			var _self = this;
			_self.__parent(arguments);

			if(!_self.transition){
				_self.transition = new _AnimationTransition({
					stylesBefore: [
						null
						,null
						,function(){
							_self.contentWidth = _self.content.outerWidth();
							return {
								display: 'block'
								,left: _self.contentWidth + 'px'
							};
						}
					]
					,stylesTransition: [
						function($elm, _opts){
							var _height = _self.getHiddenElementHeight(_opts.elements[2]);
							return {
								height: _height
							};
						}
						,function(){
							return {
								left: '-' + _self.contentWidth + 'px'
							};
						}
						,{left: 0}
					]
				});
			}
			_self.transition.sub('after', function(_opts){
				_self.currentPage = _opts.elements[2];
			});

			_self.activate();
		}
		,properties: {
			activate: function(){
				var _self = this;
				if(_self.elm){
					if(!_self.currentPage){
						_self.currentPage = _self.elm.find('.ajaxPage');
					}
					if(!_self.currentPage.length){
						_self.currentPage = undefined;
					}
					if(!_self._loadedPages){
						_self._loadedPages = {};
					}
					// $ajaxLoaderHeading = $ajaxLoaderWrap.find('.ajaxLoaderHeading');
					if(!_self.content){
						_self.content = _self.elm.find('.ajaxLoaderContent');
					}
					if(!_self.content.length){
						_self.content = jQuery('<div class="ajaxLoaderContent">');
						_self.content.hide();
						_self.elm.prepend(_self.content);
						// $ajaxLoaderHeading.after(_self.content);
					}
					if(_self.currentPage){
						_self.content.css('height', _self.currentPage.outerHeight());
					}

					_self.elm.on('click', '.ajaxLoaderAction', function(_event){
						_event.preventDefault();
						var _action = jQuery(this);
						var _url = _action.attr('href');
						if(_url !== _self.currentURL){
							_self.showPage(_url);
							_self.currentURL = _url;
						}
					});

					//--add initialized state class
					_self.elm.addClass('ajaxLoaderWrap-initialized');
				}
			}
			,content: undefined
			,_contentWidth: undefined
			,currentPage: undefined
			,currentURL: undefined
			,elm: undefined
			,getHiddenElementHeight: function($elm){
				var _height = __getElmDimensions($elm).height;

				//--make sure image height is taken into account
				var _imageHeight = $elm.find('img').attr('height');
				if(_imageHeight > _height){
					//--on nvp, image is stacked above text, so must be added to text height
					if(this.responsiveHandler && this.responsiveHandler.getBreakPoint() === 'nvp'){
						_height = parseInt(_height,10) + parseInt(_imageHeight,10);
					//--on wvp, image is left of text, and so should be the height of the container
					}else{
						_height = _imageHeight;
					}
				}

				return _height;
			}
			,_loadedPages: undefined
			,responsiveHandler: undefined
			,showLoadedPage: function(_url){
				var _self = this;
				if(typeof _self._loadedPages[_url] !== 'undefined'){
					var $item = _self._loadedPages[_url];
					if(_self.currentPage){
						_self.transition.transitionForElements({
							elements: [
								_self.content
								,_self.currentPage
								,$item
							]
						});
						//_self.currentPage.fadeOut(function(){
						//	$item.fadeIn(function(){
						//		_self.currentPage = $item;
						//	});
						//});
					}else{
						$item.show();
						_self.content.show();
						var _height = _self.getHiddenElementHeight($item);
						_self.content.animate({height: _height}, function(){
							_self.currentPage = $item;
						});
					}
					_self.currentURL = _url;
				}
			}
			,showPage: function(_url){
				var _self = this;
				if(typeof _self._loadedPages[_url] === 'undefined'){
					jQuery.ajax({
						url: _url
						,success: function(_data){
							if(typeof _data !== 'object'){
								_data = jQuery.parseJSON(_data);
							}
							if(_data.content){
								var $item = jQuery('<div class="ajaxPage" id="' + _url + '">' + _data.content + '</div>');

								//--'preload' images
								//$item.find('img').each(function(){
								//	var $img = jQuery('<img/>');
								//	$img[0].src = this.src;
								//	$body.append($img);
								//	$img.remove();
								//});

								$item.hide();
								_self.content.append($item);
								_self._loadedPages[_url] = $item;
								_self.showLoadedPage(_url);
							}
						}
					});
				}else{
					_self.showLoadedPage(_url);
				}
			}
			,transition: undefined
		}
	});
	return AjaxPager;
});
