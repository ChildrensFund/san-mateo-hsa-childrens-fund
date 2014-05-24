/*jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /donor
 *  path.  */
//    This file is required by (root folder)/server/routes/donor_routes.js

var Donor = require('../config/mysql_config.js').Donor;
var bcrypt = require('bcrypt');

module.exports.signup = function(request, response){
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

};