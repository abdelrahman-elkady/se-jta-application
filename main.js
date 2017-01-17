var express = require('express');
var app = express();
var database = require('./database');
var bodyParser = require('body-parser');

var Joi = require('joi');
var methodOverride = require('method-override');
var _ = require('lodash');
var jwt = require('jsonwebtoken');

var config = require('./config');

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
      if (err) {
        var message = '';

        for (var errorDetail of err.details) {
          message += errorDetail.message + '\n';
        }

        return res.send(message);
      } else {
        Applications.findOne({
          'email': req.body.email
        }, function(err, user) {
          if (err) {
            return res.json({msg: 'Something went wrong'});
          } else if (user) {
            return res.json({msg: 'We have received your submission already, thank you'});
          } else {
            var body = req.body;
            var application = {
              firstName: body.firstName,
              lastName: body.lastName,
              email: body.email,
              mobile: body.mobile,
              personalWebsite: body.personalWebsite
            };

            Applications.insertOne(application, function(err, doc) {
              if(err) {
                return res.json({msg: 'Something went wrong'});
              } else {
                var token = jwt.sign({_id: doc.ops[0]._id}, config.secret, {expiresIn: '10 days'});
                return res.status(201).json({msg: 'Data submitted successfully !', token: token});
              }
            })
          }
        });

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
