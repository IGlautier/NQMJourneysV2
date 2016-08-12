//************************ UI components ************************\\

function zoomToFence(location) {
  map.setView(location, 13);
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

//************************ Data components ************************\\

function getFences() {
  var xhttp = new XMLHttpRequest();
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


function deleteFence(id) {
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', '/deleteGeofence?fence=' + id, true);
  xhttp.send();
  var fence = document.getElementById(id);
  fence.parentNode.removeChild(fence);
}

function createFence(e) {
  var radius = document.getElementById('fence-size').value;
  var circle = L.circle(e.latlng, radius, {
      color: 'blue',
      fillColor: '#9966ff',
      fillOpacity: 0.2
  }).addTo(map);
  var vehicleIds = [];
  var vehiclesToAdd = document.getElementsByTagName('input');
  for (var i = 0; i < vehiclesToAdd.length; i++) {
    if (vehiclesToAdd[i].checked) {
      vehicleIds.push(_fleet[vehiclesToAdd[i].id]);
    }
  }

  var fence = {'centre':[e.latlng.lat, e.latlng.lng], 'size': parseInt(radius), 'vehicles':vehicleIds};
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      fence.id = xhttp.responseText;
      addFence(fence);
    }
  };  
  xhttp.open('GET', '/createGeofence?fence=' + JSON.stringify(fence), true);
  xhttp.send();
}