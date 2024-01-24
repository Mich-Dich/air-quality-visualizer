<template>
  <div :id="mapId"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import cities from "../assets/Städtedaten_2.json";
import L, { map, marker } from "leaflet";
import UmweltbundesamtService from "../services/UmweltbundesamtService";
import germanBorders from "../assets/germany.json";

export default {
  // The component's name:
  name: "LeafletMap",

  props: {
    airQualityData: {
      type: Object,
    },
    filterOptions: {
      type: Object,
    },
    germanyMapOverlay: {
      type: Boolean,
    },
  },

  watch: {
    filterOptions: {
      handler() {
        this.visualizeAirQualityIndex();
      },
      deep: true,
    },

    airQualityData: {
      handler() {
        this.visualizeAirQualityIndex();
      },
      deep: true,
    },

    germanyMapOverlay: {
      handler() {
        this.toggleMapOverlay();
      },
      deep: true,
    },
  },

  data() {
    return {
      mapId: "leaflet-map",
      mapOptions: {
        center: L.latLng(51.1657, 10.4515),
        zoom: 6,
        zoomControl: true,
        // minZoom: 12,
        zoomAnimation: false,
        layers: [],
      },
      geojsonData: null,
      mapInstance: null,
      currentMapBounds: null,
      filteredCities: null,
      stationsArray: [],
      markerMap: new Map(),
      circles: [],
      marker: null,
    };
  },

  async mounted() {
    this.initMap();
    await UmweltbundesamtService.fetchAndStoreAllData("de", "code");
    // UmweltbundesamtService.logAllMembers();
    this.stationsArray = UmweltbundesamtService.stations;
    // this.getCurrentMapBounds();
    // this.updateMarkers();
    // this.addAllMarkers();
  },

  beforeUnmount() {
    if (this.mapInstance) {
      this.mapInstance.remove();
    }
  },

  methods: {
    handleMapMoved() {
      // this.getCurrentMapBounds();
      // this.updateMarkers();
      // this.logInfo();
    },

    addAllMarkers() {
      this.stationsArray.forEach(station => {
        const marker = L.marker([
          parseFloat(station[8]),
          parseFloat(station[7]),
        ])
          .addTo(this.mapInstance)
          .bindPopup(station[2]);
      });
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

    visualizeAirQualityIndex() {
      // Removes the prior marker from the map if it exists.
      if (this.marker) {
        this.marker.remove();
      }
      if (this.filterOptions.station !== null) {
        const station = this.stationsArray.find(
          station => station[2] === this.filterOptions.station
        );
        const lat = parseFloat(station[8]);
        const lng = parseFloat(station[7]);
        this.mapInstance.setView([lat, lng], 14, {});

        this.marker = L.marker([lat, lng])
          .addTo(this.mapInstance)
          .bindPopup(station[2])
          .openPopup();
      }

      // Removes all circles from the map to avoid duplicates.
      this.circles.forEach(circle => {
        circle.remove();
      });

      // Empties the array of circles.
      this.circles = [];

      if (!this.airQualityData) {
        return;
      }
      // Converts the air quality data into a Map for faster lookup.
      // The keys of the Map are the station IDs and the values are the associated air quality data.
      const airQualityMap = new Map(Object.entries(this.airQualityData));

      // Filter stations based on the filterOptions prop
      const filteredStations = this.filterStations();
      console.log("filteredStations", filteredStations);
      // const filteredStations = this.stationsArray;

      // Iterates over each station in the array of filtered stations.
      filteredStations.forEach(station => {
        // Converts the latitude and longitude of the station into floating point numbers.
        const latitude = parseFloat(station[8]);
        const longitude = parseFloat(station[7]);

        // Retrieves the air quality data for the current station from the Map.
        // The station ID is used as the key to find the associated air quality data.
        const stationAirQualityData = airQualityMap.get(station[0]);

        // Initializes the air quality and incomplete data flags.
        let airQualityIndex = null;
        let incompleteData = false;

        // Checks if air quality data for the current station was found.
        if (stationAirQualityData) {
          // Extracts the first air quality data object for the current station.
          const dataArray = Object.values(stationAirQualityData)[0];

          // Sets the air quality index to the value of the key "1".
          airQualityIndex = dataArray[1];

          // Sets the incomplete data flag
          incompleteData = dataArray[2];
        }

        // Determines the color of the circle based on the air quality index.
        const circleColor =
          this.getColorBasedOnAirQualityIndex(airQualityIndex);

        // Draws a circle at the position of the station on the map.
        // The color and fill color of the circle are based on the air quality index.
        // if (circleColor !== "grey") {
        const circle = L.circle([latitude, longitude], {
          color: "rgb(0, 0, 128)",
          weight: incompleteData ? 0 : 1.2,
          opacity: 1,
          fillColor: circleColor,
          fillOpacity: 1,
          radius: 1000 / Math.pow(2, this.mapInstance.getZoom() - 10),
        }).addTo(this.mapInstance);

        // Stores a reference to the circle.
        this.circles.push(circle);
        // }
      });
    },

    toggleMapOverlay() {
      if (this.germanyMapOverlay) {
        L.geoJSON(germanBorders, {
          style: function (feature) {
            return {
              color: "#333", // Dunkelgrau für einen modernen Look
              weight: 0, // Erhöhen Sie das Gewicht, um die Grenzen deutlicher sichtbar zu machen
              fillColor: "blue", // Ein dezenter Grauton für die Füllung
              fillOpacity: 0.2, // Reduzieren Sie die Fülltransparenz, um sie dezenter zu machen
            };
          },
        }).addTo(this.mapInstance);
      } else {
        this.mapInstance.eachLayer(layer => {
          if (layer.feature) {
            layer.remove();
          }
        });
      }
    },

    getColorBasedOnAirQualityIndex(airQualityIndex) {
      switch (airQualityIndex) {
        case 0:
          return "green";
        case 1:
          return "yellow";
        case 2:
          return "orange";
        case 3:
          return "red";
        case 4:
          return "purple";
        default:
          return "grey";
      }
    },

    adjustCircleSizes() {
      let currentZoom = this.mapInstance.getZoom();
      let initialZoom = 10;

      // Kreisgröße basierend auf der Zoomstufe anpassen
      let scaleFactor = Math.pow(2, currentZoom - initialZoom);
      let newRadius = 1000 / scaleFactor;
      console.log("Zoomstufe:", currentZoom);
      console.log("Skalierungsfaktor:", scaleFactor);
      console.log("Neuer Radius:", newRadius);

      this.circles.forEach(circle => {
        circle.setRadius(newRadius);
      });
    },

    filterStations() {
      let filteredStations = this.stationsArray;
      let stationTypesArray = Array.from(this.filterOptions.stationTypes).map(
        type => type.toString()
      );
      let stationSettings = Array.from(this.filterOptions.stationSettings).map(
        setting => setting.toString()
      );

      filteredStations = filteredStations.filter(station => {
        if (stationTypesArray.includes(station[11].toString()) == false) {
          return false;
        } else if (stationSettings.includes(station[10].toString()) == false) {
          return false;
        } else {
          return true;
        }
      });

      return filteredStations;
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

      // add eventListener for when the map is zoomed
      map.on("zoomend", this.adjustCircleSizes);

      //adds a small delay that helps with smooth page reload
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      //removes the zoom control overlay from the map
      map.zoomControl.remove();

      L.geoJSON(germanBorders, {
        style: function (feature) {
          return {
            color: "#333", // Dunkelgrau für einen modernen Look
            weight: 0, // Erhöhen Sie das Gewicht, um die Grenzen deutlicher sichtbar zu machen
            fillColor: "blue", // Ein dezenter Grauton für die Füllung
            fillOpacity: 0.2, // Reduzieren Sie die Fülltransparenz, um sie dezenter zu machen
          };
        },
      }).addTo(map);

      //finally adds the map to the data function
      this.mapInstance = map;
    },
  },
};
</script>

<style scoped>
#leaflet-map {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}
</style>
