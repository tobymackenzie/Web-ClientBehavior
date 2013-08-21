/* global __, jQuery, window */
	__.mixins.Widget = {
		addElementsToDOM: function(elements){
			if(typeof elements == 'undefined'){
				elements = this.elements;
			}
			this.container.append(elements);
			if(typeof this.onAddElementsToDOM == 'function'){
				this.onAddElementsToDOM.call(this, elements);
			}
		}
		,getElements: function(){
			if(typeof this.elements == 'string'){
				this.loadElements();
			}
			return this.elements;
		}
		,hide: function(){
			this.getElements().hide();
			this.state = 'hidden';
		}
		,init: function(argOptions){
			this.container = argOptions.container || jQuery('body');
			this.elementsUrl = argOptions.elementsUrl || window.location.href;
			if(typeof argOptions.addElementsToDOM == 'function'){
				this.addElementsToDOM = argOptions.addElementsToDOM;
			}
			if(typeof argOptions.hide == 'function'){
				this.hide = argOptions.hide;
			}
			if(typeof argOptions.onAddElementsToDOM != 'undefined'){
				this.onAddElementsToDOM = argOptions.onAddElementsToDOM;
			}
			if(typeof argOptions.show == 'function'){
				this.show = argOptions.show;
			}
			if(typeof this.elements == 'undefined'){
				this.setElements(argOptions.elements || null);
			}
		}
		,loadElements: function(){
			var newElements, promise;
			if(typeof this.elements == 'string'){
				if(__.lib.isUrl(this.elements)){
					//--store elements url for later in case form has an empty action
					this.elementsUrl = this.elements;

					var lcThis = this;
					var request = jQuery.ajax({
						url: this.elements
						,dataType: 'html'
						,success: function(argData){
							var elements = jQuery(argData);
							lcThis.addElementsToDOM.call(lcThis, elements);
							lcThis.setElements(elements);
						}
					});
					promise = request.promise();
				}else if(__.lib.isHTML(this.elements)){
					newElements = jQuery(this.elements);
					this.addElementsToDOM.call(this, newElements);
					this.setElements(newElements);
				}else{
					newElements = this.container.find(this.elements);
					if(!newElements.length){
						newElements = jQuery(this.elements);
					}
					this.setElements(newElements);
				}
			}

			//--if there is no promise, return an already resolved promise
			if(typeof promise == 'undefined'){
				promise = jQuery.Deferred();
				promise.resolve();
			}
			return promise;
		}
		,setElements: function(argElements){
			this.elements = argElements;
		}
		,show: function(){
			this.getElements().show();
			this.state = 'shown';
		}
		,state: 'shown'
		,toggleVisibility: function(){
			if(this.state == 'shown'){
				this.hide();
			}else{
				this.show();
			}
		}
	};
