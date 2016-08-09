var exports = module.exports = {};

function toRadians(x) {
  return x * Math.PI / 180;
}

exports.getDistance = function getDistance(a, b) {
             
  var dLat = toRadians(a.lat - b.lat);
  var dLon = toRadians(a.lon - b.lon);
  var lata = toRadians(a.lat);
  var latb = toRadians(b.lat);         
  var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lata) * Math.cos(latb);
  var y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));        
  return 6371000 * y;

}

exports.getSpeed = function getSpeed(a, b) {
  var dist = exports.getDistance(a,b);
  var time = (a.timestamp - b.timestamp)/(60*60*1000);
  var speed = Math.abs(dist/time)/1000;
  return speed * 5/8;
}