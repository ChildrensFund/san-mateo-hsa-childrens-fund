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
  phone: Sequelize.STRING,
  gender: Sequelize.STRING,
  dob: Sequelize.STRING,
  age: Sequelize.INTEGER,
  location: Sequelize.STRING,
  cfid: {type: Sequelize.STRING, unique: true},
  programArea: Sequelize.STRING,
  image: Sequelize.STRING,
  bio: Sequelize.TEXT,
  status: Sequelize.INTEGER,
  hsaStatus: Sequelize.INTEGER,
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
  zip: Sequelize.INTEGER,
  childrensFund: Sequelize.STRING,
  maureen: Sequelize.STRING,
  schoolSupply: Sequelize.STRING,
  dental: Sequelize.STRING,
  costumes: Sequelize.STRING,
  paymentMethod: Sequelize.STRING
});

var Staff = sequelize.define('staffs', {
  email: { type: Sequelize.STRING, unique: true },
  passwordHash: Sequelize.STRING,
  sessionToken: Sequelize.STRING,
  resetToken: Sequelize.STRING,
  resetTokenSetTime: Sequelize.DATE,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  phone: Sequelize.STRING,
  department: Sequelize.STRING,
  supervisorFirstName: Sequelize.STRING,
  supervisorLastName: Sequelize.STRING,
  coordinatorFirstName: Sequelize.STRING,
  coordinatorLastName: Sequelize.STRING,
  hasAccess: {type: Sequelize.BOOLEAN, defaultValue: true}
});

var Admin = sequelize.define('admins', {
  email: { type: Sequelize.STRING, unique: true },
  passwordHash: Sequelize.STRING,
  sessionToken: Sequelize.STRING,
  resetToken: Sequelize.STRING,
  resetTokenSetTime: Sequelize.DATE,
  hasAccess: {type: Sequelize.BOOLEAN, defaultValue: true}
});

var HelpDesk = sequelize.define('helpdesks', {
  email: { type: Sequelize.STRING, unique: true },
  passwordHash: Sequelize.STRING,
  sessionToken: Sequelize.STRING,
  resetToken: Sequelize.STRING,
  resetTokenSetTime: Sequelize.DATE,
  hasAccess: {type: Sequelize.BOOLEAN, defaultValue: true}
});

Donor.hasMany(Child);
Staff.hasMany(Child);
Child.hasOne(Donor);
Child.hasOne(Staff);

Child.sync();
Donor.sync();
Staff.sync();
Admin.sync();
HelpDesk.sync();


module.exports = {
  Child: Child,
  Donor: Donor,
  Staff: Staff,
  Admin: Admin,
  HelpDesk: HelpDesk,
  sequelize: sequelize
};
































