var menu = document.getElementById('journeyPicker');
var polyline;
var marker;
var popup;
var xhttp = new XMLHttpRequest();

function drawJourney(vehicle, jNum) {
  // create a red polyline from an array of LatLng points
  var list = menu.childNodes;
  for (var i = 0; i < list.length; i++) {
    list[i].className = 'collection-item';
  }
  list[jNum].className += ' active';
  var journey = _fleet[vehicle].journeys[jNum];
  if (polyline) map.removeLayer(polyline);
  polyline = L.polyline(journey.points, {color: 'red'});
  map.addLayer(polyline);
  // zoom the map to the polyline
  map.fitBounds(polyline.getBounds());
  var hours = journey.time/(60*60*1000);
  var speed = (journey.distance/1609.34)/hours;
  var details = 'Journey Time (minutes): ' + hours*60 + ' | Average speed (mph): ' + speed + ' | Total Distance (miles): ' + journey.distance/1609.34;
  document.getElementById('details').innerText = details; 
  if (popup) map.removeLayer(popup);
  popup = L.popup();
  var len = journey.points.length - 1;
  popup.setLatLng([journey.points[len][0], journey.points[len][1]]);
  popup.setContent('Journey ended after <br/>' + Math.floor(hours * 60) + ' minutes');
  map.addLayer(popup);
}

function locateOnMap(n) {

  if (marker) map.removeLayer(marker);
  var journey = _fleet[n].journeys[_fleet[n].journeys.length - 1];
  marker = L.marker([journey.points[journey.points.length - 1][0], journey.points[journey.points.length - 1][1]]);
  map.addLayer(marker);
  map.setView([journey.points[journey.points.length - 1][0], journey.points[journey.points.length - 1][1]], 13);
}

function showJourneys(n) {
  menu.innerHTML = '';
  for (var i = 0; i < _fleet[n].journeys.length; i++) {
    
    var jLink = document.createElement('a');
    jLink.href = '#';
    jLink.className += 'collection-item';
    jLink.innerText = 'Journey ' + i;
    jLink.setAttribute('onclick', 'drawJourney(' + n + ', ' + i + ')');
    menu.appendChild(jLink);
  }

}

function getInfo(n) {
  if (!_fleet[n].journeys) {
    xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        _fleet[n].journeys = JSON.parse(xhttp.responseText);
        locateOnMap(n);
        showJourneys(n);
      }
    };
    xhttp.open('GET', '/journeys?vehicle=' + _fleet[n].id, true);
    xhttp.send();
  }
  else {
    locateOnMap(n);
    showJourneys(n);
  }
}

var map = L.map('map', {
    center: [0, 0],
    zoom: 1
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'nqmivan.12id4bh0',
    accessToken: 'pk.eyJ1IjoibnFtaXZhbiIsImEiOiJjaXJsendoMHMwMDM3aGtuaGh2bWt5OXRvIn0.6iCk2i96NUucsyDlbnVtiA'
}).addTo(map);


for (var i = 0; i < _fleet.length; i++) {
  var vehicle = document.createElement('div');
  vehicle.className += 'card blue-grey darken-1';
  var vehicleInner  = document.createElement('div');
  vehicleInner.className += 'card-content white-text';
  vehicleInner.innerText = _fleet[i].name;
  vehicle.appendChild(vehicleInner);
  var vehicleAction = document.createElement('div');
  vehicleAction.className += 'card-action';
  var vehicleLink = document.createElement('a');
  vehicleLink.href = '#';
  vehicleLink.innerText = 'Locate on Map';
  vehicleLink.setAttribute('onclick', 'getInfo(' + i + ')');
  vehicleAction.appendChild(vehicleLink);
  vehicle.appendChild(vehicleAction);
  document.getElementById('vehicle-list').appendChild(vehicle);
}