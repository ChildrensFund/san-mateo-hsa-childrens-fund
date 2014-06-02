/*jslint node: true */
'use strict';

/*  This file contains the configuration for the ApiRouter (see
 *  (root folder)/server/config/express_app.js). Requests with the '/api'
 *  path are handled here. */
//    This file is required by (root folder)/server/config/express_app.js
var controller  = require( '../controllers/images_controller.js' );

module.exports = function( router ) {
  router.route('/images')
    .get ( controller.get )
    .post( controller.post );
};
