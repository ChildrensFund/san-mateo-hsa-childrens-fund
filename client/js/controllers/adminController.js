app.controller('adminController', ['$scope', '$http', '$state', '$location', function($scope, $http, $state, $location){
  
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

}]);
