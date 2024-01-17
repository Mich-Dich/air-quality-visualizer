<template>
  <v-card
    class="pa-3"
    :title="title"
    :subtitle="subtitle"
    width="500px"
    color="rgb(31, 31, 31)"
  >
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
  </v-card>
</template>

<script>
import UmweltbundesamtService from "../services/UmweltbundesamtService";

export default {
  // The component's name:
  name: "OptionsDisplay",

  async mounted() {
    await UmweltbundesamtService.fetchAndStoreAllData("de", "code");
    UmweltbundesamtService.logAllMembers();
    this.componentNames = UmweltbundesamtService.components.map(
      component => component[4]
    );
    this.scopeNames = UmweltbundesamtService.scopes.map(scope => scope[5]);
    console.log(this.scopeNames);
  },

  data() {
    return {
      title: "Set your options",
      subtitle: "configure what data you want to get visualized",
      selectedComponent: "",
      componentNames: [],
      selectedScope: "",
      scopeNames: [],
    };
  },
};
</script>

<style scoped></style>
