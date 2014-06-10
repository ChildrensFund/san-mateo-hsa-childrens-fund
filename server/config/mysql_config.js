/*jslint node: true */
'use strict';

/*  This file creates a connection to a database, then creates the proper schemas,
 *  tables, etc. unless they exist at that database already.  */
//    This file is required by controller files, which are each invoked in
//    (root folder)/server/config/express_app.js. The controller files that require
//    this file are located in (root folder)/server/controllers
var output    = require( '../util/output.js' );
var Sequelize = require( '../lib/sequelize' );
var sequelize;

if ( process.env.PORT ) {
  var parseData   = function( id ) {
    var _AzureDB    = process.env['MYSQLCONNSTR_hsa-cf-db'];
    var itr         = (_AzureDB.indexOf( id )) + id.length;
    if ( itr === -1 ) { return null; }
    var currentChar = '';
    var result      = '';
    
    while (  (itr < _AzureDB.length)
          && ((currentChar = _AzureDB.charAt( itr )) && (currentChar !== ';')) ) {
      result += currentChar;
      itr++;
    }
    
    return ( result === '' ) ? null : result;
  };
  var dbHost      = parseData( 'Data Source=' );
  var dbName      = parseData( 'Database=' );
  var dbUser      = parseData( 'User Id=' );
  var dbPassword  = parseData( 'Password=' );
  
  sequelize = new Sequelize( dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'mysql'
  } );
} else {
  sequelize = new Sequelize( 'hsa_cf', 'hsa', '' );
}

var Child = sequelize.define('children', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  phone: Sequelize.STRING,
  gender: Sequelize.STRING,
  sortedByDate: Sequelize.STRING,
  dob: Sequelize.STRING,
  completedDate: Sequelize.STRING,
  receivedDate: Sequelize.STRING,
  inactiveDate: Sequelize.STRING,
  age: Sequelize.INTEGER,
  location: Sequelize.STRING,
  cfid: {type: Sequelize.STRING, unique: true},
  programArea: Sequelize.STRING,
  image: Sequelize.STRING,
  bio: Sequelize.TEXT,
  status: {type: Sequelize.INTEGER, defaultValue: 0},
  hsaStatus: {type: Sequelize.INTEGER, defaultValue: 0},
  firstItemName: Sequelize.STRING,
  firstItemPrice: Sequelize.STRING,
  secondItemName: Sequelize.STRING,
  secondItemPrice: Sequelize.STRING,
  thirdItemName: Sequelize.STRING,
  thirdItemPrice: Sequelize.STRING
});

//These three tables are for user signin. Feel free to modify as needed, but the email, 
// passwordHash, resetToken, and resetTokenSetTime are necessary for auth.
var Donor = sequelize.define('donors', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  phone: Sequelize.STRING,
  email: Sequelize.STRING,
  address1: Sequelize.STRING,
  address2: Sequelize.STRING,
  city: Sequelize.STRING,
  state: Sequelize.STRING,
  zip: Sequelize.INTEGER,
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
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  hasAccess: {type: Sequelize.BOOLEAN, defaultValue: true}
});

var HelpDesk = sequelize.define('helpdesks', {
  email: { type: Sequelize.STRING, unique: true },
  passwordHash: Sequelize.STRING,
  sessionToken: Sequelize.STRING,
  resetToken: Sequelize.STRING,
  resetTokenSetTime: Sequelize.DATE,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  hasAccess: {type: Sequelize.BOOLEAN, defaultValue: true}
});

var UserAccess = sequelize.define('access', {
  access: {type: Sequelize.BOOLEAN, defaultValue: false}
});

Donor.hasMany(Child);
Staff.hasMany(Child);
Child.hasOne(Donor);
Child.hasOne(Staff);

Child.sync();
Donor.sync();
Staff.sync();
Admin.sync().success(function(){
  var adminParams = {
    firstName: 'Admin',
    lastName: 'Account',
    email: 'master@master.com',
    passwordHash: '$2a$10$KGWmPW2lirmckcDHRKZyz..S18xVPWX288CKDjuT4YFSsyLmqHrzS'
  }

  Admin.find({ where: adminParams }).success(function(admin){
    if(!admin){
      Admin.create(adminParams);
    }
  });
});
HelpDesk.sync();
UserAccess.sync().success(function(){
  UserAccess.findAll().success(function(access){
    if(access.length === 0){
      UserAccess.create({});
    }
  })
})



module.exports = {
  Child     : Child,
  Donor     : Donor,
  Staff     : Staff,
  Admin     : Admin,
  HelpDesk  : HelpDesk,
  sequelize : sequelize,
  UserAccess: UserAccess
};
































