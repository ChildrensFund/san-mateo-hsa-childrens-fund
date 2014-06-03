app.controller('appController', ['$scope', '$cookies', 'signout', function ($scope, $cookies, signout){
  $scope.signout = function(){
    signout();
  }

  $scope.devSignin = function(){
    console.log('Signed in as developer');
    $cookies.type = 'developer';
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

  $scope.get = function (pageNumber) {
    $scope.page = pageNumber;
    restful.getChildren(pageNumber).then(function (promise) {
      if (promise) {
        $scope.numChildren = promise.data.shift();
        $scope.pages = [];
        for(var i = 0; i < $scope.numChildren/20; i++){
          $scope.pages.push(i + 1);
        }
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

  $scope.get(1);

}])

.controller('usersController', ['$scope', '$http', '$state', function($scope, $http, $state){

  $state.current.name === 'admin.account.accountManagement.workers' ||
  $state.current.name === 'helpDesk.account.accountManagement.workers' ? $scope.workerPage = true : $scope.workerPage = false;

  $scope.fetchUsers = function(page){
    var queryString = '';
    if($scope.userQuery){
      var userQuery = $scope.userQuery;
      $scope.userQuery = '';
      queryString = '&query=' + userQuery;
    }
    $scope.page = page;
    $http({
      method: 'GET',
      url: '/users' + $state.current.url + '?page=' + page + queryString
    }).success(function(users){
      console.log('Users fetched successfully');
      $scope.page = page;
      $scope.numUsers = users.shift();
      $scope.users = users;
      $scope.pages = [];
      for(var i = 0; i < $scope.numUsers/20; i++){
        $scope.pages.push(i + 1);
      }
    }).error(function(err){
      console.log('Users not fetched successfully: Server Error');
    })
  }

  $scope.fetchUsers(1);

  $scope.revokeAccess = function(user){
    var userType;
    switch($state.current.url){
      case '/help_desk':
        userType = 'helpDesk';
        break;
      case '/admin':
        userType = 'admin';
        break;
      case '/workers':
        userType = 'workers';
        break;
      default:
        break;
    }
    $http({
      method: 'POST',
      url: '/auth/access',
      data: {
        id: user.id,
        hasAccess: false,
        userType: userType
      }
    }).success(function(){
      console.log('User access revoked');
      user.hasAccess = false;
    }).error(function(){
      console.log('Something went wrong');
    })
  };

  $scope.grantAccess = function(user){
    var userType;
    switch($state.current.url){
      case '/help_desk':
        userType = 'helpDesk';
        break;
      case '/admin':
        userType = 'admin';
        break;
      case '/workers':
        userType = 'workers';
        break;
      default:
        break;
    }
    $http({
      method: 'POST',
      url: '/auth/access',
      data: {
        id: user.id,
        hasAccess: true,
        userType: userType
      }
    }).success(function(){
      console.log('User access granted');
      user.hasAccess = true;
    }).error(function(){
      console.log('Something went wrong');
    });
  };
}])

.controller('adminController', ['$scope', '$http', '$state', '$location', function($scope, $http, $state, $location){
  
  $scope.fetchAllChildren = function(page){
    $scope.page = page;
    $http({
      method: 'GET',
      url: '/api/children?page=' + page
    }).success(function(children){
      $scope.numChildren = children.shift();
      $scope.children = children;
      $scope.pages = [];
      for(var i = 0; i < $scope.numChildren/20; i++){
        $scope.pages.push(i + 1);
      }
    }).error(function(err){
      console.log(err);
    })
  }

  $scope.fetchAllWorkers = function(page){
    $scope.page = page;
    $http({
      method: 'GET',
      url: '/api/workers?page=' + page
    }).success(function(workers){
      $scope.numWorkers = workers.shift();
      $scope.workers = workers;
      $scope.pages = [];
      for(var i = 0; i > $scope.numWorkers/20; i++){
        $scope.pages.push(i + 1);
      }
    }).error(function(err){
      console.log(err);
    })
  }

  if($state.current.name === 'admin.account.children'){
    $scope.fetchAllChildren(1);
  } else if ($state.current.name === 'admin.account.workers'){
    $scope.fetchAllWorkers(1);
  }


  $scope.getWorker = function(child){
    $http({
      method: 'GET',
      url: '/api/children/' + child.id + '/worker'
    }).success(function(worker){
      console.log(worker);
      child.worker = worker;
    }).error(function(err){
      console.log(err);
    });
  };

  $scope.getChildren = function(worker){
    $http({
      method: 'GET',
      url: '/api/workers/' + worker.id + '/children'
    }).success(function(children){
      worker.children = children;
    }).error(function(err){
      console.log(err);
    });
  };

  $scope.setChildForModal = function(child){
    $scope.modalChild = child;
  };

  $scope.fetchWorker = function(){
    var workerQuery = $scope.workerQuery;
    $scope.workerQuery = '';
    $http({
      method: 'GET',
      url: '/api/worker?lastName=' + workerQuery
    }).success(function(workers){
      Array.isArray(workers) ? $scope.matchedWorkers = workers : $scope.matchedWorkers = [workers];
    }).error(function(err){
      console.log(err);
    })
  };

  $scope.setWorker = function(worker){
    $scope.swapWorker = worker;
  };

  $scope.saveWorker = function(){
    $http({
      method: 'POST',
      url: '/api/children/' + $scope.modalChild.id + '/swap',
      data: {
        workerId: $scope.swapWorker.id
      }
    }).success(function(child){
      console.log(child);
    }).error(function(err){
      console.log(err);
    })
  };

  $scope.generateReport = function(){
    if($scope.startDate < $scope.endDate){
      $http({
        method: 'POST',
        url: '/api/generate',
        data: {
          startDate: $scope.startDate,
          endDate: $scope.endDate
        }
      }).success(function(data){
        console.log('Report generated');
        window.location = '/api/download/' + data.filename;
      }).error(function(){
        console.log('Report not generated, server error');
      });
    }
  };

}])

//Authentication logic
.controller('authController', ['$scope', '$http', '$state', '$cookies', 
  '$stateParams', '$location', 'oneTimeAuthorization', 'sessionCache',
  function($scope, $http, $state, $cookies, $stateParams, $location, oneTimeAuthorization, sessionCache){

  $scope.signup = function(manual){
    if($scope.password === $scope.passwordConfirmation){
      var userType, password, email;
      email = $scope.email;
      if(manual){ //If admin or helpdesk is creating a new account, we want to generate a random password and passthrough userType
        userType = $scope.userType;
        password = Math.random().toString();
        $scope.email = '';
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

.controller('pledgeController', ['$scope', 'restful', 'childObjSaver', '$state', '$timeout', function ($scope, restful, childObjSaver, $state, $timeout) {
  $scope.currentChild = childObjSaver.getChildObj() || undefined;
  var postObj;

  $scope.pledgeButton = function (child, index) {
    childObjSaver.setChildObj(child);
  }

  $scope.donorSubmit = function () {
    postObj = {};
    postObj.id = $scope.currentChild.id;
    postObj.status = 1;
    
    restful.updateChild(postObj).then(function (promise) {
      if (promise) {
        postObj.donor = $scope.donor;

        restful.postDonor(postObj).then(function (promise) {
          if (promise) {
            childObjSaver.setChildObj();
            $state.go('donationSubmitted');
            $timeout(function () {
              $state.go('root');
            }, 3000);
          }
        })
        
      }
    });
  };

}])

.controller('imageController', ['$scope', '$upload', '$cookies', function($scope, $upload, $cookies) {

  var fileName;

  var getMimetype = function (file) {
    var uploadedFilename = file.name, found = false, index = uploadedFilename.length;
    while (!found) {
      if (uploadedFilename[index] === '.') { found = true; }
      if (index < 0) { return res.send(404, 'Incorrect uploadedFilename'); }
      index--;
    }
    return uploadedFilename.substr(index + 1, uploadedFilename.length);
  };


  $scope.onFileSelect = function($files) {
    $scope.file = $files[0];
  };


  // Image is saved to root/server/images/ childCFID .(mimetype of image)
  $scope.uploadImageThenCreateChild = function () {
      $scope.$parent.tempChildObj.image = '';
      $scope.$parent.tempChildObj.image += randNum();
      $scope.$parent.tempChildObj.image += getMimetype($scope.file);
      delete $scope.file.name
      $scope.file.name = $scope.$parent.tempChildObj.image;

      $upload.upload({
        url: '/images',
        method: 'POST',
        file: $scope.file,
      }).success(function(data, status, headers, config) {
        console.log('Success!...uploading kid now...');
        // upload kid to db
        $scope.$parent.create();
      });
  };

}])


var randNum = function () {
  return Math.floor(Math.random()*10e10);
};










