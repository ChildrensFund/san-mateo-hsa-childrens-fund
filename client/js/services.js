// GET/POST logic
app.factory('restful', ['$http', '$cookies', function ($http, $cookies) {
  return {

    createChild: function (childObj) {
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

    updateChild: function (childObj) {
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

    getChildren: function (pageNumber) {
      var queryUrl = '/api/children';
      if(pageNumber){
        queryUrl += '?page=' + pageNumber;
      }
      return $http({
        method: 'GET',
        url: queryUrl
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
    },

    postDonor: function (postObj) {
      return $http({
        method: 'POST',
        url: '/api/children/' + postObj.id + '/donor',
        data: postObj.donor
      }).success(function (data, status) {
        console.log('(Donor) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(Donor) POST Error! ', data, status);
      });
    }

  }
}])

//Cookies don't update instantly, which causes problems when allowing a user into
//their account page after signin. When the server sends a response saying "yes, you're
//who you say you are", this allows the user to passthrough without having to check server vs.
//cookies.
.factory('oneTimeAuthorization', function(){
  var authorized = false;
  return {
    authorize: function(){
      authorized = true;
    },
    isAuthorized: function(){
      var temp = authorized;
      authorized = false;
      return temp;
    }
  }
})

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

.factory('protect', ['$cookies', '$q', '$http', 'sessionCache', 'oneTimeAuthorization', 
  function($cookies, $q, $http, sessionCache, oneTimeAuthorization){
  
  //pageType needs to be 'donors' || 'workers' || 'admin' || 'helpDesk'
  return function(pageType){
    var cookieSessionToken = $cookies.sessionToken;
    var cookieUserType = $cookies.type;
    console.log('################ Page is protected, checking login status ################');
    var deferred = $q.defer();
    if(oneTimeAuthorization.isAuthorized()){
      console.log('One time authorization token used');
      deferred.resolve(true);
    }
    //Add handling to allow developer to access all portals
      else if(cookieUserType === 'developer'){
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
      docCookies.removeItem('sessionToken');
      docCookies.removeItem('type');
      docCookies.removeItem('id');
      console.log($state.current.name);
      var array = $state.current.name.split('.');
      $state.go(array[0] + '.signin');
    }).error(function(){
      console.log('Something went wrong');
    })
  }
})


.service('childObjSaver', function () {
  var childIndex = null;
  var childObj = {};
  return {
    setChildObj: function (obj) {
      obj = obj || {};
      childObj = obj;
    },
    getChildObj: function () {
      return childObj;
    }
  }
})


.filter('unpledged', function() {
  return function(input) {
    console.log(input);
    if (!input.status) 
      return input;
  }  
});