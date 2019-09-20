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
        watcher: {
            css: {
                files: 'assets/css/**/*.scss',
                tasks: ['sass'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: 'assets/js/**/*.js',
                tasks: ['uglify'],
                options: {
                    livereload: true,
                },
            }
        },
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

    grunt.registerTask('build', ['sass', 'uglify']);

};