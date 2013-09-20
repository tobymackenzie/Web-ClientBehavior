/*
Configuration for require js
*/
({
	baseUrl: '.'
	,include: ['../vendor/almond/almond.js', 'requirements.base']
	,out: 'build.base.js'
	,paths: {
		tmclasses: '../vendor/tmclasses/src'
		,tmlib: '../src'
	}
	,wrap: {
		startFile: 'wrap.start.js'
		,endFile: 'wrap.end.js'
	}
})
