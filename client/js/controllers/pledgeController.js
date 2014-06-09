app.controller('pledgeController', ['$scope', 'restful', 'childObjSaver', '$state', '$timeout', function ($scope, restful, childObjSaver, $state, $timeout) {
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

}]);