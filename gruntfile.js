module.exports = function(grunt) {
    const sass = require('node-sass');

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: ['dist/'],
        browserify: {
            src: {
                files: {
                    './dist/js/bundle.min.js' : './assets/js/app.js'
                },
                options: {
                    debug: true,
                    transform: ["babelify", "vueify"]
                } 
            },
            dist: {
                files: {
                    './dist/js/bundle.min.js' : './assets/js/app.js'
                },
                options: {
                    transform: ["envify", "vueify", "babelify", "uglifyify"]
                } 
            }
        },
        sass: {
            options: {
                implementation: sass
            },
            src: {
                files: {
                    './dist/css/vidden.min.css': './assets/css/scss/style.scss'
                }
            },
            dist: {
                files: {
                    './dist/css/vidden.min.css': './assets/css/scss/style.scss'
                },
                options: {
                    outputStyle: 'compressed'
                }
            }            
        },
        concat: {
            dist: {
                src: ['./node_modules/bootstrap/dist/css/bootstrap.min.css',
                      './node_modules/vue-popperjs/dist/vue-popper.css',
                      './node_modules/vue-search-select/dist/VueSearchSelect.css'],
                dest: './dist/css/plugins.min.css'
            }
        },
        watcher: {
            css: {
                files: 'assets/css/**/*.scss',
                tasks: ['sass:src'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['assets/js/**/*.vue', 'assets/js/**/*.js'],
                tasks: ['browserify:src'],
                options: {
                    livereload: true,
                },
            },
        },
        env: {
            prod: {
                NODE_ENV: 'production',
                DEST: 'dist'
            }
        }
    });

    grunt.registerTask('build-dev', ['browserify:src', 'sass:src', 'concat']);
    grunt.registerTask('build', ['clean','env:prod', 'browserify:dist', 'sass:dist', 'concat'])
};