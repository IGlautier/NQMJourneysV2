var menu = document.getElementById('journeyPicker');
var polyline;
var marker;
var fences;
var popup;
var xhttp = new XMLHttpRequest();


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


function deleteFence(id) {
  xhttp.open('GET', '/deleteGeofence?fence=' + id, true);
  xhttp.send();
  var fence = document.getElementById(id);
  fence.parentNode.removeChild(fence);

}

function createFence(e) {
  console.log(e);
  var radius = document.getElementById('fence-size').value;
  var circle = L.circle(e.latlng, radius, {
      color: 'blue',
      fillColor: '#9966ff',
      fillOpacity: 0.2
  }).addTo(map);
  console.log(e.latlng);
  var vehicleIds = [];
  var vehiclesToAdd = document.getElementsByTagName('input');
  for (var i = 0; i < vehiclesToAdd.length; i++) {
    if (vehiclesToAdd[i].checked) {
      vehicleIds.push(_fleet[vehiclesToAdd[i].id]);
    }
  }
  

  var fence = {'centre':[e.latlng.lat, e.latlng.lng], 'size': parseInt(radius), 'vehicles':vehicleIds};
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      fence.id = xhttp.responseText;
      addFence(fence);
    }
  };  
  xhttp.open('GET', '/createGeofence?fence=' + JSON.stringify(fence), true);
  xhttp.send();
}

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
  if (popup) map.removeLayer(popup);
  popup = L.popup();
  var len = journey.points.length - 1;
  popup.setLatLng([journey.points[len][0], journey.points[len][1]]);
  popup.setContent('Journey ended after <br/>' + Math.floor(hours * 60) + ' minutes');
  map.addLayer(popup);
}

function locateOnMap(n) {

  if (marker) map.removeLayer(marker);
  if (_fleet[n].journeys.length > 0) {
    var journey = _fleet[n].journeys[_fleet[n].journeys.length - 1];
    var location = [journey.points[journey.points.length - 1][0], journey.points[journey.points.length - 1][1]];
    marker = L.marker(location);
    map.addLayer(marker);
    map.setView([journey.points[journey.points.length - 1][0], journey.points[journey.points.length - 1][1]], 13);

    for (var i = 0; i < fences.length; i++) {
      for(var j = 0; j < fences[i].vehicles.length; j++) {
        if (fences[i].vehicles[j].id == _fleet[n].id) {
          if (getDistance(fences[i].centre, location) > fences[i].size) alert(_fleet[n].name + ' has breached geofence ' +  fences[i].id);
        }
      }
    }
  }
  
}

function showJourneys(n) {

  while (menu.firstChild) {
    menu.removeChild(menu.firstChild);
  }
  for (var i = 0; i < _fleet[n].journeys.length; i++) {
    
    var jLink = document.createElement('a');
    jLink.href = '#';
    jLink.className += 'collection-item';
    jLink.innerText = 'Journey ' + i;
    jLink.setAttribute('onclick', 'drawJourney(' + n + ', ' + i + ')');
    var hours = _fleet[n].journeys[i].time/(60*60*1000);
    var speed = (_fleet[n].journeys[i].distance/1609.34)/hours;
    var mphChip = document.createElement('div');
    mphChip.className += 'chip';
    mphChip.innerText = Math.floor(speed) + ' mph';
    var distChip = document.createElement('div');
    distChip.className += 'chip';
    distChip.style.marginLeft = '8px';
    distChip.innerText = Math.floor(_fleet[n].journeys[i].distance/1609.34) + ' miles';
    jLink.appendChild(distChip);
    jLink.appendChild(mphChip);
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

map.on('click', createFence);

function zoomToFence(location) {
  map.setView(location, 9);
}

function addFence(newFence) {
  var fence = document.createElement('div');
  fence.id = newFence.id;
  fence.className += 'card blue-grey darken-1';
  var fenceInner = document.createElement('div');
  fenceInner.className += 'card-content white-text';
  fenceInner.innerText = 'Fence Name: ' + newFence.id + ', Applies To: ';
  for (var i = 0; i < newFence.vehicles.length; i++)  fenceInner.innerText += newFence.vehicles[i].name + ' ';
  fence.appendChild(fenceInner);
  var fenceAction = document.createElement('div');
  fenceAction.className += 'card-action';
  var fenceLocate = document.createElement('a');
  fenceLocate.href = '#';
  fenceLocate.innerText = 'Zoom To Fence';
  fenceLocate.setAttribute('onclick', 'zoomToFence(' + JSON.stringify(newFence.centre) + ')');
  fenceAction.appendChild(fenceLocate);
  var fenceDelete = document.createElement('a');
  fenceDelete.href = '#';
  fenceDelete.innerText = 'Delete Fence';
  fenceDelete.setAttribute('onclick', 'deleteFence("' + newFence.id + '")');
  fenceAction.appendChild(fenceDelete);
  fence.appendChild(fenceAction);
  document.getElementById('fences').appendChild(fence);
  L.circle(newFence.centre, newFence.size, {
      color: 'blue',
      fillColor: '#9966ff',
      fillOpacity: 0.2
  }).addTo(map);
} 

function getFences() {
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      fences = JSON.parse(xhttp.responseText);
      for (var i = 0; i < fences.length; i++) {
       addFence(fences[i]);
      }
    }
  };
  xhttp.open('GET', '/geofences', true);
  xhttp.send();
}

for (var i = 0; i < _fleet.length; i++) {
  var vehicle = document.createElement('div');
  vehicle.id = _fleet[i].id;
  vehicle.className += 'card blue-grey darken-1';
  var vehicleInner  = document.createElement('div');
  vehicleInner.className += 'card-content white-text';
  vehicleInner.innerText = _fleet[i].name;
  vehicle.appendChild(vehicleInner);
  var checkbox = document.createElement('form');
  checkbox.action = '#';
  var checkboxInput = document.createElement('input');
  checkboxInput.type = 'checkbox';
  checkboxInput.id = i;
  checkbox.appendChild(checkboxInput);
  var checkboxLabel = document.createElement('label');
  checkboxLabel.setAttribute('for', i);
  checkboxLabel.innerText = 'New Geofence';
  checkbox.appendChild(checkboxLabel);
 
  vehicleInner.appendChild(checkbox);
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
getFences();