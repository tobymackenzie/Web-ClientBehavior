/* global module, require */
module.exports = function(__grunt){
	//--show time grunt takes to run
	require('time-grunt')(__grunt);
	//--auto loading of grunt tasks from package.json
	require('load-grunt-tasks')(__grunt);

	//==config
	__grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			}
			,all: [
				'Gruntfile.js'
				,'src/**/*.js'
				,'test/**/*.js'
			]
		}
		,requirejs: {
			almond: {
				options: {
					baseUrl: 'build'
					,include: ['../vendor/almond/almond.js', 'requirements.base']
					,out: 'dist/tmlib.almond.js'
					,paths: {
						tmclasses: '../vendor/tmclasses/src'
						,tmlib: '../src'
					}
					,wrap: {
						startFile: 'build/wrap.start.js'
						,endFile: 'build/wrap.end.js'
					}
				}
			}
			,require: {
				options: {
					baseUrl: 'build'
					,include: ['tmlib/core/functions', 'tmlib/core/objects', 'tmlib/core/classes', 'tmlib/core/BaseClass']
					,out: 'dist/tmlib.require.js'
					,paths: {
						tmclasses: '../vendor/tmclasses/src'
						,tmlib: '../src'
					}
				}
			}
		}
	});

	//==tasks
	__grunt.registerTask('build', [
		'jshint'
		,'requirejs:require'
	]);
	__grunt.registerTask('build:all', [
		'jshint'
		,'requirejs:almond'
		,'requirejs:require'
	]);
	__grunt.registerTask('default', [
		'jshint'
	]);
};
