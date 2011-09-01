/*
monitor a select element, perform an ajax call when the value changes and use a callback to handle that data
-----dependencies
jquery
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
__.classes.updateSelect = function(arguments){
		var fncThis = this;
		this.boot = arguments.boot || {};
		this.callback = arguments.callback || function(){};
		this.elmSelectSource = arguments.elmSelectSource || null;
		this.elmSelectDestination = arguments.elmSelectDestination || null;
		this.handleNull = arguments.handleNull || false;
		this.nameParameter = arguments.nameParameter || null;
		this.parametersFixed = arguments.parametersFixed || null;
		this.urlData = arguments.urlData || null;
		
		if(!this.elmSelectSource || !this.urlData){
			return false;
		}
		this.elmSelectSource.bind("change", function(){
			fncThis.handleChange();
		});
		fncThis.handleChange();
	}
	__.classes.updateSelect.prototype.handleChange = function(){
		var fncThis = this;
		var valueSelect = fncThis.elmSelectSource.val();
		if(valueSelect != "" || this.handleNull){
			var callback = function(data, textStatus, jqXHR){
				fncThis.callback.call(fncThis, data, textStatus, jqXHR);
			}
			var fncParameters = {};
			jQuery.extend(fncParameters, fncThis.parametersFixed);
			if(this.nameParameter && valueSelect != "")
				fncParameters[this.nameParameter] = valueSelect;
			jQuery.ajax({
				type: 'GET'
				,data: fncParameters
				,success: callback
				,url: fncThis.urlData
			});
		}
	}
