var express = require('express');
var app = express();
var database = require('./database');
const bodyParser = require('body-parser');

var Joi = require('joi');
var methodOverride = require('method-override');
var _ = require('lodash');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(methodOverride());

var applySchema = {
  firstName: Joi.string().min(3).max(600).required(),
  lastName: Joi.string().min(3).max(600).required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().length(11).required(),
  personalWebsite: Joi.string()
};

database.connect(function(db, Applications) {

  app.get('/', function(req, res) {
    res.sendFile('index.html');
  });

  app.post('/api/apply', function(req, res) {
    Joi.validate(req.body, applySchema, function(err, value) {
      if(err) {
        var message = '';

        for (var errorDetail of err.details) {
          message += errorDetail.message + ' ';
        }

        return res.send(message);
      } else {
        return res.json({'msg': 'great job, here is a cookie for you'});
      }
    });


  });

  app.use(function(req, res, next) {
    res.status(404).json({'msg': 'Get back to C7, you are lost !'});
  });

  app.listen(1234, function() {
    console.log('app listening on port 1234!');
  });

});
