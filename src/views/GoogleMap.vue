<template>
  <GoogleMap></GoogleMap>
</template>

<script>

import GoogleMap from "@/components/GoogleMap.vue"
export default {
    name: "GoogleMap",
    components: { GoogleMap },
    mounted() {
      
    },
    data() {
      return {

      }
    },
    methods: {

    },
    computed: {
      
    }
};
</script>

<style>


.carouselheader{
  font-size: 3em
}

.bottom-stick {
  z-index: 999;
  position: fixed;
  bottom: 0;
}

</style>