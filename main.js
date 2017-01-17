var express = require('express');
var app = express();
var database = require('./database');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

database.connect(function(db, Applications) {

  app.get('/', function(req, res) {
    res.sendFile('index.html');
  });

  app.listen(1234, function() {
    console.log('app listening on port 1234!');
  });

});
