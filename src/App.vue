<template>
  <v-app>
    <Navbar />
    <v-main>
      <LeafletMap
        class="map-position"
        :airQualityData="airQualityData"
        :filterOptions="filterOptions"
        :germanyMapOverlay="germanyMapOverlay"
      />
      <DetailsDisplay class="details-display-position" />
      <OptionsDisplay
        class="options-display-position"
        @airQualityDataFetched="handleAirQualityDataChanged"
        @filtersChanged="handleFiltersChanged"
      />
      <BottomBar class="bottom-bar-position" />
      <v-btn
        @click="this.germanyMapOverlay = !this.germanyMapOverlay"
        class="toggle-borders-button"
        variant="elevated"
        color="primary"
        size="large"
      >
        <v-icon>mdi mdi-map-outline</v-icon>
        <span v-if="germanyMapOverlay">Deutschland Overlay ausblenden</span>
        <span v-else>Deutschland Overlay einblenden</span>
      </v-btn>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import LeafletMap from "./components/LeafletMap.vue";
import DetailsDisplay from "./components/DetailsDisplay.vue";
import OptionsDisplay from "./components/OptionsDisplay.vue";
import BottomBar from "./components/BottomBar.vue";

export default {
  name: "App",
  components: { Navbar, LeafletMap, DetailsDisplay, OptionsDisplay, BottomBar },
  data() {
    return {
      airQualityData: null,
      filterOptions: null,
      germanyMapOverlay: true,
    };
  },
  methods: {
    handleAirQualityDataChanged(airQualityData) {
      airQualityData = airQualityData.data.data;
      console.log("extracted air quality data", airQualityData);

      if (airQualityData) {
        this.airQualityData = airQualityData;
      }
    },

    handleFiltersChanged(filterOptions) {
      console.log("filter changed", filterOptions);
      this.filterOptions = filterOptions;
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

.bottom-bar-position {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
}

.toggle-borders-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
