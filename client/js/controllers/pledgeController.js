app.controller('pledgeController', ['$scope', 'restful', 'childObjSaver', '$state', '$timeout', function ($scope, restful, childObjSaver, $state, $timeout) {
  $scope.currentChild = childObjSaver.getChildObj() || undefined;
  var postObj;

  var totalPrice = function itemTotal () {
    var sum = 0;
    for (var i=0;i<arguments.length;i++) {
      if (arguments[i]) {
        sum += Number(arguments[i]);
      }
    }
    return sum;
  };

  $scope.$watch('currentChild', function() {
    $scope.currentChild.itemTotalPrice = totalPrice($scope.currentChild.firstItemPrice, $scope.currentChild.secondItemPrice, $scope.currentChild.thirdItemPrice)
  });


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
            $timeout(function () {
              childObjSaver.setChildObj();
            }, 3000);
          }
        })
        
      }
    });
  };

}]);