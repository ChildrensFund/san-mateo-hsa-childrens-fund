var _db   = require( '../config/mysql_config.js' );
var Child = require( '../models/child.js' );

var Children = new _db.Collection();

Children.model = Child;

module.exports = Children;