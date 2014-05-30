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
var path = require('path');

var parseUrl = function(req){
  var pathname = url.parse(req.url).pathname;
  var array = pathname.split('/');
  return array;
}

var setUserType = function(userPath){
  switch(userPath){
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
      return undefined;
      break;
  }
}

module.exports.fetchUsers = function(req, res){
  var urlArray = parseUrl(req);
  var User = setUserType(urlArray[1]);
  User.findAll().success(function(users){
    res.send(users);
  });
};

module.exports.fetchUser = function(req, res){
  var urlArray = parseUrl(req);
  var User = setUserType(urlArray[1]);
  var userId = urlArray[2];
  User.findAll({where: {id: userId}}).success(function(user){
    res.send(user);
  })
}

module.exports.editUser = function(req, res){
  var urlArray = parseUrl(req);
  var User = setUserType(urlArray[1]);
  var userId = urlArray[2];
  User.find({where: {id: userId}}).success(function(user){
    user.updateAttributes(req.body).success(function(user){
      res.send(user);
    });
  });
}

// router.route('/children/:id/worker')
  // .get( controller.fetchChildWorker );
module.exports.fetchChildWorker = function(req, res){
  res.send(200);
};

// router.route('/children/:id/donor')
  // .get( controller.fetchChildDonor )
module.exports.fetchChildDonor = function(req, res){
  res.send(200);

};

  // .post( controller.createChildDonor );
module.exports.createChildDonor = function(req, res){
  res.send(200);

};

// router.route('/workers/:id/children')
  // .get( controller.fetchWorkerChildren )
module.exports.fetchWorkerChildren = function(req, res){
  res.send(200);

};

  // .post( controller.createWorkerChild );
module.exports.createWorkerChild = function(req, res){
  res.send(200);

};

// router.route('/donors/:id/children')
//   .get( controller.fetchDonorChildren );
module.exports.fetchDonorChildren = function(req, res){
  res.send(200);

};