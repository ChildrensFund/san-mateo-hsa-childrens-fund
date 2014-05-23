var app = angular.module('childrensFund', ['ui.router'])

// ui-router configuration
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  // view for nagivation bar
  $stateProvider
    .state('/', {
      url: '/',
      views: {
        navMenuView: { templateUrl: '/templates/navMenu.html'}
      }
    })

  // view for donors (nav bar and list of children with pledge button)
  .state('donorsPortal', {
    url: '/donors',
    views: {
      navMenuView: { templateUrl: '/templates/navMenu.html'},
      middleView: { templateUrl: 'templates/donorView.html', controller: 'inputController' }
    }
  })

  // view for workers (nav bar, input field and list of children)
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
          // Clears input fields after GET succeeds
          $scope.childName = '';
          $scope.item1 = '';
          // calls GET after POST is complete
          return $scope.get();
        }
      });
    } else {
      console.log('Invalid Input Values')
    }
  };

  $scope.get = function () {
    restful.getChildren().then(function (promise) {
      if (promise) {
        // sets $scope.children as received server data
        $scope.children = promise.data;
      }
    });
  };

  $scope.pledge = function (childObj, index) {
    // for a given child's item, sets pledged to true
    childObj.childData.items[index].pledged = true;

    // then POSTs it to the server
    restful.updateChild(childObj).then(function (promise) {
      if (promise) {

        //after POST is completed, GETs updated data
          //necessary to updated Pledge/Pledged! buttons
        $scope.get();
      }
    });
  }

}])

// GET/POST logic
.factory('restful', ['$http', function ($http) {
  return {
    createChild: function (childName, item1) {
      return $http({
        method: 'POST',
        url: '/children',
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
        url: '/children',
        data: childObj
      }).success(function (data, status) {        
        console.log('(Update) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(Update) POST Error! ', data, status);
      });
    },

    getChildren: function () {
      return $http({
        method: 'GET',
        url: '/children'
      }).success(function (data, status) {
        console.log('GET Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('GET Error! ', data, status);
      });
    }
  }
}])