var Donor = require('../config/mysql_config.js').Donor;
var Staff = require('../config/mysql_config.js').Staff;
var Admin = require('../config/mysql_config.js').Admin;
var q = require('q');

var setUserType = function(request, response, userType){
  var userType = userType || request.body.userType;
  switch(userType){
    case 'donors':
      return Donor;
      break;
    case 'workers':
      return Staff;
      break;
    case 'admin':
      return Admin;
      break;
    default:
      return undefined;
      break;
  }
}

module.exports = function(request){
  console.log('################## Server-Side: signedIn Function Called ##################');
  var deferred = q.defer();
  var sessionToken = request.cookies.sessionToken;
  var userType = request.cookies.type;
  var whitelist = Array.prototype.slice.call(arguments, 1);

  if(!sessionToken || !userType || sessionToken === 'j:null' || userType === 'j:null'){
    console.log('Signed out (no session token or no userType)');
    console.log('Session Token:', sessionToken);
    console.log('User Type:', userType);
    deferred.resolve({result: false});
  } else {

    var User = setUserType(request, null, userType);
    User.find({where: {sessionToken: sessionToken}}).success(function(user){
      if(!user){
        console.log('Complete: User not signed in');
        deferred.resolve({result: false});
      } else {
        console.log('Complete: User is signed in');
        console.log('Checking to see if whitelisted');
        var found = false;
        for(var i = 0; i < whitelist.length; i++){
          if(whitelist[i] === userType){
            console.log('User is authorized');
            console.log(user.values.id);
            deferred.resolve({
              result: true,
              id: user.values.id,
              userType: userType
            });
            found = true;
          }
        }
        if(found === false){
          console.log('User is not whitelisted, unauthorized');
          deferred.resolve({result: false});
        }
      }
    }).error(function(err){
      console.log('Complete: Server error in db lookup');
      deferred.reject();
    });
  }

  return deferred.promise;
};