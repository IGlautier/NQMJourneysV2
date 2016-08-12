function toRadians(x) {
  return x * Math.PI / 180;
}

function getDistance(a, b) {
             
  var dLat = toRadians(a[0] - b[0]);
  var dLon = toRadians(a[1] - b[1]);
  var lata = toRadians(a[0]);
  var latb = toRadians(b[0]);         
  var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lata) * Math.cos(latb);
  var y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));        
  return 6371000 * y; // In metres

}