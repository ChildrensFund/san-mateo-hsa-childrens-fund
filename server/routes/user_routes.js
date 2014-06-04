/*jslint node: true */
'use strict';

/*  This file contains the configuration for the ChildRouter (see
 *  (root folder)/server/config/express_app.js). Requests with the '/children'
 *  path are handled here. */
//    This file is required by (root folder)/server/config/express_app.js
var controller  = require( '../controllers/users_controller.js' );

module.exports = function( router ) {
  router.route('/workers/accounts')
    .get( controller.getUsersAccountInformation );
  router.route('/admin/accounts')
    .get( controller.getUsersAccountInformation );
  router.route('/help_desk/accounts')
    .get( controller.getUsersAccountInformation );
  router.route('/workers')
    .get( controller.fetchUsers )
  router.route('/children')
    .get( controller.fetchUsers )
};
