module.exports = function(grunt) {
grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		includereplace: {
				app_local: {
					options: {
						flatten: true
						,globals: {
							VERSION: "V2.0"
							,NOWW: new Date().toISOString()
							,ENV: "LOCAL"
							,"clLib.REST.baseURI" : "http://localhost:1983/db"
							,"clLib.REST.clLibServerURI" : "http://localhost:1983"
                            ,DEBUG_OUTPUT: true 
							,ENABLE_DEBUG_VISIBILITY: "visible" 
						}
					// Task-specific options go here.
					},
					files : [
						{
							src: ['*.html', "*.xml"],
							dest: 'dist/tmp/app/'
						}
						,{
							src: ['js/*'],
							dest: 'dist/tmp/app/'
						}
					]

				}
				,app_dev: {
					options: {
						flatten: true
						,globals: {
							VERSION: "V2.0"
							,NOWW: new Date().toISOString()
							,ENV: "DEV"
							,"clLib.REST.baseURI" : "http://cllibserverdev.herokuapp.com/db"
							,"clLib.REST.clLibServerURI" : "http://cllibserverdev.herokuapp.com"
                            ,DEBUG_OUTPUT: false
							,ENABLE_DEBUG_VISIBILITY: "visible" 
						}
					// Task-specific options go here.
					},
					files : [
						{
							src: ['*.html', "*.xml"],
							dest: 'dist/tmp/app/'
						}
						,{
							src: ['js/*'],
							dest: 'dist/tmp/app/'
						}
					]

				}
				,app_prod: {
					options: {
						flatten: true
						,globals: {
							VERSION: "V2.0"
							,NOWW: new Date().toISOString()
							,ENV: "PROD"
							,"clLib.REST.baseURI" : "http://cllibserver.herokuapp.com/db"
							,"clLib.REST.clLibServerURI" : "http://cllibserver.herokuapp.com"
							,DEBUG_OUTPUT: false
							,ENABLE_DEBUG_VISIBILITY: "hidden" 
						}
					// Task-specific options go here.
					},
					files : [
						{
							src: ['*.html', "*.xml"],
							dest: 'dist/tmp/app/'
						}
						,{
							src: ['js/*'],
							dest: 'dist/tmp/app/'
						}
					]
				}
				,web_prod: {
					options: {
						flatten: true
						,globals: {
							VERSION: "V2.0"
							,NOWW: new Date().toISOString()
							,ENV: "PROD"
							,"clLib.REST.baseURI" : "http://cllibserver.herokuapp.com/db"
							,"clLib.REST.clLibServerURI" : "http://cllibserver.herokuapp.com"
                            ,DEBUG_OUTPUT: false
							,ENABLE_DEBUG_VISIBILITY: "hidden" 
							,WEB_IMG_FOLDER_URL: "/KURT/files/views/assets/image"
						}
					// Task-specific options go here.
					},
					files : [
						{ 
							src: ['html/_web/*'],
							dest: 'dist/tmp/web/'
						}
						,{ 
							src: ['js/*'],
							dest: 'dist/tmp/web/'
						}
					]
				}
				,web_local: {
                    //expand: true,
					options: {
						flatten: true
						,globals: {
							VERSION: "V2.0"
							,NOWW: new Date().toISOString()
							,ENV: "LOCAL"
							,"clLib.REST.baseURI" : "http://localhost:1983/db"
							,"clLib.REST.clLibServerURI" : "http://localhost:1983"
                            ,DEBUG_OUTPUT: true
							,ENABLE_DEBUG_VISIBILITY: "visible" 
							,WEB_IMG_FOLDER_URL: "http://localhost:8082/files/views/assets/image"
						}
					// Task-specific options go here.
					},
					files : [
						{ 
							src: ['html/_web/*'],
							dest: 'dist/tmp/web/'
						}
						,{ 
                            src: ['js/*'],
							dest: 'dist/tmp/web/'
						}
					]
				}
				,web_dev: {
                    //expand: true,
					options: {
						flatten: true
						,globals: {
							VERSION: "V2.0"
							,NOWW: new Date().toISOString()
							,ENV: "DEV"
							,"clLib.REST.baseURI" : "http://cllibserverdev.herokuapp.com/db"
							,"clLib.REST.clLibServerURI" : "http://cllibserverdev.herokuapp.com"
                            ,DEBUG_OUTPUT: true
							,ENABLE_DEBUG_VISIBILITY: "visible" 
							,WEB_IMG_FOLDER_URL: "http://localhost:8082/files/views/assets/image"
						}
					// Task-specific options go here.
					},
					files : [
						{ 
							src: ['html/_web/*'],
							dest: 'dist/tmp/web/'
						}
						,{ 
                            src: ['js/*'],
							dest: 'dist/tmp/web/'
						}
					]
				}
				,server_dev: {
					options: {
						flatten: true
						,globals: {
							VERSION: "V2.0"
							,NOWW: new Date().toISOString()
							,ENV: "DEV"
							,"clLib.REST.baseURI" : "http://localhost:1983/db"
							,"clLib.REST.clLibServerURI" : "http://localhost:1983"
                            ,DEBUG_OUTPUT: true
							,mongodbUser :  "clAdmin"
							,mongodbPwd  : "blerl1la"
							,mongodbHost : "ds023520.mlab.com"
							,mongodbPort : "23520"
							,mongodbDBName: "climbinglog_dev"
							}
					// Task-specific options go here.
					},
					files : [
						{ 
                            src: ['server/*'],
							dest: 'dist/tmp/server/'
						}
						,{
							src: ['js/*'],
							dest: 'dist/tmp/server/'
						}

					]

				}
				
				,server_local: {
					options: {
						flatten: true
						,globals: {
							VERSION: "V2.0"
							,NOWW: new Date().toISOString()
							,ENV: "LOCAL"
							,"clLib.REST.baseURI" : "http://localhost:1983/db"
							,"clLib.REST.clLibServerURI" : "http://localhost:1983"
                            ,DEBUG_OUTPUT: true
							,mongodbUser :  "clAdmin"
							,mongodbPwd  : "blerl1la"
							,mongodbHost : "ds023520.mlab.com"
							,mongodbPort : "23520"
							,mongodbDBName: "climbinglog_dev"
							}
					// Task-specific options go here.
					},
					files : [
						{ 
                            src: ['server/*'],
							dest: 'dist/tmp/server/'
						}
						,{
							src: ['js/*'],
							dest: 'dist/tmp/server/'
						}

					]

				}				
				,server_prod: {
					options: {
						flatten: true
						,globals: {
							VERSION: "V2.0"
							,NOWW: new Date().toISOString()
							,ENV: "PROD"
							,"clLib.REST.baseURI" : "http://localhost:1983/db"
							,"clLib.REST.clLibServerURI" : "http://localhost:1983"
                            ,DEBUG_OUTPUT: false
							,mongodbUser :  "clAdmin"
							,mongodbPwd  : "blerl1la"
							,mongodbHost : "ds053438.mongolab.com"
							,mongodbPort : "53438"
							,mongodbDBName: "climbinglog"
						}
					// Task-specific options go here.
					},
					files : [
						{ 
                            src: ['server/*'],
							dest: 'dist/tmp/server/'
						}
						,{
							src: ['js/*'],
							dest: 'dist/tmp/server/'
						}

					]
				}
         },
		copy: {
				app_dev: {
					expand: true,
					//flatten: true,
					files: [
						{ src: ["js/*"], dest:"dist/app/" }
						,{ src: ["css/*","css/**/*"],  dest:"dist/app/" }
						,{ src: ["files/*", "files/**/*"] , dest:"dist/app/" }
						,{ 
							flatten: true
							,expand: true
							,cwd: "dist/tmp/app"
							,src: [
								"**"
							]
							,dest:"dist/app" 
						}
						,
						{ 
							flatten: true
							,expand: true
							,cwd: "dist/tmp/app/js"
							,src: [
								"**"
							]
							,dest:"dist/app/js" 
						}
						,
						
					]
				}
				,app_local: {
					expand: true,
					//flatten: true,
					files: [
						{ src: ["js/*"], dest:"dist/app/" }
						,{ src: ["css/*","css/**/*"],  dest:"dist/app/" }
						,{ src: ["files/*", "files/**/*"] , dest:"dist/app/" }
						,{ 
							flatten: true
							,expand: true
							,cwd: "dist/tmp/app"
							,src: [
								"**"
							]
							,dest:"dist/app" 
						}
						,
						{ 
							flatten: true
							,expand: true
							,cwd: "dist/tmp/app/js"
							,src: [
								"**"
							]
							,dest:"dist/app/js" 
						}
						,
						
					]
				}
				,app_prod: {
					expand: true,
					//flatten: true,
					files: [
						{ src: ["js/*"], dest:"dist/app/" }
						,{ src: ["css/*","css/**/*"],  dest:"dist/app/" }
						,{ src: ["files/*", "files/**/*"] , dest:"dist/app/" }
						,{ 
							flatten: true
							,expand: true
							,cwd: "dist/tmp/app"
							,src: [
								"**"
							]
							,dest:"dist/app" 
						}
						,
						{ 
							flatten: true
							,expand: true
							,cwd: "dist/tmp/app/js"
							,src: [
								"**"
							]
							,dest:"dist/app/js" 
						}
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
							,cwd: "dist/tmp/web/html"
							,src: [
								"**"
							]
							,dest:"dist/web/html" 
						}
						,
						{ 
							flatten: true
							,expand: true
							,cwd: "dist/tmp/web/js"
							,src: [
								"**"
							]
							,dest:"dist/web/js" 
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
						,{ src: ["js/lightbox/*", "js/lightbox/**/*"] , dest:"dist/web/" }
					]
				}
				,server_prod: {
					expand: true,
					files: [
						{ 
							flatten: true
							,expand: true
							,cwd: "dist/tmp/server/server"
							,src: [
								"*"
							]
							,dest:"dist/server" 
						}
						,
						{ 
							flatten: true
                            ,expand: true
							,src: [
								"dist/tmp/server/js/clLib.emulateBrowser.js", 
								"dist/tmp/server/js/clLib.js", 
								"dist/tmp/server/js/clLib.logging.js", 
								"dist/tmp/server/js/clLib.gradeConfig.js", 
								"!dist/tmp/server/js/_web"
							]
							,dest:"dist/server" 
                        }
						,
					{ 
                          expand: true
                          ,src: ["server/node_modules/*", "server/node_modules/**/*"] 
                          ,dest:"dist" 
                      }
                        ,
                        { 
                            expand: true
                            ,src: ["server/appCertificates/*", "server/appCertificates/**/*"] 
                            ,dest:"dist" 
                        }
                     ]
				}
				,server_dev: {
					expand: true,
					files: [
						{ 
							flatten: true
							,expand: true
							,cwd: "dist/tmp/server/server"
							,src: [
								"*"
							]
							,dest:"dist/server" 
						}
						,
						{ 
							flatten: true
                            ,expand: true
							,src: [
								"dist/tmp/server/js/clLib.emulateBrowser.js", 
								"dist/tmp/server/js/clLib.js", 
								"dist/tmp/server/js/clLib.logging.js", 
								"dist/tmp/server/js/clLib.gradeConfig.js", 
								"!dist/tmp/server/js/_web"
							]
							,dest:"dist/server" 
                        }
						,
					{ 
                          expand: true
                          ,src: ["server/node_modules/*", "server/node_modules/**/*"] 
                          ,dest:"dist" 
                      }
                        ,
                        { 
                            expand: true
                            ,src: ["server/appCertificates/*", "server/appCertificates/**/*"] 
                            ,dest:"dist" 
                        }
                     ]
				}
				,server_local: {
					expand: true,
					files: [
						{ 
							flatten: true
							,expand: true
							,cwd: "dist/tmp/server/server"
							,src: [
								"*"
							]
							,dest:"dist/server" 
						}
						,
						{ 
							flatten: true
                            ,expand: true
							,src: [
								"dist/tmp/server/js/clLib.emulateBrowser.js", 
								"dist/tmp/server/js/clLib.js", 
								"dist/tmp/server/js/clLib.logging.js", 
								"dist/tmp/server/js/clLib.gradeConfig.js", 
								"!dist/tmp/server/js/_web"
							]
							,dest:"dist/server" 
                        }
						,
					{ 
                          expand: true
                          ,src: ["server/node_modules/*", "server/node_modules/**/*"] 
                          ,dest:"dist" 
                      }
                        ,
                        { 
                            expand: true
                            ,src: ["server/appCertificates/*", "server/appCertificates/**/*"] 
                            ,dest:"dist" 
                        }
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
			  ,app_local: {
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
    grunt.registerTask('appdev', ['includereplace:app_dev', 'copy:app_dev']);
    grunt.registerTask('applocal', ['includereplace:app_local', 'copy:app_local']);
    grunt.registerTask('appprod', ['includereplace:app_prod', 'copy:app_prod', 'compress:app_prod']);
    grunt.registerTask('webprod', ['includereplace:web_prod', 'copy:web_prod']);
    grunt.registerTask('webdev', ['includereplace:web_dev', 'copy:web_prod']);
    grunt.registerTask('weblocal', ['includereplace:web_local', 'copy:web_local']);
    grunt.registerTask('serverprod', ['includereplace:server_prod', 'copy:server_prod']);
    grunt.registerTask('serverdev', ['includereplace:server_dev', 'copy:server_dev']);
    grunt.registerTask('serverlocal', ['includereplace:server_local', 'copy:server_local']);

};
