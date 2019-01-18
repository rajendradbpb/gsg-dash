module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            libs: {
                src: [
                    "./plugins/jQuery/jQuery-2.2.0.min.js",
                    "./dist/bootstrap/js/bootstrap.min.js",
                    "./dist/js/app.js",
                    "./dist/js/ext/lodash.js",
                ],
                dest: 'libs.js'
            },
            custom: {
                src: [
                    // "./main_app.js",
                    // "./filter.js",
                    // "./constants.js",
                    // "./modules/*.js",
                    // "./modules/**/*.js",
                    // "./models/*.js",
                    // "./models/**/*.js",
                    // "./controller/*.js",
                    // "./controller/**/*.js",
                    // "./directive/*.js",
                    // "./directive/**/*.js"
                    "./main_app.js",
                    "./filter.js",
                    "./constants.js",
                    "modules/*.js",
                    "modules/**/*.js",
                    "controller/*.js",
                    "controller/**/*.js",
                    "services/*.js",
                    "services/**/*.js",
                    "models/*.js",
                    "models/**/*.js",
                    "directive/*.js",
                    "directive/**/*.js"
                ],
                dest: 'custom.js'
            },
            angular: {
                src: [
                    "./dist/js/angular/angular.js",
                    "./dist/js/angular/angular-animate.js",
                    "./dist/js/angular/ngStorage.min.js",
                    "./dist/js/angular/angular-resource.js",
                    "./dist/js/angular/ng-animate.js",
                    "./dist/js/angular/angular-ui-router.js",
                    "./dist/js/angular/angular-ui-utils.min.js",
                    "./dist/js/angular/ui-bootstrap-tpls-0.14.3.min.js",
                    "./dist/js/angular/ng-table.min.js",
                    "./dist/js/angular/xlsx.core.min.js",
                    "./dist/js/angular/angular-js-xlsx.js",
                    "./dist/js/angular/angular-sanitize.min.js",
                    "./dist/js/date-picker/angular-datepicker.min.js",
                    "./dist/js/date-picker/moment.js",
                    "./plugins/textEditor/textAngular.min.js",

                ],
                dest: 'ng-libs.js'
            },
        },
        uglify: {
            options: {
                mangle: true,
            },
            my_target: {
                files: {
                    'custom.js': ['custom.js'],
                    'libs.js': ['libs.js'],
                    'ng-libs.js': ['ng-libs.js'],
                }
            }
        },
        comments: {
            my_target: {
                options: {
                    singleline: true,
                    multiline: true
                },
                src: ['custom.js', 'libs.js']
            },
        },
        ngAnnotate: {
          options: {

          },
          appannotate: {
              files: {
                  'custom.js': ['custom.js']
              },
          },
        },
        watch: {
            options: {
                livereload: true,
            },
            debug: {
                files: ['./*.js', './**/*.js','./*.html','./**/*.html','!**/built/**','!**//custom.js','!**//libs.js','!**//ng-libs.js'],
                tasks: ['concat', 'comments:my_target', 'ngAnnotate:appannotate',"cssmin:combine"],
                options: {
                    livereload: true
                }
            },
            built: {
                files: ['./dist/css/**','./*.js', './**/*.js','./*.html','./**/*.html','!**/built/**','!**//custom.js','!**//libs.js','!**//ng-libs.js'],
                tasks: ['concat', 'comments:my_target', 'ngAnnotate:appannotate', 'uglify:my_target', "cssmin:combine",'copy:main','htmlmin:dist'],
                options: {
                    livereload: true
                }
            },
            server: {
              files: ['app.js','server/*.js','server/**/*.js'],
              tasks: ['jshint'],
              options: {
                livereload: true,
                spawn: false,
              },
            }
        },
        clean: ["./custom.js","./libs.js","./ng-libs.js","./dist/css/all.css","built"],
        cssmin: {
            combine: {
                files: {
                    './dist/css/all.css': [
                    "./dist/bootstrap/css/bootstrap.min.css",
                    "./dist/css/style.css",
                    "./dist/css/ng-table.min.css",
		    "./dist/css/AdminTamda.css",
                    "./dist/css/skins/_all-skins.css",
                    "./dist/css/font-awesome.min.css",
                    "./dist/js/date-picker/angular-datepicker.min.css",
                    ],
                }
            }
        },
        cachebreaker: {
          dev: {
              options: {
                  match: ['custom.js'],
              },
              files: {
                  src: ['index.html']
              }
          }
        },
        copy:{
          main: {
            files:[
              {
                expand: true,
                cwd:'/',
                src: ['dist/css/all.css','dist/fonts/**','dist/img/**','custom.js','ng-libs.js','libs.js'],
                dest: 'built/'
              }
            ]
          }
        },
        htmlmin: {
            dist: {
              options: {
                removeComments: true,
                collapseWhitespace: true
              },
              files: [{
                expand: true,
                cwd: '/',
                src: ['**/*.html', '*.html'],
                dest: 'built/'
              }]
            }
        },
        // nodemon: {
        //   server: {
        //     script: './bin/www',
        //     tasks: ['watch:server']
        //   }
        // },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-stripcomments');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-cache-breaker');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    // grunt.loadNpmTasks('grunt-nodemon');
    // Default task(s).
    grunt.registerTask('default', ['concat']);
    // grunt.registerTask('default', ['concat','watch:debug']);
    grunt.registerTask('dev', ['clean','concat','ngAnnotate:appannotate','cssmin:combine','comments:my_target','default']);
    grunt.registerTask('built', ['clean','concat','ngAnnotate:appannotate','uglify:my_target','cssmin:combine','copy:main','htmlmin:dist','comments:my_target','cachebreaker:dev','watch:built']);
    // grunt.registerTask('server', ["nodemon:server"]);

};