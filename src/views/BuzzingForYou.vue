<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>
    <v-container class="mb-4 align-center">
    <v-row>
      <v-col
          v-for="event in events"
          :key="event.name"
          class="col-sm-6 col-md-4 col-lg-3 col-xs-12"
        >
          <EventCard :eventDetails="event" onclick="goToEvent"></EventCard>
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<script>
import LoadingScreen from '../components/LoadingScreen.vue';
import EventCard from '@/components/EventCard.vue';


export default {
    name: "BuzzingForYou",
    components: { LoadingScreen, EventCard },
    props: ['events'],
    mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
    },
    data() {
      return {
        isLoading: true,
      }
    },
    methods: {
      gotoEvent: function (id){
        this.$router.push({ path:`/event?id=${id}`})
      }
    },
};
</script>
