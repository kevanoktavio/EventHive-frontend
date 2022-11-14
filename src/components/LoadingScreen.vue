<template>
  <v-container id="loading" fill-height fluid>
    <v-row class="d-flex align-center justify-center">
      <img
      v-if="xsBreakpoint"
      class="img"
      src="../assets/images/bee-dancing.gif"
      alt="landing..."
      height=300px
      />
    <img
      v-else
      class="img"
      src="../assets/images/bee-dancing.gif"
      alt="landing..."
      height=50%
    />
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Loading",
  computed: {
      xsBreakpoint() {
        return this.$vuetify.breakpoint.width <= 700
      }
  }
};
</script>