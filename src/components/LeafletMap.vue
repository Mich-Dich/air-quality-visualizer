<template>
  <div :id="mapId"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
