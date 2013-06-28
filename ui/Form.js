	/*-----
	--Form
	-----*/
	__.classes.Form = function(argOptions){
			this.inputSelector = argOptions.inputSelector || 'input:not([type=button],[type=image],[type=reset],[type=submit]),select,textarea';
			this.onSend = argOptions.onSend || null;
			this.onSuccess = argOptions.onSuccess || null;

			if(typeof argOptions.onSubmit == 'function'){
				this.onSubmit = argOptions.onSubmit;
			}
			if(typeof argOptions.action == 'undefined'){
				this.actionType = 'deferred';
				this.action = null;
			}else{
				this.actionType = 'fixed';
				this.action = argOptions.action;
			}
			if(typeof argOptions.method == 'undefined'){
				this.methodType = 'deferred';
				this.method = 'post';
			}else{
				this.methodType = 'fixed';
				this.method = argOptions.action;
			}
			this.init(argOptions); //--'parent' constructor
		}
		__.core.Objects.mergeInto(__.classes.Form.prototype, __.Widget);
		__.classes.Form.prototype.onSubmit = function(argValues, argEvent){
			var lcThis = this;
			if(lcThis.onSend){
				lcThis.onSend.call(this, argValues, argEvent);
			}
			jQuery.ajax({
				url: this.action
				,data: argValues
				,type: this.method.toUpperCase()
				,success: function(argResponse){
					if(lcThis.onSuccess){
						lcThis.onSuccess(argResponse);
					}
				}
			});
		}
		__.classes.Form.prototype.reset = function(){
			this.elements.each(function(){
				this.reset();
			});
		}
		__.classes.Form.prototype.setElements = function(argElements){
			//--unbind for old elements if a jQuery instance
			if(this.elements && this.elements instanceof jQuery){
				this.elements.off('submit', this.submitHandler);
			}

			//--set new elements
			__.widget.setElements.call(this, argElements);

			if(argElements && argElements instanceof jQuery){
				//--bind
				this.elements.on('submit', jQuery.proxy(this.submitHandler, this));

				//--set action if needed
				if(this.actionType == 'deferred'){
					//--set object action to action of form element
					var action = this.elements.attr('action');
					if(action){
						this.action = action;
					//--if empty form action, attempt to use url that was passed in for form location or current href
					}else{
						this.action = this.elementsUrl;
					}
				}

				//--set method if needed
				if(this.methodType == 'deferred'){
					//--set object method to method of form element, if it has one
					var method = this.elements.attr('method');
					if(method){
						this.method = method;
					}
				}
			}
		}
		__.classes.Form.prototype.submitHandler = function(event){
			var values = {};
			this.elements.find(this.inputSelector).each(function(){
				var elmThis = jQuery(this);
				values[elmThis.attr('name')] = elmThis.val();
			});
			if(this.onSubmit){
				this.onSubmit.call(this, values, event);
			}
			if(event.preventDefault) event.preventDefault();
			return false;
		}
