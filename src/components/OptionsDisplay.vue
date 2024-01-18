<template>
  <v-card
    class="pa-3"
    :title="title"
    :subtitle="subtitle"
    max-width="550px"
    height="auto"
    color="rgb(31, 31, 31)"
  >
    <v-tabs v-model="tab" bg-color="primary" class="mb-3" fixed-tabs>
      <v-tab value="one">Luftqualität</v-tab>
      <v-tab value="two">Stationen</v-tab>
      <v-tab value="three">Alle Filter</v-tab></v-tabs
    >

    <v-window v-model="tab">
      <!-- Ansicht Luftqualität -->
      <v-window-item value="one">
        <v-row>
          <v-col cols="6">
            <VueDatePicker
              v-model="Date"
              placeholder="Datum"
              dark
              class="mb-5"
              :enable-time-picker="false"
              auto-apply
              min-date="1 / 1 / 2016"
              :max-date="new Date()"
              prevent-min-max-navigation
              locale="de"
            ></VueDatePicker>
          </v-col>

          <v-col cols="6">
            <VueDatePicker
              v-model="Time"
              placeholder="Uhrzeit"
              dark
              class="mb-5"
              time-picker
              auto-apply
              locale="de"
            >
              <template #input-icon>
                <img
                  class="input-slot-image"
                  src="./icons/clock.png"
                /> </template
            ></VueDatePicker>
          </v-col>
        </v-row>

        <v-autocomplete
          v-model="selectedNetwork"
          variant="outlined"
          clearable
          label="Bundesländer"
          :items="networkNames"
        ></v-autocomplete>

        <v-autocomplete
          v-model="selectedStation"
          variant="outlined"
          clearable
          label="Stationen"
          :items="stationNames"
        ></v-autocomplete>

        <v-container class="pa-0 mb-3">
          <h2 class="text-subtitle-2">
            Filter Stationen nach geographischer Lage
          </h2>
          <v-chip-group
            v-model="selectedStationSettings"
            multiple
            filter
            color="primary"
            variant="tonal"
          >
            <v-chip
              v-for="stationSettingName in stationSettingNames"
              :key="stationSettingName"
              filter
            >
              {{ stationSettingName }}
            </v-chip>
          </v-chip-group>
        </v-container>

        <v-container class="pa-0 mb-3">
          <h2 class="text-subtitle-2">Filter Stationen nach Einsatzgebiet</h2>
          <v-chip-group
            v-model="selectedStationTypes"
            multiple
            filter
            color="primary"
            variant="tonal"
          >
            <v-chip
              v-for="stationTypeName in stationTypeNames"
              :key="stationTypeName"
              filter
            >
              {{ stationTypeName }}
            </v-chip>
          </v-chip-group>
        </v-container>
      </v-window-item>

      <!-- Ansicht Messwerte -->
      <v-window-item value="two">
        <v-row>
          <v-col cols="6">
            <VueDatePicker
              v-model="Date"
              placeholder="Datum"
              dark
              class="mb-5"
              :enable-time-picker="false"
              auto-apply
              min-date="1 / 1 / 2016"
              :max-date="new Date()"
              prevent-min-max-navigation
              locale="de"
            ></VueDatePicker>
          </v-col>

          <v-col cols="6">
            <VueDatePicker
              v-model="Time"
              placeholder="Uhrzeit"
              dark
              class="mb-5"
              time-picker
              auto-apply
              locale="de"
            >
              <template #input-icon>
                <img
                  class="input-slot-image"
                  src="./icons/clock.png"
                /> </template
            ></VueDatePicker>
          </v-col>
        </v-row>

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
          v-model="selectedNetwork"
          variant="outlined"
          clearable
          label="Bundesländer"
          :items="networkNames"
        ></v-autocomplete>

        <v-autocomplete
          v-model="selectedStation"
          variant="outlined"
          clearable
          label="Stationen"
          :items="stationNames"
        ></v-autocomplete>
      </v-window-item>

      <!-- Ansicht Alle Filter -->
      <v-window-item value="three"
        ><VueDatePicker
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
          v-model="selectedTransgression"
          variant="outlined"
          clearable
          label="Überschreitungswert"
          :items="transgressionNames"
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

        <v-container class="pa-0 mb-3">
          <h2 class="text-subtitle-2">
            Filter Stationen nach geographischer Lage
          </h2>
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

        <v-container class="pa-0 mb-3">
          <h2 class="text-subtitle-2">Filter Stationen nach Einsatzgebiet</h2>
          <v-chip-group v-model="selectedStationTypes" multiple filter>
            <v-chip
              v-for="stationTypeName in stationTypeNames"
              :key="stationTypeName"
              filter
              variant="elevated"
            >
              {{ stationTypeName }}
            </v-chip>
          </v-chip-group>
        </v-container>
      </v-window-item>
    </v-window>
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
      (component) => component[4]
    );
    this.scopeNames = UmweltbundesamtService.scopes.map((scope) => scope[5]);
    this.stationNames = UmweltbundesamtService.stations.map(
      (station) => station[2]
    );
    this.networkNames = UmweltbundesamtService.networks.map(
      (network) => network[2]
    );
    this.stationSettingNames = UmweltbundesamtService.stationSettings.map(
      (stationSetting) => stationSetting[1]
    );
    this.selectedStationSettings = UmweltbundesamtService.stationSettings.map(
      (stationSetting) => stationSetting[0] - 1
    );
    this.stationTypeNames = UmweltbundesamtService.stationsTypes.map(
      (stationType) => stationType[1]
    );
    this.selectedStationTypes = UmweltbundesamtService.stationsTypes.map(
      (stationType) => stationType[0] - 1
    );
    this.transgressionNames = UmweltbundesamtService.transgressionTypes.map(
      (transgression) => transgression[1]
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
      selectedTransgression: "",
      transgressionNames: [],
      selectedNetwork: "",
      networkNames: [],
      selectedStationSettings: [],
      stationSettingNames: [],
      selectedStationTypes: [],
      stationTypeNames: [],
      Date: null,
      Time: null,
      startDate: null,
      endDate: null,
      tab: null,
    };
  },
};
</script>

<style scoped>
.input-slot-image {
  height: 20px;
  opacity: 0.5;
  width: auto;
  margin-left: 5px;
  margin-top: 5px;
}
</style>
