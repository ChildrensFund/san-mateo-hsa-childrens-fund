/*jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /donor
 *  path.  */
//    This file is required by (root folder)/server/routes/donor_routes.js

var Donor = require('../config/mysql_config.js').Donor;
var Staff = require('../config/mysql_config.js').Staff;
var Admin = require('../config/mysql_config.js').Admin;
var HelpDesk = require('../config/mysql_config.js').HelpDesk;

// router.route('/children')
  // .get( controller.fetchChildren );
module.exports.fetchChildren = function(req, res){};

// router.route('/children/:id')
  // .get( controller.fetchChild )
module.exports.fetchChild = function(req, res){};

  // .post( controller.editChild );
module.exports.editChild = function(req, res){};

// router.route('/children/:id/worker')
  // .get( controller.fetchChildWorker );
module.exports.fetchChildWorker = function(req, res){};

// router.route('/children/:id/donor')
  // .get( controller.fetchChildDonor )
module.exports.fetchChildDonor = function(req, res){};

  // .post( controller.createChildDonor );
module.exports.createChildDonor = function(req, res){};

// router.route('/workers')
  // .get( controller.fetchWorkers );
module.exports.fetchWorkers = function(req, res){};

// router.route('/workers/:id')
  // .get( controller.fetchWorker )
module.exports.fetchWorker = function(req, res){};

  // .post( controller.editWorker );
module.exports.editWorker = function(req, res){};

// router.route('/workers/:id/children')
  // .get( controller.fetchWorkerChildren )
module.exports.fetchWorkerChildren = function(req, res){};

  // .post( controller.createWorkerChild );
module.exports.createWorkerChild = function(req, res){};

// router.route('/donors')
  // .get( controller.fetchDonors );
module.exports.fetchDonors = function(req, res){};

// router.route('/donors/:id')
  // .get( controller.fetchDonor )
module.exports.fetchDonor = function(req, res){};

  // .post( controller.editDonor );
module.exports.editDonor = function(req, res){};

// router.route('/donors/:id/children')
//   .get( controller.fetchDonorChildren );
module.exports.fetchDonorChildren = function(req, res){};