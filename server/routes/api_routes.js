/*jslint node: true */
'use strict';

/*  This file contains the configuration for the ApiRouter (see
 *  (root folder)/server/config/express_app.js). Requests with the '/api'
 *  path are handled here. */
//    This file is required by (root folder)/server/config/express_app.js
var controller  = require( '../controllers/api_controller.js' );

module.exports = function( router ) {
  router.route('/children')
    .get( controller.fetchChildren );
  router.route('/children/:id')
    .get( controller.fetchChild )
    .post( controller.editChild );
  router.route('/children/:id/worker')
    .get( controller.fetchChildWorker );
  router.route('/children/:id/donor')
    .get( controller.fetchChildDonor )
    .post( controller.createChildDonor );
  router.route('/workers')
    .get( controller.fetchWorkers );
  router.route('/workers/:id')
    .get( controller.fetchWorker )
    .post( controller.editWorker );
  router.route('/workers/:id/children')
    .get( controller.fetchWorkerChildren )
    .post( controller.createWorkerChild );
  router.route('/donors')
    .get( controller.fetchDonors );
  router.route('/donors/:id')
    .get( controller.fetchDonor )
    .post( controller.editDonor );
  router.route('/donors/:id/children')
    .get( controller.fetchDonorChildren );

};
