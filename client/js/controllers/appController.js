app.controller('appController', ['$scope', '$cookies', 'signout', function ($scope, $cookies, signout){
  $scope.signout = function(){
    signout();
  }

  $scope.devSignin = function(){
    console.log('Signed in as developer');
    $cookies.type = 'developer';
  }
}]);