var exports = module.exports = {};
var data = require('./data/data1.json');
var _geometry = require('./geometry.js');

var a = data.shift();
var sections = [];


function createSection(b, cb) {
  var section = {};
  section.a = a;
  section.b = b;
  section.speed = _geometry.getSpeed(a,b);
  sections.push(section);
  a = b;
  cb();
}

exports.analyse = function analyse() {
  if (data[0]) {
    console.log(a);
      createSection(data.shift(), function(){
        analyse(data);
      })
  }
  else console.log(sections);

}