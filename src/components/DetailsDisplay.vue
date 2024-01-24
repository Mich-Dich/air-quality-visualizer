<template>
  <v-card class="pa-3 clipping" width="500px">
    <v-card-title>
      {{ show_details ? station_infos.title : generalInfos.title }}
    </v-card-title>
    <v-card-text>
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
            <v-col><v-divider>stuff</v-divider></v-col>
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

      <v-list v-else>
        <v-list-item v-for="(info, index) in generalInfos.data" :key="index">
          <v-row>
            <v-col>
              <v-list-item-title>{{ info.name }}</v-list-item-title>
            </v-col>
            <v-col>
              <v-list-item-subtitle>{{ info.value }}</v-list-item-subtitle>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  // The component's name:
  name: "DetailsDisplay",

  props: {
    airQualityData: {
      type: Object,
      required: true,
    },
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
      general_infos: {
        title: "Meta Informationen zur Abfrage",
        data: [
          { name: "Stations number", value: 42 },
          { name: "", value: 25 },
          { name: "CO", value: 10 },
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
            name: "Anzahl der Datensätze",
            value: Object.keys(this.airQualityData).length,
          },
          {
            name: "Sehr gut",
            value: 3,
          },
          { name: "Gut", value: 10 },
          { name: "Mäßig", value: 5 },
          { name: "Schlecht", value: 2 },
          { name: "Sehr schlecht", value: 1 },
        ],
      };
    },
  },
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
