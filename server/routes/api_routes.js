/*jslint node: true */
'use strict';

/*  This file contains the configuration for the ApiRouter (see
 *  (root folder)/server/config/express_app.js). Requests with the '/api'
 *  path are handled here. */
//    This file is required by (root folder)/server/config/express_app.js
var controller  = require( '../controllers/api_controller.js' );

module.exports = function( router ) {
  router.route('/children')
    .get()
  router.route('/children/:id')
    .get()
    .post()
  router.route('/children/:id/worker')
    .get()
  router.route('/children/:id/donor')
    .get()
    .post()
  router.route('/workers')
    .get()
  router.route('/workers/:id')
    .get()
    .post()
  router.route('/workers/:id/children')
    .get()
    .post()
  router.route('/donors')
    .get()
  router.route('/donors/:id')
    .get()
    .post()
  router.route('/donors/:id/children')
    .get()

};
