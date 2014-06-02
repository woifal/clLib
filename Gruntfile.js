module.exports = function(grunt) {
grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		includereplace: {
			dev: {
				options: {
					flatten: true
				// Task-specific options go here.
				},
				// Files to perform replacements and includes with
				src: ['*.html'],
				// Destination directory to copy files to
				dest: 'dist/'
			}
			,prod: {
				options: {
					flatten: true
				// Task-specific options go here.
				},
				// Files to perform replacements and includes with
				src: ['*.html'],
				// Destination directory to copy files to
				dest: 'dist/'
			}
		},
		copy: {
			dev: {
				expand: true,
				//flatten: true,
				files: [
					{ src: ["js/*", "js/**/*"], dest:"dist/" }
					,{ src: ["js/*"], dest:"dist/" }
				]
			}
			, prod: {
				expand: true,
				//flatten: true,
				files: [
					{ src: ["js/*", "js/**/*"], dest:"dist/" }
					,{ src: ["js/*"], dest:"dist/" }
					,{ src: ["css/*","css/**/*"],  dest:"dist/" }
					,{ src: ["files/*", "files/**/*"] , dest:"dist/" }
				]
			}
		},
});

    grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('dev', ['includereplace:dev', 'copy:dev']);
    grunt.registerTask('prod', ['includereplace:prod', 'copy:prod']);

};
