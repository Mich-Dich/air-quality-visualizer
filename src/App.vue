<template>
  <v-app class="grey lighten-4">
    <Navbar />
    <v-main>
      <LeafletMap class="map-position" />
      <DetailsDisplay class="details-display-position" />
      <OptionsDisplay class="options-display-position" />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import LeafletMap from "./components/LeafletMap.vue";
import DetailsDisplay from "./components/DetailsDisplay.vue";
import OptionsDisplay from "./components/OptionsDisplay.vue";

export default {
  name: "App",
  components: { Navbar, LeafletMap, DetailsDisplay, OptionsDisplay },
};
</script>

<style scoped>
.map-position {
  position: relative;
}

.details-display-position {
  position: absolute;
  top: 84px;
  right: 20px;
  z-index: 1000;
}

.options-display-position {
  position: absolute;
  top: 84px;
  left: 20px;
  z-index: 1000;
}
</style>
