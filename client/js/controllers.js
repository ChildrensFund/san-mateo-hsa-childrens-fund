app.controller('appController', function($scope, signout){
  $scope.signout = function(){
    signout();
  }
})

app.controller('inputController', ['$scope', 'restful', 'protect', function ($scope, restful, protect) {

  $scope.tempChildItemObj = {
    item: undefined, 
    status: undefined, 
    price: undefined, 
    paymentDate: undefined, 
    hsaReceivedDate: undefined, 
    childReceivedDate: undefined
  };

  // sets basic template for creating new child tags
  $scope.tempChildObj = {
    request: {
      // had to use extend otherwise all item field populate simultaneously 
      items: [_.extend({},$scope.tempChildItemObj), _.extend({},$scope.tempChildItemObj), _.extend({},$scope.tempChildItemObj)] 
    }
  };

  $scope.post = function () {
    // $scope.tempChildObj.worker.accountID = get signed-in worker's account ID here
    $scope.tempChildObj.request.createdAt = new Date();
    restful.createChild($scope.tempChildObj).then(function (promise) {
      if (promise) {
        return $scope.get();
      }
    });
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
    childObj.request.items[index].status = 'pledged';

    // then POSTs it to the server
    restful.updateChild(childObj).then(function (promise) {
      if (promise) {

        //after POST is completed, GETs updated data
          //necessary to updated Pledge/Pledged! buttons
        $scope.get();
      }
    });
  }

}])

//Authentication logic
.controller('authController', ['$scope', '$http', '$state', function($scope, $http, $state){
  $scope.signup = function(){
    if($scope.password === $scope.passwordConfirmation){
      $http({
        method: 'POST',
        url: '/auth/signup',
        data: {
          userType: $state.current.data.userType,
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
    var userType = $state.current.data.userType;
    if($scope.password){
      $http({
        method: 'POST',
        url: '/auth/signin',
        data: {
          userType: userType,
          email: $scope.email,
          password: $scope.password
        }
      }).success(function(data, status){
        console.log('User signed in');
        $state.go(userType + '.account');
      }).error(function(data, status){
        console.log('User not signed in: Server Error');
      });
    }
  }

  $scope.signout = function(){
    $http({
      method: 'POST',
      url: '/auth/signout'
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
        userType: $state.current.data.userType,
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
        userType: $state.current.data.userType,
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
        userType: $state.current.data.userType,
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