/* global __, test */
test('tmlib strings', function(__assert){
	var _i;
	//==initial setup
	var _plainStrings = [
		'google.com'
		,'foo bar ://baz'
		,'://good'
		,'http://good'
		,'ep'
		// ,'/ hello there'
		// ,'http:// hello there'
		// ,'http://google.com/ foo bar'
	];

	var _urls = [
		'gopher://foo.bar'
		,'http://google.com'
		,'http://google.com/?q=foo+bar'
		,'/red'
		,'/blue?with=hintOfRed'
		,'/foo/bar?red=blue'
	];

	var _htmlStrings = [
		'<div>'
		,'<div></div>'
		,'<div class="foo"><input type="hidden" value="foo" /></div>'
	];

	/*=====
	==html
	=====*/
	//--non html
	for(_i = 0; _i < _plainStrings.length; ++_i){
		__assert.ok(!__.lib.isHTML(_plainStrings[_i]), '"' + _plainStrings[_i] + '" should not be considered HTML.');
	}

	//--html
	for(_i = 0; _i < _htmlStrings.length; ++_i){
		__assert.ok(__.lib.isHTML(_htmlStrings[_i]), '"' + _htmlStrings[_i] + '" should be considered HTML.');
	}

	/*=====
	==urls
	=====*/

	//==test
	//--non urls
	for(_i = 0; _i < _plainStrings.length; ++_i){
		__assert.ok(!__.lib.isURL(_plainStrings[_i]), '"' + _plainStrings[_i] + '" should not be considered a URL.');
	}

	//--urls
	for(_i = 0; _i < _urls.length; ++_i){
		__assert.ok(__.lib.isURL(_urls[_i]), '"' + _urls[_i] + '" should be considered a URL.');
	}
});
