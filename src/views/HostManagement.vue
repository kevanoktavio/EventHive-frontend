<template>
  <div class="event-card brownLight py-4 py-lg-8 px-lg-16">
    <v-card class="mx-auto mt-2 pt-4" :width="cardWidth">
      <v-container>
        <v-row>
          <v-card
            class="mx-auto mt-5"
            :width="width"
            outlined
            color="transparent"
          >
            <img
              v-bind:src="eventObj['eventPhotoURL']"
              aspect-ratio="16/9"
              width="100%"
            />
          </v-card>
          <v-card class="mx-auto mt-5 fill-height" :width="width" outlined
            color="transparent">
            <v-container class="fill-height">
              <v-row class="d-flex flex-column">
                <v-col>
                  <h1 class="text-left mb-8">{{ eventObj["eventName"] }}</h1>
                  <h3 class="text-left font-weight-regular"> <span><v-icon>mdi-map-marker</v-icon></span> {{eventObj["eventLocation"].ADDRESS}}</h3>
                </v-col>
                <v-col class="justify-start text-left"> </v-col>
              </v-row>
              <v-row class="align-end justify-left">
                <v-card
                  class="mx-auto px-4"
                  :width="width"
                  outlined
                  color="transparent"
                >
                  <div class="d-flex flex-column">
                    <v-card class="pa-4" :width="width">
                      <h2 class="font-weight-medium greenDark rounded-lg white--text py-3 mb-5">Attendees</h2>
                      <div v-if="eventObj.attendees.length > 0">
                        <v-virtual-scroll
                          :items="eventObj.attendees"
                          height="200"
                          item-height="30"
                        >
                          <template v-slot:default="{ item }">
                            <v-list-item :key="item">
                              <v-list-item-content>
                                <v-list-item-title>
                                  <p>
                                    <strong class="mb-2">{{
                                      item.userName
                                    }}</strong>
                                  </p>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-virtual-scroll>
                      </div>
                      <div v-else>
                        <p>No attendees yet!</p>
                      </div>
                    </v-card>
                  </div>
                </v-card>
              </v-row>
            </v-container>
            
          </v-card>
        </v-row>
        <v-row> 
            <EditEvent :eventobject="eventObj"></EditEvent>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import EditEvent from '../components/EditEvent.vue';
export default {
  name: "HostManagement",
  components: {EditEvent},
  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  },
  data() {
    return {
      // landscape: true,
      reactive: true,
      showSlider: false,
      isLoading: true,
      eventID: "",
      picker: "",
      capacity: 0,
      dialog: false,
    };
  },
  computed: {
    eventObj() {
      for (let event of this.$store.state.events) {
        if (event["_id"] == this.eventID) {
          return event;

        }
      }
    },
    attendees() {
      return this.eventObj["attendees"];
    },
    landscape() {
      return this.$vuetify.breakpoint.width <= 700;
    },
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 450;
        case "sm":
          return 450;
        case "md":
          return 450;
        case "lg":
          return 500;
        case "xl":
          return 500;
      }
    },
    cardWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 500;
        case "sm":
          return 760;
        case "md":
          return 1000;
        case "lg":
          return 1300;
        case "xl":
          return 1500;
      }
    },
  },
  watch: {
    "$route.params": {
      handler() {
        this.eventID = this.$route.query.id;
      },
      immediate: true,
    },
  },
};
</script>
