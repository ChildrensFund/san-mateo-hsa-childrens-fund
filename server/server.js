'use strict';

/*  This application will require the following npm modules to be installed:
 *    express
 *    mysql
 *    knex
 *    bookshelf
 *    body-parser
 *    underscore
 *    q
 */
var expressApp  = require( './config/express_app.js' );
var output      = require( './util/output.js' );

var port        = expressApp.get( 'port' );
var listenMsg   = 'Listening on ' + expressApp.get( 'base url' ) + ':' + port;

expressApp.listen( port );
output.log( listenMsg );
