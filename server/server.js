/*jslint node: true */
'use strict';

/*  This application will require the following npm modules to be installed:
 *    express
 *    mysql
 *    sequelize
 *    underscore
 *    q
 *    body-parser
 *    cookie-parser
 *    nodemailer
 *    bcrypt-nodejs
 *    busboy
 *    connect-busboy
 */
var expressApp  = require( './config/express_app.js' );
var output      = require( './util/output.js' );

var port        = expressApp.get( 'port' );
var listenMsg   = 'Listening on port ' + port;

expressApp.listen( port );
output.log( listenMsg );
