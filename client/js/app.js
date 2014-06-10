var app = angular.module('childrensFund', ['ui.router', 'ngCookies', 'xeditable', 'angularFileUpload'])

app.run(['editableOptions', function (editableOptions) {
  editableOptions.theme = 'bs3';
}]);

app.config(['$stateProvider','$locationProvider','$urlRouterProvider',function($stateProvider, $locationProvider, $urlRouterProvider){
  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');

  $stateProvider
    // Command + K, Command + 3 to make this intelligible
    //################## Public ROUTES #####################
    .state('root', {
      url: '/',
      templateUrl: '/templates/public/home.html',
      controller: 'donorController'
      // controller: 'childController'
    })

    .state('pledge', {
      url: '^/pledge',
      templateUrl: '/templates/public/pledge.html',
      controller: 'pledgeController'
    })

    .state('donationSubmitted', {
      url: '/submitted',
      templateUrl: '/templates/public/donationSubmitted.html',
      controller: 'pledgeController'
    })

    .state('404', {
      url: '/404',
      templateUrl: '/templates/public/404.html'
    })
    //################## Worker ROUTES #####################
    .state('workers', {
      abstract: true,
      template: '<ui-view/>',
      data: { userType: 'workers' }
    })
      .state('workers.account', {
        url: '/workers',
        templateUrl: '/templates/workers/account.html',
        resolve: {
          auth: ['$q', '$state', 'protect', function($q, $state, protect){
            var deferred = $q.defer();
            protect('workers').then(function(authorized){
              if(authorized) {
                deferred.resolve();
              } else {
                deferred.reject();
                $state.go('workers.signin');
              }
            })
            return deferred.promise;
          }]
        },
        controller: ['$state', function($state){
          $state.go('workers.account.myAccount');
          }]
      })
      .state('workers.account.myAccount', {
        url:'/myAccount',
        templateUrl: '/templates/workers/myAccount.html',
        controller: 'workerController'
      })
      .state('workers.account.create', {
        url: '/create',
        templateUrl: '/templates/workers/createChildTag.html',
        controller: 'workerController'
      })
      .state('workers.account.myTags', {
        url: '/myTags',
        templateUrl: '/templates/workers/childrenFeed.html',
        controller: 'workerController'
      })
      .state('workers.signup', {
        url: '/workers/signup',
        templateUrl: '/templates/authentication/signupView.html',
        resolve: {
          authenticate: ['$http', '$q', '$state', function($http, $q, $state){
            var deferred = $q.defer();

            $http({
              method: 'GET',
              url: '/auth/toggle'
            }).then(function(data){
              if(data.data.access){
                deferred.resolve();
              } else {
                deferred.reject();
                $state.go('workers.signin');
              }
            })

            return deferred.promise;
          }]
        },
        controller: 'authController'
      })
      .state('workers.signin', {
        url: '/workers/signin',
        templateUrl: '/templates/authentication/signinView.html',
        controller: 'authController'
      })
      .state('workers.sendReset', {
        url: '/workers/send_reset',
        templateUrl: '/templates/authentication/sendResetView.html',
        controller: 'authController'
      })
      .state('workers.resetPassword', {
        url: '/workers/reset_password/:resetToken',
        templateUrl: '/templates/authentication/resetPasswordView.html',
        controller: 'authController'
      })
      .state('workers.signout', {
        template: '<ui-view/>',
        controller: 'signoutController'
      })
    //################## Admin ROUTES #####################
    .state('admin', {
      abstract: true,
      template: '<ui-view/>',
      data: { userType: 'admin' }
    })
      .state('admin.account', {
        url: '/admin',
        templateUrl: '/templates/admin/account.html',
        resolve: {
          auth: ['$q', '$state', 'protect', function($q, $state, protect){
            var deferred = $q.defer();
            protect('admin').then(function(authorized){
              if(authorized) {
                deferred.resolve();
              } else {
                deferred.reject();
                $state.go('admin.signin');
              }
            })
            return deferred.promise;
          }]
        }
      })
        .state('admin.account.children', {
          url: '/children',
          controller: 'adminController',
          templateUrl: '/templates/admin/children.html'
        })
        .state('admin.account.workers', {
          url: '/workers',
          controller: 'adminController',
          templateUrl: '/templates/admin/workers.html'
        })
        .state('admin.account.reports', {
          url: '/reports',
          controller: 'adminController',
          templateUrl: '/templates/admin/reports.html'
        })
        .state('admin.account.accountManagement', {
          abstract: true,
          url: '/manage',
          template: '<ui-view/>',
          controller: 'usersController'
        })
          .state('admin.account.accountManagement.create', {
            url: '/create',
            templateUrl: '/templates/admin/account/create.html',
            controller: 'authController'
          })
          .state('admin.account.accountManagement.workers', {
            url: '/workers',
            templateUrl: '/templates/admin/account/users.html',
            controller: 'usersController'
          })
          .state('admin.account.accountManagement.admin', {
            url: '/admin',
            templateUrl: '/templates/admin/account/users.html',
            controller: 'usersController'
          })
          .state('admin.account.accountManagement.helpDesk', {
            url: '/help_desk',
            templateUrl: '/templates/admin/account/users.html',
            controller: 'usersController'
          })
      .state('admin.signin', {
        url: '/admin/signin',
        templateUrl: '/templates/authentication/signinView.html',
        controller: 'authController'
      })
      .state('admin.sendReset', {
        url: '/admin/send_reset',
        templateUrl: '/templates/authentication/sendResetView.html',
        controller: 'authController'
      })
      .state('admin.resetPassword', {
        url: '/admin/reset_password/:resetToken',
        templateUrl: '/templates/authentication/resetPasswordView.html',
        controller: 'authController'
      })
      .state('admin.signout', {
        template: '<ui-view/>',
        controller: 'signoutController'
      })
    //################## Help Desk ROUTES #####################
    .state('helpDesk', {
      abstract: true,
      template: '<ui-view/>',
      data: { userType: 'helpDesk' }
    })
      .state('helpDesk.account', {
        url: '/help_desk',
        templateUrl: '/templates/helpDesk/account.html',
        resolve: {
          auth: ['$q', '$state', 'protect', function($q, $state, protect){
            var deferred = $q.defer();
            protect('helpDesk').then(function(authorized){
              if(authorized) {
                deferred.resolve();
              } else {
                deferred.reject();
                $state.go('helpDesk.signin');
              }
            })
            return deferred.promise;
          }]
        },
        controller: 'authController'
      })
        .state('helpDesk.account.accountManagement', {
          abstract: true,
          template: '<ui-view/>',
          controller: 'usersController'
        })
          .state('helpDesk.account.accountManagement.create', {
            url: '/create',
            templateUrl: '/templates/helpDesk/account/create.html',
            controller: 'authController'
          })
          .state('helpDesk.account.accountManagement.workers', {
            url: '/workers',
            templateUrl: '/templates/helpDesk/account/users.html',
            controller: 'usersController'
          })
          .state('helpDesk.account.accountManagement.admin', {
            url: '/admin',
            templateUrl: '/templates/helpDesk/account/users.html',
            controller: 'usersController'
          })
          .state('helpDesk.account.accountManagement.helpDesk', {
            url: '/help_desk',
            templateUrl: '/templates/helpDesk/account/users.html',
            controller: 'usersController'
          })
      .state('helpDesk.signin', {
        url: '/help_desk/signin',
        templateUrl: '/templates/authentication/signinView.html',
        controller: 'authController'
      })
      .state('helpDesk.sendReset', {
        url: '/help_desk/send_reset',
        templateUrl: '/templates/authentication/sendResetView.html',
        controller: 'authController'
      })
      .state('helpDesk.resetPassword', {
        url: '/help_desk/reset_password/:resetToken',
        templateUrl: '/templates/authentication/resetPasswordView.html',
        controller: 'authController'
      })
      .state('helpDesk.signout', {
        template: '<ui-view/>',
        controller: 'signoutController'
      })

}]);