module.exports = function (grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        antdeploy: {
            options: {},
            // specify one deploy target
            dev1: {
                options: {
                    user: 'alberto.garcia@garp.com.' + process.env.SANDBOX_ENV,
                    pass: 'sfdc2013AG',
                    token: '',
                    serverurl: 'https://test.salesforce.com' // default => https://login.salesforce.com
                },
                pkg: {
                    staticresource: ['*']
                }
            }
        },
        compress: {
            main: {
                options: {
                    mode: 'zip',
                    archive: 'build/staticresources/reportsGARP_dl.resource'
                },
                files: [
                    {
                        src: ['data/**', 'fonts/**', 'css/**', 'img/**', 'data/**', 'js/**', 'less/**', 'partials/**']
                    }
                ]
            }
            /*,
            lib: {
                options: {
                    mode: 'zip',
                    archive: 'build/staticresources/reportsGARP.resource.lib'
                },
                files: [
                    {
                        src: ['lib/**']
                    }
                ]
            }*/
        },
        antretrieve: {
            options: {
                maxpoll: "20"
            },
            // specify one deploy target
            dev1: {
                options: {
                    user: 'alberto.garcia@garp.com' + process.env.SANDBOX_ENV,
                    pass: 'sfdc2013AG',
                    token: '',
                    serverurl: 'https://test.salesforce.com' // default => https://login.salesforce.com
                },
                pkg: {
                    staticresource: ['*']
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ['less'],
                    compress: true
                },
                files: {
                    'css/global_variables.css': 'less/global_variables.less',
                    'css/login.css': 'less/login.less',
                    'css/sfdcApp.css': 'less/sfdcApp.less',
                    'css/sfdcApp2.css': 'less/sfdcApp2.less',
                    'css/print.css': 'less/print.less',
                    'css/login.css': 'less/login.less',
                    'css/nav_styles.css': 'less/nav_styles.less',
                    'css/nav_tablet.css': 'less/nav_tablet.less',                    
                    'css/nav_styles_public.css': 'less/nav_styles_public.less',                                                                                              
                    'css/registration.css': 'less/registration.less'                         
                }
            }
        },
        watch: {
            js: {
                files: ['gruntfile.js', 'server.js', 'js/**', 'test/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true,
                },
            },
            html: {
                files: ['views/**', 'index.html'],
                options: {
                    livereload: true,
                },
            },
            css: {
                files: ['less/**'],
                tasks: ['less'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: {
                src: ['gruntfile.js', 'server.js', 'js/controllers/*.js', 'js/services/*.js', 'js/app.js', 'js/config.js', 'js/init.js'],
                options: {
                    jshintrc: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: [],
                    ignore: ['public/**'],
                    ext: 'js',
                    nodeArgs: ['--debug'],
                    delayTime: 1,
                    env: {
                        PORT: 8080
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch', 'concat', 'uglify'],
            options: {
                logConcurrentOutput: true
            }
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        protractor: {
            options: {
                keepAlive: true,
                configFile: 'test/protractor/config.protractor.js'
            },
            run: {},
            your_target: {
                options: {
                    configFile: 'test/protractor/config.protractor.js', // Target-specific config file
                    args: {} // Target-specific arguments
                }
            }
        },
        karma: {
            dev: {
                configFile: 'test/karma/karma.conf.js',
                runnerPort: 9876,
                singleRun: true,
                browsers: ['PhantomJS', 'Firefox', 'Chrome']
            },
            unit: {
                configFile: 'test/karma/karma.conf.js',
                runnerPort: 9876,
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        concat: {
            mean_min: {
                options: {
                    // Replace all 'use strict' statements in the code with a single one at the top
                    banner: "'use strict';\n",
                    process: function (src, filepath) {
                        return '// Source: ' + filepath + '\n' +
                            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                },
                src: ['js/init.js', 'js/app.js', 'js/config.js', 'js/controllers/*.js', 'js/services/*.js', 'js/directives.js'],
                dest: 'build/js/garp.js'
            },
            library: {
                src: ['lib/angular/angular.js', 'lib/angular-charlimit-master/build/igCharLimit.js',
                    'lib/angular/angular-animate.js', 'lib/angular/angular-cookies.js', 'lib/angular/angular-resource.js', 'lib/angular/angular-ui-router.js', 'lib/angular/ngStorage.js',
                    'lib/angular-bootstrap/ui-bootstrap.js', 'lib/angular-translate/angular-translate.min.js', 'lib/angular-chart/Chart.js/Chart.min.js','lib/angular-chart/angular-chart.js'
                ],
                dest: 'all.js'
            }
        },
        uglify: {
            garp_min: {
                files: {
                    'build/js/garp.min.js': ['build/js/garp.js']
                }
            },
            lib_min: {
                files: {
                    'build/lib/all.min.js': ['build/lib/all.js']
                }
            }
        }
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-git-deploy');
    grunt.loadNpmTasks('grunt-ant-sfdc');
    grunt.loadNpmTasks('grunt-contrib-compress');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['jshint', 'concurrent', 'compress', 'antdeploy']);

    //Test task.
    grunt.registerTask('e2e-test', ['protractor:run']);
    grunt.registerTask('unit-test', ['karma:unit']);
    grunt.registerTask('unit-test-multi', ['karma:dev']);
    grunt.registerTask('sfdc-push', ['compress:main'/*,'compress:lib'*/]);

};