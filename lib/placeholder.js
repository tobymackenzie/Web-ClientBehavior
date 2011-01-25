/* -----
addplacholdersupport
add placeholder support for old browsers
*/
/* -----
©addplacholdersupport
----- */
	tmlib.prototype.supportsInputPlaceholder = function(){
		if(!this.supportsInputPlaceholderValue){
			var a = document.createElement('input');
			this.supportsInputPlaceholderValue = 'placeholder' in a
		}
		return this.supportsInputPlaceholderValue;
	}
/* non-jquery version */
	tmlib.prototype.addPlaceholderSupport = function(argContainer){
		if(!argContainer) argContainer = document.body;
		if(!__.supportsInputPlaceholder()){
			// inputs
			var elmsInputs = argContainer.getElementsByTagName("input");
			var elmsInputsLength = elmsInputs.length;
			for(var i = 0; i < elmsInputsLength; ++i){
				var fncThis = elmsInputs[i];
				if(fncThis.getAttribute("placeholder")){
					var callbackFocus = function(fncThis){
						return function(){
							if(fncThis.value == fncThis.getAttribute("placeholder"))
								fncThis.value = "";
						}
					}(fncThis);
					var callbackBlur = function(fncThis){
						return function(){
							if(fncThis.value == "")
								fncThis.value = fncThis.getAttribute("placeholder");
						}
					}(fncThis);
					
					__.addListener(fncThis, "focus", callbackFocus);
					__.addListener(fncThis, "blur", callbackBlur);
					
//					fncThis.blur();
					callbackBlur.call();
				}
			}
			// textareas
			var elmsTextareas = argContainer.getElementsByTagName("textarea");
			var elmsTextareasLength = elmsTextareas.length;
			for(var i = 0; i < elmsTextareasLength; ++i){
				var fncThis = elmsTextareas[i];
				if(fncThis.getAttribute("placeholder")){
					var callbackFocus = function(fncThis){
						return function(){
							if(fncThis.value == fncThis.getAttribute("placeholder"))
								fncThis.value = "";
						}
					}(fncThis);
					var callbackBlur = function(fncThis){
						return function(){
							if(fncThis.value == "")
								fncThis.value = fncThis.getAttribute("placeholder");
						}
					}(fncThis);
					
					__.addListener(fncThis, "focus", callbackFocus);
					__.addListener(fncThis, "blur", callbackBlur);
					
//					fncThis.blur();
					callbackBlur.call();
				}
			}
		}
	}
/* jquery version */
	tmlib.prototype.addPlaceholderSupport = function(argContainer){
		if(!argContainer) argContainer = $("body");
		if(!__.supportsInputPlaceholder()){
			argContainer.find("input[placeholder]").attr("value", function(){ return $(this).attr("placeholder"); })
				.focus(function(){
					var fncThis = $(this);
					if(fncThis.attr("value") == fncThis.attr("placeholder")){
						fncThis.attr("value","");
					}
				})
				.blur(function(){
					var fncThis = $(this);
					if(fncThis.attr("value") == ""){
						fncThis.attr("value",function(){ return $(this).attr("placeholder"); });
					}
				})
			;
			argContainer.find("textarea[placeholder]").html(function(){ return $(this).attr("placeholder"); })
				.focus(function(){
					var fncThis = $(this);
					if(fncThis.val() == fncThis.attr("placeholder")){
						fncThis.val("");
					}
				})
				.blur(function(){
					var fncThis = $(this);
					if(fncThis.val() == ""){
						fncThis.val(function(){ return $(this).attr("placeholder"); });
					}
				})
			;
		}
	}

