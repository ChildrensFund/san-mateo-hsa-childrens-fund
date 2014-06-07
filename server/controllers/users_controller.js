/*jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /donor
 *  path.  */
//    This file is required by (root folder)/server/routes/donor_routes.js

var Child = require('../config/mysql_config.js').Child;
var Donor = require('../config/mysql_config.js').Donor;
var Staff = require('../config/mysql_config.js').Staff;
var Admin = require('../config/mysql_config.js').Admin;
var HelpDesk = require('../config/mysql_config.js').HelpDesk;
var url = require('url');
var Sequelize = require('../lib/sequelize');

var parseUrl = function(req){
  var pathname = url.parse(req.url).pathname;
  var array = pathname.split('/');
  if(url.parse(req.url).query){
    var page = url.parse(req.url).query.split('=')[1];
    var query = url.parse(req.url).query.split('=')[2];
  }
  return {
    pathArray: array,
    page: page,
    query: query
  };
}

var setUserType = function(userPath){
  switch(userPath){
    case '/workers/accounts':
      return Staff;
      break;
    case '/admin/accounts':
      return Admin;
      break;
    case '/help_desk/accounts':
      return HelpDesk;
      break;
    case 'workers':
      return Staff;
      break;
    case 'children':
      return Child;
      break;
    case 'donors':
      return Donor;
      break;
    default:
      break;
  }
}

module.exports.getUsersAccountInformation = function(req, res){
  console.log('called');
  var userPath = url.parse(req.url).pathname;
  var User = setUserType(userPath);
  var page = url.parse(req.url).query.split('=')[1];
  var query = url.parse(req.url).query.split('=')[2];
  var sqlQuery;
  query ? sqlQuery = ["lastName LIKE '" + query + "%'"] : '';

  User.findAndCountAll({
    where: sqlQuery,
    order: 'lastName ASC',
    limit: 20,
    offset: (20 * (page-1))
  }).success(function(data){
    var users = Sequelize.Utils._.map(data.rows, function(user){
      user.passwordHash = 'protected';
      user.sessionToken = 'protected';
      user.resetToken = 'protected';
      user.resetTokenSetTime = 'protected';
      console.log(user);
      return user;
    });
    users.unshift(data.count);
    res.send(users);
  });
};

module.exports.fetchUsers = function(req, res){
  var page = parseUrl(req).page;
  var query = parseUrl(req).query;
  var urlArray = parseUrl(req).pathArray;
  var User = setUserType(urlArray[1]);
  var sqlQuery;
  query ? sqlQuery = ["lastName LIKE '" + query + "%'"] : '';

  User.findAndCountAll({
    where: sqlQuery,
    order: 'lastName ASC',
    limit: 20,
    offset: (20 * (page-1))
  }).success(function(results){
    var array = results.rows;
    //If User is children, we need to sanitize these rows before we do anything because
    //this JSON will be passed back to clients at the root
    if(User === Child){
      console.log('child detected, sanitizing output');
      array = Sequelize.Utils._.map(results.rows, function(child){
        return {
          id: child.id,
          cfid: child.cfid,
          phone: child.phone,
          gender: child.gender,
          age: child.age,
          location: child.location,
          programArea: child.programArea,
          createdAt: child.createdAt,
          firstName: child.firstName,
          lastName: child.lastName,
          bio: child.bio,
          status: child.status,
          hsaStatus: child.hsaStatus
        }
      })
    } else {
      array = Sequelize.Utils._.map(results.rows, function(user){
        user.passwordHash = 'protected';
        user.sessionToken = 'protected';
        user.resetToken = 'protected';
        user.resetTokenSetTime = 'protected';
        return user;
      })
    }
    array.unshift(results.count);
    res.send(array);
  });
};