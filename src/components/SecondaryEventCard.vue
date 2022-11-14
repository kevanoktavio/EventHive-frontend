<template>
  <v-card @click="toEvent()">
    <div
      class="d-flex flex-column flex-md-row flex-no-wrap justify-md-start justify-sm-center align-center"
    >
      <v-avatar class="ma-3 mx-sm-auto mx-md-3" size="200" tile>
        <v-img :src="eventDetails.eventPhotoURL"></v-img>
      </v-avatar>

      <div>
        <v-card-title>
          <v-row class="py-2 mx-1 mt-1 mb-1 font-weight-bold">
            {{ eventDetails.eventName }}
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row class="py-2 mx-1 font-weight-medium">
            <v-icon class="mx-1" color="greenDark">place</v-icon>
            {{ eventDetails.eventLocation.SEARCHVAL }}
          </v-row>
          <v-row class="py-2 mx-1 font-weight-medium">
            <v-icon class="mx-1" color="greenDark">event</v-icon>
            {{ getFormattedDate }}
          </v-row>
          <v-row class="pt-2 pb-3 mx-1 font-weight-medium">
            <v-icon class="mx-1" color="greenDark">schedule</v-icon>
            {{ eventDetails.eventTime ? getFormattedTime : "TBD" }}
          </v-row>
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "SecondaryEventCard",
  props: {
    eventDetails: {
      type: Object,
      required: true,
    },
  },
  methods: {
    toEvent() {
      this.$router.push("/event/?id=" + this.eventDetails["_id"]);
    },
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
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let date = new Date(this.eventDetails.eventDate);
      return (
        date.getDate() +
        " " +
        months[date.getMonth()] +
        ", " +
        date.getFullYear()
      );
    },
    getFormattedTime() {
      const unformattedTime = this.eventDetails.eventTime;
      const unformattedTimeList = unformattedTime.split(":");
      const hours = unformattedTimeList[0] % 12 || 12;
      const suffix = unformattedTimeList[0] >= 12 ? "PM" : "AM";
      return hours + "." + unformattedTimeList[1] + " " + suffix;
    },
  },
};
</script>
