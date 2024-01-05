<template>
  <div class="display-container slashed-corners">
    <h1 class="display-title">{{ title }}</h1>
    <hr class="separator" />
    <input
      type="text"
      class="search-input slashed-corners"
      id="searchInput"
      placeholder="Suche..."
    />
  </div>
</template>

<script>
export default {
  // The component's name:
  name: "DetailsDisplay",

  data() {
    return {
      title: "Air Pollution Details",
    };
  },
};
</script>

<style>
:root {
  --width-display: 500px;
  --aspect-ratio-display: 4;
  --aspect-ratio: var(--aspect-ratio-display);
  --corner-depth: 15;
  --padding-display: 20px;
  --searchbar-height: 40px;
  --aspect-ratio-searchbar: calc(
    calc((var(--width-display) - (var(--padding-display) * 2))) /
      var(--searchbar-height)
  );
}
.display-container {
  /* design */
  background-color: black;
  color: white;

  /* layout */
  width: var(--width-display);
  aspect-ratio: var(--aspect-ratio-display) / 1;
  padding: var(--padding-display);
}

.display-title {
  font-size: x-large;
  text-align: center;
}

.separator {
  color: white;
  margin: 15px 0;
}

.search-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  height: var(--searchbar-height);
  /* Override aspect ratio for search bar */
  --aspect-ratio: var(--aspect-ratio-searchbar);
  --corner-depth: 30;
}

.slashed-corners {
  clip-path: polygon(
    calc((var(--corner-depth) / var(--aspect-ratio)) * 1%) 0,
    100% 0,
    100% calc(100% - var(--corner-depth) * 1%),
    calc(100% - (var(--corner-depth) / var(--aspect-ratio)) * 1%) 100%,
    0 100%,
    0 calc(var(--corner-depth) * 1%)
  );
}
</style>
