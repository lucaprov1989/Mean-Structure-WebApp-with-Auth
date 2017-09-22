module.exports = function(grunt) {

  grunt.initConfig({
    cssmin: {
        combine: {
            files: {
                'app.css': [
                    'gestionale/bower_components/angular-material/angular-material.css',
                    'gestionale/bower_components/angular-chart.js/dist/angular-chart.min.css',
                    'styles/styles.css'
                ]
            }
        }
    },
    sass: {
        webapp: {
          files: {
            'styles/styles.css': 'styles/styles.scss'
          }
        }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
    
  grunt.registerTask('build', ['sass:webapp','cssmin']);
};