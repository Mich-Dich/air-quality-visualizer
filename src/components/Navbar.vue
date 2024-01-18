<style>
a {
  text-decoration: none;
  color: inherit;
}

a:focus {
  color: inherit;
}

.title {
  /* text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); */
}
</style>

<template>
  <nav>
    <v-toolbar app color="rgb(31, 31, 31)">
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light"> Airquality </span>
        <span class="font-weight-bold text-primary title"> Visualizer </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn>
        <span class="font-weight-bold">Mode</span>
        <v-icon right>mdi mdi-invert-colors</v-icon>
      </v-btn>
      <v-btn>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <span class="font-weight-bold">Github</span>
          <v-icon right>mdi mdi-github</v-icon>
        </a>
      </v-btn>
      <v-btn>
        <span class="font-weight-bold">About</span>
        <v-icon right>mdi mdi-information</v-icon>
      </v-btn>
      <v-btn>
        <span class="font-weight-bold">Language</span>
        <v-icon right>mdi mdi-translate-variant</v-icon>
      </v-btn>
    </v-toolbar>
  </nav>
</template>

<script>
export default {};
</script>
