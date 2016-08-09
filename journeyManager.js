var exports = module.exports = {};
var https = require('https');
var _journeyAnalyser = require('./journeyAnalyser.js');

exports.getJourneys = function(vehicle, accessToken, cb) {

  var url = 'https://q.nqminds.com/v1/datasets/' + vehicle + '/data';
  https.get(url, function(res) {
		var body = '';

		res.on('data', function(chunk) {
			body += chunk;
		})

		res.on('end', function() {
      var raw = JSON.parse(body);
      _journeyAnalyser.analyse(raw.data, cb);
		})

	}).on('error', function() { 
		cb(null);
	})
}