<template>
  <div class="display-container slashed-corners-display">
    <h1 class="display-title">{{ title }}</h1>
    <hr class="separator" />
    <input
      type="text"
      class="search-input slashed-corners-search"
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
  --padding-display: 20px;
  --searchbar-height: 40px;

  /* for calculation slashed corners of display container */
  --aspect-ratio-display: 4;
  --corner-depth-display: 15;

  /* for calculation slashed corners of searchbar */
  --aspect-ratio-search: 12;
  --corner-depth-search: 30;
}

.display-container {
  /* design */
  background-color: rgb(31, 31, 31);
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
  color: white;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  width: 100%;
  height: var(--searchbar-height);
  background-color: rgb(66, 66, 66);
}

.search-input::placeholder {
  color: rgb(187, 187, 187);
}

.search-input:focus {
  outline: none;
}

.slashed-corners-display {
  clip-path: polygon(
    calc((var(--corner-depth-display) / var(--aspect-ratio-display)) * 1%) 0,
    100% 0,
    100% calc(100% - var(--corner-depth-display) * 1%),
    calc(
        100% - (var(--corner-depth-display) / var(--aspect-ratio-display)) * 1%
      )
      100%,
    0 100%,
    0 calc(var(--corner-depth-display) * 1%)
  );
}

.slashed-corners-search {
  clip-path: polygon(
    calc((var(--corner-depth-search) / var(--aspect-ratio-search)) * 1%) 0,
    100% 0,
    100% calc(100% - var(--corner-depth-search) * 1%),
    calc(100% - (var(--corner-depth-search) / var(--aspect-ratio-search)) * 1%)
      100%,
    0 100%,
    0 calc(var(--corner-depth-search) * 1%)
  );
}
</style>
