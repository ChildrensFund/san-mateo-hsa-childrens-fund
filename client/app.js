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
    url: '/donor',
    views: {
      navMenuView: { templateUrl: '/templates/navMenu.html'},
      firstView: { templateUrl: 'templates/donorView.html', controller: 'inputController' }
    }
  })

  // view for workers (nav bar, input field and list of children)
  .state('workersPortal', {
    url: '/worker',
    views: {
      navMenuView: { templateUrl: '/templates/navMenu.html'},
      firstView: { templateUrl: 'templates/workerView.html', controller: 'inputController' },
      secondView: { templateUrl: 'templates/childrenFeedView.html', controller: 'inputController' }
    }
  })

  // view for workers to create a new child tag
  .state('createTag', {
    url: '/create',
    views: {
      navMenuView: { templateUrl: '/templates/navMenu.html'},
      firstView: { templateUrl: 'templates/childInputView.html', controller: 'inputController' },
    }
  })


  // view for workers to update an existing new child tag
}])

.controller('inputController', ['$scope', 'restful', function ($scope, restful) {

  $scope.tempChildObj = {
    items: [ {item: undefined, price: undefined}, {item: undefined, price: undefined}, {item: undefined, price: undefined} ]
  };

  // $scope.post = function () {
  //   if ($scope.childName && $scope.item1) {
  //     restful.createChild($scope.childName, $scope.item1).then( function (promise) {
  //       if (promise) {
  //         // Clears input fields after GET succeeds
  //         $scope.childName = '';
  //         $scope.item1 = '';
  //         // calls GET after POST is complete
  //         return $scope.get();
  //       }
  //     });
  //   } else {
  //     console.log('Invalid Input Values')
  //   }
  // };

  $scope.post = function (childObj, reqObj, workerObj) {
    // restful.createChild(childObj, reqObj, workerObj);
    restful.createChild($scope.tempChildObj);
    // console.log($scope.tempChildObj);
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

  $scope.get();

}])

// GET/POST logic
.factory('restful', ['$http', function ($http) {
  return {
    createChild: function (childObj) {
      return $http({
        method: 'POST',
        url: '/children',
        data: childObj
      }).success(function (data, status) {
        console.log('(Create) POST Success! ', data);
        // return data;
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



// temporary object
// {
//   child: {
//     firstName: 'Amar',
//     lastName: 'Patel',
//     phone: '19166008929',
//     gender: 'male',
//     dob: 'my birthday',
//     age: 24,
//     location: 'San Francisco',
//     CFID: '00001A',
//     programArea: 'somewhere',
//     bio: 'Amar hails from a heritage of awesome and bad-assery.'
//   },

//   request: {
//     createdAt: 'dateString',
//     items: [
//       {
//         item: 'bike', 
//         status: null, 
//         price: null, 
//         date: 'itemReceivedDate', 
//         paymentDate: 'somedate',
//         hsaReceivedDate: 'somedate',
//         childReceivedDate: 'somedate'
//       },
//       {
//         item: 'helmet', 
//         status: null, 
//         price: null, 
//         date: 'itemReceivedDate', 
//         paymentDate: 'somedate',
//         hsaReceivedDate: 'somedate',
//         childReceivedDate: 'somedate'
//       },
//       {
//         item: 'babes', 
//         status: null, 
//         price: null, 
//         date: 'itemReceivedDate', 
//         paymentDate: 'somedate',
//         hsaReceivedDate: 'somedate',
//         childReceivedDate: 'somedate'
//       }
//     ]
//   },

//   worker: {
//     firstName: 'Wayland',
//     lastName 'Gangsta-fresh',
//     phone: '12903812124',
//     email: 'someemail',
//     department: 'someDept',
//     supervisorFirstName: 'Marcus',
//     supervisorLastName: 'Phillips',
//     coordinatorFirstName: 'Tony',
//     coordinatorLastName 'Phillips'
//   },

//   donor: {
//     email: 'someemail',
//     address1: '1221 1st ave.',
//     address1: 'apt se1801',
//     city: 'seattle',
//     state: 'washington',
//     zip: '98101',
//     firstName: 'amar',
//     lastName: 'patel',
//     phone: '9166008929'
//   }
// }