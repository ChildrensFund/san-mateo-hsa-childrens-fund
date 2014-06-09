app.factory('signout', ['$http', '$state', '$cookies', function($http, $state, $cookies){
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
}]);