//-# only set up tmlib if passed in, so base tmlib can instantiate itself and store original
if(_dependencies.tmlib || false){
	var __ = _dependencies.tmlib;
	var tmlib = _dependencies.tmlib;
}else if(_dependencies.__ || false){
	var __ = _dependencies.__;
	var tmlib = _dependencies.__;
}
