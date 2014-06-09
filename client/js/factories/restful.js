app.factory('restful', ['$http', '$cookies', function ($http, $cookies) {
  return {

    createChild: function (childObj) {
      return $http({
        method: 'POST',
        url: '/api/workers/' + $cookies.id + '/children',
        data: childObj
      }).success(function (data, status) {
        console.log('(postChild) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(postChild) POST Error! ', data, status);
      });
    },

    updateChild: function (childObj) {
      return $http({
        method: 'POST',
        url: '/api/children/' + childObj.id,
        data: childObj
      }).success(function (data, status) {
        console.log('(updateChild) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(updateChild) POST Error! ', data, status);
      });
    },

    getChildren: function (pageNumber) {
      var queryUrl = '/api/children';
      if(pageNumber){
        queryUrl += '?page=' + pageNumber;
      }
      return $http({
        method: 'GET',
        url: queryUrl
      }).success(function (data, status) {
        console.log('(getChildren) GET Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(getChildren) GET Error! ', data, status);
      });
    },

    getWorkersChildren: function () {
      return $http({
        method: 'GET',
        url: '/api/workers/' + $cookies.id + '/children',
      }).success(function (data, status) {
        console.log('(getWorkersChildren) GET Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(getWorkersChildren) GET Error! ', data, status);
      });
    },

    getWorkerData: function () {
      return $http({
        method: 'GET',
        url: '/api/workers/' + $cookies.id
      }).success(function (data, status) {
        console.log('(getWorkerData) GET Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(getWorkerData) GET Error! ', data, status);
      });
    },

    postWorkerData: function (workerObj) {
      return $http({
        method: 'POST',
        url: '/api/workers/' + $cookies.id,
        data: workerObj
      }).success(function (data, status) {
        console.log('(postWorkerData) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(postWorkerData) POST Error! ', data, status);
      });
    },

    getChildsDonor: function (id) {
      return $http({
        method: 'GET',
        url: '/api/children/' + id + '/donor'
      }).success(function (data, status) {
        console.log('(getChildsDonor) GET Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(getChildsDonor) GET Error! ', data, status);
      });
    },

    postDonor: function (postObj) {
      return $http({
        method: 'POST',
        url: '/api/children/' + postObj.id + '/donor',
        data: postObj.donor
      }).success(function (data, status) {
        console.log('(postDonor) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(postDonor) POST Error! ', data, status);
      });
    },

    updateDonor: function (postObj) {
      return $http({
        method: 'POST',
        url: '/api/donors/' + postObj.id,
        data: postObj
      }).success(function (data, status) {
        console.log('(updateDonor) POST Success! ', data);
        return data;
      }).error(function (data, status) {
        console.log('(updateDonor) POST Error! ', data, status);
      });
    }

  }
}]);