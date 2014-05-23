'use strict';

/*  This file creates a connection to a database, then creates the proper schemas,
 *  tables, etc. unless they exist at that database already.  */
 //   This file is required by (root folder)/server/config/express_config.js
var bookshelf = require( 'bookshelf' );
var output    = require( '../util/output.js' );

var _db = bookshelf._db = bookshelf.initialize( {
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'zamiel',
    database: 'hsa_cf'
  }
} );


_db.knex.schema.hasTable( 'children' ).then( function( exists ) {
  if ( !exists ) {
    _db.knex.schema.createTable( 'children', function( table ) {
      table.increments('_id').primary();
      table.string( 'name', 128 );
      table.string( 'requestItem', 128 );
      table.boolean( 'requestItemStatus' );
    } ).then( function( table ) {
        output.log( 'Children table created!' );
      } );
  }
} );


/*  Template for building tables below

_db.knex.schema.hasTable( TABLE NAME ).then( function( exists ) {
  if ( !exists ) {
    _db.knex.schema.createTable( TABLE NAME, function( table ) {
      //  Build the table schema here
    } ).then( function( table ) {
        //  Do something when the table finishes getting built
      } );
  }
} );

*/

module.exports = _db;
































