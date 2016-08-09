var exports = module.exports = {};
var https = require('https');

exports.getFleet = function(accessToken, cb) {

  var url = 'https://q.nqminds.com/v1/datasets?access_token=' + accessToken + '&filter={"tags":"vehicle"}';
  https.get(url, function(res) {
		var body = '';

		res.on('data', function(chunk) {
			body += chunk;
		})

		res.on('end', function() {
      var raw = JSON.parse(body);
      var vehicles = [];
      for (var i = 0; i < raw.length; i++) {
        var vehicle = {};
        vehicle.name = raw[i].name;
        vehicle.id = raw[i].id;
        vehicles.push(vehicle);
      }
			cb(vehicles);
		})

	}).on('error', function() { 
		cb(null);
	})

}