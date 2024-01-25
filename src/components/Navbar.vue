<style>
a {
  text-decoration: none;
  color: inherit;
}

a:focus {
  color: inherit;
}
</style>

<template>
  <nav>
    <v-toolbar app color="rgb(31, 31, 31)">
      <v-img
        max-width="35px"
        class="ml-6"
        src="../assets/logo.png"
        alt="Logo"
      />
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light"> Airquality </span>
        <span class="font-weight-bold text-primary title"> Visualizer </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <span class="font-weight-bold">Github</span>
          <v-icon right>mdi mdi-github</v-icon>
        </a>
      </v-btn>
    </v-toolbar>
  </nav>
</template>

<script>
export default {};
</script>
