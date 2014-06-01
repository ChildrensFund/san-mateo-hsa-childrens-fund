var app = angular.module('childrensFund', ['ui.router', 'ngCookies', 'xeditable', 'lr.upload'])

app.run(function (editableOptions) {
  editableOptions.theme = 'bs3';
});

app.config(function($stateProvider, $locationProvider, $urlRouterProvider){
  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/404');

  $stateProvider
    // Command + K, Command + 3 to make this intelligible
    //################## Public ROUTES #####################
    .state('root', {
      url: '/',
      templateUrl: '/templates/public/home.html',
      controller: 'childController'
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
          auth: function($q, $state, protect){
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
          }
        }
      })
      .state('workers.account.myAccount', {
        url:'/myAccount',
        templateUrl: '/templates/workers/myAccount.html',
        controller: 'workerController'
      })
      .state('workers.account.create', {
        url: '/create',
        templateUrl: '/templates/workers/createChildTag.html',
        controller: 'childController'
      })
      .state('workers.account.myTags', {
        url: '/myTags',
        templateUrl: '/templates/workers/childrenFeed.html',
        controller: 'childController'
      })
      .state('workers.signup', {
        url: '/workers/signup',
        templateUrl: '/templates/authentication/signupView.html',
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
          auth: function($q, $state, protect){
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
          }
        }
      })
        .state('admin.account.accountManagement', {
          abstract: true,
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
      .state('admin.signup', {
        url: '/admin/signup',
        templateUrl: '/templates/authentication/signupView.html',
        controller: 'authController'
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
          auth: function($q, $state, protect){
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
          }
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
      .state('helpDesk.signup', {
        url: '/help_desk/signup',
        templateUrl: '/templates/authentication/signupView.html',
        controller: 'authController'
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

});


/*
// CURRENT MASTER OBJ (as of 5/30 @ 13:30)
{
  child: {
    createdAt: 'dateString',
    workerAccountID: 'someString',  // contains worker's account information (IE: supervisor name, coordinator name, department, etc.)
    firstName: 'Amar',
    lastName: 'Patel',
    phone: '19166008929',
    gender: 'male',
    dob: 'my birthday',
    age: 24,
    location: 'San Francisco',
    CFID: '00001A',
    programArea: 'somewhere',
    bio: 'Amar hails from a heritage of awesome and bad-assery.',
    items: [
      {
        item: 'bike', 
        price: 'number',
        hsaReceivedDate: 'somedate',
        childReceivedDate: 'somedate'
      },
      {
        item: 'helmet', 
        price: 'number',
        hsaReceivedDate: 'somedate',
        childReceivedDate: 'somedate'
      },
      {
        item: 'babes', 
        price: 'number',
        hsaReceivedDate: 'somedate',
        childReceivedDate: 'somedate'
      }
    ],
    status: null,
    donor: {
      firstName: 'amar',
      lastName: 'patel',
      phone: '9166008929',
      email: 'someemail',
      address1: '1221 1st ave.',
      address2: 'apt se1801',
      city: 'seattle',
      state: 'washington',
      zip: '98101'
    }
  }
};

*/