var app = angular.module('childrensFund', ['ui.router', 'ngCookies'])

app.config(function($stateProvider, $locationProvider, $urlRouterProvider){
  $locationProvider.html5Mode(true);

  //Protect the donor/worker/admin account pages
  // $urlRouterProvider.when(/^\/account$|^\/workers$|^\/admin$/, function($match, $state, protect, $q){
  //   console.log('regex caught');
  //   var user;
  //   $match[0] === '/account' ? user = 'donors' : user = $match[0].substring(1);
  //   protect(user).then(function(authorized){
  //     authorized ? $state.go(user + '.account') : $state.go(user + '.signin');
  //   });
  // });

  $urlRouterProvider.otherwise('/404');

  $stateProvider
    // Command + K, Command + 3 to make this intelligible
    //################## Public ROUTES #####################
    .state('home', {
      url: '/',
      templateUrl: '/templates/public/home.html '
    })
    .state('cart', {
      url: '/cart',
      templateUrl: '/templates/public/cart.html'
    })
    .state('children', {
      url: '/childrens',
      templateUrl: '/templates/public/children.html'
    })
    .state('child', {
      url: '/child',
      templateUrl: '/templates/public/child.html'
    })
    .state('404', {
      url: '/404',
      templateUrl: '/templates/public/404.html'
    })
    //################## Donor ROUTES #####################
    .state('donors', {
      abstract: true,
      template: '<ui-view/>',
      data: { userType: 'donors' }
    })
      .state('donors.account', {
        url: '/account',
        templateUrl: '/templates/donors/account.html',
        resolve: {
          auth: function($q, $state, protect){
            var deferred = $q.defer();
            protect('donors').then(function(authorized){
              if(authorized) {
                deferred.resolve();
              } else {
                deferred.reject();
                $state.go('donors.signin');
              }
            })
            return deferred.promise;
          }
        }
      })
      .state('donors.signup', {
        url: '/signup',
        templateUrl: '/templates/authentication/signupView.html',
        controller: 'authController'
      })
      .state('donors.signin', {
        url: '/signin',
        templateUrl: '/templates/authentication/signinView.html',
        controller: 'authController'
      })
      .state('donors.sendReset', {
        url: '/send_reset',
        templateUrl: '/templates/authentication/sendResetView.html',
        controller: 'authController'
      })
      .state('donors.resetPassword', {
        url: '/reset_password',
        templateUrl: '/templates/authentication/passwordResetView.html',
        controller: 'authController'
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
        url: '/workers/reset_password',
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
        url: '/admin/reset_password',
        templateUrl: '/templates/authentication/sendResetView.html',
        controller: 'authController'
      })

});

// ui-router configuration
// app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
//   $urlRouterProvider.otherwise('/');

//   $stateProvider
//   // root view is for donors
//   .state('/', {
//     url: '/',
//     views: {
//       navMenuView: { templateUrl: '/templates/developerViews/navMenu.html'},
//       firstView: { templateUrl: 'templates/userViews/donorView.html', controller: 'inputController' },
//       secondView: { templateUrl: 'templates/userViews/donorChildrenFeedView.html', controller: 'inputController' }
//     }
//   })

//   // view for workers (nav bar, input field and list of children)
//   .state('workersPortal', {
//     url: '/workers',
//     views: {
//       navMenuView: { templateUrl: '/templates/developerViews/navMenu.html'},
//       firstView: { templateUrl: 'templates/userViews/workerView.html', controller: 'inputController' },
//       secondView: { templateUrl: 'templates/userViews/workerChildrenFeedView.html', controller: 'inputController' }
//     }
//   })

//   // view for workers to create a new child tag
//   .state('createTag', {
//     url: '/create',
//     views: {
//       navMenuView: { templateUrl: '/templates/developerViews/navMenu.html'},
//       firstView: { templateUrl: 'templates/userViews/workerChildInputView.html', controller: 'inputController' }
//     }
//   })

//   //Authentication Handlers
//   .state('signup', {
//     url: '/{userType:donors|workers|admin}/signup',
//     views: {
//       navMenuView: { templateUrl: '/templates/developerViews/navMenu.html' },
//       firstView: { templateUrl: 'templates/authentication/signupView.html', controller: 'authController' }
//     }
//   })

//   .state('signin', {
//     url: '/{userType:donors|workers|admin}/signin',
//     views: {
//       navMenuView: { templateUrl: '/templates/developerViews/navMenu.html' },
//       firstView: { templateUrl: 'templates/authentication/signinView.html', controller: 'authController' }
//     }
//   })

//   .state('signout', {
//     url: '/{userType:donors|workers|admin}/signout',
//     views: {
//       navMenuView: { templateUrl: '/templates/developerViews/navMenu.html' },
//       firstView: { templateUrl: 'templates/authentication/signoutView.html', controller: 'authController' }
//     }
//   })

//   .state('sendReset', {
//     url: '/{userType:donors|workers|admin}/send_reset',
//     views: {
//       navMenuView: { templateUrl: '/templates/developerViews/navMenu.html' },
//       firstView: { templateUrl: 'templates/authentication/sendResetView.html', controller: 'authController' }
//     }
//   })

//   .state('resetPassword', {
//     url: '/{userType:donors|workers|admin}/reset_password/:resetToken',
//     views: {
//       navMenuView: { templateUrl: '/templates/developerViews/navMenu.html' },
//       firstView: { templateUrl: 'templates/authentication/resetView.html', controller: 'authController' }
//     }
//   })
//   //End Authentication Handlers

// }])





/*

temporary object
{
  child: {
    firstName: 'Amar',
    lastName: 'Patel',
    phone: '19166008929',
    gender: 'male',
    dob: 'my birthday',
    age: 24,
    location: 'San Francisco',
    CFID: '00001A',
    programArea: 'somewhere',
    bio: 'Amar hails from a heritage of awesome and bad-assery.'
  },

  request: {
    createdAt: 'dateString',
    items: [
      {
        item: 'bike', 
        status: null, 
        price: null, 
        paymentDate: 'somedate',
        hsaReceivedDate: 'somedate',
        childReceivedDate: 'somedate'
      },
      {
        item: 'helmet', 
        status: null, 
        price: null, 
        paymentDate: 'somedate',
        hsaReceivedDate: 'somedate',
        childReceivedDate: 'somedate'
      },
      {
        item: 'babes', 
        status: null, 
        price: null, 
        paymentDate: 'somedate',
        hsaReceivedDate: 'somedate',
        childReceivedDate: 'somedate'
      }
    ]
  },

  worker: {
    accountID: 'string',
    firstName: 'Wayland',
    lastName: 'Gangsta-fresh',
    phone: '12903812124',
    email: 'someemail',
    department: 'someDept',
    supervisorFirstName: 'Marcus',
    supervisorLastName: 'Phillips',
    coordinatorFirstName: 'Tony',
    coordinatorLastName 'Phillips'
  },

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
};

*/


// This module when invoked will see if the user is signed in and authorized to view the page. It returns a promise
/* Valid parameters for protect = 'workers', 'donors', 'admin'
  protect('donors').success(function(status){
    if(status === false){
      //User is not authorized, redirect to signin page
    } else {
      //User is authorized, serve normal page
    }
  });

*/