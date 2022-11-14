<template>
    <v-card
    data-aos="slide-up"
    width="300px"
    @click="toEvent()"
    class="mx-auto"
  >
    <v-img
      :src="eventDetails.eventPhotoURL"
      lazy-src="../assets/images/no-image-placeholder.jpg"
      height="200px"
    ></v-img>

    <v-card-title class="d-block">
      <v-row class="pa-2 d-flex flex-nowrap">
        <div class="text-truncate">
          {{eventDetails.eventName}}
        </div>
        <v-spacer></v-spacer>
        <v-icon class="mx-1">star</v-icon>
        <div class="">
          {{ getAvgRating }}
        </div>
      </v-row>
    </v-card-title>

    <v-card-text class="d-block">
      <v-row class="pa-2">
      </v-row>
      <v-row class="pa-2 d-flex flex-nowrap">
        <v-icon class="mx-1">place</v-icon>
        <div class="text-truncate">
          {{eventDetails.eventLocation.SEARCHVAL}}
        </div>
      </v-row>
      <v-row class="pa-2 d-flex flex-nowrap">
        <v-icon class="mx-1">event</v-icon>
        <div class="text-truncate">
        {{ getFormattedDate }}
        </div>
      </v-row>
      <v-row class="pa-2">
        <v-icon class="mx-1">schedule</v-icon>
        {{ eventDetails.eventTime ? getFormattedTime : "TBD" }}
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import AOS from 'aos'
export default {
    name: 'EventCard',
    mounted() {
      AOS.init()
    },
    props: {
        eventDetails: {
            type: Object,
            required: true
        }
    },
    methods: {
        toEvent() {
            this.$router.push("/event?id=" + this.eventDetails["_id"]);
        }
    },
    computed: {
      getAvgRating() {
        let sum = 0;
            if (this.eventDetails.eventReviews.length == 0) {
              return "-";
            }
            for (let i = 0; i < this.eventDetails.eventReviews.length; i++) {
                sum += this.eventDetails.eventReviews[i].numStars;
            }
              
            return (sum / this.eventDetails.eventReviews.length).toPrecision();
      },
      getFormattedDate() {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let date = new Date(this.eventDetails.eventDate);
        return date.getDate() + " " + months[date.getMonth()] + ", " + date.getFullYear();
      },
      getFormattedTime() {
        // TODO: add time in the db
        const unformattedTime = this.eventDetails.eventTime
        console.log(unformattedTime)
        const unformattedTimeList = unformattedTime.split(":")
        const hours = (unformattedTimeList[0] % 12) || 12
        const suffix = unformattedTimeList[0] >= 12 ? 'PM' : 'AM'
        return hours + '.' + unformattedTimeList[1] + " " + suffix
      }
    },
}

</script>
