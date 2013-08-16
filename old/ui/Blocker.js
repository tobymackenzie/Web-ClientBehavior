	/*-----
	==Blocker
	-----*/
	__.classes.Blocker = function(argOptions){
			if(typeof argOptions == 'undefined') argOptions = {};
			this.elements = argOptions.elements || '<div class="Blocker">';
			this.elmMessage = argOptions.elmMessage || jQuery('<div class="BlockerMessage">');

			this.hasMessageClass = argOptions.hasMessageClass || 'hasMessage';
			this.noMessageClass = argOptions.noMessageClass || 'noMessage';

			this.init(argOptions); //--'parent' constructor
		}
		__.core.Objects.mergeInto(__.classes.Blocker.prototype, __.Widget);
		//--hide elements on add to DOM
		__.classes.Blocker.prototype.onAddElementsToDOM = function(argElements){
			argElements.hide();
		}
		__.classes.Blocker.prototype.show = function(argMessage){
			if(typeof argMessage != 'undefined'){
				this.elmMessage.html(argMessage);
				this.elements
					.append(this.elmMessage)
					.addClass(this.hasMessageClass)
					.removeClass(this.noMessageClass)
				;
			}else{
				this.elmMessage.detach();
				this.elements
					.removeClass(this.hasMessageClass)
					.addClass(this.noMessageClass)
				;
			}
			__.widget.show.call(this); //--parent
		}
