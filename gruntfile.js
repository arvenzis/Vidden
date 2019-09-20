module.exports = function(grunt) {
    const sass = require('node-sass');

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        sass: {
            options: {
                implementation: sass
            },
            dist: {
                files: {
                    'dist/css/vidden.css': 'assets/css/scss/style.scss'
                }
            }
        },
        // watch: {
        //     options: {
        //         livereload: true
        //     },
        //
        //     sass: {
        //         options: {
        //             implementation: sass
        //         },
        //         dist: {
        //             files: {
        //                 'dist/css/style.css': 'assets/css/scss/style.scss'
        //             }
        //         }
        //     },
        //
        //     font: {
        //         files: ['assets/fonts/**'],
        //         tasks: ['clean:fonts', 'copy']
        //     },
        //
        // },
        uglify: {
            options: {
                preserveComments: false
            },
            dist: {
                files: {
                    'dist/js/vidden.min.js': [
                        'assets/js/**/*.js'
                    ],
                }
            }
        },
    });

    // grunt.registerTask('watch', ['watch']);

    grunt.registerTask('build', ['sass', 'uglify']);

};