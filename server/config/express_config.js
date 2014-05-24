/*jslint node: true */
'use strict';

/*  This file connects the server to the database, configures the ORM application
 *  to use the physical server's address and port settings, and configure which
 *  routers to use for request url paths.  */
//    This file is required by (root folder)/server/config/express_app.js
var ouput       = require( '../util/output.js' );
var bodyParser  = require( 'body-parser' );
var cookieParser = require( 'cookie-parser' );
var _           = require( 'underscore' );

module.exports = function( app, express, routers ) {
  app.set( 'port', process.env.PORT || 4568 );
  app.set( 'base url', process.env.URL || 'http://localhost' );
  app.use( express.static( __dirname + '/../../client/' ));
  app.use( bodyParser() );
  app.use( cookieParser() );

  //  Connect request paths to their respective routers
  _.each( routers, function( Router ) {
    app.use( Router.path, Router.name );
  } );

};








