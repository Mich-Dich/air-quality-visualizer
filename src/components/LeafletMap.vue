<template>
  <div :id="mapId"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
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
        zoomAnimation: false,
        layers: [],
      },
      geojsonData: null,
      mapInstance: null,
      layerControlInstance: null,
    };
  },

  computed: {
    currentMapBounds() {
      const bounds = this.mapInstance.getBounds();
      return {
        A: { lat: bounds._northEast.lat, lng: bounds._southWest.lng },
        B: { lat: bounds._northEast.lat, lng: bounds._northEast.lng },
        C: { lat: bounds._southWest.lat, lng: bounds._northEast.lng },
        D: { lat: bounds._southWest.lat, lng: bounds._southWest.lng },
      };
    },
  },

  //life cycle hooks
  mounted() {
    this.initMap();
  },

  beforeUnmount() {
    if (this.mapInstance) {
      this.mapInstance.remove();
    }
  },

  methods: {
    initMap() {
      const map = L.map(this.mapId, this.mapOptions);
      const tile = L.tileLayer(
        `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(map);

      this.layerControlInstance = L.control
        .layers({
          OpenStreetMap: tile,
        })
        .addTo(map);

      // activate for Debugging: Logs the boundaries of the visible map to the console
      // map.addEventListener("moveend", () =>
      //   console.table(this.currentMapBounds)
      // );

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
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
