//-@ from http://stackoverflow.com/questions/3614944/how-to-get-random-element-in-jquery
jQuery.fn.random = function() {
	var index = Math.floor(Math.random() * this.length);
	return jQuery(this[index]);
};
