/*
Configuration for require js
*/
({
	baseUrl: '.'
	,include: ['../vendor/almond.js', 'requirements.base']
	,out: 'build.base.js'
	,paths: {
		tmlib: '../src'
	}
	,wrap: {
		startFile: 'wrap.start.js'
		,endFile: 'wrap.end.js'
	}
})
