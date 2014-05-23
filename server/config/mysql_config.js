/*jslint node: true */
'use strict';

/*  This file creates a connection to a database, then creates the proper schemas,
 *  tables, etc. unless they exist at that database already.  */
 //   This file is required by (root folder)/server/config/express_config.js

var output    = require( '../util/output.js' );
var Sequelize = require('sequelize');
var sequelize = new Sequelize('hsa_cf', 'hsa', '');

var Child = sequelize.define('children', {
  name: Sequelize.STRING,
  requestItem: Sequelize.STRING,
  requestItemStatus: Sequelize.BOOLEAN
});

Child.sync();

module.exports = Child;
































