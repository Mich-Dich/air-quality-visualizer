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
    selectedAirQualityIndicesArray: {
      type: Array,
    },
    isEmptyDataMarker: {
      type: Boolean,
    },
  },

  watch: {
    filterOptions: {
      handler() {
        this.visualizeAirQualityIndex();
        this.toggleMapOverlay();
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

    selectedAirQualityIndicesArray: {
      handler() {
        this.visualizeAirQualityIndex();
      },
      deep: true,
    },

    isEmptyDataMarker: {
      handler() {
        this.visualizeAirQualityIndex();
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

      geoJsonNetworkData: null,
      networkCentralCoordinates: {
        "Baden-Württemberg": [48.6616, 9.3501, 8],
        Bayern: [48.7904, 11.4979, 7.5],
        Berlin: [52.5167, 13.3833, 11],
        Brandenburg: [52.4125, 12.5316, 8],
        Bremen: [53.1153, 8.7973, 11],
        Hamburg: [53.5503, 9.9937, 11],
        Hessen: [50.6521, 9.1624, 8],
        "Mecklenburg-Vorpommern": [53.6127, 12.4296, 8],
        Niedersachsen: [52.6367, 9.8451, 8],
        "Nordrhein-Westfalen": [51.4333, 7.2667, 8],
        "Rheinland-Pfalz": [49.9131, 7.4518, 8.5],
        Saarland: [49.3964, 6.7562, 10],
        Sachsen: [51.0493, 13.7384, 8.5],
        "Sachsen-Anhalt": [51.9503, 11.6923, 8.5],
        "Schleswig-Holstein": [54.2194, 9.6961, 8.5],
        Thüringen: [50.8614, 11.0418, 9],
      },
    };
  },

  async mounted() {
    this.initMap();
    await UmweltbundesamtService.fetchAndStoreAllData("de", "code");
    // UmweltbundesamtService.logAllMembers();
    this.stationsArray = UmweltbundesamtService.stations;
  },

  beforeUnmount() {
    if (this.mapInstance) {
      this.mapInstance.remove();
    }
  },

  methods: {
    visualizeAirQualityIndex() {
      // Removes the prior marker from the map if it exists.
      this.marker?.remove();

      if (this.filterOptions.station !== null) {
        const station = this.stationsArray.find(
          (station) => station[2] === this.filterOptions.station
        );

        if (station) {
          const lat = station[8];
          const lng = station[7];
          this.mapInstance.setView([lat, lng], 14, {});

          this.marker = L.marker([lat, lng])
            .addTo(this.mapInstance)
            .bindPopup(station[2])
            .openPopup();
        }
      }

      // Removes all circles from the map and empties the array of circles.
      this.circles.forEach((circle) => circle.remove());
      this.circles = [];

      if (!this.airQualityData) {
        return;
      }

      // Filter stations based on the filterOptions prop
      const filteredStations = this.filterStations();

      // Calculate the radius once before the loop
      const radius = 1000 / Math.pow(2, this.mapInstance.getZoom() - 10);

      // Filter stations based on the selected air quality indices
      const newFilteredStations =
        this.filterAirQualityIndexStations(filteredStations);

      console.log("newFilteredStations", newFilteredStations);

      // Iterates over each station in the array of filtered stations.
      newFilteredStations.forEach((station) => {
        const latitude = station[8];
        const longitude = station[7];

        // Finds the air quality data for the station.
        const airQualityDataForStation = this.airQualityData.get(
          station[0]
        ) ?? [0, -1, 0];

        const airQualityIndex = airQualityDataForStation[1];
        const incompleteData = airQualityDataForStation[2] === 1;

        // Determines the color of the circle based on the air quality index.
        const circleColor =
          this.getColorBasedOnAirQualityIndex(airQualityIndex);

        // Draws a circle at the position of the station on the map.
        const circle = L.circle([latitude, longitude], {
          color: incompleteData ? "grey" : "rgb(0, 0, 128)",
          weight: 1,
          opacity: 1,
          fillColor: circleColor,
          fillOpacity: 1,
          radius: radius,
        }).addTo(this.mapInstance);

        // Stores a reference to the circle.
        this.circles.push(circle);
      });
    },

    setViewToNetwork(networkCentralCoordinates) {
      this.mapInstance.setView(
        [networkCentralCoordinates[0], networkCentralCoordinates[1]],
        networkCentralCoordinates[2],
        {}
      );
      console.log("networkCentralCoordinates", networkCentralCoordinates);
    },

    reAddCirclesToMap() {
      this.circles.forEach((circle) => {
        circle.removeFrom(this.mapInstance).addTo(this.mapInstance);
      });
    },

    reAddCirclesToMap() {
      this.circles.forEach((circle) => {
        circle.removeFrom(this.mapInstance).addTo(this.mapInstance);
      });
    },

    //erstellt objekt mit alle Bundesländern als keys und den zugehörigen Koordinaten als values
    getGeoJsonBordersForNetworks(network) {
      const feature = germanBorders.features.find(
        (feature) => feature.properties.GEN === network
      );

      if (feature) {
        return {
          type: "FeatureCollection",
          features: [feature],
        };
      } else {
        console.log(`Bundesland "${network}" nicht gefunden.`);
        return null;
      }
    },

    addGeoJsonDataToMap(geoJsonData) {
      L.geoJSON(geoJsonData, {
        style: function (feature) {
          return {
            color: "#333",
            weight: 0,
            fillColor: "blue",
            fillOpacity: 0.2,
          };
        },
      }).addTo(this.mapInstance);
    },

    toggleMapOverlay() {
      const network = this.filterOptions.network;

      // Entfernen Sie alle Layer, die ein Feature haben
      this.mapInstance.eachLayer((layer) => {
        if (layer.feature) {
          layer.remove();
        }
      });

      // Wenn ein Netzwerk ausgewählt ist, fügen Sie die GeoJson-Daten für dieses Netzwerk hinzu
      if (network) {
        const geoJsonData = this.getGeoJsonBordersForNetworks(network);
        this.addGeoJsonDataToMap(geoJsonData);
        this.setViewToNetwork(this.networkCentralCoordinates[network]);
      }
      // Wenn kein Netzwerk ausgewählt ist, aber die Deutschlandkarte Overlay aktiv ist, fügen Sie die deutschen Grenzen hinzu
      else if (this.germanyMapOverlay) {
        this.addGeoJsonDataToMap(germanBorders);
      }

      // Fügen Sie die Kreise zur Karte hinzu
      this.reAddCirclesToMap();
    },

    // toggleMapOverlay() {
    //   let network = this.filterOptions.network;

    //   const geoJsonData = this.getGeoJsonBordersForNetworks(network);

    //   if (network) {
    //     if (this.germanyMapOverlay) {
    //       this.mapInstance.eachLayer(layer => {
    //         if (layer.feature) {
    //           layer.remove();
    //         }
    //       });
    //     }
    //     this.addGeoJsonDataToMap(geoJsonData);

    //     this.setViewToNetwork(this.networkCentralCoordinates[network]);
    //     this.reAddCirclesToMap();
    //   } else if (this.germanyMapOverlay) {
    //     if (network) {
    //       this.mapInstance.eachLayer(layer => {
    //         if (layer.feature) {
    //           layer.remove();
    //         }
    //       });
    //     }
    //     this.addGeoJsonDataToMap(germanBorders);
    //     this.reAddCirclesToMap();
    //   } else {
    //     this.mapInstance.eachLayer(layer => {
    //       if (layer.feature) {
    //         layer.remove();
    //       }
    //     });
    //   }
    // },

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

      this.circles.forEach((circle) => {
        circle.setRadius(newRadius);
      });
    },

    filterAirQualityIndexStations(filteredStations) {
      let newFilteredStations = [];

      filteredStations.forEach((station) => {
        const latitude = station[8];
        const longitude = station[7];

        // Finds the air quality data for the station.
        const airQualityDataForStation = this.airQualityData.get(
          station[0]
        ) ?? [0, -1, 0];
        const airQualityIndex = airQualityDataForStation[1];

        if (
          this.selectedAirQualityIndicesArray.includes(airQualityIndex) ||
          (this.isEmptyDataMarker && airQualityIndex === -1)
        ) {
          newFilteredStations.push(station);
        }
      });
      return newFilteredStations;
    },

    filterStations() {
      let filteredStations = this.stationsArray;
      let stationTypesArray = Array.from(this.filterOptions.stationTypes).map(
        (type) => type.toString()
      );
      let stationSettings = Array.from(this.filterOptions.stationSettings).map(
        (setting) => setting.toString()
      );

      filteredStations = filteredStations.filter((station) => {
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
