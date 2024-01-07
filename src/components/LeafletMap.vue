<template>
  <div :id="mapId"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import cities from "../assets/Städtedaten_2.json";
import stations from "../assets/stations.json";
import L, { map, marker } from "leaflet";
import UmweltbundesamtService from "../services/UmweltbundesamtService";

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
        // minZoom: 12,
        zoomAnimation: false,
        layers: [],
      },
      geojsonData: null,
      mapInstance: null,
      currentMapBounds: null,
      filteredCities: null,
      filterOptions: { onlyInView: true, onlyOneDistrictPerCity: true },
      stationsArray: [],
      markerMap: new Map(),
    };
  },

  mounted() {
    this.initMap();
    this.stationsArray = Object.values(stations);
    this.getCurrentMapBounds();
    this.updateMarkers();
    UmweltbundesamtService.getNetworks("en", "2").then(response =>
      console.log(response)
    );
  },

  beforeUnmount() {
    if (this.mapInstance) {
      this.mapInstance.remove();
    }
  },

  methods: {
    handleMapMoved() {
      this.getCurrentMapBounds();

      // this.getFilteredCities(this.filterOptions);

      // this.addMarkersToCities(this.filteredCities);

      this.updateMarkers();

      // this.logInfo();
    },

    updateMarkers() {
      // Durchläuft jedes Element im stationsArray.
      this.stationsArray.forEach(station => {
        // Konvertiert die Breiten- und Längengrade der Station in Fließkommazahlen.
        const lat = parseFloat(station[8]);
        const lng = parseFloat(station[7]);

        // Überprüft, ob der Marker innerhalb der aktuellen Kartenbegrenzungen liegt.
        const markerInBounds =
          lat <= this.currentMapBounds.A.lat &&
          lat >= this.currentMapBounds.D.lat &&
          lng <= this.currentMapBounds.B.lng &&
          lng >= this.currentMapBounds.A.lng;

        // Versucht, einen vorhandenen Marker an den gegebenen Koordinaten in der markerMap zu finden.
        const existingMarker = this.markerMap.get(`${lat},${lng}`);

        // Wenn der Marker innerhalb der Begrenzungen liegt und noch nicht existiert, wird ein neuer Marker erstellt und zur markerMap hinzugefügt.
        if (markerInBounds && !existingMarker) {
          const newMarker = this.createMarker(station);
          this.markerMap.set(`${lat},${lng}`, newMarker);
        }
        // Wenn der Marker außerhalb der Begrenzungen liegt und bereits existiert, wird er entfernt.
        else if (!markerInBounds && existingMarker) {
          this.removeMarker(existingMarker);
        }
      });
    },

    createMarker(station) {
      const marker = L.marker([parseFloat(station[8]), parseFloat(station[7])])
        .addTo(this.mapInstance)
        .bindPopup(station[2]);
      return marker;
    },

    logInfo() {
      // Loggt die aktuellen Kartenbegrenzungen.
      // console.table(this.currentMapBounds);
      // Loggt die gefilterten Städte.
      // console.table(this.filteredCities);
      // Loggt die Kartenoptionen.
      // console.table(this.mapOptions);
      // Loggt die GeoJSON-Daten.
      // console.table(this.geojsonData);
      // Loggt die Stationsdaten.
      // console.table(this.stationsArray.map(station => station[2]));
      // Loggt die Filteroptionen.
      // console.table(this.filterOptions);
      // Loggt die MarkerMap.
      // console.table(Array.from(this.markerMap.entries()));
    },

    addMarkersToCities(citiesArray) {
      citiesArray.forEach(city => {
        const marker = L.marker([city.Breitengrad, city.Längengrad])
          .addTo(this.mapInstance)
          .bindPopup(city.Ort);
      });
    },

    removeMarker(markerToRemove) {
      if (markerToRemove) {
        markerToRemove.remove();
        const lat = markerToRemove.getLatLng().lat;
        const lng = markerToRemove.getLatLng().lng;
        this.markerMap.delete(`${lat},${lng}`);
      }
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
