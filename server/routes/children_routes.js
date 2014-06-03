/*jslint node: true */
'use strict';

/*  This file contains the configuration for the ChildRouter (see
 *  (root folder)/server/config/express_app.js). Requests with the '/children'
 *  path are handled here. */
//    This file is required by (root folder)/server/config/express_app.js
var controller  = require( '../controllers/children_controllers.js' );

module.exports = function( router ) {
  router.route('/')
    .get( controller.get )
    .post( controller.post );
};
