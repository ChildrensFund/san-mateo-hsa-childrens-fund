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

// router.route('/children')
  // .get( controller.fetchChildren );
module.exports.fetchChildren = function(req, res){
  Child.findAll().success(function(children){
    res.send(children);
  });
};

// router.route('/children/:id')
  // .get( controller.fetchChild )
module.exports.fetchChild = function(req, res){
  var pathname = url.parse(req.url).pathname;
  var childId = pathname.split('/')[2];
  Child.find({where: {id: childId}}).success(function(child){
    res.send(child);
  })
};

  // .post( controller.editChild );
module.exports.editChild = function(req, res){
  res.send(200);
};

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

// router.route('/workers')
  // .get( controller.fetchWorkers );
module.exports.fetchWorkers = function(req, res){
  res.send(200);

};

// router.route('/workers/:id')
  // .get( controller.fetchWorker )
module.exports.fetchWorker = function(req, res){
  res.send(200);

};

  // .post( controller.editWorker );
module.exports.editWorker = function(req, res){
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

// router.route('/donors')
  // .get( controller.fetchDonors );
module.exports.fetchDonors = function(req, res){
  res.send(200);

};

// router.route('/donors/:id')
  // .get( controller.fetchDonor )
module.exports.fetchDonor = function(req, res){
  res.send(200);

};

  // .post( controller.editDonor );
module.exports.editDonor = function(req, res){
  res.send(200);

};

// router.route('/donors/:id/children')
//   .get( controller.fetchDonorChildren );
module.exports.fetchDonorChildren = function(req, res){
  res.send(200);
  
};