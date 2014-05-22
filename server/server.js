var express = require('express');
var app = express();

app.listen(8000);

console.log('Live on 8000');

app.get('/*', function (req, res, next) {
  console.log(req.method, ': ', req.url);
  next();
});

app.get('/', function (req, res) {
  res.send(200);
});