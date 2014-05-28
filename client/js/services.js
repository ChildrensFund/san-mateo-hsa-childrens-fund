// GET/POST logic
app.factory('restful', ['$http', function ($http) {
  return {
    createChild: function (childObj) {
      return $http({
        method: 'POST',
        url: '/children',
        data: childObj
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
  
  //pageType needs to be 'donors' || 'workers' || 'admin'
  return function(pageType){
    var cookieSessionToken = $cookies.sessionToken;
    var cookieUserType = $cookies.type;
    console.log('################ Page is protected, checking login status ################');
    var deferred = $q.defer();
    if(!cookieSessionToken || !cookieUserType || cookieSessionToken === 'j:null' || cookieUserType === 'j:null'){
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

.factory('signout', function($http){
  return function(){
    return $http({
      method: 'POST',
      url: '/auth/signout'
    }).success(function(){
      console.log('User signed out');
    }).error(function(){
      console.log('Something went wrong');
    })
  }
});