<template>
  <v-card class="pa-3 clipping" width="auto" color="rgb(31, 31, 31)">
    <v-card-title>
      {{ show_details ? station_infos.title : generalInfos.title }}
    </v-card-title>
    <!-- Displaying content based on the condition -->

    <v-list v-if="show_details">
      <v-list-item
        v-for="(section, sectionIndex) in station_infos.data"
        :key="sectionIndex"
      >
        <v-row>
          <v-col
            ><v-list-item-title style="font-size: 14px; font-weight: bold">{{
              section.section_title
            }}</v-list-item-title></v-col
          >
          <v-col><v-divider></v-divider></v-col>
        </v-row>

        <v-list density="compact">
          <v-list-item
            v-for="(info, infoIndex) in section.section_data"
            :key="infoIndex"
          >
            <v-row>
              <v-col
                ><v-list-item-title>{{ info.name }}</v-list-item-title></v-col
              >
              <v-col
                ><v-list-item-subtitle>{{
                  info.value
                }}</v-list-item-subtitle></v-col
              >
            </v-row>
          </v-list-item>
        </v-list>
      </v-list-item>
    </v-list>

    <v-list v-else bg-color="rgb(31, 31, 31)">
      <v-list-item v-for="(info, index) in generalInfos.data" :key="index">
        <v-row>
          <v-col cols="1" class="mr-2">
            <v-icon :style="{ color: info.color }">{{ info.icon }}</v-icon>
          </v-col>
          <v-col>
            <v-list-item-title>{{ info.name }}</v-list-item-title>
          </v-col>
          <v-col align-self="center">
            <v-list-item-subtitle class="text-right">{{
              info.value
            }}</v-list-item-subtitle>
          </v-col>
        </v-row>
        <v-divider
          v-if="
            info.name === 'Vollständige Datensätze' ||
            info.name === 'Anzahl der Datensätze'
          "
          class="mt-4"
        ></v-divider>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import UmweltbundesamtService from "../services/UmweltbundesamtService";

export default {
  // The component's name:
  name: "DetailsDisplay",

  props: {
    airQualityData: {
      type: Object,
      required: true,
    },
  },

  mounted() {
    console.log(this.generalInfos.data[1].value);
  },

  data() {
    return {
      show_details: false, // Change this condition based on your logic
      station_infos: {
        title: "Station XY-42 Stuttgart",
        data: [
          {
            section_title: "Air quality info",
            section_data: [
              { name: "General quality", value: 42 },
              { name: "NO2", value: 25 },
              { name: "PM10", value: 10 },
              { name: "CO", value: 5 },
            ],
          },
          {
            section_title: "Station infos",
            section_data: [
              {
                name: "location",
                value: "48° 46' 59.9'' N and 9° 10' 59.9'' E",
              },
              { name: "type of area", value: "urban" },
            ],
          },
          {
            section_title: "Scope Info",
            section_data: [
              { name: "measurement duration", value: "1h" },
              { name: "type of area", value: "urban" },
            ],
          },
        ],
      },
    };
  },

  computed: {
    generalInfos() {
      return {
        title: "Luftqualitätsdaten",
        data: [
          {
            name: "Anzahl der Stationen",
            value: UmweltbundesamtService.stations.length,
            icon: "mdi-map-marker",
            color: "grey",
          },
          {
            name: "Anzahl der Datensätze",
            value: Object.keys(this.airQualityData).length,
            icon: "mdi-database",
            color: "grey",
          },
          {
            name: "Unvollständige Datensätze",
            value: Object.values(this.airQualityData)
              .map(obj => Object.values(obj)[0])
              .filter(station => station[2] === 1).length,
            icon: "mdi-circle-outline",
            color: "blue",
          },
          {
            name: "Vollständige Datensätze",
            value: Object.values(this.airQualityData)
              .map(obj => Object.values(obj)[0])
              .filter(station => station[2] === 0).length,
            icon: "mdi-circle-outline",
            color: "grey",
          },
          {
            name: "Sehr gut",
            value: Object.values(this.airQualityData)
              .map(obj => Object.values(obj)[0])
              .filter(station => station[1] === 0).length,
            icon: "mdi-circle",
            color: "green",
          },
          {
            name: "Gut",
            value: Object.values(this.airQualityData)
              .map(obj => Object.values(obj)[0])
              .filter(station => station[1] === 1).length,
            icon: "mdi-circle",
            color: "yellow",
          },
          {
            name: "Mäßig",
            value: Object.values(this.airQualityData)
              .map(obj => Object.values(obj)[0])
              .filter(station => station[1] === 2).length,
            icon: "mdi-circle",
            color: "orange",
          },
          {
            name: "Schlecht",
            value: Object.values(this.airQualityData)
              .map(obj => Object.values(obj)[0])
              .filter(station => station[1] === 3).length,
            icon: "mdi-circle",
            color: "red",
          },
          {
            name: "Sehr schlecht",
            value: Object.values(this.airQualityData)
              .map(obj => Object.values(obj)[0])
              .filter(station => station[1] === 4).length,
            icon: "mdi-circle",
            color: "purple",
          },
          {
            name: "Keine Daten",
            value:
              UmweltbundesamtService.stations.length -
              Object.keys(this.airQualityData).length,
            icon: "mdi-circle",
            color: "grey",
          },
        ],
      };
    },
  },

  methods: {},
};
</script>

<style>
.clipping {
  clip-path: polygon(
    15px 0,
    100% 0,
    100% calc(100% - 15px),
    calc(100% - 15px) 100%,
    0 100%,
    0 15px
  );
}
</style>
