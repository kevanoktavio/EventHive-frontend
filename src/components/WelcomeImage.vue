<template>
  <div v-if="xsBreakpoint">
    <v-row class="mx-5 align-center mt-1">
      <v-col class="pa-0 ma-0">
        <h1 data-aos="fade-right" :id='headerID' class="font-weight-black brownDark--text text-start mr-0">BEE there or BEE <span class="brownMid">square!</span></h1>
      </v-col>
      <v-col class="pa-0 ma-0 pl-4 justify-start">
        <img  src="../assets/images/graphics1.png" width="140" data-aos="fade-left">
      </v-col>
    </v-row>
  </div>
  <div v-else-if="smBreakpoint">
    <v-row >
      <v-col class="d-flex align-content-center flex-wrap justify-end justify-sm-center">
        <h1 data-aos="fade-right" :id="headerID" class="font-weight-black brownDark--text ml-14 text-start">BEE there or BEE <span class="brownMid">square!</span></h1>
      </v-col>
      <v-col class="d-flex align-content-center justify-start">
        <img class="ml-8" src="../assets/images/graphics1.png" width="280" data-aos="fade-left">
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <v-row class="mx-6 my-0 py-0">
      <v-col class="d-flex align-content-center flex-wrap justify-center ml-2 my-0 py-0">
        <h1 data-aos="fade-right" :id="headerID" class="font-weight-bold brownDark--text ml-14 pl-14 text-start">BEE there or BEE <span class="brownMid">square!</span></h1>
      </v-col>
      <v-col class="d-flex align-content-center justify-center pr-16 mr-16">
        <img src="../assets/images/graphics1.png" width="550" data-aos="fade-left">
      </v-col>
    </v-row>
  </div>
    
</template>

<script>
import AOS from 'aos'

export default {
  name: "WelcomeImage",
  computed: {
    xsBreakpoint() {
        return this.$vuetify.breakpoint.width <= 700
    },
    mdBreakpoint() {
      return this.$vuetify.breakpoint.name == 'md' 
    },
    smBreakpoint() {
      return this.$vuetify.breakpoint.name == 'sm' 
    },
    headerID() {
      switch(this.$vuetify.breakpoint.name) {
        case 'xs' : return 'header-xs'
        case 'sm' : return 'header-xs'
        case 'md' : return 'header-md'
        case 'lg' : return 'header'
        case 'xl' : return 'header'
      }
    }
  },
  mounted() {
    AOS.init(
      {
      duration: 800
    }
    )
  },
}
</script>

<style>
#header{
  font-size: 5em
}

#header-md {
  font-size: 3em
}

#header-xs {
  font-size: 1.6em
}

</style>

