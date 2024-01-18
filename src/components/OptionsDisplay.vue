<template>
  <v-card
    class="pa-3"
    :title="title"
    :subtitle="subtitle"
    width="550px"
    height="800px"
    color="rgb(31, 31, 31)"
  >
    <VueDatePicker
      v-model="startDate"
      placeholder="Start Date"
      dark
      class="mb-5"
      position="right"
      time-picker-inline
      auto-apply
      partial-flow
      min-date="1 / 1 / 2016"
      :max-date="new Date()"
      prevent-min-max-navigation
      locale="de"
    ></VueDatePicker>

    <VueDatePicker
      v-model="endDate"
      placeholder="End Date"
      dark
      class="mb-5"
      position="right"
      time-picker-inline
      auto-apply
      partial-flow
      min-date="1 / 1 / 2016"
      :max-date="new Date()"
      prevent-min-max-navigation
      locale="de"
    ></VueDatePicker>

    <v-autocomplete
      v-model="selectedComponent"
      variant="outlined"
      clearable
      label="Schadstoff"
      :items="componentNames"
    ></v-autocomplete>

    <v-autocomplete
      v-model="selectedScope"
      variant="outlined"
      clearable
      label="Zeitbezug"
      :items="scopeNames"
    ></v-autocomplete>

    <v-autocomplete
      v-model="selectedStation"
      variant="outlined"
      clearable
      label="Stationen"
      :items="stationNames"
    ></v-autocomplete>

    <v-autocomplete
      v-model="selectedNetwork"
      variant="outlined"
      clearable
      label="Bundesländer"
      :items="networkNames"
    ></v-autocomplete>

    <v-container class="ma-0 pa-0">
      <h2 class="text-subtitle-2">Filter Stationen nach geographischer Lage</h2>
      <v-chip-group v-model="selectedStationSettings" multiple filter>
        <v-chip
          v-for="stationSettingName in stationSettingNames"
          :key="stationSettingName"
          filter
          variant="elevated"
        >
          {{ stationSettingName }}
        </v-chip>
      </v-chip-group>
    </v-container>
  </v-card>
</template>

<script>
import UmweltbundesamtService from "../services/UmweltbundesamtService";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  // The component's name:
  name: "OptionsDisplay",

  components: {
    VueDatePicker,
  },

  async mounted() {
    await UmweltbundesamtService.fetchAndStoreAllData("de", "code");
    UmweltbundesamtService.logAllMembers();
    this.componentNames = UmweltbundesamtService.components.map(
      component => component[4]
    );
    this.scopeNames = UmweltbundesamtService.scopes.map(scope => scope[5]);
    this.stationNames = UmweltbundesamtService.stations.map(
      station => station[2]
    );
    this.networkNames = UmweltbundesamtService.networks.map(
      network => network[2]
    );
    this.stationSettingNames = UmweltbundesamtService.stationSettings.map(
      stationSetting => stationSetting[1]
    );
    this.selectedStationSettings = UmweltbundesamtService.stationSettings.map(
      stationSetting => stationSetting[0] - 1
    );
  },

  data() {
    return {
      title: "Set your options",
      subtitle: "configure what data you want to get visualized",
      selectedComponent: "",
      componentNames: [],
      selectedScope: "",
      scopeNames: [],
      selectedStation: "",
      stationNames: [],
      selectedNetwork: "",
      networkNames: [],
      selectedStationSettings: [],
      stationSettingNames: [],
      startDate: null,
      endDate: null,
    };
  },
};
</script>

<style scoped></style>
