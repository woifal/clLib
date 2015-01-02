module.exports = function(grunt) {
grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		includereplace: {
				app_dev: {
					options: {
						flatten: true
						,globals: {
							NOWW: "xxxxx"
						}
					// Task-specific options go here.
					},
					// Files to perform replacements and includes with
					src: ['*.html', "*.xml"],
					// Destination directory to copy files to
					dest: 'dist/app/'
				}
				,app_prod: {
					options: {
						flatten: true
						,globals: {
							NOWW: new Date().toISOString()
						}
					// Task-specific options go here.
					},
					// Files to perform replacements and includes with
					src: ['*.html', "*.xml"],
					// Destination directory to copy files to
					dest: 'dist/app/'
				}
				,web_prod: {
					options: {
						flatten: true
						,globals: {
							NOWW: new Date().toISOString()
						}
					// Task-specific options go here.
					},
					// Files to perform replacements and includes with
					src: ['html/_web/*'],
					// Destination directory to copy files to
					dest: 'dist/tmp/html'
				}
		},
		copy: {
				app_dev: {
					expand: true,
					//flatten: true,
					files: [
						{ src: ["js/*", "js/**/*"], dest:"dist/app/" }
						,{ src: ["js/*"], dest:"dist/app/" }
					]
				}
				,app_prod: {
					expand: true,
					//flatten: true,
					files: [
						{ src: ["js/*"], dest:"dist/app/" }
						,{ src: ["css/*","css/**/*"],  dest:"dist/app/" }
						,{ src: ["files/*", "files/**/*"] , dest:"dist/app/" }
					]
				}
				,web_prod: {
					expand: true,
//					flatten: true,
					files: [
						{ 
							src: [
								"js/*", "!js/_web"
							], 
							dest:"dist/web/" 
						}
						,
						{ 
							flatten: true
							,expand: true
							,cwd: "html/_web"
							,src: [
								"**"
							]
							,dest:"dist/web/html" 
						}
						,
						{ 
							flatten: true
							,expand: true
							,cwd: "dist/tmp/html"
							,src: [
								"**"
							]
							,dest:"dist/web/html" 
						}
						,
						{ 
							flatten: true
							,expand: true
							,cwd: "css/THEMES/20140405"
							,src: [
								"jquery.mobile-1.4.2.js"
							]
							,dest:"dist/web/js" 
						}
						,
						{ 
							flatten: true
							,expand: true
							,cwd: "js/_web"
							,src: [
								"**"
							]
							,dest:"dist/web/js" 
						}
						,{ 
							flatten: true
							,expand: true
							,cwd: "css/_web"
							,src: [
								"**"
							]
							,dest:"dist/web/css" 
						}
						,{ 
							flatten: true
							,expand: true
							,cwd: "css"
							,src: [
								"clLib.css"
								,"clRouteColors.css"
							]
							,dest:"dist/web/css" 
						}
						,
						{ 
							flatten: true
							,expand: true
							,cwd: "php/_web"
							,src: [
								"**"
							]
							,dest:"dist/web/php" 
						}						
						,{ src: ["files/*", "files/**/*"] , dest:"dist/web/" }
					]
				}
		},
        compress: {
			  app_dev: {
				options: {
				  archive: 'dist/app/archive.zip'
				},
				files: [
				  {
				  expand: true,
				  src: [
					//1
					'**'
					,
					'!archive.zip',
				  ]
				  , dest: '.'
				  , cwd: 'dist/app/'
				  }, // includes files in path
				]
			  }
			  ,app_prod: {
				options: {
				  archive: 'dist/app/archive.zip'
				},
				files: [
				  {
				  expand: true,
				  src: [
					//1
					'**'
					,
					'!archive.zip',
				  ]
				  , dest: '.'
				  , cwd: 'dist/app/'
				  }, // includes files in path
				]
			  }
		}
    });

    grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');	
    
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('appdev', ['includereplace:app_dev', 'copy:app_dev', 'compress:app_dev']);
    grunt.registerTask('appprod', ['includereplace:app_prod', 'copy:app_prod', 'compress:app_prod']);
    grunt.registerTask('webprod', ['includereplace:web_prod', 'copy:web_prod']);

};
