module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';\n'
      },
      app: {
        src: ["client/js/cookies.js",
              "client/js/app.js",
              "client/js/controllers/appController.js",
              "client/js/controllers/donorController.js",
              "client/js/controllers/usersController.js",
              "client/js/controllers/adminController.js",
              "client/js/controllers/authController.js",
              "client/js/controllers/signoutController.js",
              "client/js/controllers/workerController.js",
              "client/js/controllers/pledgeController.js",
              "client/js/controllers/imageController.js",
              "client/js/factories/restful.js",
              "client/js/factories/oneTimeAuthorization.js",
              "client/js/factories/sessionCache.js",
              "client/js/factories/protect.js",
              "client/js/factories/signout.js",
              "client/js/services/childObjSaver.js",
              "client/js/services/sanitize.js",
              "client/js/services/randNum.js"],
        dest: 'client/js/compiled/resources.js'
      },
      bower: {
        src: ["client/bower_components/jquery/dist/jquery.min.js",
              "client/bower_components/bootstrap/dist/js/bootstrap.min.js",
              "client/bower_components/ng-file-upload/angular-file-upload-shim.js", 
              "client/bower_components/angular/angular.js",
              "client/bower_components/ng-file-upload/angular-file-upload.js", 
              "client/bower_components/underscore/underscore.js",
              "client/bower_components/angular-route/angular-route.js",
              "client/bower_components/angular-cookies/angular-cookies.js",
              "client/bower_components/angular-ui-router/release/angular-ui-router.js",
              "client/bower_components/angular-xeditable/dist/js/xeditable.js"
        ],
        dest: 'client/js/compiled/dependencies.js'
      },
      all: {
        src: ["client/js/compiled/dependencies.js",
              "client/js/compiled/resources.js"],
        dest: 'client/js/compiled/application.js'
      }
    },

    nodemon: {
      dev: {
        script: 'server/server.js'
      },
      options: {
       ignore: ['node_modules/**']
      }
    },

    uglify: {
      app: {
        files: {
          'client/js/compiled/resources.js': ['<%= concat.app.dest %>']
        }
      },
      bower: {
        files: {
          'client/js/compiled/dependencies.js': ['<%= concat.bower.dest %>']
        }
      }
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'client/app.js',
          'client/*.html',
          'client/templates/*.html'
        ],
        tasks: [
          // 'concat',
          // 'uglify'
        ]
      },
      css: {
        // files: 'public/*.css',
        // tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        // command : 'git push azure master'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });


  grunt.registerTask('server-prod', function (target) {
    // Running nodejs in a different process and displaying output on the main console

    grunt.task.run([ 'build' ]);
    // grunt.task.run([ 'shell' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('build', ['concat:app', 'concat:bower' ,'uglify:app', 'uglify:bower', 'concat:all']);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.log.write('prod')
      // add your production server task here
      grunt.task.run([ 'server-prod' ]);
    } else {
      grunt.log.write('dev');
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
  ]);

  grunt.registerTask('default',[
  ]);


};
