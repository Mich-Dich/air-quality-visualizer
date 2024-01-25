<template>
  <v-card
    class="pa-3"
    :subtitle="subtitle"
    max-width="5000px"
    height="auto"
    color="rgb(31, 31, 31)"
  >
    <v-container>
      <v-row>
        <v-col cols="12" md="7">
          <v-range-slider
            track-color="transparent"
            track-fill-color="gray"
          ></v-range-slider>
        </v-col>
        <v-col
          cols="12"
          md="1"
          v-for="(item, index) in legendItems"
          :key="index"
          class="icon-item"
        >
          <v-icon :style="{ color: item.color }">mdi-circle</v-icon>
          <span>{{ item.text }}</span>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import Slider from "./Slider.vue";
import Slider from "./Slider.vue";
export default {
  // The component's name:
  name: "BottomBar",
  data() {
    return {
      title: "Slider",
      subtitle: "",
      tab: null,

      // Slider
      min_value: 0,
      max_value: 0,

      luftqualitaetsdaten: [
        { name: "Sehr gut", airQualityIndex: 0 },
        { name: "Gut", airQualityIndex: 1 },
        { name: "Mittel", airQualityIndex: 2 },
        { name: "Schlecht", airQualityIndex: 3 },
        { name: "Sehr schlecht", airQualityIndex: 4 },
        { name: "Keine Angabe", airQualityIndex: 5 },
      ],
    };
  },
  computed: {
    legendItems() {
      // Erstelle ein Array von Objekten für die Legende
      return this.luftqualitaetsdaten.map((luftqualitaetsdaten) => ({
        text: luftqualitaetsdaten.name,
        color: this.getColorBasedOnValue(luftqualitaetsdaten.airQualityIndex),
      }));
    },
  },
  methods: {
    getColorBasedOnValue(airQualityIndex) {
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
  },
  components: { Slider },
};
</script>

<style scoped></style>
