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
    console.log('Received: ', partial);
    partial = JSON.parse(partial);
    data.push(partial);
    res.send(200);
  });
});

app.get('/submit', function (req, res) {
  res.send(JSON.stringify(data));
});