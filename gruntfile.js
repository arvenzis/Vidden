module.exports = function(grunt) {
    const sass = require('node-sass');

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        browserify: {
            bundle: {
                src: './assets/js/index.js',
                dest: './dist/js/bundle.min.js'
            },
            options: {
                browserifyOptions: {
                    debug: true
                },
                transform: ["babelify", "vueify"]

            }
        },
        sass: {
            options: {
                implementation: sass
            },
            dist: {
                files: {
                    'dist/css/vidden.min.css': 'assets/css/scss/style.scss'
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
                files: ['assets/js/**/*.vue', 'assets/js/**/*.js'],
                tasks: ['browserify'],
                options: {
                    livereload: true,
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('node-sass');

    grunt.registerTask('build', function() {
        grunt.task.run('browserify');
        grunt.task.run('sass');
    });
};