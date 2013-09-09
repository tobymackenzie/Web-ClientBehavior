/*
Library: Logger

Logging of messages to a div on the page, with auto vardump of objects
done as singleton by instantation while defining

Dependencies:
	tmlib vardump
	jquery
*/
/* global __, jQuery */
__.logger = {
	init: function(){
		var _this = this;
		_this.elmContainer = jQuery('<div>');
		_this.elmContainer.css({overflow: 'hidden', display: 'block', position: 'absolute', top: 0, left: 0, background: '#fff'});
		_this.elmList = jQuery('<ol>');
		_this.elmContainer.append(_this.elmList);
		//__.elmError.on('click', 'pre', function(){ jQuery(this).remove(); });
		_this.elmContainer.click(function(){
			if(_this.elmContainer.data('open')){
				_this.hide();
			}else{
				_this.show();
			}
		});
		_this.elmContainer.click();
		jQuery('body').append(_this.elmContainer);
	}
	,log: function(){
		if(!this.elmContainer){
			this.init();
		}
		var _data = {};
		_data.elmLI = jQuery('<li>');
		if(arguments.length > 1){
			_data.elmSublist = jQuery('<ol>');
			_data.elmLI.append(_data.elmSublist);
		}
		for(var key = 0; key < arguments.length; ++key){
			var lopItem = arguments[key];
			var lopItemFormatted;
			if(typeof lopItem == 'object'){
				lopItemFormatted = __.lib.varDump(lopItem);
			}else{
				lopItemFormatted = lopItem;
			}
			if(arguments.length > 1){
				var elmSubLI = jQuery('<li>');
				elmSubLI.text(lopItemFormatted).html();
				_data.elmSublist.append(elmSubLI);
			}else{
				_data.elmLI.text(lopItemFormatted).html();
			}
		}
		this.elmList.append(_data.elmLI);
		this.show();
	}
	,hide: function(){
		if(!this.elmContainer){
			this.init();
		}
		this.elmContainer.css({width: '20px', height: '20px'});
		this.elmContainer.data('open', false);
	}
	,show: function(){
		if(!this.elmContainer){
			this.init();
		}
		this.elmContainer.css({width: '100%', height: 'auto'});
		this.elmContainer.data('open', true);
	}
};
