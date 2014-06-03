/*jslint node: true */
'use strict';

/*  This file contains the configuration for the ChildRouter (see
 *  (root folder)/server/config/express_app.js). Requests with the '/children'
 *  path are handled here. */
//    This file is required by (root folder)/server/config/express_app.js
var controller  = require( '../controllers/users_controller.js' );

module.exports = function( router ) {
  router.route('/workers')
    .get( controller.getUsers );
  router.route('/admin')
    .get( controller.getUsers );
  router.route('/help_desk')
    .get( controller.getUsers );

};
