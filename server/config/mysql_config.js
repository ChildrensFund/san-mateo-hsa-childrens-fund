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

//These three tables are for user signin. Feel free to modify as needed, but the email, 
// passwordHash, resetToken, and resetTokenSetTime are necessary for auth.
var Donor = sequelize.define('donors', {
  email: { type: Sequelize.STRING, unique: true },
  passwordHash: Sequelize.STRING,
  sessionToken: Sequelize.STRING,
  resetToken: Sequelize.STRING,
  resetTokenSetTime: Sequelize.DATE
});

var Staff = sequelize.define('staffs', {
  email: { type: Sequelize.STRING, unique: true },
  passwordHash: Sequelize.STRING,
  sessionToken: Sequelize.STRING,
  resetToken: Sequelize.STRING,
  resetTokenSetTime: Sequelize.DATE
});

var Admin = sequelize.define('admins', {
  email: { type: Sequelize.STRING, unique: true },
  passwordHash: Sequelize.STRING,
  sessionToken: Sequelize.STRING,
  resetToken: Sequelize.STRING,
  resetTokenSetTime: Sequelize.DATE
});

Child.sync();
Donor.sync();
Staff.sync();
Admin.sync();

module.exports = {
  Child: Child,
  Donor: Donor,
  Staff: Staff,
  Admin: Admin
};
































