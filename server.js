/*

Created basic server to get things running
Moved this file outside of /server to make static file hosting easier

*/
var express = require('express');
var app = express();
var data = [];

app.use(express.static(__dirname + '/client'));

app.listen(8000);

console.log('Live on 8000');

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.post('/submit', function (req, res) {
  var partial = '';
  req.on('data', function (chunk) {
    partial += chunk;
  });
  req.on('end', function () {
    console.log('/submit Received: ', partial);
    partial = JSON.parse(partial);
    data.push(partial);
    res.send(200);
  });
});

app.get('/submit', function (req, res) {
  res.send(JSON.stringify(data));
});

var dataUpdate = function (childObj, dataArr, cb) {
  for (var i=0;i<dataArr.length;i++) {
    if (dataArr[i].id === childObj.id) {
      dataArr[i] = childObj;
      cb(true);
      return;
    }
  }

  cb(false);

};

app.post('/update', function (req, res) {
  var partial = '';
  req.on('data', function (chunk) {
    partial += chunk;
  });
  req.on('end', function () {
    partial = JSON.parse(partial);
    console.log('/update received: ', partial);

    dataUpdate(partial, data, function (updated) {
      if (updated) {
        res.send(200);
      } else {
        res.send(404, 'Error: File Not Written');
      }
    });
    
  });
});

