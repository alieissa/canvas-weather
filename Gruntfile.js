
module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
			options: {
				globals: {
					console: true,
					document: true,
					Event: true,
					XMLHttpRequest: true
				}
			},
			project: {
				src: ['./**/*.js', '!./node_modules/**', '!./**/canvas_weather.js']
			}
		},

		// build canvas_weather.js
		browserify: {
			optons: {
				browserifyOptions: {
					debug: true
				}
			},

			dist: {
				files: {
					'./canvas_weather.js': './app.js'	
				}
			}
		},

		// build canvas_weather.js
		uglify: {
			min: {
				'./canvas_weahter.min.js': './canvas_weather.js'
			}
		},

		// for any change in files browserify
		watch: {
			scripts: {
				files: ['./app.js', './model/Model.js', './controller/Controller.js', './view/View.js'],
				tasks: ['browserify'] 
			}

		}

	});


	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ['jshint', 'browserify', 'uglify']);
	grunt.registerTask('default', ['watch']);
};
