var exports = module.exports = {};
var https = require('https');


exports.getFences = function(accessToken, cb) {
  var url = 'https://q.nqminds.com/v1/datasets/r1xKhjx5Y/data';
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