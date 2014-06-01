app.controller('appController', ['$scope', '$cookies', 'signout', function ($scope, $cookies, signout){
  $scope.signout = function(){
    signout();
  }

  $scope.devSignin = function(){
    if($cookies.type === 'j:null' || $cookies.type === undefined){
      console.log('Signed in as developer');
      $cookies.type = 'developer';
    } else {
      console.log('Sign out before using the master signin');
    }
  }
}])

app.controller('childController', ['$scope', 'restful', '$cookies', '$state', function ($scope, restful, $cookies, $state) {
  $scope.tempChildObj = {};
  var postObj;

  $scope.create = function () {
    restful.createChild($scope.tempChildObj).then(function (promise) {
      if (promise) {
        return $scope.get();
      }
    });
  };

  $scope.get = function () {
    restful.getChildren().then(function (promise) {
      if (promise) {
        $scope.children = promise.data;
      }
    });
  };

  $scope.update = function (id, key, value) {
    postObj = {};
    postObj.id = id;
    postObj[key] = value;

    restful.updateChild(postObj).then(function (promise) {
      if (promise) {
        $scope.get();
      }
    });
  };

  $scope.get();

}])

.controller('usersController', ['$scope', '$http', '$state', function($scope, $http, $state){
  console.log('Fetching Users');
  $http({
    method: 'GET',
    url: '/users' + $state.current.url
  }).success(function(users){
    console.log('Users fetched successfully');
    $scope.users = users;
  }).error(function(err){
    console.log('Users not fetched successfully: Server Error');
  })
}])

//Authentication logic
.controller('authController', ['$scope', '$http', '$state', '$cookies', '$stateParams', function($scope, $http, $state, $cookies, $stateParams){
  $scope.signup = function(manual){
    if($scope.password === $scope.passwordConfirmation){
      var userType, password, email;
      email = $scope.email;
      if(manual){ //If admin or helpdesk is creating a new account, we want to generate a random password and passthrough userType
        userType = $scope.userType;
        password = Math.random().toString();
      } else { //Otherwise, grab user submitted data from signin page
        userType = $state.current.data.userType;
        password = $scope.password;
      }
      console.log(userType);
      $http({
        method: 'POST',
        url: '/auth/signup',
        data: {
          userType: userType,
          email: email,
          password: password
        }
      }).success(function(data, status){
        console.log('User Created!');
        //If the user was manually added, we need to immediately fire a sendReset, which
        //will allow the user to enter their own password
        if(manual) $scope.sendReset(userType, email);
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
      }).success(function(data){
        console.log('User signed in');
        $cookies.sessionToken = data.sessionToken;
        $cookies.type = data.type;
        $cookies.id = data.id;
        $state.go(userType + '.account');
      }).error(function(data){
        console.log('User not signed in: Server Error');
      });
    }
  }

  $scope.signout = function(){
    $http({
      method: 'POST',
      url: '/auth/signout'
    }).success(function(data, status){
      $cookies.sessionToken = 'j:null';
      $cookies.type = 'j:null';
      $cookies.id = 'j:null';
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

  $scope.sendReset = function(userType, email){
    $http({
      method: 'POST',
      url: '/auth/sendReset',
      data: {
        userType: userType || $state.current.data.userType,
        email: email || $scope.email
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
      url: '/auth/resetPassword',
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



// Worker Account Controller
.controller('workerController', ['$scope', 'restful', function ($scope, restful) {

  $scope.getWorkerData = function () {
    restful.getWorkerData().then(function (promise) {
      if (promise) {
        $scope.workerData = promise.data;
      }
    });
  };

  $scope.getWorkerData();

  $scope.postWorkerData = function (key, val) {
    var workerObj = {};
    workerObj[key] = val;
    restful.postWorkerData(workerObj).then(function (promise) {
      if (promise) {
        $scope.getWorkerData();
      }
    })
  };

}])

.controller('pledgeController', ['$scope', 'restful', 'childObjSaver', function ($scope, restful, childObjSaver) {
  $scope.currentChild = childObjSaver.getChildObj() || undefined;
  var postObj;

  $scope.pledgeButton = function (child, index) {
    childObjSaver.setChildObj(child);
  }

  $scope.donorSubmit = function () {

    // set status to 1
    postObj = {};
    postObj.id = $scope.currentChild.id;
    postObj.status = 1;
    
    restful.updateChild(postObj).then(function (promise) {
      if (promise) {
    // add donor
        postObj.donor = $scope.donor;
        restful.postDonor(postObj).then(function (promise) {
          if (promise) {

            // reset childObjSaver
            childObjSaver.setChildObj();
            console.log(childObjSaver.getChildObj());


            // $state.go('donationSubmitted');
          }
        })
      }
    });
  };

}])















