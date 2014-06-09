/* jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /images
 *  path.  */
//    This file is required by (root folder)/server/routes/images_routes.js

var url = require('url');
var path = require('path');
var fs = require('fs');
var imageFolder = path.normalize(__dirname + '/../images/');
var placeHolderBoy = path.normalize(__dirname + '/../../client/assets/images/boy.jpeg');
var placeHolderGirl = path.normalize(__dirname + '/../../client/assets/images/girl.jpeg');

module.exports = {

  get: function (req, res) {
    // if images/male || images/female 
      // return placeholder
    // else 

    if (req.originalUrl === '/images/male/') {
      res.sendfile(placeHolderBoy);
    } else if (req.originalUrl === '/images/female/') {
      res.sendfile(placeHolderGirl);
    } else {

      var urlNoGender = req.originalUrl.replace(/male\/|female\//g,'');
      var gender = req.originalUrl.match(/male\/|female\//g,'').join('');

      fs.exists(path.normalize(__dirname + '/../' + urlNoGender), function (exists) {
        if (exists) {
          res.sendfile(path.normalize(__dirname + '/../' + urlNoGender));
        } else {
          (gender[0] === 'f') ? res.sendfile(placeHolderGirl) : res.sendfile(placeHolderBoy)
        }
      });

    }
  },

  post: function (req, res) {
    console.log('############# IMAGE UPLOAD POST #############');
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
      // Image is saved to root/server/images/ childFirstName + childLocation + workerID .(mimetype of image)
      var fstream = fs.createWriteStream(imageFolder + filename);
      file.pipe(fstream);
      fstream.on('close', function () {
        res.send(200);
      })
    });
  }
};


var findDot = function findDot (filename) {
  for (var i = filename.length; i > 0; i--) {
    if (filename[i] === '.') {
      return i;
    }
  }
}