app.controller('authController', ['$scope', '$http', '$state', '$cookies', 
  '$stateParams', '$location', 'oneTimeAuthorization', 'sessionCache',
  function($scope, $http, $state, $cookies, $stateParams, $location, oneTimeAuthorization, sessionCache){
    
  $scope.stateUserType = $state.current.name.split('.')[0];
  switch ($scope.stateUserType) {
    case 'workers':
      $scope.userHeader = 'Staff';
      break;
    case 'helpDesk':
      $scope.userHeader = 'Help Desk';
      break;
    case 'admin':
      $scope.userHeader = 'Admin';
      break;
  }

  $scope.signup = function(manual){
    $scope.waitAuth = 0;
    $scope.error = null;
    $scope.waitSignup = true;
    if($scope.password === $scope.passwordConfirmation){
      var userType, password, email, firstName, lastName;
      email = $scope.email;
      if(manual){ //If admin or helpdesk is creating a new account, we want to generate a random password and passthrough userType
        userType = $scope.userType;
        firstName = $scope.firstName;
        lastName = $scope.lastName;
        password = Math.random().toString();
        $scope.email = '';
        $scope.firstName = '';
        $scope.lastName = '';
      } else { //Otherwise, grab user submitted data from signin page
        firstName = $scope.firstName;
        lastName = $scope.lastName;
        userType = $state.current.data.userType;
        password = $scope.password;
        $scope.firstName = '';
        $scope.lastName = '';
        $scope.password = '';
        $scope.passwordConfirmation = '';
        $scope.email = '';
      }
      console.log(userType);
      if(firstName && lastName && email && userType){ //If manual creation, we want to make sure all fields are filled
        $scope.waitAuth = 1;
        $http({
          method: 'POST',
          url: '/auth/signup',
          data: {
            firstName: firstName,
            lastName: lastName,
            userType: userType,
            email: email,
            password: password
          }
        }).success(function(data, status){
          $scope.waitAuth = 2;
          $scope.waitSignup = false;
          $scope.success = 'User successfully created and should check email for password reset.  (Emails can sometimes appear in spam folder.)';
          if(manual){//If the user was manually added, we need to immediately fire a sendReset, which
          //will allow the user to enter their own password
            $scope.sendReset(userType, email);
          } else { //Else the user is adding themselves, we need to redirect to account page
            $scope.email = email;
            $scope.password = password;
            $scope.signin();
          }
        }).error(function(data, status){
          $scope.waitAuth = 0;
          console.log('User Not Created: Server Error');
          $scope.waitSignup = false;
          $scope.error = 'E-mail address: ' + email + ' already in use';
        })
      } else { //If all fields are not filled, throw an error instead
        $scope.error = 'Please fill all fields';
        $scope.waitSignup = false;
      }
    } else {
      $scope.error = 'Password and Password Confirmation Don\'t Match';
      $scope.waitSignup = false;
    }
  };

  $scope.signin = function(){
    $scope.waitAuth = 0;
    var userType = $state.current.data.userType;
    if($scope.password){
      var email = $scope.email;
      var password = $scope.password;
      $scope.email = '';
      $scope.password = '';
      $scope.waitAuth = 1;
      $http({
        method: 'POST',
        url: '/auth/signin',
        data: {
          userType: userType,
          email: email,
          password: password
        }
      }).success(function(data){
        $scope.waitAuth = 2;
        console.log('User signed in');
        $cookies.sessionToken = data.sessionToken;
        $cookies.type = data.type;
        $cookies.id = data.id;
        sessionCache.updateSessionToken(data.sessionToken);
        sessionCache.updateUserType(data.type);
        oneTimeAuthorization.authorize();
        switch(data.type){
          case 'workers':
            $location.path('/workers');
            break;
          case 'admin':
            $location.path('/admin');
            break;
          case 'helpDesk':
            $location.path('/help_desk');
            break;
        }
        // setTimeout(function(){
          // $state.go(userType + '.account');
        // }, 500);
      }).error(function(data){
        $scope.waitAuth = 0;
        $scope.error = 'Incorrect Username or Password';
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
    $scope.waitSendPassword = 1;
    $http({
      method: 'POST',
      url: '/auth/sendReset',
      data: {
        userType: userType || $state.current.data.userType,
        email: email || $scope.email
      }
    }).success(function(data, status){
      console.log('Reset token sent');
      $scope.error = '';
      $scope.status = 'Password reset sent to email: ' + $scope.email;
      $scope.waitSendPassword = 2;
    }).error(function(data, status){
      $scope.error = 'Email not found'
      $scope.waitSendPassword = 0;
      console.log('Reset token not sent: Server Error');
    });
  }

  $scope.resetPassword = function(){
    if($scope.password === $scope.passwordConfirmation){
      $http({
        method: 'POST',
        url: '/auth/resetPassword',
        data: {
          userType: $state.current.data.userType,
          password: $scope.password,
          resetToken: $stateParams.resetToken
        }
      }).success(function(data, status){
        console.log('Password successfully reset, sending you to signin page');
        $state.go($state.current.data.userType + '.signin');
      }).error(function(data, status){
        console.log('Password not reset: Server Error');
        $scope.error = 'We couldn\'t find your account. This can happen if you used an old password reset link. Check your email for a newer password reset email or contact the help desk.';
      });
    } else {
      $scope.password = '';
      $scope.passwordConfirmation = '';
      $scope.error = 'Password and Password Confirmation Didn\'t Match';
    }
  };

  $scope.fetchWorkerSignup = function(){
    $http({
      method: 'GET',
      url: '/auth/toggle'
    }).success(function(data){
      $scope.hasAccess = data.access;
    });
  };

  $scope.toggleWorkerSignup = function(){
    $http({
      method: 'POST',
      url: '/auth/toggle'
    }).success(function(data){
      $scope.hasAccess = data.access;
    }).error(function(){
      console.log('Something went wrong');
    });
  };

  if($state.current.name === 'admin.account.accountManagement.create'){
    $scope.fetchWorkerSignup();
    $scope.url = 'http://' + $location.host();
    $scope.url += '/workers/signup';
  }

}]);