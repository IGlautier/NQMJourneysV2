var exports = module.exports = {};
var _geometry = require('./geometry.js');
var _journeySimplifier = require('./journeySimplifier.js');
var data;
var a; 
var journey = {};
journey.points = [];
journey.time = 0;
journey.distance = 0;
var journeys = [];
var distParam = 20; // Controls what counts as a new data point
var timeParam = 120000;
var speedParam = 2.5;
var lastTime = 0;


function createSection(b, cb) {

  if ((b.timestamp - lastTime) > timeParam) {
    if (journey.points.length > 0) {
      journeys.push(JSON.parse(JSON.stringify(journey)));  
      journey = {};
      journey.points = [];
      journey.time = 0;
      journey.distance = 0;
    } 
    lastTime = b.timestamp; 
  }
  else if (_geometry.getSpeed(a, b) > speedParam) {
    journey.points.push([b.lat, b.lon]);
    journey.time += b.timestamp - lastTime;
    journey.distance += _geometry.getDistance(a,b);
    lastTime = b.timestamp;
  }
  a = b;
  cb();
}

function createJourney(cb) {
  if (data[0]) {
      createSection(data.shift(), function(){
        createJourney(cb);
      })
  }
  else {
    if (journey.points.length > 0) journeys.push(JSON.parse(JSON.stringify(journey)));
    _journeySimplifier.simplify(journeys, cb);
   // cb(journeys);

  }

}

exports.analyse = function(raw, cb) {
  if (!a) a = raw.shift();
  data = raw;
  createJourney(cb);
}