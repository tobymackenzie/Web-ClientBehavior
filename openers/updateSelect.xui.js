/*
monitor a select element, perform an ajax call when the value changes and use a callback to handle that data
-----dependencies
tmlib: ajaxcall, merge
xui
-----parameters
elmSelectSource: the select element to monitor for changes
elmSelectDestination: the html element that will receive content from the ajax request
urlData: url to receive ajax data from
nameParameter: parameter sent with ajax request containing value from select
callback: function to run when ajax content is received
	data: data received from ajax callback

-----instantiation
		var elmPageGetAQuote = document.getElementById("page_getaquote");
		if(elmPageGetAQuote){
			__.quoteUpdateSelect = new __.classes.updateSelect({elmSelectSource: $("#frm\\[getaquote\\]\\[type\\]"), elmSelectDestination: $("#frm\\[getaquote\\]\\[td-typeinfo\\]"), nameParameter: "type", urlData: "/content/forms/ajax_getaquote_inquiry_types.php"
				,callback: function(data){
					this.elmSelectDestination.html(data);
				}
			});
		}
		
-----html
-----css
*/

/*----------
©updateSelect
----------*/
__.classes.updateSelect = function(args){
		var fncThis = this;
		this.boot = args.boot || {};
		this.callback = args.callback || function(){};
		this.elmSelectSource = args.elmSelectSource || null;
		this.elmSelectDestination = args.elmSelectDestination || null;
		this.handleNull = args.handleNull || false;
		this.nameParameter = args.nameParameter || null;
		this.parametersFixed = args.parametersFixed || null;
		this.urlData = args.urlData || null;
		
		if(!this.elmSelectSource || !this.urlData){
			return false;
		}
		this.elmSelectSource.on("change", function(){
			fncThis.handleChange();
		});
		fncThis.handleChange();
	}
	__.classes.updateSelect.prototype.handleChange = function(){
		var fncThis = this;
		var valueSelect = fncThis.elmSelectSource[0].options[fncThis.elmSelectSource[0].selectedIndex].value;
		if(valueSelect != "" || this.handleNull){
			var callback = function(argResponse){
				fncThis.callback.call(fncThis, argResponse.responseText, argResponse);
			}
			var fncParameters = {};
			fncParameters = __.lib.merge(fncParameters, fncThis.parametersFixed);
			if(this.nameParameter && valueSelect != "")
				fncParameters[this.nameParameter] = valueSelect;
			__.lib.ajaxCall({
				onsuccess: callback
				,parameters: fncParameters
				,url: fncThis.urlData
			});
		}
	}

