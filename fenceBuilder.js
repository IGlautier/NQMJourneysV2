var exports = module.exports = {};
var https = require('https');

exports.build = function build(accessToken, fence, cb) {
  console.log(fence);
  var post_data = JSON.stringify({
      'datasetId': 'r1xKhjx5Y',
      'payload': [fence]
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: 'cmd.nqminds.com',
      port: '443',
      path: '/commandSync/dataset/data/createMany',
      method: 'POST',
      headers: {
        'authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
        'Content-Length': post_data.length
          
      }
  };

  // Set up the request
  var req = https.request(post_options, function(res) {
    res.on('data', function (body) {
    console.log('Body: ' + body);
    });
    res.on('end', function() {
      
    });
    
  });
  req.on('error', function(err) {
    console.log(err);
    
  });
  // post the data
  req.write(post_data);
  req.end();
  cb(200);
}