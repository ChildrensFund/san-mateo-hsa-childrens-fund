/*jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /children
 *  path.  */
//    This file is required by (root folder)/server/routes/children_routes.js
var Children  = require( '../collections/children.js' );
var Child     = require( '../models/child.js' );
var output    = require( '../util/output.js' );
var bookshelf = require( 'bookshelf' );
var _         = require( 'underscore' );

module.exports = {
  get: function( request, response, next ) {
    Children.reset().fetch().then( function( children ) {
      var results = [];
      _.each( children.models, function( child ) {
        results.push( {
          id: child.get( 'id' ),
          childData: {
            name: child.get( 'name' ),
            items: [ { item: child.get( 'requestItem' )
                     , pledged: child.get( 'requestItemStatus' )
                     }
                   ]
          }
        } );
      } );
      
      response.send( 200, results );
    } );
  },
  
  post: function( request, response, next ) {
    var childData = request.body.childData;
//    output.log( 'Handling POST:' );
//    output.log( childData );
    
    var child = {
      name: childData.name,
      requestItem: childData.items[0].item,
      requestItemStatus: childData.items[0].pledged || false
    };
    
    new Child( { name: child.name } ).fetch().then( function( found ) {
      if ( found ) {
        found.save( 'requestItemStatus', (!(found.get( 'requestItemStatus' ))), { method: 'update' } )
          .then( function( savedChild ) {
            var result = {
              id: found.get( 'id' ),
              childData: {
                name: found.get( 'name' ),
                items: [ { item: found.get( 'requestItem' )
                         , pledged: found.get( 'requestItemStatus' )
                         }
                       ]
              }
            };
            response.send( 200, result );
          } )
          .otherwise( function( error ) {
            output.log( error );
          } );
      } else {
        var newChild = new Child( {
          name: child.name,
          requestItem: child.requestItem,
          requestItemStatus: child.requestItemStatus
        } );
        
        newChild.save().then( function( savedChild ) {
          Children.add( savedChild );
          response.send( 200, savedChild );
        } );
      }
    } );
  }
  
};

















