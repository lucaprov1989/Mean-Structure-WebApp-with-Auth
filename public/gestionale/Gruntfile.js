module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            public: {
                files: ['app/*.js', 'styles/**/*.scss'],
                tasks: ['concat:components', 'concat:webapp', 'uglify:webapp'],
                options: {
                    spawn: false
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            webapp: {
                src: [
                    'app/*.js'
                ],
                dest: 'app.js'
            },
            components: {
                src: [
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-route/angular-route.min.js',
                    'bower_components/angular-aria/angular-aria.min.js',
                    'bower_components/angular-animate/angular-animate.min.js',
                    'bower_components/angular-material/angular-material.min.js',
                    'bower_components/ngstorage/ngStorage.min.js',
                    'bower_components/angular-base64/angular-base64.min.js',
                    'bower_components/angular-filter/dist/angular-filter.min.js',
                    'bower_components/Chart.js/Chart.min.js',
                    'bower_components/Chart.HorizontalBar.js/Chart.HorizontalBar.js',
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/jqvmap/dist/jquery.vmap.min.js',
                    'bower_components/jqvmap/dist/maps/jquery.vmap.world.js',
                    'bower_components/angular-chart.js/dist/angular-chart.js',
                    'bower_components/angular-file-upload/dist/angular-file-upload.min.js'
                ],
                dest: 'components.js'
            }
        },
        uglify: {
            webapp: {
                files: {
                    'app.js': ['app.js']
                },
                options: {
                    mangle: false,
                    preserveComments: 'some'
                }
            }
        },
        html2js: {
            options: {
                // custom options, see below
            },
            webapp: {
                src: ['pages/*.html', 'dialogs/*.html'],
                dest: 'templates.js'
            }
        },
        htmlmin: { // Task
            webapp: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'pages/home.html': 'pages/src/home.html', // 'destination': 'source'
                    'pages/login.html': 'pages/src/login.html'
                    //'dialogs/richiesta_modifica.html': 'dialogs/src/richiesta_modifica.html'
                }
            }
        }
    });

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('build', ['concat:components', 'concat:webapp', 'uglify:webapp', 'htmlmin:webapp', 'html2js:webapp', 'watch:public']);
};
