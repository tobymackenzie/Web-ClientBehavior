	__.classes.Button = function(argOptions){
			if(typeof argOptions.onPress == 'function'){
				this.onPress = argOptions.onPress;
			}

			this.init(argOptions); //--'parent' constructor
		}
		__.core.Objects.mergeInto(__.classes.Button.prototype, __.Widget);
		__.classes.Button.prototype.pressHandler = function(event){
			if(this.onPress){
				this.onPress.call(this, event);
			}
			if(event.preventDefault) event.preventDefault();
			return false;
		}
		__.classes.Button.prototype.setElements = function(argElements){
			//--unbind for old elements if a jQuery instance
			if(this.elements && this.elements instanceof jQuery){
				this.elements.off('click', this.pressHandler);
			}

			//--set new elements
			__.widget.setElements.call(this, argElements);

			if(argElements && argElements instanceof jQuery){
				//--bind
				this.elements.on('click', jQuery.proxy(this.pressHandler, this));
			}
		}
