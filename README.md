# nqm fleet manager
Asset tracking and journey analysis

## usage
npm install
node index.js

accessible at localhost:8084

Press locate on map on a vehicle to see the last location, this will auto-update every 30 seconds.

Geofencing: Select vehicles from the left pane to apply geo fence to, set radius with slider below map and then click on the map to add as a geofence. Alerts will pop on the page if the vehicle you are currently monitoring location for is outside of this geofence.

## todo
* Friendly names for geo fences
* Fix ui issues for deleting fences, currently old fences remain on the map and will cause alerts until the page is reloaded. This should be a simple case of removing entry from fences variable.
* Add geocoding to give street address of current location
* Tracking multiple vehicles
