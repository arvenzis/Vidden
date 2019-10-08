module.exports = function(grunt) {
    const sass = require('node-sass');

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: {
            first: ['dist/'],
            last: ['dist/js/*.vue.js', 'dist/js/bundle.js']
        },
        sass: {
            options: {
                implementation: sass
            },
            dist: {
                files: {
                    'dist/css/vidden.css': 'assets/css/scss/style.scss'
                }
            },
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
                files: 'assets/js/**/*.vue',
                tasks: ['clean:first', 'vueify', 'browserify', 'uglify', 'clean:last'],
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
                       ['dist/js/bundle.js']
                    ],
                }
            }
        },
        browserify: {
            dist: {
                files: {
                    'dist/js/bundle.js': ['assets/js/app.js', 'dist/js/**/*.js']
                },
                options: {
                    transform: ["babelify", "vueify"]
                }
            }
        },
        babel: {
            "presets": ["vueify"]
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

    grunt.registerTask('build', ['clean:first', 'sass', 'vueify', 'browserify', 'uglify', 'clean:last']);
};