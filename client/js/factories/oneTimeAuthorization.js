app.factory('oneTimeAuthorization', function(){
  var authorized = false;
  return {
    authorize: function(){
      authorized = true;
    },
    isAuthorized: function(){
      var temp = authorized;
      authorized = false;
      return temp;
    }
  }
});