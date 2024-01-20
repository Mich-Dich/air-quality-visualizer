<template>
  <v-app>
    <Navbar />
    <v-main>
      <LeafletMap class="map-position" :airQualityData="airQualityData" />
      <DetailsDisplay class="details-display-position" />
      <OptionsDisplay
        class="options-display-position"
        @airQualityDataFetched="handleAirQualityData"
      />
      <Slider class="slider-position" />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import LeafletMap from "./components/LeafletMap.vue";
import DetailsDisplay from "./components/DetailsDisplay.vue";
import OptionsDisplay from "./components/OptionsDisplay.vue";
import Slider from "./components/Slider.vue";

export default {
  name: "App",
  components: { Navbar, LeafletMap, DetailsDisplay, OptionsDisplay, Slider },
  data() {
    return {
      airQualityData: null,
    };
  },
  methods: {
    handleAirQualityData(airQualityData) {
      airQualityData = airQualityData.data.data;
      console.log("extracted air quality data", airQualityData);

      // TODO: pass the air quality data to the map component to display the data on the map
      this.airQualityData = airQualityData;
    },
  },
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

.slider-position {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1000;
}
</style>
