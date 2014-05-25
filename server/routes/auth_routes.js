/*jslint node: true */
'use strict';

/*  This file contains the configuration for the DonorsRouter (see
 *  (root folder)/server/config/express_app.js). Requests with the '/donors'
 *  path are handled here. */
//    This file is required by (root folder)/server/config/express_app.js
var controller  = require( '../controllers/auth_controller.js' );

module.exports = function( router ) {
  router.route('/signup')
    .post( controller.signup );
  router.route('/signin')
    .post( controller.signin );
  router.route('/signout')
    .post( controller.signout );
  router.route('/signedIn')
    .post( controller.signedIn );
  router.route('/sendReset')
    .post( controller.sendReset );
  router.route('/resetPassword')
    .post( controller.resetPassword );
};
