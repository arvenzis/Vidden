module.exports = function(grunt) {
  const sass = require('node-sass');
  var envify = require('envify/custom')
  require('load-grunt-tasks')(grunt);
  

  browserify: {
    dist: {
      options: {
        // Function to deviate from grunt-browserify's default order
        configure: b => b
          .transform('vueify')
          .transform(
            // Required in order to process node_modules files
            { global: true },
            envify({ NODE_ENV: 'production' })
          )
          .bundle()
      }
    }
  }

    grunt.initConfig({
        browserify: {
            bundle: {
                src: './assets/js/app.js',
                dest: './dist/js/bundle.min.js'
            },
            options: {
                browserifyOptions: {
                    debug: true
                },
                transform: ["babelify", "vueify"]

             },
             resolve: {
                alias: {
                  vue: process.env.NODE_ENV != 'production' ? 'vue/dist/common.prod.js' : 'vue/dist/common.dev.js'
                }
             }
        },
        sass: {
            options: {
                implementation: sass
            },
            dist: {
                files: {
                    './dist/css/vidden.min.css': './assets/css/scss/style.scss'
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
