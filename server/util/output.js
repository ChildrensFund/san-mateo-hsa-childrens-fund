/*  This file contains only a function to control how output from logging is handled.
 *  The default method of logging is to use console.log(); changing the exported method
 *  will change how all parts of this application log messages. */
//    This file is required by many files throughout the application

module.exports.log = function log( message ) {
  console.log( message );
};