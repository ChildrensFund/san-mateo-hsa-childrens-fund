/* jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /images
 *  path.  */
//    This file is required by (root folder)/server/routes/images_routes.js

var url = require('url');
var path = require('path');
var fs = require('fs');

module.exports = {

  get: function (req, res) {
    console.log('Served image!');
    res.send(200);
  },

  post: function (req, res) {
    console.log('############# IMAGE UPLOAD POST #############');

    var imageFolder = path.normalize(__dirname + '/../images/');
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("text: ",fieldname, file, filename); 
        fstream = fs.createWriteStream(imageFolder + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
          res.send(200);
        });
    });
  }

};