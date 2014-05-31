// GET/POST logic
app.factory('restful', ['$http', '$cookies', function ($http, $cookies) {
  return {

    postChild: function (childObj) {
      return $http({
        method: 'POST',
        url: '/api/workers/' + $cookies.id + '/children',
        data: childObj
      }).success(function (data, status) {
        console.log('(postChild) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(postChild) POST Error! ', data, status);
      });
    },

    pledgeChild: function (childObj) {
      return $http({
        method: 'POST',
        url: '/api/children/' + childObj.id,
        data: childObj
      }).success(function (data, status) {
        console.log('(pledgeChild) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(pledgeChild) POST Error! ', data, status);
      });
    },

    getChildren: function () {
      return $http({
        method: 'GET',
        url: '/api/workers/' + $cookies.id + '/children',
      }).success(function (data, status) {
        console.log('GET Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('GET Error! ', data, status);
      });
    },

    getWorkersChildren: function () {
      return $http({
        method: 'GET',
        url: '/api/workers/' + $cookies.id + '/children',
      }).success(function (data, status) {
        console.log('(getWorkersChildren) GET Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(getWorkersChildren) GET Error! ', data, status);
      });
    },

    getWorkerData: function () {
      return $http({
        method: 'GET',
        url: '/api/workers/' + $cookies.id
      }).success(function (data, status) {
        console.log('(Worker Data) GET Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(Worker Data) GET Error! ', data, status);
      });
    },

    postWorkerData: function (workerObj) {
      return $http({
        method: 'POST',
        url: '/api/workers/' + $cookies.id,
        data: workerObj
      }).success(function (data, status) {
        console.log('(Worker Data) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(Worker Data) POST Error! ', data, status);
      });
    }

  }
}])

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
  
  //pageType needs to be 'donors' || 'workers' || 'admin' || 'helpDesk'
  return function(pageType){
    var cookieSessionToken = $cookies.sessionToken;
    var cookieUserType = $cookies.type;
    console.log('################ Page is protected, checking login status ################');
    var deferred = $q.defer();
    //Add handling to allow developer to access all portals
    if(cookieUserType === 'developer'){
      console.log('Logged in as developer, granting access');
      deferred.resolve(true);
    } else if(!cookieSessionToken || !cookieUserType || cookieSessionToken === 'j:null' || cookieUserType === 'j:null'){
      console.log('Session token is null');
      deferred.resolve(false);
    } else if (sessionCache.retrieveSessionToken() === cookieSessionToken && sessionCache.retrieveUserType() === cookieUserType && cookieUserType === pageType) {
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
        deferred.reject('There was a server error');
      });
    }
    return deferred.promise;
  }

}])

.factory('signout', function($http, $state, $cookies){
  return function(){
    return $http({
      method: 'POST',
      url: '/auth/signout'
    }).success(function(){
      console.log('User signed out');
      // $cookies.sessionToken = undefined;
      // $cookies.type = undefined;
      // $cookies.id = undefined;
      docCookies.removeItem('sessionToken');
      docCookies.removeItem('type');
      docCookies.removeItem('id');
      $state.go('root');
    }).error(function(){
      console.log('Something went wrong');
    })
  }
});