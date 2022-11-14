<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else-if="events.length > 0">
    <v-container class="mb-4">
    <v-row justify-xs="center">
      <v-col
          v-for="event in events"
          :key="event.name"
          class="col-sm-6 col-md-4 col-lg-3"
        >
          <EventCard :eventDetails="event" onclick="goToEvent"></EventCard>
      </v-col>
    </v-row>
  </v-container>
  </div>
  <v-container v-else class="">
      <v-row class="justify-center mb-5">
        <img src="../assets/images/flying-bee.gif">
      </v-row>
      <v-row class="justify-center">
        <h2>Buzz off, there ain't any events for ya!</h2>
      </v-row>
    </v-container>
</template>

<script>
import LoadingScreen from '../components/LoadingScreen.vue';
import EventCard from '@/components/EventCard.vue';


export default {
    name: "Home",
    components: { LoadingScreen, EventCard },
    mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
    },
    data() {
      return {
        isLoading: true,
        events:[]
      }
    },
    methods: {
      eventViewWithFilter: function (categoryFilter){
        var self = this;
        var data = JSON.stringify({
          "categories": [
            categoryFilter
          ]
        });

        var config = {
          method: 'post',
          url: 'https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/events/categories',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        this.axios(config)
        .then(function (response) {
          self.events = []
          for (let indiv of response.data) {
            // console.log(indiv.eventDate)
            if (indiv.eventDate >= new Date().toISOString()){
              self.events.push(indiv)
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      gotoEvent: function (id){
        this.$router.push({ path:`/event?id=${id}`})
      }
    },
    watch: {
    '$route.params': {
        handler() {
            let categoryFilter = this.$route.query.category
            this.eventViewWithFilter(categoryFilter)
        },
        immediate: true,
    }
}
};
</script>
