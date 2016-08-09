var menu = document.getElementById('journeyPicker');
var polyline;
var marker;
var vehicles = [{name:'Ivan\'s CBF125', id: 'ANID'}];
var popup;

function locateOnMap(id) {
  if (marker) map.removeLayer(marker);
  marker = L.marker([_journeys[_journeys.length-1].points[0][0], _journeys[_journeys.length-1].points[0][1]]);
  map.addLayer(marker);
  map.panTo([_journeys[_journeys.length-1].points[0][0], _journeys[_journeys.length-1].points[0][1]]);
}

function drawJourney(n) {
  // create a red polyline from an array of LatLng points
  if (polyline) map.removeLayer(polyline);
  polyline = L.polyline(_journeys[n].points, {color: 'red'});
  map.addLayer(polyline);
  // zoom the map to the polyline
  map.fitBounds(polyline.getBounds());
  var hours = _journeys[n].time/(60*60*1000);
  var speed = (_journeys[n].distance/1609.34)/hours;
  var details = 'Journey Time (minutes): ' + hours*60 + ' | Average speed (mph): ' + speed + ' | Total Distance (miles): ' + _journeys[n].distance/1609.34;
  document.getElementById('details').innerText = details; 
  if (popup) map.removeLayer(popup);
  popup = L.popup();
  var len = _journeys[n].points.length - 1;
  popup.setLatLng([_journeys[n].points[len][0], _journeys[n].points[len][1]]);
  popup.setContent('Journey ended after <br/>' + Math.floor(hours * 60) + ' minutes');
  map.addLayer(popup);
}

var map = L.map('map', {
    center: [_journeys[0].points[0][0], _journeys[0].points[0][1]],
    zoom: 13
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'nqmivan.12id4bh0',
    accessToken: 'pk.eyJ1IjoibnFtaXZhbiIsImEiOiJjaXJsendoMHMwMDM3aGtuaGh2bWt5OXRvIn0.6iCk2i96NUucsyDlbnVtiA'
}).addTo(map);


for (var i = 0; i < vehicles.length; i++) {
  var vehicle = document.createElement('div');
  vehicle.className += 'card blue-grey darken-1';
  var vehicleInner  = document.createElement('div');
  vehicleInner.className += 'card-content white-text';
  vehicleInner.innerText = vehicles[i].name;
  vehicle.appendChild(vehicleInner);
  var vehicleAction = document.createElement('div');
  vehicleAction.className += 'card-action';
  var vehicleLink = document.createElement('a');
  vehicleLink.href = '#';
  vehicleLink.innerText = 'Locate on Map';
  vehicleLink.setAttribute('onclick', 'locateOnMap(2)');
  vehicleAction.appendChild(vehicleLink);
  vehicle.appendChild(vehicleAction);
  document.getElementById('vehicle-list').appendChild(vehicle);
}



for (var i = 0; i < _journeys.length; i++) {

  var journey = document.createElement('li');
  
  journey.setAttribute('onclick', 'drawJourney(' + i + ')');
  journey.className += 'bold';
  var jLink = document.createElement('a');
  jLink.href = '#';
  jLink.className += 'waves-effect waves-teal';
  jLink.innerText = 'Journey ' + i;
  journey.appendChild(jLink);
  menu.appendChild(journey);
}