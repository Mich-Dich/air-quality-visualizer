<template>
  <div class="lower-left-component">
    <v-range-slider
      track-color="transparent"
      track-fill-color="gray"
    ></v-range-slider>
  </div>
</template>

<script>
import "../assets/main.css";
export default {
  name: "Slider",

  data() {
    return {
      min_value: 0,
      max_value: 0,
    };
  },

  mounted() {
    this.setPosition();
    window.addEventListener("resize", this.setPosition);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.setPosition);
  },

  methods: {
    setPosition() {
      const el = this.$el;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Set the position of the component
      el.style.position = "fixed";
      el.style.bottom = "0";
      el.style.left = "0";
    },
  },
};
</script>

<style scoped>
:root {
  --corner_size: 15px;
}

.draggable-container {
  position: relative;
  width: 100%;
  height: 200px; /* Adjust the height as needed */
}

.draggable-image {
  position: absolute;
  top: 0;
  left: 0;
  cursor: grab;
  z-index: 1;
}
.lower-left-component {
  /* Add your styles for the component here */
  background-color: #292929;
  clip-path: polygon(
    15px 0,
    100% 0,
    100% calc(100% - 15px),
    calc(100% - 15px) 100%,
    0 100%,
    0 15px
  );
  color: #fff;
  width: 65%;
  margin: 20px;
  padding: 10px;
  border-radius: 0px;
  display: flex;
  align-items: center;
}

.button {
  clip-path: polygon(
    10px 0,
    100% 0,
    100% calc(100% - 10px),
    calc(100% - 10px) 100%,
    0 100%,
    0 10px
  );
  margin: 5px;
  border: 0;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  height: 35px;
  background-color: rgb(179, 179, 179);
  color: rgb(0, 0, 0);
}
.all {
  background-color: rgb(0, 184, 0);
  color: rgb(0, 0, 0);
}
</style>
