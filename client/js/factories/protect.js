app.factory('protect', ['$cookies', '$q', '$http', 'sessionCache', 'oneTimeAuthorization', 
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

}]);