/*jslint node: true */
'use strict';

/*  This file creates a connection to a database, then creates the proper schemas,
 *  tables, etc. unless they exist at that database already.  */
 //   This file is required by (root folder)/server/config/express_config.js

var output    = require( '../util/output.js' );
var Sequelize = require('sequelize');
var sequelize = new Sequelize('hsa_cf', 'hsa', '');

var Child = sequelize.define('children', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  phone: Sequelize.INTEGER,
  gender: Sequelize.STRING,
  dob: Sequelize.DATE,
  age: Sequelize.INTEGER,
  location: Sequelize.STRING,
  cfid: Sequelize.STRING,
  programArea: Sequelize.STRING,
  bio: Sequelize.TEXT,
  status: Sequelize.INTEGER,
  firstItemName: Sequelize.STRING,
  firstItemPrice: Sequelize.DECIMAL,
  firstItemHsaReceivedDate: Sequelize.DATE,
  firstItemChildReceivedDate: Sequelize.DATE,
  secondItemName: Sequelize.STRING,
  secondItemPrice: Sequelize.DECIMAL,
  secondItemHsaReceivedDate: Sequelize.DATE,
  secondItemChildReceivedDate: Sequelize.DATE,
  thirdItemName: Sequelize.STRING,
  thirdItemPrice: Sequelize.DECIMAL,
  thirdItemHsaReceivedDate: Sequelize.DATE,
  thirdItemChildReceivedDate: Sequelize.DATE
});

//These three tables are for user signin. Feel free to modify as needed, but the email, 
// passwordHash, resetToken, and resetTokenSetTime are necessary for auth.
var Donor = sequelize.define('donors', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  phone: Sequelize.INTEGER,
  email: Sequelize.STRING,
  address1: Sequelize.STRING,
  address2: Sequelize.STRING,
  city: Sequelize.STRING,
  state: Sequelize.STRING,
  zip: Sequelize.INTEGER
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

var HelpDesk = sequelize.define('helpdesks', {
  email: { type: Sequelize.STRING, unique: true },
  passwordHash: Sequelize.STRING,
  sessionToken: Sequelize.STRING,
  resetToken: Sequelize.STRING,
  resetTokenSetTime: Sequelize.DATE
})

Child.sync();
Donor.sync();
Staff.sync();
Admin.sync();
HelpDesk.sync();

Donor.hasMany(Child);
Child.hasOne(Donor);
Child.belongsTo(Staff);
Staff.hasMany(Child);

module.exports = {
  Child: Child,
  Donor: Donor,
  Staff: Staff,
  Admin: Admin,
  HelpDesk: HelpDesk
};
































