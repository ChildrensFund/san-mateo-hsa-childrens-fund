app.controller('usersController', ['$scope', '$http', '$state', function($scope, $http, $state){

  $state.current.name === 'admin.account.accountManagement.workers' ||
  $state.current.name === 'helpDesk.account.accountManagement.workers' ? $scope.workerPage = true : $scope.workerPage = false;

  $scope.fetchUsers = function(page){
    var queryString = '';
    if($scope.userQuery){
      var userQuery = $scope.userQuery;
      $scope.userQuery = '';
      queryString = '&query=' + userQuery;
    }
    $scope.page = page;
    $http({
      method: 'GET',
      url: '/users' + $state.current.url + '/accounts' + '?page=' + page + queryString
    }).success(function(users){
      console.log('Users fetched successfully');
      $scope.page = page;
      $scope.numUsers = users.shift();
      $scope.users = users;
      $scope.pages = [];
      for(var i = 0; i < $scope.numUsers/20; i++){
        $scope.pages.push(i + 1);
      }
    }).error(function(err){
      console.log('Users not fetched successfully: Server Error');
    })
  }

  //Only fetch users if on one of the account management pages that's NOT create
  if($state.current.name !== 'admin.account.accountManagement.create' && 
     $state.current.name !== 'helpDesk.account.accountManagement.create'){
    $scope.fetchUsers(1); 
  }

  $scope.issuePasswordReset = function(user){
    user.waitPasswordReset = 1;
    $http({
      method: 'POST',
      url: '/auth/sendReset',
      data: {
        userType: $state.current.name.split('.')[3],
        email: user.email
      }
    }).success(function(data, status){
      user.waitPasswordReset = 2;
      console.log('Reset token sent');
    }).error(function(data, status){
      user.waitPasswordReset = 3;
      console.log('Reset token not sent: Server Error');
    });
  };

  $scope.revokeAccess = function(user){
    var userType;
    user.waitAccess = 1;
    switch($state.current.url){
      case '/help_desk':
        userType = 'helpDesk';
        break;
      case '/admin':
        userType = 'admin';
        break;
      case '/workers':
        userType = 'workers';
        break;
      default:
        break;
    }
    $http({
      method: 'POST',
      url: '/auth/access',
      data: {
        id: user.id,
        hasAccess: false,
        userType: userType
      }
    }).success(function(){
      user.waitAccess = 2;
      console.log('User access revoked');
      user.hasAccess = false;
    }).error(function(){
      user.waitAccess = 3;
      console.log('Something went wrong');
    })
  };

  $scope.grantAccess = function(user){
    var userType;
    user.waitAccess = 1;
    switch($state.current.url){
      case '/help_desk':
        userType = 'helpDesk';
        break;
      case '/admin':
        userType = 'admin';
        break;
      case '/workers':
        userType = 'workers';
        break;
      default:
        break;
    }
    $http({
      method: 'POST',
      url: '/auth/access',
      data: {
        id: user.id,
        hasAccess: true,
        userType: userType
      }
    }).success(function(){
      user.waitAccess = 2;
      console.log('User access granted');
      user.hasAccess = true;
    }).error(function(){
      user.waitAccess = 3;
      console.log('Something went wrong');
    });
  };
}]);