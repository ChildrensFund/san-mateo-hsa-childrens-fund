/* jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /images
 *  path.  */
//    This file is required by (root folder)/server/routes/images_routes.js

var url = require('url');
var path = require('path');
var fs = require('fs');
var imageFolder = path.normalize(__dirname + '/../images/');

module.exports = {

  get: function (req, res) {
    fs.exists(path.normalize(__dirname + '/../' + req.originalUrl), function (exists) {
      if (exists) {
        res.sendfile(path.normalize(__dirname + '/../' + req.originalUrl));
      } else {
        res.sendfile(imageFolder + 'placeholder.jpg');
      }
    })
  },

  post: function (req, res) {
    console.log('############# IMAGE UPLOAD POST #############');

    //validates file as image
    if (!req.get('Content-Type').match(/image/)) {
      res.send(404, 'Incorrect Content-Type');
    }


    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
      // Image is saved to root/server/images/ childFirstName + childLocation + workerID .(mimetype of image)
      fstream = fs.createWriteStream(imageFolder + filename);
      file.pipe(fstream);
      fstream.on('close', function () {
        res.send(200);
      });
    });

  }


};