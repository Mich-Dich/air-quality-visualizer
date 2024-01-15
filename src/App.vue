<template>
  <v-app>
    <Navbar />
  </v-app>
  <div class="map-container">
    <LeafletMap />
    <div class="overlay">
      <DetailsDisplay />
    </div>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import LeafletMap from "./components/LeafletMap.vue";
import DetailsDisplay from "./components/DetailsDisplay.vue";

export default {
  name: "App",
  components: { Navbar, LeafletMap, DetailsDisplay },
};
</script>

<style scoped>
.map-container {
  position: relative;
  height: 100vh; /* Adjust as needed */
}

.overlay {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  margin: 20px;
}
</style>
