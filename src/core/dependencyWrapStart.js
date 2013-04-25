(function(_dependencies, _js_undefined){
	/*=====
	==dependencies
	Allow injection of dependencies so they can be theoretically modified for testing.
	Local names allow them to be minified.
	=====*/
	if(typeof _dependencies != 'object'){
		_dependencies = {};
	}
	var _deps_globals = _dependencies.globals = _dependencies.globals || this;
	var _deps_head = _dependencies.head = _dependencies.head || _deps_globals.head || _js_undefined;
	var _deps_jQuery = _dependencies.jQuery = _dependencies.jQuery || _deps_globals.jQuery || _js_undefined;

	var _js_Array = _deps_globals.Array;
