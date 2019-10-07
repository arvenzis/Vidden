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
                files: ['assets/js/components/*.js', 'assets/js/*.js'],
                tasks: ['uglify'],
                options: {
                    livereload: true,
                },
            },
            vueify: {
                files: ['assets/js/components/**/*.vue'],
                tasks: ['vueify'],
                options: {
                    livereload: true,
                },
            },
        },
        uglify: {
            options: {
                preserveComments: false
            },
            dist: {
                files: {
                    'dist/js/vidden.min.js': [
                       ['assets/js/components/*.js', 'assets/js/*.js']
                    ],
                }
            }
        },
        vueify: {
            components: {
                files: [
                    {
                        expand: false,
                        src: 'assets/js/components/**/*.vue',
                        dest: 'dist/js/',
                        ext: '.vue.js'
                    }
                ]
            }
        },
    });

    grunt.registerTask('build', ['sass', 'vueify', 'uglify']);

};