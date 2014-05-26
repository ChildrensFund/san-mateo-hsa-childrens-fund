/*jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /children
 *  path.  */
//    This file is required by (root folder)/server/routes/children_routes.js
var Child     = require( '../config/mysql_config.js').Child; //This line changed because mysql_config has to export many different sequelize objects
var output    = require( '../util/output.js' );
var _         = require( 'underscore' );

module.exports = {

  get: function(request, response){

    Child.findAll().success(function(children){
      var results = [];
      _.each( children, function( child ) {
        results.push( {
          id: child.getDataValue( 'id' ),
          childData: {
            name: child.getDataValue( 'name' ),
            items: [ { item: child.getDataValue( 'requestItem' )
                     , pledged: child.getDataValue( 'requestItemStatus' )
                     }
                   ]
          }
        } );
      });
      response.send(200, results);
    });
  },

  post: function(request, response){

    var child = request.body;

    Child.findOrCreate({name: child.childData.name})
    .success(function(dbChild, created){
      if (created) {
        dbChild.requestItem = child.childData.items[0].item;
        dbChild.requestItemStatus = false;
        dbChild.save(['requestItem', 'requestItemStatus']).success(function(child){
          response.send(201, child);
        });
      } else {
        dbChild.requestItemStatus = true;
        dbChild.save(['requestItemStatus']).success(function(child){
          response.send(202, child);
        });
      }
    });
  }

};

















