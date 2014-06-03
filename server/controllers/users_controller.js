/*jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /donor
 *  path.  */
//    This file is required by (root folder)/server/routes/donor_routes.js

var Staff = require('../config/mysql_config.js').Staff;
var Admin = require('../config/mysql_config.js').Admin;
var HelpDesk = require('../config/mysql_config.js').HelpDesk;
var url = require('url');

var setUserType = function(userPath){
  switch(userPath){
    case '/workers':
      return Staff;
      break;
    case '/admin':
      return Admin;
      break;
    case '/help_desk':
      return HelpDesk;
      break;
    default:
      response.send(404, 'Worker type other than donors/workers/admin was POSTed');
      break;
  }
}

module.exports.getUsers = function(req, res){
  var userPath = url.parse(req.url).pathname;
  var User = setUserType(userPath);
  var page = url.parse(req.url).query.split('=')[1];

  User.findAndCountAll({
    limit: 20,
    offset: (20 * (page-1))
  }).success(function(data){
    var users = data.rows;
    users.unshift(data.count);
    res.send(users);
  });
};