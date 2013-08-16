xui.extend({
/*-@ http://stackoverflow.com/questions/4911077/jquery-slideup-slidedown-xui-equivalent */
	fadeOut:function(argDuration, argCallback) {       
		this.tween({opacity: '0', duration: argDuration}, argCallback);
	}
	,fadeIn:function(argDuration, argCallback) {       
		this.tween({opacity: '1', duration: argDuration}, argCallback);	
	}
	,first: function(){
		return xui(this[0]);
	}
	,last: function(){
		return xui(this[this.length - 1]);
	}
	,next: function(){
		var elm = this[0];
		do{
			elm = elm.nextSibling;
		}while(elm && elm.nodeType != 1);
		return xui(elm);
	}
	,prev: function(){
		var elm = this[0];
		do{
			elm = elm.previousSibling;
		}while(elm && elm.nodeType != 1);
		return xui(elm);
	}
});

