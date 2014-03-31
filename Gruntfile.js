module.exports = function(grunt) {
grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		includereplace: {
			your_target: {
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
			your_target: {
				expand: true,
				//flatten: true,
				files: [
					{ src: ["js/*", "js/**/*"], dest:"dist/" },
					{ src: ["css/*","css/**/*"],  dest:"dist/" },
					{ src: ["files/*", "files/**/*"] , dest:"dist/" },
				]
			}
		},
});

    grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['includereplace', 'copy']);

};
