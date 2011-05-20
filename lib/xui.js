xui.extend({
/*-@ http://stackoverflow.com/questions/4911077/jquery-slideup-slidedown-xui-equivalent */
	fadeOut:function(argDuration, argCallback) {       
		this.tween({opacity: '0', duration: argDuration}, argCallback);
	}
	,fadeIn:function(argDuration, argCallback) {       
		this.tween({opacity: '1', duration: argDuration}, argCallback);	
	}
});

