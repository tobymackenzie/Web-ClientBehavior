/*
monitor a select element, perform an ajax call when the value changes and use a callback to handle that data
-----dependencies
tmlib addlisteners, ajaxcall

-----parameters
elmSelectSource: the select element to monitor for changes
elmSelectDestination: the html element that will receive content from the ajax request
urlData: url to receive ajax data from
nameParameter: parameter sent with ajax request containing value from select
callback: function to run when ajax content is received
	data: data received from ajax callback

-----instantiation
		var keuringupdateSelect = new __.classes.updateSelect({elmSelectSource: document.getElementById('frmKeuring'), elmSelectDestination: document.getElementById('frmClass'), nameParameter: 'catid', urlData: '/content/forms/ajax_classes_for_keuring.php'
			,callback: function(transport){
				var responseObject = JSON.parse(transport.responseText);
				var newHTML = '';
				for(var key in responseObject){
					if(responseObject.hasOwnProperty(key)){
						var itemID = 'frmClass'+responseObject[key]['unid'];
						var typeInput = (typeof responseObject[key]['inputtype'] != 'undefined')? responseObject[key]['inputtype']: 'radio';
						newHTML +=	'<div class="formitem checkbox"> \
										<input type="'+typeInput+'" name="class[]" value="'+responseObject[key]['unid']+'" id="'+itemID+'" /> \
										<div class="label"> \
											<label for="'+itemID+'">'+responseObject[key]['name']+'</label> \
									';
						if(typeof responseObject[key]['price'] != 'undefined')
							newHTML +=		'<div class="price">$'+responseObject[key]['price']+'</div>';
						if(typeof responseObject[key]['description'] != 'undefined')
							newHTML +=		'<div class="description">'+responseObject[key]['description']+'</div>';
						newHTML +=		'</div> \
									</div>';
					}
				}
				if(newHTML == ''){
					newHTML = 'No inspections are available at this location for this horse.';
					if(this.boot.elmLabelAddMore){
						this.boot.elmLabelAddMore.style.display = 'none';
					}
				}
				this.elmSelectDestination.innerHTML = newHTML;
			}
			,boot: {elmLabelAddMore: document.getElementById('frmLabelAddMore')}
		});


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
		this.urlData = args.urlData || null;

		if(!this.elmSelectSource || !this.urlData){
			return false;
		}
		__.lib.addListeners(this.elmSelectSource, 'change', function(){
			fncThis.handleChange();
		});
		fncThis.handleChange();
	}
	__.classes.updateSelect.prototype.handleChange = function(){
		var fncThis = this;
		var valueSelect = fncThis.elmSelectSource.value;
		if(valueSelect != '' || this.handleNull){
			var callback = function(transport){
				fncThis.callback.call(fncThis, transport);
			}
			var fncParameters = {};
			if(this.nameParameter && valueSelect != '')
				fncParameters[this.nameParameter] = valueSelect;
			if(typeof pagHunid != 'undefined')
				fncParameters.hunid = pagHunid;
			__.lib.ajaxCall({
				method: 'GET'
				,parameters: fncParameters
				,onsuccess: callback
				,url: fncThis.urlData
			});
		}
	}

