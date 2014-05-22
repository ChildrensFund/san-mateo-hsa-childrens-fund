angular.module('childrensFund', ['ui.router'])

// ui-router configuration
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('/', {
      url: '/',
      views: {
        navMenuView: { templateUrl: '/templates/navMenu.html'}
      }
    })
  .state('donorsPortal', {
    url: '/donors',
    views: {
      navMenuView: { templateUrl: '/templates/navMenu.html'},
      middleView: { templateUrl: 'templates/donorView.html', controller: 'inputController' }
    }
  })
  .state('workersPortal', {
    url: '/workers',
    views: {
      navMenuView: { templateUrl: '/templates/navMenu.html'},
      middleView: { templateUrl: 'templates/workerView.html', controller: 'inputController' }
    }
  })
}])

.controller('inputController', ['$scope', 'restful', function ($scope, restful) {

  $scope.post = function () {
    if ($scope.childName && $scope.item1) {
      restful.createChild($scope.childName, $scope.item1).then( function (promise) {
        if (promise) {
          $scope.childName = '';
          $scope.item1 = '';
          //calls GET after POST is complete
          return $scope.get();
        }
      });
    } else {
      console.log('Invalid Input Values')
    }
  };

  $scope.get = function () {
    restful.getInputs().then(function (promise) {
      if (promise) {
        $scope.children = promise.data;
      }
    });
  };

  $scope.pledge = function (childObj, index) {
    childObj.childData.items[index].pledged = true;
    console.log('Pledgee: ', childObj);
    restful.updateChild(childObj).then(function (promise) {
      if (promise) {
        $scope.get();
      }
    });
  }

}])


// basic GET/POST logic
.factory('restful', ['$http', function ($http) {
  return {
    createChild: function (childName, item1) {
      return $http({
        method: 'POST',
        url: '/submit',
        data: { 
          id: Math.floor(Math.random() * 100000), 
          childData: {
            name: childName, 
            items: [
              {
                item: item1,
                pledged: false 
              }
            ]
          }
        },
      }).success(function (data, status) {
        console.log('(Create) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(Create) POST Error! ', data, status);
      });
    },

    updateChild: function (childObj) {
      return $http({
        method: 'POST',
        url: '/update',
        data: childObj
      }).success(function (data, status) {        
        console.log('(Update) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(Update) POST Error! ', data, status);
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