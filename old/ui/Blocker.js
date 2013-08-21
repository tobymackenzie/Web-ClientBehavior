/* global __, jQuery */
	/*-----
	==Blocker
	-----*/
	__.classes.Blocker = function(argOptions){
			if(typeof argOptions == 'undefined'){
				argOptions = {};
			}
			this.elements = argOptions.elements || '<div class="blocker">';
			this.elmMessage = argOptions.elmMessage || jQuery('<span class="blockerMessage">');

			this.hasMessageClass = argOptions.hasMessageClass || 'hasMessage';
			this.noMessageClass = argOptions.noMessageClass || 'noMessage';

			this.init(argOptions); //--'parent' constructor
		};
		__.core.Objects.mergeInto(
			__.classes.Blocker.prototype
			,__.mixins.Widget
			,{
				//--hide elements on add to DOM
				onAddElementsToDOM: function(argElements){
					argElements.hide();
				}
				,show: function(argMessage){
					var _elements = this.getElements();
					if(typeof argMessage != 'undefined'){
						this.elmMessage.html(argMessage);
						_elements
							.append(this.elmMessage)
							.addClass(this.hasMessageClass)
							.removeClass(this.noMessageClass)
						;
					}else{
						this.elmMessage.detach();
						_elements
							.removeClass(this.hasMessageClass)
							.addClass(this.noMessageClass)
						;
					}
					__.mixins.Widget.show.call(this); //--parent
				}
			}
		);
