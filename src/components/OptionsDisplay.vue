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
              v-model="apiQueryOptions.startDate"
              placeholder="Datum"
              dark
              format="dd.MM.yyyy"
              :enable-time-picker="false"
              auto-apply
              min-date="1 / 1 / 2016"
              :max-date="new Date()"
              prevent-min-max-navigation
              locale="de"
            ></VueDatePicker>
          </v-col>

          <v-col cols="6" class="mb-3">
            <VueDatePicker
              v-model="apiQueryOptions.startHour"
              placeholder="Uhrzeit"
              dark
              time-picker
              auto-apply
              locale="de"
              :minutes-increment="0"
              no-minutes-overlay
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
          v-model="apiQueryOptions.station"
          variant="outlined"
          clearable
          label="Stationen"
          :items="stationNames"
        ></v-autocomplete>

        <v-autocomplete
          v-model="apiQueryOptions.network"
          variant="outlined"
          clearable
          label="Bundesländer"
          :items="networkNames"
        ></v-autocomplete>

        <v-container class="pa-0 mb-3">
          <h2 class="text-subtitle-2">
            Filter Stationen nach geographischer Lage
          </h2>
          <v-chip-group
            v-model="apiQueryOptions.stationSettings"
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
            v-model="apiQueryOptions.stationTypes"
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

        <v-btn color="primary" variant="elevated" @click="validateAndSentData"
          >Luftdaten abrufen</v-btn
        >
      </v-window-item>

      <!-- Ansicht Stationen -->
      <v-window-item value="two">
        <v-row>
          <v-col cols="6">
            <VueDatePicker
              v-model="apiQueryOptions.startDate"
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
              v-model="apiQueryOptions.startHour"
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
          v-model="apiQueryOptions.component"
          variant="outlined"
          clearable
          label="Schadstoff"
          :items="componentNames"
        ></v-autocomplete>

        <v-autocomplete
          v-model="apiQueryOptions.scope"
          variant="outlined"
          clearable
          label="Zeitbezug"
          :items="scopeNames"
        ></v-autocomplete>

        <v-autocomplete
          v-model="apiQueryOptions.network"
          variant="outlined"
          clearable
          label="Bundesländer"
          :items="networkNames"
        ></v-autocomplete>

        <v-autocomplete
          v-model="apiQueryOptions.station"
          variant="outlined"
          clearable
          label="Stationen"
          :items="stationNames"
        ></v-autocomplete>
      </v-window-item>

      <!-- Ansicht Alle Filter -->
      <v-window-item value="three"
        ><VueDatePicker
          v-model="apiQueryOptions.startDate"
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
          v-model="apiQueryOptions.endDate"
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
          v-model="apiQueryOptions.component"
          variant="outlined"
          clearable
          label="Schadstoff"
          :items="componentNames"
        ></v-autocomplete>

        <v-autocomplete
          v-model="apiQueryOptions.transgressionType"
          variant="outlined"
          clearable
          label="Überschreitungswert"
          :items="transgressionNames"
        ></v-autocomplete>

        <v-autocomplete
          v-model="apiQueryOptions.scope"
          variant="outlined"
          clearable
          label="Zeitbezug"
          :items="scopeNames"
        ></v-autocomplete>

        <v-autocomplete
          v-model="apiQueryOptions.station"
          variant="outlined"
          clearable
          label="Stationen"
          :items="stationNames"
        ></v-autocomplete>

        <v-autocomplete
          v-model="apiQueryOptions.network"
          variant="outlined"
          clearable
          label="Bundesländer"
          :items="networkNames"
        ></v-autocomplete>

        <v-container class="pa-0 mb-3">
          <h2 class="text-subtitle-2">
            Filter Stationen nach geographischer Lage
          </h2>
          <v-chip-group
            v-model="apiQueryOptions.stationSettings"
            multiple
            filter
          >
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
          <v-chip-group v-model="apiQueryOptions.stationTypes" multiple filter>
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

  emits: ["airQualityDataFetched"],

  components: {
    VueDatePicker,
  },

  async mounted() {
    await UmweltbundesamtService.fetchAndStoreAllData("de", "code");
    // UmweltbundesamtService.logAllMembers();
    this.getMembersFromUBA();
    this.extractInputValues();
    this.setChipGroupValues();
  },

  data() {
    return {
      title: "Set your options",
      subtitle: "configure what data you want to get visualized",
      tab: null,
      // members of UmweltbundesamtService
      stations: [],
      components: [],
      networks: [],
      scopes: [],
      stationSettings: [],
      stationTypes: [],
      transgressionTypes: [],
      // values shown in the input components
      componentNames: [],
      scopeNames: [],
      stationNames: [],
      transgressionNames: [],
      networkNames: [],
      stationSettingNames: [],
      stationTypeNames: [],
      // values to be emitted to App.vue
      apiQueryOptions: {
        startDate: new Date(),
        endDate: new Date(),
        startHour: this.getPriorHour(),
        endHour: this.getPriorHour(),
        station: null,
        component: null,
        network: null,
        scope: null,
        stationSettings: null,
        stationTypes: null,
        transgressionType: null,
      },
    };
  },

  methods: {
    getMembersFromUBA() {
      this.stations = UmweltbundesamtService.stations;
      this.components = UmweltbundesamtService.components;
      this.networks = UmweltbundesamtService.networks;
      this.scopes = UmweltbundesamtService.scopes;
      this.stationSettings = UmweltbundesamtService.stationSettings;
      this.stationTypes = UmweltbundesamtService.stationsTypes;
      this.transgressionTypes = UmweltbundesamtService.transgressionTypes;
    },
    extractInputValues() {
      this.componentNames = this.components.map(component => component[4]);
      this.scopeNames = this.scopes.map(scope => scope[5]);
      this.stationNames = this.stations.map(station => station[2]);
      this.networkNames = this.networks.map(network => network[2]);
      this.stationSettingNames = this.stationSettings.map(
        stationSetting => stationSetting[1]
      );
      this.stationTypeNames = this.stationTypes.map(
        stationType => stationType[1]
      );
      this.transgressionNames = this.transgressionTypes.map(
        transgression => transgression[1]
      );
    },
    setChipGroupValues() {
      this.apiQueryOptions.stationSettings = this.stationSettings.map(
        stationSetting => stationSetting[0] - 1
      );
      this.apiQueryOptions.stationTypes = this.stationTypes.map(
        stationType => stationType[0] - 1
      );
    },

    formatDate(date) {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },

    formatHour(date) {
      const hour = date["hours"];
      return `${hour}`;
    },

    getPriorHour: function () {
      let date = new Date();
      return { hours: date.getHours() - 1, minutes: 0 };
    },

    async validateAndSentData() {
      // mache eine Kopie von apiQueryOptions um die Werte zu verändern
      const sendOptions = { ...this.apiQueryOptions };

      // check if all required fields are filled
      if (sendOptions.startDate === null) {
        alert("Bitte wählen Sie ein Startdatum aus.");
        return;
      } else if (sendOptions.startHour === null) {
        alert("Bitte wählen Sie eine Startzeit aus.");
        return;
      } else if (sendOptions.endDate === null) {
        alert("Bitte wählen Sie ein Enddatum aus.");
        return;
      } else if (sendOptions.endHour === null) {
        alert("Bitte wählen Sie eine Endzeit aus.");
        return;
      }

      // format the dates and hours to the required format of the API
      sendOptions.startDate = this.formatDate(sendOptions.startDate);
      sendOptions.startHour = this.formatHour(sendOptions.startHour);
      sendOptions.endDate = this.formatDate(sendOptions.endDate);
      sendOptions.endHour = this.formatHour(sendOptions.endHour);

      // if null is selected, get all stations, else get the station id
      if (sendOptions.station !== null) {
        sendOptions.station = this.stations.find(
          station => station[2] === sendOptions.station
        )[0];
      }

      console.log(sendOptions);
      const airqualityData = await UmweltbundesamtService.getAirquality(
        sendOptions.startDate,
        sendOptions.startDate,
        sendOptions.startHour,
        sendOptions.startHour,
        sendOptions.station
      );

      console.log("return of getAirquality()", airqualityData);

      // emit the data to App.vue
      this.$emit("airQualityDataFetched", airqualityData);
    },
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
