app.controller('donorController', ['$scope', 'restful', 'sanitize', function ($scope, restful, sanitize) {

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

}]);