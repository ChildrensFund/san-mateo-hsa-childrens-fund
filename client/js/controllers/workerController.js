app.controller('workerController', ['$scope', 'restful', 'sanitize', '$cookies', '$state', '$location',
 function ($scope, restful, sanitize, $cookies, $state, $location) {
  $scope.tempChildObj = {};
  $scope.deleteConfirm='';
  var postObj;

  $scope.genders = [
  {value: 'male', text: 'male'},
  {value: 'female', text: 'female'}
  ];

  $scope.paymentMethods = [
  {value: 'Items', text: 'Items'},
  {value: 'Cash', text: 'Cash'},
  {value: 'Check', text: 'Check'}
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
      postObj.sortedByDate = new Date();
      postObj.status = 0;
      postObj.hsaStatus = 0;
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
    $scope.tempChildObj.sortedByDate = new Date();
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

  $scope.updateDonor = function (donorId, key, value) {
    value = sanitize.update(key, value);
    postObj = {};
    postObj.id = donorId;
    postObj[key] = value;
    console.log(postObj);
    restful.updateDonor(postObj).then(function (promise) {
      if (promise) {
        console.log('edit donor success!');
      }
    });
  };

  $scope.getChildsDonor = function (childId) {
    $scope.childsDonor = {};
    restful.getChildsDonor(childId).then(function (promise) {
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
    if (type === 'paymentMethod') {
      str = data[0].toUpperCase() + data.slice(1);
      if (str !== 'Cash' && str !== 'Check' && str !== 'Items') {
        console.log(str, data)
        return 'Please enter only numbers';
      }
    }
  };

  $scope.setModalChild = function(child){
    $scope.modalChild = child;
  };

}]);