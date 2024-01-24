<template>
  <v-card
    class="pa-3"
    :title="title"
    :subtitle="subtitle"
    max-width="550px"
    height="auto"
    color="rgb(31, 31, 31)"
  >
    <Slider></Slider>
    <v-container></v-container>
  </v-card>
  <!--Slider-->
</template>

<script>
export default {
  // The component's name:
  name: "DetailsDisplay",

  data() {
    return {
      title: "Air Pollution Details",
      subtitle: "",
      tab: null,

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
};
</script>

<style scoped></style>
