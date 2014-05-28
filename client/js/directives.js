// verifies worker views
app.directive('workerVerify', ['protect', '$location', function (protect, $location) {
  return {
    restrict: 'A',
    link: function (scope) {
      protect('workers').then(function (isWorker) {
        if (isWorker === false) {
          console.log('workerVerify changed path to /workers/signin');
          $location.path('/workers/signin');
        } else {
          scope.get();
          console.log('workerVerify allowed access');
        }
      })
    }
  }
}])

// verifies donor views
.directive('donorVerify', ['protect', '$location', function (protect, $location) {
  return {
    restrict: 'A',
    link: function (scope) {
      protect('donors').then(function (isWorker) {
        if (isWorker === false) {
          console.log('donorVerify changed path to /donors/signin');
          $location.path('/donors/signin');
        } else {
          scope.get();
          console.log('donorVerify allowed access');
        }
      })
    }
  }
}])

// verifies admin views
.directive('adminVerify', ['protect', '$location', function (protect, $location) {
  return {
    restrict: 'A',
    link: function (scope) {
      protect('admin').then(function (isWorker) {
        if (isWorker === false) {
          console.log('donorVerify changed path to /admin/signin');
          $location.path('/admin/signin');
        } else {
          console.log('donorVerify allowed access');
        }
      })
    }
  }
}])