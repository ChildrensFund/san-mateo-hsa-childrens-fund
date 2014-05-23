/*jslint node: true */
'use strict';

/*  This file connects the server to the database, configures the ORM application
 *  to use the physical server's address and port settings, and configure which
 *  routers to use for request url paths.  */
//    This file is required by (root folder)/server/config/express_app.js
var ouput       = require( '../util/output.js' );
var _db         = require( './mysql_config.js' );   //  Configures database
var bodyParser  = require( 'body-parser' );
var _           = require( 'underscore' );

module.exports = function( app, express, routers ) {
  app.set( 'port', process.env.PORT || 4568 );
  app.set( 'base url', process.env.URL || 'http://localhost' );
  app.set( 'database', _db );
  app.use( express.static( __dirname + '/../../client/' ));
  app.use( bodyParser() );
  
  //  Connect request paths to their respective routers
  _.each( routers, function( Router ) {
    app.use( Router.path, Router.name );
  } );
  
};








