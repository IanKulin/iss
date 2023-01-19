import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';
import {defaults as defaultInteractions} from 'ol/interaction.js';

let latitude = 0.0;
let longitude = 0.0;

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  interactions: defaultInteractions({
    doubleClickZoom: true,
    dragAndDrop: false,
    keyboardPan: false,
    keyboardZoom: true,
    dragPan: false,
    pinchRotate: false,
    altShiftDragRotate: false,
    mouseWheelZoom: false,
    pointer: false,
    select: false
  }),
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

const lblLat = document.querySelector("#lblLat");
const lblLong = document.querySelector("#lblLong");

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
    const lat = String(location.latitude);
    const long = String(location.longitude);
    lblLat.innerHTML = `lat: ${lat.slice(0,7)}&nbsp;`;
    lblLong.innerHTML = `long: ${long.slice(0,7)}`;
    latitude = +location.latitude;
    longitude = +location.longitude;
  } else {
    lblLat.innerHTML = "";
    lblLong.innerHTML = "";
  };
}


function updateLoop() {
  fetchISSLocation();
  mapView.setCenter(fromLonLat([longitude, latitude]));
  setTimeout(updateLoop, 5000);
}

updateLoop();
