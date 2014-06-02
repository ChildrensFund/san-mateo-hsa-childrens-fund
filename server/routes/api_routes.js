/*jslint node: true */
'use strict';

/*  This file contains the configuration for the ApiRouter (see
 *  (root folder)/server/config/express_app.js). Requests with the '/api'
 *  path are handled here. */
//    This file is required by (root folder)/server/config/express_app.js
var controller  = require( '../controllers/api_controller.js' );

module.exports = function( router ) {
  router.route('/children')
    .get( controller.fetchUsers );
  router.route('/children/:id')
    .get( controller.fetchUser )
    .post( controller.editUser );
  router.route('/children/:id/worker')
    .get( controller.fetchChildWorker );
  router.route('/children/:id/donor')
    .get( controller.fetchChildDonor )
    .post( controller.createChildDonor );
  router.route('/workers')
    .get( controller.fetchUsers );
  router.route('/workers/:id')
    .get( controller.fetchUser )
    .post( controller.editUser );
  router.route('/workers/:id/children')
    .get( controller.fetchWorkerChildren )
    .post( controller.createWorkerChild );
  router.route('/donors')
    .get( controller.fetchUsers );
  router.route('/donors/:id')
    .get( controller.fetchUser )
    .post( controller.editUser );
  router.route('/donors/:id/children')
    .get( controller.fetchDonorChildren );
  router.route('/worker')
    .get( controller.fetchWorker );
  router.route('/children/:id/swap')
    .post( controller.swapChildWorker );

};
