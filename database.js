var MongoClient = require('mongodb').MongoClient;

// Connection URL
var databaseUrl = 'mongodb://localhost:27017/se-2017-applications';

var db, Applications;

function connect(cb) {
  MongoClient.connect(databaseUrl, function(err, instance) {
    db = instance;
    Applications = db.collection('applications');

    return cb(db, Applications);
  });
}

module.exports = {
  connect: connect
}
