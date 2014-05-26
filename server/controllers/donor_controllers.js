/*jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /donor
 *  path.  */
//    This file is required by (root folder)/server/routes/donor_routes.js

var Donor = require('../config/mysql_config.js').Donor;
var bcrypt = require('bcrypt');
var signedIn = require('../lib/auth/auth.js').signedIn;

module.exports.signedIn = function(request, response){
  signedIn(request);
  response.send(201);
};

module.exports.signup = function(request, response){
  console.log('################## SIGNUP FUNCTION CALLED ##################');
  var email = request.body.email;
  var password = request.body.password;
  // Hash password
  bcrypt.hash(password, 8, function(err, hash){
    console.log(email);
    console.log(hash);
    Donor.create({
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
  console.log('################## SIGNIN FUNCTION CALLED ##################');
  var email = request.body.email;
  var password = request.body.password;
  Donor.find({where: {email: email}}).success(function(donor){
    if(!donor){
      console.log('user not found');
    } else {
      bcrypt.compare(password, donor.getDataValue('passwordHash'), function(err, isValid){
        if(isValid){
          console.log('User found, welcome', donor.getDataValue('email'));
          console.log('Creating Session Token');
          bcrypt.hash(Math.random().toString(), 8, function(err, hash){
            console.log('Your hash is:', hash);
            donor.sessionToken = hash;
            donor.save(['sessionToken']).success(function(donor){
              console.log('Session Token Saved to DB, save', hash, 'to user cookies');
              console.log('User is now signed in')
              response.cookie('sessionToken', hash);
              response.cookie('type', 'donor');
              response.send(201);
            });
          });
        } else {
          console.log('Invalid login information');
        }
      });
    }
  });
};

module.exports.signout = function(request, response){
  console.log('################## SIGNOUT FUNCTION CALLED ##################');
  var sessionToken = request.cookies.sessionToken;
  if (sessionToken === 'j:null') {
    console.log('Session token null, doing nothing');
    response.send(200);
  } else {
    Donor.find({where: {sessionToken: sessionToken}}).success(function(donor){
      if (!donor) {
        console.log('Donor not found in database, clearing session token');
        response.cookie('type', null);
        response.cookie('sessionToken', null);
        response.send(200);
      } else {
        console.log('Donor found in database, clearing session token and database token')
        response.cookie('sessionToken', null);
        response.cookie('type', null);
        donor.sessionToken = null;
        donor.save(['sessionToken']).success(function(donor){
          console.log('Donor session token cleared out of database + session');
          console.log('User is now signed out')
          response.send(200);
        });
      }
    });
  }
};

module.exports.sendReset = function(request, response){
  console.log('################## sendReset FUNCTION CALLED ##################');
  var email = request.body.email;
  Donor.find({where: {email: email}}).success(function(donor){
    if(!donor){
      console.log('Complete: email not found in database');
      response.send(404);
    } else {
      console.log('Donor found, hashing new reset token');
      bcrypt.hash(Math.random().toString(), 8, function(err, hash){
        console.log('Hash created successfully, attempting to save to database');
        hash = hash.replace(/\.|\/|\$/g, '');
        donor.resetToken = hash;
        donor.save(['resetToken']).success(function(donor){
          console.log('resetToken saved successfully')
          console.log('Complete: resetToken is:', hash);
          response.send(201);
        });
      });
    }
  })
};

module.exports.resetPassword = function(request, response){
  console.log('################## resetPassword FUNCTION CALLED ##################');
  var password = request.body.password;
  var resetToken = request.body.resetToken;
  Donor.find({where: {resetToken: resetToken}}).success(function(donor){
    if(!donor){
      console.log('Complete: No donor found with resetToken');
      response.send(404);
    } else {
      console.log('Donor found, hashing new password');
      bcrypt.hash(password, 8, function(err, hash){
        console.log('Password successfully hashed, saving to database and clearing resetToken');
        donor.resetToken = null;
        donor.passwordHash = hash;
        donor.save(['passwordHash', 'resetToken']).success(function(donor){
          console.log('Complete: Password successfully saved');
          response.send(201);
        }).error(function(err){
          console.log('Complete: Error saving to the database:', err);
        });
      })
    }
  })
};