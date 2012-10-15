/*
description
-----dependencies
-----parameters
-----instantiation
-----html
-----css
*/

	/*---
	==LightBox
	---*/
	__.classes.LightBox = function(args){
			var lcThis = this;
			//--optional attributes
			this.argsDelegateHandleRelativeNavigation = args.argsDelegateHandleRelativeNavigation || [
				'.linkRelative'
				,'click'
				,function(argEvent){
					var elmThis = jQuery(this);
					lcThis.open({
						'url': elmThis.attr('href')
						,'type': lcThis.typeDefault
					});
					if(argEvent.preventDefault) argEvent.preventDefault();
					return false;
				}
			];
			this.classPrefixType = args.classPrefixType || 'type';
			this.doRelativeNavigation = args.doRelativeNavigation || false;
			this.duration = (typeof args.duration != 'undefined') ? args.duration : 500;
			this.fxClose = args.fxClose || 'fadeOut';
			this.fxOpen = args.fxOpen || 'fadeIn';
			this.elmButtonNext = args.elmButtonNext;
			this.elmButtonPrevious = args.elmButtonPrevious;
			this.elmContainer = args.elmContainer || jQuery('body');
			this.elmContent = args.elmContent;
			this.elmsNavigation = args.elmsNavigation;
			this.elmWrap = args.elmWrap;
			this.elmWrapButtonNext = args.elmWrapButtonNext;
			this.elmWrapButtonPrevious = args.elmWrapButtonPrevious;
			this.elmWrapRelativeNavigation = args.elmWrapRelativeNavigation;
			this.elmsCollection = args.elmsCollection || null;
			this.htmlButtonNext = args.htmlButtonNext || '<a class="linkRelative linkRelativeNext" href=""><span class="label">Next</span></a>';
			this.htmlButtonPrevious = args.htmlButtonPrevious || '<a class="linkRelative linkRelativePrevious" href=""><span class="label">Previous</span></a>';
			this.htmlContent = args.htmlContent || '<div class="contentLightBox">';
			this.htmlWrap = args.htmlWrap || '<div class="wrapLightBox">';
			this.htmlWrapButtonNext = args.htmlWrapButtonNext || '<li class="itemNavigationRelative itemNavigationRelativeNext">';
			this.htmlWrapButtonPrevious = args.htmlWrapButtonPrevious || '<li class="itemNavigationRelative itemNavigationRelativePrevious">';
			this.htmlWrapRelativeNavigation = args.htmlWrapRelativeNavigation || '<ul class="relativeNavigation imageRelativeNavigation plain">';
			this.onPreClose = args.onPreClose || null;
			this.onPostClose = args.onPostClose || null;
			this.onPreOpen = args.onPreOpen || null;
			this.onPostOpen = args.onPostOpen || null;
			this.typeDefault = args.typeDefault || 'image';
			if(args.animateClose) this.animateClose = args.animateClose;
			if(args.animateOpen) this.animateOpen = args.animateOpen;

			//--derived attributes
			if(!this.elmWrap){
				this.elmWrap = jQuery(this.htmlWrap).hide();
				this.elmContainer.append(this.elmWrap);
			}
			if(!this.elmContent){
				this.elmContent = jQuery(this.htmlContent);
				this.elmWrap.append(this.elmContent);
			}
			this.isOpened = false;
			this.typeCurrent = null;

			//--add relative navigation if needed
			if(this.doRelativeNavigation){
				if(!this.elmWrapRelativeNavigation){
					this.elmWrapRelativeNavigation = jQuery(this.htmlWrapRelativeNavigation);
					this.elmWrap.append(this.elmWrapRelativeNavigation);
				}
				this.elmWrapRelativeNavigation.on.apply(this.elmWrapRelativeNavigation, this.argsDelegateHandleRelativeNavigation)
				if(!this.elmButtonPrevious){
					this.elmWrapButtonPrevious = jQuery(this.htmlWrapButtonPrevious);
					this.elmButtonPrevious = jQuery(this.htmlButtonPrevious)
					this.elmWrapButtonPrevious.append(this.elmButtonPrevious);
					this.elmWrapRelativeNavigation.append(this.elmWrapButtonPrevious);
				}
				if(!this.elmButtonNext){
					this.elmWrapButtonNext = jQuery(this.htmlWrapButtonNext);
					this.elmButtonNext = jQuery(this.htmlButtonNext)
					this.elmWrapButtonNext.append(this.elmButtonNext);
					this.elmWrapRelativeNavigation.append(this.elmWrapButtonNext);
				}
				this.updateRelativeNavigation();
			}
		}
		__.classes.LightBox.prototype.animateClose = function(args){
			if(!args) args = {};
			var lcThis = this;
			var elmAnimateWrap = (args.elmAnimateWrap) ? args.elmAnimateWrap : lcThis.elmWrap;
			if(args.onPreClose) args.onPreClose.call(lcThis, args);
			if(lcThis.onPreClose) this.onPreClose.call(lcThis, args);
			elmAnimateWrap[this.fxClose](
				this.duration
				,function(){
					lcThis.isOpened = false;
					if(args.onPostClose) args.onPostClose.call(lcThis, args);
					if(lcThis.onPostClose) lcThis.onPostClose.call(lcThis, args);
				}
			);
		}
		__.classes.LightBox.prototype.animateOpen = function(args){
			var lcThis = this;
			var elmAnimateWrap = (args.elmAnimateWrap) ? args.elmAnimateWrap : lcThis.elmWrap;
			if(args.onPreOpen) args.onPreOpen.call(lcThis, args);
			if(lcThis.onPreOpen) lcThis.onPreOpen.call(lcThis, args);
			elmAnimateWrap[this.fxOpen](
				this.duration
				,function(){
					lcThis.isOpened = true;
					lcThis.updateRelativeNavigation(args);
					if(args.onPostOpen) args.onPostOpen.call(lcThis, args);
					if(lcThis.onPostOpen) lcThis.onPostOpen.call(lcThis, args);
				}
			);
		}
		__.classes.LightBox.prototype.close = function(){
			this.animateClose();
		}
		__.classes.LightBox.prototype.open = function(args){
			var lcThis = this;
			if(__.lib.isObject(args)){
				var lcUrl = args.url;
				var lcType = args.type;
			}else{
				var lcUrl = args;
				var lcType = '';
			}
			if(typeof lcType == 'undefined'){
				lcUrlSplit = lcUrl.split('.');
				lcType = lcUrlSplit[lcUrlSplit.length - 1];
			}
			if(this.isOpened && !args.elmAnimateWrap){
				args.elmAnimateWrap =  this.elmContent;
				args.onPostClose = function(){ lcThis.open(args); };
				this.animateClose(args);
				return false;
			}
			if(lcUrl){
				if(lcThis.typeCurrent)
					lcThis.elmWrap.removeClass(lcThis.classPrefixType + lcThis.typeCurrent);
				if(lcType){
					lcThis.elmWrap.addClass(lcThis.classPrefixType + lcType);
					lcThis.typeCurrent = lcType;
				}
				jQuery.ajax({
					url: lcUrl
					,data: {ajaxcall: 1}
					,success: function(argData){
						lcThis.elmContent.html(argData);
						lcThis.animateOpen(args);
					}
				});
			}else{
				lcThis.elmWrap[lcThis.fxOpen]();
			}
		}
		__.classes.LightBox.prototype.updateRelativeNavigation = function(args){
			if(this.isOpened){
				if(this.elmsCollection && args && args.url){
					var lcElmCurrent = this.elmsCollection.filter('[href="'+args.url+'"]');
					var indexCurrent = this.elmsCollection.index(lcElmCurrent)
					var indexNext = indexCurrent + 1;
					var indexPrevious = indexCurrent - 1;
					var lcUrlNext = '';
					var lcUrlPrevious = '';
					if(indexNext <= this.elmsCollection.length){
						var lcUrlNext = jQuery(this.elmsCollection[indexNext]).attr('href');
					}
					if(indexPrevious > -1){
						var lcUrlPrevious = jQuery(this.elmsCollection[indexPrevious]).attr('href');
					}
					this.elmButtonNext
						.attr('href', lcUrlNext)
						[(lcUrlNext) ? 'show' : 'hide']()
					;
					this.elmButtonPrevious
						.attr('href', lcUrlPrevious)
						[(lcUrlPrevious) ? 'show' : 'hide']()
					;
				}
			}else{
				this.elmButtonNext.hide();
				this.elmButtonPrevious.hide();
			}
		}
