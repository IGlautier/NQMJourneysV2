var exports = module.exports = {};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};


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

function area (a, b, c) {
  var lenAB = getDistance(a, b);
  var lenBC = getDistance(b, c);
  var lenCA = getDistance(c, a);
  var s = (lenAB + lenBC + lenCA)/2;
  var area = Math.sqrt(s*((s-lenAB)*(s-lenBC)*(s-lenCA)));
  return area;
}

function getMinArea(journey) {
  var speed = journey.distance/(journey.time/1000);
  var avgTime = (journey.time/1000)/journey.points.length;
  var lenA = speed * avgTime;
  return lenA * lenA * 0.5;
}

function removePoints(points, minArea) {
  var areas;
  var min = minArea - 1;
  while (min < minArea && points.length > 2) {
    areas = [];
    for (var i = 1; i < points.length - 1; i++) {     
      areas.push(area(points[i-1], points[i], points[i+1]));
    } 
    min = Array.min(areas);
    points.splice(areas.indexOf(min)+1, 1);

    
  }

  
}

exports.simplify = function(journeys, cb) {

  
  for (var i = 0; i < journeys.length; i++) {   
    removePoints(journeys[i].points, getMinArea(journeys[i]));
  }
  
  cb(journeys);

}