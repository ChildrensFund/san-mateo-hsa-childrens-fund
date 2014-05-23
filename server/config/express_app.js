'use strict';

/*  This creates the application objects for this Node/Express server application  */
//    This file is required by (root folder)/server/server.js
var express = require( 'express' );
var _       = require( 'underscore' );

//  Create ORM application and routers
var app         = express();
var ChildRouter = express.Router();

//  Collect routers for ease of reference
var routers   = {};
routers.Child = { name: ChildRouter, path: '/children', handler: '../routes/children_routes.js' };

//  Configure the app
require( './express_config.js' )( app, express, routers );

//  Configure the routers to handle requests
_.each( routers, function( Router ) {
  require( Router.handler )( Router.name );
} );

module.exports = app;






















