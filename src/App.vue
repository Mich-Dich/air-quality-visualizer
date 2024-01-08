<template>
  <v-app>
    <v-main>
      <LeafletMap />
      <div class="overlay">
        <DetailsDisplay />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import LeafletMap from "./components/LeafletMap.vue";
import DetailsDisplay from "./components/DetailsDisplay.vue";

export default {
  name: "App",
  components: {
    LeafletMap,
    DetailsDisplay,
  },
};
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  margin: 20px;
}
</style>
