angular.module('childrensFund', ['ui.router'])

// ui-router configuration
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('/', {
      url: '/',
      views: {
        inputsView: { templateUrl: '/templates/inputsView.html', controller: 'inputController' }
      }
    })
}])

.controller('inputController', ['$scope', 'restful', function ($scope, restful) {

  $scope.post = function () {
    restful.sendInputs($scope.childName, $scope.item1).then( function (promise) {
      if (promise) {
        //calls GET after POST is complete
        return $scope.get();
      }
    });
  };

  $scope.get = function () {
    restful.getInputs().then(function (promise) {
      if (promise) {
        $scope.children = promise.data;
      }
    });
  };

}])


// basic GET/POST logic
.factory('restful', ['$http', function ($http) {
  return {
    sendInputs: function (childName, item1) {
      return $http({
        method: 'POST',
        url: '/submit',
        data: {
          name: childName, 
          items: item1
        }
      }).success(function (data, status) {
        console.log('POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('POST Error! ', data, status);
      });
    },

    getInputs: function () {
      return $http({
        method: 'GET',
        url: '/submit'
      }).success(function (data, status) {
        console.log('GET Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('GET Error! ', data, status);
      });
    }
  }
}])