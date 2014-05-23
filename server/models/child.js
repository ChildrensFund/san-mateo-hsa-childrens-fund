var _db       = require( '../config/mysql_config.js' );

var Child = _db.Model.extend( {
  tableName: 'children'
} );

module.exports = Child;