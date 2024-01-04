<template>
  <div :id="mapId"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import cities from "../assets/Städtedaten_2.json";
import L, { map } from "leaflet";

export default {
  // The component's name:
  name: "LeafletMap",

  data() {
    return {
      mapId: "leaflet-map",
      mapOptions: {
        center: L.latLng(47.6526, 9.4794),
        zoom: 10,
        zoomControl: true,
        minZoom: 12,
        zoomAnimation: false,
        layers: [],
      },
      geojsonData: null,
      mapInstance: null,
      layerControlInstance: null,
      currentMapBounds: null,
      filteredCities: null,
      filterOptions: { onlyInView: true, onlyOneDistrictPerCity: true },
    };
  },

  mounted() {
    this.initMap();
  },

  beforeUnmount() {
    if (this.mapInstance) {
      this.mapInstance.remove();
    }
  },

  methods: {
    handleMapMoved() {
      this.getCurrentMapBounds();

      this.getFilteredCities(this.filterOptions);

      this.addMarkers(this.filteredCities);

      this.logInfo();
    },

    logInfo() {
      // select or add variables to log here
      console.table(this.currentMapBounds);
      console.table(this.filteredCities);
    },

    addMarkers(citiesArray) {
      //adds a marker with city name popup to every city in citiesArray
      citiesArray.forEach(city => {
        const marker = L.marker([city.Breitengrad, city.Längengrad])
          .addTo(this.mapInstance)
          .bindPopup(city.Ort);
      });
    },

    getCurrentMapBounds() {
      //calculate and set the four corner points of the viewable map
      const bounds = this.mapInstance.getBounds();
      this.currentMapBounds = this.getMapCornerPoints(bounds);
    },

    getFilteredCities({ onlyInView, onlyOneDistrictPerCity }) {
      let filteredCities = cities;

      //filters out cities that are not in the viewable window
      if (onlyInView) {
        filteredCities = filteredCities.filter(city => {
          return (
            city.Breitengrad <= this.currentMapBounds.A.lat &&
            city.Breitengrad >= this.currentMapBounds.D.lat &&
            city.Längengrad <= this.currentMapBounds.B.lng &&
            city.Längengrad >= this.currentMapBounds.A.lng
          );
        });
      }

      // filters out duplicate cities with different postal codes
      if (onlyOneDistrictPerCity) {
        const uniqueCities = {};
        filteredCities = filteredCities.filter(city => {
          if (!uniqueCities[city.Ort]) {
            uniqueCities[city.Ort] = true;
            return true;
          }
          return false;
        });
      }

      this.filteredCities = filteredCities;
    },

    getMapCornerPoints(bounds) {
      //constructs the currentMapBounds object by returning its points
      return {
        A: { lat: bounds._northEast.lat, lng: bounds._southWest.lng },
        B: { lat: bounds._northEast.lat, lng: bounds._northEast.lng },
        C: { lat: bounds._southWest.lat, lng: bounds._northEast.lng },
        D: { lat: bounds._southWest.lat, lng: bounds._southWest.lng },
      };
    },

    initMap() {
      //initializes the Leaflet map and loads open street map as its tile layer
      const map = L.map(this.mapId, this.mapOptions);
      const tile = L.tileLayer(
        `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(map);

      //adds the overlay in the top right corner, might be removed later
      this.layerControlInstance = L.control
        .layers({
          OpenStreetMap: tile,
        })
        .addTo(map);

      // add eventListener for when the map is moved
      map.addEventListener("moveend", this.handleMapMoved);

      //adds a small delay that helps with smooth page reload
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      //finally adds the map to the data function
      this.mapInstance = map;
    },
  },
};
</script>

<style scoped>
#leaflet-map {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
