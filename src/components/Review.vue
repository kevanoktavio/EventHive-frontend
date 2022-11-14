<template>
  <v-container class="review">
    <v-col>
      <v-row class="justify-start">
        <v-btn
          class="greenDark white--text reviewBtn ma-2"
          @click="inputReview = !inputReview"
        >
          Review Event
        </v-btn>
          <v-icon
          v-if="updateSuccess"
          color="greenDark"
          transition="scale-transition"
          large
        >
          check_circle
        </v-icon>
        
      </v-row>

      <v-row class="justify-start">
        <v-container v-if="inputReview" class="greenLight justify-start">
          <v-rating
            empty-icon="far fa-star"
            full-icon="fas fa-star"
            hover
            length="5"
            size="20"
            color="greenDark"
            background-color="grey"
            value="5"
            v-model="ratingValue"
          ></v-rating>
          <v-textarea
            outlined
            hide-details
            v-model="reviewText"
            placeholder="Enter your review here"
            background-color="white"
          >
          </v-textarea>
          <v-btn class="ma-2" @click="inputReview = !inputReview">
            Cancel
          </v-btn>
          <v-btn class="ma-2" @click="addReview"> Submit </v-btn>
        </v-container>
      </v-row>
    </v-col>
  </v-container>
</template>
<script>
export default {
  name: "Review",
  props: {
    event: Object,
  },
  data() {
    return {
      updateSuccess: false,
      inputReview: false,
      reviewText: "",
      ratingValue: 5,
      eventReviews: [],
    };
  },
  methods: {
    setAlertTimeout() {
      setTimeout(() => {
        this.updateSuccess = false;
      }, 2000);
    },
    addReview() {
      console.log("add review");
      let today = new Date();
      let reviews = this.event.eventReviews;
      reviews.push({
        userName: this.$store.state.user.userName,
        dateReviewed: today.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
        numStars: this.ratingValue,
        reviewText: this.reviewText,
      });
      let reqBody = {
        _id: this.event["_id"],
        eventReviews: reviews,
      };
      this.axios
        .put(
          `https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/events/reviews`,
          reqBody
        )
        .then((response) => {
          this.updateSuccess = true;
          this.inputReview = false;
          this.setAlertTimeout();
        });
    },
  },
};
</script>

<style></style>
