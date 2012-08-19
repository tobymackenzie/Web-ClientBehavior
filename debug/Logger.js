/*
logging of messages to a div on the page, with auto vardump of objects
done as singleton by instantation while defining

-----dependencies
tmlib vardump
jquery

-----parameters
-----instantiation
-----html
-----css
*/

/*----
©Logger
-----*/
__.logger = {
	init: function(){
		var fncThis = this;
		fncThis.elmContainer = $('<div>');
		fncThis.elmContainer.css({overflow: 'hidden', display: 'block', position: 'absolute', top: 0, left: 0, background: '#fff'});
		fncThis.elmList = $('<ol>');
		fncThis.elmContainer.append(fncThis.elmList);
		//__.elmError.on('click', 'pre', function(){ $(this).remove(); });
		fncThis.elmContainer.click(function(){
			if(fncThis.elmContainer.data('open')){
				fncThis.hide();
			}else{
				fncThis.show();
			}
		});
		fncThis.elmContainer.click();
		$('body').append(fncThis.elmContainer);
	}
	,log: function(){
		if(!this.elmContainer)
			this.init();
		var lcl = {};
		lcl.elmLI = $('<li>');
		if(arguments.length > 1){
			lcl.elmSublist = $('<ol>');
			lcl.elmLI.append(lcl.elmSublist);
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
				var elmSubLI = $('<li>');
				elmSubLI.text(lopItemFormatted).html();
				lcl.elmSublist.append(elmSubLI);
			}else{
				lcl.elmLI.text(lopItemFormatted).html();
			}
		}
		this.elmList.append(lcl.elmLI);
		this.show();
	}
	,hide: function(){
		if(!this.elmContainer)
			this.init();
		this.elmContainer.css({width: '20px', height: '20px'});
		this.elmContainer.data('open', false);
	}
	,show: function(){
		if(!this.elmContainer)
			this.init();
		this.elmContainer.css({width: '100%', height: 'auto'});
		this.elmContainer.data('open', true);
	}
}

