app.controller('appController', ['$scope', '$cookies', 'signout', function ($scope, $cookies, signout){
  $scope.signout = function(){
    signout();
  }

  $scope.devSignin = function(){
    console.log('Signed in as developer');
    $cookies.type = 'developer';
  }
}])

.controller('donorController', ['$scope', 'restful', 'sanitize', function ($scope, restful, sanitize) {

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
        _.each($scope.children, function (val, ind, col) {
          if(val.dob) {
            val.dob = sanitize.get(val.dob);
          }
        });
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
      url: '/users' + $state.current.url + '/accounts' + '?page=' + page + queryString
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

  //Only fetch users if on one of the account management pages that's NOT create
  if($state.current.name !== 'admin.account.accountManagement.create' && 
     $state.current.name !== 'helpDesk.account.accountManagement.create'){
    $scope.fetchUsers(1); 
  }

  $scope.issuePasswordReset = function(user){
    user.waitPasswordReset = 1;
    $http({
      method: 'POST',
      url: '/auth/sendReset',
      data: {
        userType: $state.current.name.split('.')[3],
        email: user.email
      }
    }).success(function(data, status){
      user.waitPasswordReset = 2;
      console.log('Reset token sent');
    }).error(function(data, status){
      user.waitPasswordReset = 3;
      console.log('Reset token not sent: Server Error');
    });
  };

  $scope.revokeAccess = function(user){
    var userType;
    user.waitAccess = 1;
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
      user.waitAccess = 2;
      console.log('User access revoked');
      user.hasAccess = false;
    }).error(function(){
      user.waitAccess = 3;
      console.log('Something went wrong');
    })
  };

  $scope.grantAccess = function(user){
    var userType;
    user.waitAccess = 1;
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
      user.waitAccess = 2;
      console.log('User access granted');
      user.hasAccess = true;
    }).error(function(){
      user.waitAccess = 3;
      console.log('Something went wrong');
    });
  };
}])

.controller('adminController', ['$scope', '$http', '$state', '$location', function($scope, $http, $state, $location){
  
  $scope.generatingReport;

  $scope.fetchAllChildren = function(page){
    var queryString = '';
    if($scope.userQuery){
      var userQuery = $scope.userQuery;
      $scope.userQuery = '';
      queryString = '&query=' + userQuery;
    }
    $scope.page = page;
    $http({
      method: 'GET',
      url: '/users/children?page=' + page + queryString
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
    var queryString = '';
    if($scope.userQuery){
      var userQuery = $scope.userQuery;
      $scope.userQuery = '';
      queryString = '&query=' + userQuery;
    }
    $scope.page = page;
    $http({
      method: 'GET',
      url: '/users/workers?page=' + page + queryString
    }).success(function(workers){
      $scope.numWorkers = workers.shift();
      $scope.workers = workers;
      $scope.pages = [];
      for(var i = 0; i < $scope.numWorkers/20; i++){
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

  $scope.setChildForModal = function(child, worker){
    $scope.modalChild = child;
    if(worker){
      $scope.modalWorker = worker;  
    } else {
      $scope.modalWorker = null;
    }
    $scope.matchedWorkers = null;
    $scope.swapWorker = null;
    $scope.success = null;
    $scope.swapWorkerForButton = null;
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
    console.log($scope.swapWorker);
    $http({
      method: 'POST',
      url: '/api/children/' + $scope.modalChild.id + '/swap',
      data: {
        workerId: $scope.swapWorker.id
      }
    }).success(function(child){
      $scope.success = true;
      if($scope.modalChild.worker){ //If on the children panel, set new worker on child view
        $scope.modalChild.worker.firstName = $scope.swapWorker.firstName;
        $scope.modalChild.worker.lastName = $scope.swapWorker.lastName;
      } else { //If on the worker panel, remove the child from the current worker.
        for(var i = 0; i < $scope.modalWorker.children.length; i++){
          if($scope.modalWorker.children[i].id === $scope.modalChild.id && $scope.modalWorker.id !== $scope.swapWorker.id){
            $scope.modalWorker.children.splice(i, 1);
            break;
          }
        }
      }
      $scope.tempWorkerForButton = $scope.swapWorker;
      // $scope.modalWorker = null;
      // $scope.swapWorker = null;
    }).error(function(err){
      console.log(err);
    })
  };

  $scope.generateReport = function(){
    if($scope.startDate && $scope.endDate && $scope.startDate < $scope.endDate){
      $scope.generatingReport = true;
      $scope.generateReportMessage = 'Creating Your Report';
      $http({
        method: 'POST',
        url: '/api/generate',
        data: {
          startDate: $scope.startDate,
          endDate: $scope.endDate
        }
      }).success(function(data){
        $scope.generateReportMessage = 'Report Created, Downloading Now';
        $scope.error = null;
        window.location = '/api/download/' + data.filename;
      }).error(function(){
        $scope.generateReportMessage = null;
        $scope.error = 'Something went wrong, try refreshing the page and submitting a new request';
        console.log('Report not generated, server error');
      });
    } else {
      $scope.error = 'Please enter valid start and end date';
    }
  };

}])

//Authentication logic
.controller('authController', ['$scope', '$http', '$state', '$cookies', 
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
        userType = $state.current.data.userType;
        password = $scope.password;
      }
      console.log(userType);
      if(!manual || (manual && firstName && lastName && email && userType)){ //If manual creation, we want to make sure all fields are filled
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
          console.log('User Created!');
          //If the user was manually added, we need to immediately fire a sendReset, which
          //will allow the user to enter their own password
          $scope.waitSignup = false;
          $scope.success = 'User successfully created and should check email for password reset';
          if(manual) $scope.sendReset(userType, email);
        }).error(function(data, status){
          console.log('User Not Created: Server Error');
          $scope.waitSignup = false;
          $scope.error = 'E-mail address: ' + email + ' already in use';
        })
      } else { //If all fields are not filled, throw an error instead
        $scope.error = 'Please fill all fields';
        $scope.waitSignup = false;
      }
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
  }

}])

.controller('signoutController', ['$scope', '$http', '$state', '$cookies', function($scope, $http, $state, $cookies){
  $http({
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
}])

.controller('workerController', ['$scope', 'restful', 'sanitize', '$cookies', '$state', '$location',
 function ($scope, restful, sanitize, $cookies, $state, $location) {
  $scope.tempChildObj = {};
  $scope.deleteConfirm='';
  var postObj;

  $scope.genders = [
  {value: 'male', text: 'male'},
  {value: 'female', text: 'female'}
  ];

  $scope.getWorkerData = function () {
    restful.getWorkerData().then(function (promise) {
      if (promise) {
        $scope.workerData = promise.data;
        // $scope.deleteBox = false;
      }
    });
  };

  $scope.getWorkerData();

  $scope.postWorkerData = function (key, val) {
    val = sanitize.update(key, val);
    var workerObj = {};
    workerObj[key] = val;
    restful.postWorkerData(workerObj).then(function (promise) {
      if (promise) {
        // $scope.deleteBox = false;
        // $scope.getWorkerData();
      }
    })
  };

  $scope.unpledge = function (child, confirm) {
    if (confirm === 'delete' || confirm === 'DELETE') {
      child.waitDelete = 1;
      postObj = {};
      postObj.donorId = null;
      postObj.status = 0;
      postObj.id = child.id;
      restful.updateChild(postObj).then(function (promise) {
        if (promise) {
          child.waitDelete = 2;
          child.status = 0;
        }
      });
    }
    $scope.deleteConfirm = '';
  };


  $scope.create = function () {
    // sanitize phone numbers
    if ($scope.tempChildObj.phone) {
      $scope.tempChildObj.phone = sanitize.update('phone',$scope.tempChildObj.phone);
    }
    // sanitize item price ($)
    if ($scope.tempChildObj.firstItemPrice || 
        $scope.tempChildObj.secondItemPrice || 
        $scope.tempChildObj.thirdItemPrice) 
    {
      $scope.tempChildObj.firstItemPrice = sanitize.update('firstItemPrice', $scope.tempChildObj.firstItemPrice);
      $scope.tempChildObj.secondItemPrice = sanitize.update('secondItemPrice', $scope.tempChildObj.secondItemPrice);
      $scope.tempChildObj.thirdItemPrice = sanitize.update('thirdItemPrice', $scope.tempChildObj.thirdItemPrice);
    }
    restful.createChild($scope.tempChildObj).then(function (promise) {
      if (promise) {
        $state.go('workers.account.myTags');
      }
    });
  };

  $scope.get = function (pageNumber) {
    $scope.page = pageNumber;
    restful.getWorkersChildren(pageNumber).then(function (promise) {
      if (promise) {
        $scope.children = promise.data;
        _.each($scope.children, function (val, ind, col) {
          if(val.dob) {
            val.dob = sanitize.get('dob', val.dob);
          }
        });
      }
    });
  };

  $scope.getChildsDonor = function (id) {
    $scope.childsDonor = {};
    restful.getChildsDonor(id).then(function (promise) {
      if (promise) {
        $scope.childsDonor = promise.data;
      }
    })
  };

  $scope.update = function (id, key, value) {
    value = sanitize.update(key, value);
    postObj = {};
    postObj.id = id;
    postObj[key] = value;
    restful.updateChild(postObj).then(function (promise) {
      if (promise) {
        console.log('update success!');
      }
    });
  };

  $scope.get(1);

  $scope.checkData = function (data, type) {
    if (type === 'firstName' || type === 'lastName') {
      if (Boolean(data.match(/[^\w-'`]/g))) {
        return 'Valid characters are letters and -\`\''
      }
    }
    if (type === 'age') {
      if (Boolean(data.match(/[^\d]/g))) {
        return 'Please enter only numbers';
      }
    }
    if (type === 'price') {
      if (Boolean(data.match(/[^\d$.]/g))) {
        return 'Please enter only numbers';
      }
    }
  };

  $scope.setModalChild = function(child){
    $scope.modalChild = child;
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
            $scope.confirmation = $scope.currentChild.cfid;
            // $state.go('')
            $timeout(function () {
              childObjSaver.setChildObj();
            }, 3000);
          }
        })
        
      }
    });
  };

}])

.controller('imageController', ['$scope', '$upload', '$cookies', 'randNum', function($scope, $upload, $cookies, randNum) {

  var fileName;

  var getMimetype = function (file) {
    var uploadedFilename = file.name;
    for (var i = uploadedFilename.length; i >= 0; i--) {
      if (uploadedFilename[i] === '.') {
        return uploadedFilename.slice(i,uploadedFilename.length);
      }
    }
  };


  $scope.onFileSelect = function($files) {
    $scope.file = $files[0];
  };

  $scope.updatePhoto = function (id) {
    var imageNumber = randNum();
    var newName = '';
    newName += imageNumber;
    newName += getMimetype($scope.file);
    delete $scope.file.name
    $scope.file.name = newName;
    $upload.upload({
      url: '/images',
      method: 'POST',
      file: $scope.file,
    }).success(function(data, status, headers, config) {
      console.log('Image Upload Success!...Updating kid now...');
      $scope.$parent.update(id, 'image', $scope.file.name);
    });

  };

  $scope.uploadImageThenCreateChild = function () {
    if (
      !$scope.$parent.tempChildObj.firstName ||
      !$scope.$parent.tempChildObj.lastName ||
      !$scope.$parent.tempChildObj.gender ||
      $scope.$parent.tempChildObj.gender === '' ||
      !$scope.$parent.tempChildObj.dob ||
      !$scope.$parent.tempChildObj.age ||
      !$scope.$parent.tempChildObj.location ||
      !$scope.$parent.tempChildObj.programArea ||
      !$scope.$parent.tempChildObj.bio ||
      $scope.$parent.tempChildObj.bio.length > 600 ||
      (!$scope.$parent.tempChildObj.firstItemName && $scope.$parent.tempChildObj.firstItemName.length > 16) ||
      ($scope.$parent.tempChildObj.secondItemName && $scope.$parent.tempChildObj.secondItemName.length > 16) ||
      ($scope.$parent.tempChildObj.thirdItemName && $scope.$parent.tempChildObj.thirdItemName.length > 16) ||
      !$scope.$parent.tempChildObj.firstItemPrice 
    )
      {return;}

    if ($scope.file) {
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
        console.log('Image Upload Success!...Creating kid now...');
        // upload kid to db
        $scope.$parent.create();
      });
    } else {
        console.log('No Image Upload...Creating kid...');
        $scope.$parent.create();
    }
  };

}])






