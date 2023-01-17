import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';

let latitude = 0.0;
let longitude = 0.0;

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 4
  })
});
const mapView = map.getView();

const marker = new Feature({
  geometry: new Point(fromLonLat([118.0, -32])),
});

const markers = new VectorSource({
  features: [marker]
});

const markerVectorLayer = new VectorLayer({
  source: markers,
});
map.addLayer(markerVectorLayer);

const lblLocation = document.querySelector("#lblLocation");

function fetchISSLocation() {
    try {
        fetch("https://api.wheretheiss.at/v1/satellites/25544")
            .then(response => {
                return response.json();
            })
            .then(location => {
                updateLocation(location)
            });
    } catch (err) {
        console.log(err)
    }
}


function updateLocation(location) {
    if (location.name === "iss") {
        lblLocation.innerHTML = `lat: ${location.latitude} long: ${location.longitude}`;
        latitude = +location.latitude;
        longitude = +location.longitude;
    } else {
        lblLocation.innerHTML = "not found";
    };
}


function updateLoop() {
    fetchISSLocation();
    mapView.setCenter(fromLonLat([longitude, latitude]));
    setTimeout(updateLoop, 5000);
}

updateLoop();
