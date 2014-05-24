var Staff = require('../../config/mysql_config.js').Staff;
var Admin = require('../../config/mysql_config.js').Admin;
var Donor = require('../../config/mysql_config.js').Donor;
var bcrypt = require('bcrypt');

module.exports.signedIn = function(request){
  console.log('########## signedIn Function Called ############');
  var sessionToken = request.cookies.sessionToken;
  var type = request.cookies.type;

  if(!sessionToken || !type || sessionToken === 'j:null' || type === 'j:null'){
    console.log('Signed out (no session token or no type)');
    console.log('Session Token:', sessionToken);
    console.log('Type:', type);
    return false;
  }

  switch (type) {
    case 'donor':
      Donor.find({where: {sessionToken: sessionToken}}).success(function(donor){
        if (donor) {
          console.log('Signed in');
          return true;
        } else {
          console.log('Signed out (user not found)');
          return false;
        }
      });
      break;
    case 'staff':
      break;
    case 'admin':
      break;
  }

}