test('tmlib strings', function(assert){
	//==initial setup
	var plainStrings = [
		'google.com'
		,'foo bar ://baz'
		,'://good'
		,'http://good'
		,'ep'
		// ,'/ hello there'
		// ,'http:// hello there'
		// ,'http://google.com/ foo bar'
	];

	var URLs = [
		'gopher://foo.bar'
		,'http://google.com'
		,'http://google.com/?q=foo+bar'
		,'/red'
		,'/blue?with=hintOfRed'
		,'/foo/bar?red=blue'
	];

	var htmlStrings = [
		'<div>'
		,'<div></div>'
		,'<div class="foo"><input type="hidden" value="foo" /></div>'
	];

	/*=====
	==html
	=====*/
	//--non html
	for(var i = 0; i < plainStrings.length; ++i){
		assert.ok(!__.lib.isHTML(plainStrings[i]), '"' + plainStrings[i] + '" should not be considered HTML.');
	}

	//--html
	for(var i = 0; i < htmlStrings.length; ++i){
		assert.ok(__.lib.isHTML(htmlStrings[i]), '"' + htmlStrings[i] + '" should be considered HTML.');
	}

	/*=====
	==urls
	=====*/

	//==test
	//--non urls
	for(var i = 0; i < plainStrings.length; ++i){
		assert.ok(!__.lib.isURL(plainStrings[i]), '"' + plainStrings[i] + '" should not be considered a URL.');
	}

	//--urls
	for(var i = 0; i < URLs.length; ++i){
		assert.ok(__.lib.isURL(URLs[i]), '"' + URLs[i] + '" should be considered a URL.');
	}
});
