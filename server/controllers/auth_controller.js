/*jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /donor
 *  path.  */
//    This file is required by (root folder)/server/routes/donor_routes.js

var Donor = require('../config/mysql_config.js').Donor;
var Staff = require('../config/mysql_config.js').Staff;
var Admin = require('../config/mysql_config.js').Admin;
var HelpDesk = require('../config/mysql_config.js').HelpDesk;
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');

var transport = nodemailer.createTransport("Direct", {debug: true});

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
    case 'helpDesk':
      return HelpDesk;
      break;
    default:
      response.send(404, 'Worker type other than donors/workers/admin was POSTed');
      break;
  }
}

module.exports.signedIn = function(request, response){
  console.log('################## signedIn Function Called ##################');
  var sessionToken = request.cookies.sessionToken;
  var userType = request.cookies.type;

  if(!sessionToken || !userType || sessionToken === 'j:null' || userType === 'j:null'){
    console.log('Signed out (no session token or no userType)');
    console.log('Session Token:', sessionToken);
    console.log('User Type:', userType);
    if(response) response.send(200, { signedIn: false });
    return false;
  } else {

    if(userType !== request.body.userType){
      console.log('Complete: Unauthorized');
      if(response) response.send(200, { signedIn: false });
      return false;
    }

    var User = setUserType(request, response, userType);
    User.find({where: {sessionToken: sessionToken}}).success(function(user){
      if(!user){
        console.log('Complete: User not signed in');
        if(response) response.send(200, { signedIn: false });
        return false;
      } else {
        console.log('Complete: User is signed in');
        if(response) response.send(200, { signedIn: true });
        return true;
      }
    }).error(function(err){
      console.log('Complete: Server error in db lookup');
      if(response) response.send(500, 'Sequelize failure on DB lookup');
      return undefined;
    });
  }
};

module.exports.signup = function(request, response){
  console.log('################## signup FUNCTION CALLED ##################');
  var email = request.body.email;
  var password = request.body.password;
  var User = setUserType(request, response);
  // Hash password
  bcrypt.hash(password, 8, function(err, hash){
    console.log(email);
    console.log(hash);
    User.create({
      email: email,
      passwordHash: hash
    }).success(function(a){
      console.log('User is now signed up')
      response.send(201, {
        id: a.getDataValue('id'),
        createdAt: a.getDataValue('createdAt'),
        updatedAt: a.getDataValue('updatedAt')
      });
    }).error(function(err){
      response.send(500);
    });
  });
};

module.exports.signin = function(request, response){
  console.log('################## signin FUNCTION CALLED ##################');
  var email = request.body.email;
  var password = request.body.password;
  var User = setUserType(request, response);
  User.find({where: {email: email}}).success(function(user){
    if(!user){
      console.log('user not found');
      response.send(404, 'User not found');
    } else {
      bcrypt.compare(password, user.getDataValue('passwordHash'), function(err, isValid){
        if(isValid){
          console.log('User found, welcome', user.getDataValue('email'));
          console.log('Creating Session Token');
          bcrypt.hash(Math.random().toString(), 8, function(err, hash){
            console.log('Your hash is:', hash);
            user.sessionToken = hash;
            user.save(['sessionToken']).success(function(user){
              console.log('Session Token Saved to DB, save', hash, 'to user cookies');
              console.log('User is now signed in');
              response.send({sessionToken: hash, type: request.body.userType, id: user.getDataValue('id')});
            });
          });
        } else {
          console.log('Invalid login information');
          response.send(401, 'Invalid login information');
        }
      });
    }
  });
};

module.exports.signout = function(request, response){
  console.log('################## SIGNOUT FUNCTION CALLED ##################');
  var sessionToken = request.cookies.sessionToken;
  var userType = request.cookies.type;
  if (sessionToken === 'j:null' || sessionToken === undefined || userType === 'j:null' || userType === undefined) {
    console.log('Session token null, doing nothing');
    response.send(200);
  } else {
    var User = setUserType(request, response, userType);
    User.find({where: {sessionToken: sessionToken}}).success(function(user){
      if (!user) {
        console.log('User not found in database, clearing session token');
        response.cookie('type', null);
        response.cookie('sessionToken', null);
        response.send(204, 'User signed out');
      } else {
        console.log('User found in database, clearing session token and database token')
        // response.cookie('sessionToken', null);
        // response.cookie('type', null);
        // response.cookie('id', null);
        user.sessionToken = null;
        user.save(['sessionToken']).success(function(user){
          console.log('User session token cleared out of database + session');
          console.log('User is now signed out')
          response.send(204, 'User signed out');
        });
      }
    });
  }
};

module.exports.sendReset = function(request, response){
  console.log('################## sendReset FUNCTION CALLED ##################');
  var email = request.body.email;
  var User = setUserType(request, response);
  var userType = request.body.userType;
  User.find({where: {email: email}}).success(function(user){
    if(!user){
      console.log('Complete: email not found in database');
      response.send(404, 'User email not found');
    } else {
      console.log('User found, hashing new reset token');
      bcrypt.hash(Math.random().toString(), 8, function(err, hash){
        console.log('Hash created successfully, attempting to save to database');
        hash = hash.replace(/\.|\/|\$/g, '');
        user.resetToken = hash;
        user.save(['resetToken']).success(function(user){
          console.log('resetToken saved successfully');
          console.log('Complete: resetToken is:', hash);

          var htmlString;
          switch(userType){
            case 'workers':
              htmlString = '<a href="http://localhost:4568/workers/reset_password/' + hash + '">Reset Link</a>';
              break;
            case 'admin':
              htmlString = '<a href="http://localhost:4568/admin/reset_password/' + hash + '">Reset Link</a>';
              break;
            case 'helpDesk':
              htmlString = '<a href="http://localhost:4568/help_desk/reset_password/' + hash + '">Reset Link</a>';
              break;
          }

          var message = {
            from: 'HSA CF TEST <hsacf@example.com>',
            to: '"" <' + user.email + ' >',
            subject: 'HSA CF TEST Password Reset',
            html: htmlString
          };

          transport.sendMail(message, function(error, response){
            if (error) {
              console.log('Error occured');
              console.log(error.message);
            } else {
              console.log(response);
              console.log('Message sent successfully!');
            }
          });

          response.send(204, 'Reset Token Generated');
        });
      });
    }
  })
};

module.exports.resetPassword = function(request, response){
  console.log('################## resetPassword FUNCTION CALLED ##################');
  var password = request.body.password;
  var resetToken = request.body.resetToken;
  var User = setUserType(request, response);
  User.find({where: {resetToken: resetToken}}).success(function(user){
    if(!user){
      console.log('Complete: No user found with resetToken');
      response.send(404, 'Invalid Reset Token');
    } else {
      console.log('User found, hashing new password');
      bcrypt.hash(password, 8, function(err, hash){
        console.log('Password successfully hashed, saving to database and clearing resetToken');
        user.resetToken = null;
        user.passwordHash = hash;
        user.save(['passwordHash', 'resetToken']).success(function(user){
          console.log('Complete: Password successfully saved');
          response.send(204, 'Password Saved Successfully');
        }).error(function(err){
          console.log('Complete: Error saving to the database:', err);
          response.send(500, 'Error saving to the database');
        });
      })
    }
  })
};