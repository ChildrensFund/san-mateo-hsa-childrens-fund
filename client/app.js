var app = angular.module('childrensFund', ['ui.router', 'ngCookies'])

// ui-router configuration
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  // view for nagivation bar
  $stateProvider
    .state('/', {
      url: '/',
      views: {
        navMenuView: { templateUrl: '/templates/navMenu.html'}
      }
    })

  // view for donors (nav bar and list of children with pledge button)
  .state('donorsPortal', {
    url: '/donors',
    views: {
      navMenuView: { templateUrl: 'templates/navMenu.html'},
      middleView: { 
        templateUrl: 'templates/donorView.html',
        controller: 'inputController' 
      }
    }
  })

  // view for workers (nav bar, input field and list of children)
  .state('workersPortal', {
    url: '/workers',
    views: {
      navMenuView: { templateUrl: '/templates/navMenu.html'},
      middleView: { templateUrl: 'templates/workerView.html', controller: 'inputController' }
    }
  })

  //Authentication Handlers
  .state('signup', {
    url: '/{userType:donors|workers|admin}/signup',
    views: {
      navMenuView: { templateUrl: '/templates/navMenu.html' },
      middleView: { templateUrl: 'templates/authentication/signupView.html', controller: 'authController' }
    }
  })

  .state('signin', {
    url: '/{userType:donors|workers|admin}/signin',
    views: {
      navMenuView: { templateUrl: '/templates/navMenu.html' },
      middleView: { templateUrl: 'templates/authentication/signinView.html', controller: 'authController' }
    }
  })

  .state('signout', {
    url: '/{userType:donors|workers|admin}/signout',
    views: {
      navMenuView: { templateUrl: '/templates/navMenu.html' },
      middleView: { templateUrl: 'templates/authentication/signoutView.html', controller: 'authController' }
    }
  })

  .state('sendReset', {
    url: '/{userType:donors|workers|admin}/send_reset',
    views: {
      navMenuView: { templateUrl: '/templates/navMenu.html' },
      middleView: { templateUrl: 'templates/authentication/sendResetView.html', controller: 'authController' }
    }
  })

  .state('resetPassword', {
    url: '/{userType:donors|workers|admin}/reset_password/:resetToken',
    views: {
      navMenuView: { templateUrl: '/templates/navMenu.html' },
      middleView: { templateUrl: 'templates/authentication/resetView.html', controller: 'authController' }
    }
  })
  //End Authentication Handlers
}])

.controller('inputController', ['$scope', 'restful', function ($scope, restful) {
  $scope.post = function () {
    if ($scope.childName && $scope.item1) {
      restful.createChild($scope.childName, $scope.item1).then( function (promise) {
        if (promise) {
          // Clears input fields after GET succeeds
          $scope.childName = '';
          $scope.item1 = '';
          // calls GET after POST is complete
          return $scope.get();
        }
      });
    } else {
      console.log('Invalid Input Values')
    }
  };

  $scope.get = function () {
    restful.getChildren().then(function (promise) {
      if (promise) {
        // sets $scope.children as received server data
        $scope.children = promise.data;
      }
    });
  };

  $scope.pledge = function (childObj, index) {
    // for a given child's item, sets pledged to true
    childObj.childData.items[index].pledged = true;

    // then POSTs it to the server
    restful.updateChild(childObj).then(function (promise) {
      if (promise) {

        //after POST is completed, GETs updated data
          //necessary to updated Pledge/Pledged! buttons
        $scope.get();
      }
    });
  }

  $scope.get();

}])

//Authentication logic
.controller('authController', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams){
  $scope.signup = function(){
    if($scope.password === $scope.passwordConfirmation){
      $http({
        method: 'POST',
        url: '/auth/signup',
        data: {
          userType: $stateParams.userType,
          email: $scope.email,
          password: $scope.password
        }
      }).success(function(data, status){
        console.log('User Created!');
      }).error(function(data, status){
        console.log('User Not Created: Server Error');
      })
    }
  };

  $scope.signin = function(){
    if($scope.password === $scope.passwordConfirmation){
      $http({
        method: 'POST',
        url: '/auth/signin',
        data: {
          userType: $stateParams.userType,
          email: $scope.email,
          password: $scope.password
        }
      }).success(function(data, status){
        console.log('User signed in');
      }).error(function(data, status){
        console.log('User not signed in: Server Error');
      });
    }
  }

  $scope.signout = function(){
    $http({
      method: 'POST',
      url: '/auth/signout',
      data: {
        userType: $stateParams.userType
      }
    }).success(function(data, status){
      console.log('User signed out');
    }).error(function(data, status){
      console.log('User not signed out: Server Error');
    });
  }

  $scope.signedIn = function(){
    $http({
      method: 'POST',
      url: '/auth/signedIn',
      data: {
        userType: $stateParams.userType,
      }
    }).success(function(data, status){
    }).error(function(data, status){
    });
  }

  $scope.sendReset = function(){
    $http({
      method: 'POST',
      url: '/auth/sendReset',
      data: {
        userType: $stateParams.userType,
        email: $scope.email
      }
    }).success(function(data, status){
      console.log('Reset token sent');
    }).error(function(data, status){
      console.log('Reset token not sent: Server Error');
    });
  }

  $scope.resetPassword = function(){
    $http({
      method: 'POST',
      url: 'auth/resetPassword',
      data: {
        userType: $stateParams.userType,
        password: $scope.password,
        resetToken: $stateParams.resetToken
      }
    }).success(function(data, status){
      console.log('Password successfully reset');
    }).error(function(data, status){
      console.log('Password not reset: Server Error');
    });
  }

}])

// GET/POST logic
.factory('restful', ['$http', function ($http) {
  return {
    createChild: function (childName, item1) {
      return $http({
        method: 'POST',
        url: '/children',
        data: { 
          id: Math.floor(Math.random() * 100000), 
          childData: {
            name: childName, 
            items: [
              {
                item: item1,
                pledged: false 
              }
            ]
          }
        },
      }).success(function (data, status) {
        console.log('(Create) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(Create) POST Error! ', data, status);
      });
    },

    updateChild: function (childObj) {
      return $http({
        method: 'POST',
        url: '/children',
        data: childObj
      }).success(function (data, status) {        
        console.log('(Update) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(Update) POST Error! ', data, status);
      });
    },

    getChildren: function () {
      return $http({
        method: 'GET',
        url: '/children'
      }).success(function (data, status) {
        console.log('GET Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('GET Error! ', data, status);
      });
    }
  }
}])

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
.factory('sessionCache', function(){
  var cache = {};
  var sessionCacheService = {};
  sessionCacheService.updateSessionToken = function(sessionToken){
    cache.sessionToken = sessionToken;
  };

  sessionCacheService.updateUserType = function(userType){
    cache.userType = userType;
  };

  sessionCacheService.retrieveSessionToken = function(){
    return cache.sessionToken;
  };

  sessionCacheService.retrieveUserType = function(){
    return cache.userType;
  };
  return sessionCacheService;
})

.factory('protect', ['$cookies', '$q', '$http', 'sessionCache', function($cookies, $q, $http, sessionCache){
  var cookieSessionToken = $cookies.sessionToken;
  var cookieUserType = $cookies.type;
 
  //pageType needs to be 'donors' || 'workers' || 'admin'
  return function(pageType){
    console.log('################ Page is protected, checking login status ################');
    var deferred = $q.defer();
    if(!cookieSessionToken || !cookieUserType || cookieSessionToken === 'j:null' || cookieUserType === 'j:null'){
      console.log('Session token is null');
      deferred.resolve(false);
    } else if (sessionCache.retrieveSessionToken() === cookieSessionToken && sessionCache.retrieveUserType() === cookieUserType) {
      console.log('Cached credentials');
      deferred.resolve(true);
    } else {
      console.log('Client has sessionId cookie, but no sessionId is cached in Angular. Awaiting server verification');
      $http({
        method: 'POST',
        url: '/auth/signedIn',
        data: {
          userType: pageType,
        }
      }).success(function(data, status){
        if(data.signedIn){
          console.log('Client authorized');
          sessionCache.updateSessionToken(cookieSessionToken);
          sessionCache.updateUserType(cookieUserType);
          deferred.resolve(true);
        } else {
          console.log('Client unauthorized');
          deferred.resolve(false);
        }
      }).error(function(){
        console.log('Server error: Preventing client access regardless');
        deferred.resolve(false);
      });
    }
    return deferred.promise;
  }

}])