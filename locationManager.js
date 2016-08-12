var exports = module.exports = {};
var https = require('https');

exports.currentLocation = function(id, cb) {
  var url = 'https://q.nqminds.com/v1/datasets/' + id + '/data?opts={"limit":1,"sort":{"timestamp":-1}}';
  https.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    })

    res.on('end', function() {
      var raw = JSON.parse(body);
      cb(raw.data);
    })

  }).on('error', function() { 
    cb(null);
  })
}