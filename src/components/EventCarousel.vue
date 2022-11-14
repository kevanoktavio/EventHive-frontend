<template>
  <div v-if="xsBreakpoint">
    <v-carousel
    cycle
    height="420"
    hide-delimiters
    >
      <v-carousel-item 
        v-for="event in allEvents"
        :key="event.name"
        >
        <v-row align="center" justify="center">
          <div class="mt-8 mt-xs-14">
            <EventCard :eventDetails="event" ></EventCard>
          </div>
        </v-row>
          
      </v-carousel-item>
    </v-carousel>
  </div>
  <div v-else>
    <v-sheet
      class="mx-auto pa-4 rounded-lg"
      color="rgb(0, 0, 0, 0)"
      width="90%"
      data-aos="slide-up"
    >
      <v-slide-group
        class="p-4 align-center"
        center-active
        show-arrows="always"
        
      >
        <v-slide-item
          v-for="event in allEvents"
          :key="event.name"
        >
          <div class="mx-3 my-2">
            <EventCard :eventDetails="event" ></EventCard>
          </div>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>
import EventCard from '@/components/EventCard.vue';
import AOS from 'aos'

  export default {
    name: 'EventCarousel',
    props: {
          allEvents: {
              type: Array,
              required: true
          }
    },
    mounted() {
      AOS.init({
        duration: 1200
      })
    },
    computed: {
      xsBreakpoint() {
        return this.$vuetify.breakpoint.width <= 700
      }
    }
  }
</script>

<style>

</style>