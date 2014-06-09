module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
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
      dist: {
        files: {
          'client/js/compiled/application.js': ['<%= concat.dist.dest %>']
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

  grunt.registerTask('build', ['concat','uglify']);

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
