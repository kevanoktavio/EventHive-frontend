<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else fill-height class="d-flex">
    <v-container v-if="events.length == 0" class="align-center">
      <v-row class="justify-center align-center mb-5">
        <img src="../assets/images/flying-bee.gif" />
      </v-row>
      <v-row class="justify-center align-center">
        <h2>Buzz off, there ain't any events for ya!</h2>
      </v-row>
    </v-container>
    <v-container
      v-else
      class="justify-sm-center justify-xs-center pb-16 mb-16"
      fluid
    >
      <v-row class="mb-12">
        <v-col class="ml-sm-8 mx-6 mb-16 pb-16">
          <v-row cols="12">
            <v-col v-for="event in events" :key="event.name" class="col-sm-12">
              <SecondaryEventCard
                :eventDetails="event"
                @mouseover.native="previewEvent(event)"
                @mouseout.native="eventPreview = false"
                onclick="goToEvent"
              ></SecondaryEventCard>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="this.$vuetify.breakpoint.mdAndUp" class="">
          <div
            v-if="eventPreview != false && mdBreakpoint"
            class="mt-2 mr-8 preview"
          >
            <PreviewEventCard
              :eventDetails="this.eventPreview"
            ></PreviewEventCard>
          </div>
          <div v-else-if="mdBreakpoint" class="preview mr-8">
            <v-row class="justify-center my-5">
              <img src="../assets/images/flying-bee.gif" />
            </v-row>
            <h2>Hover over the event for a sneak peek!</h2>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import LoadingScreen from "../components/LoadingScreen.vue";
import SecondaryEventCard from "@/components/SecondaryEventCard.vue";
import PreviewEventCard from "@/components/PreviewEventCard.vue";

export default {
  name: "Home",
  components: { LoadingScreen, SecondaryEventCard, PreviewEventCard },
  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  },
  data() {
    return {
      isLoading: true,
      events: [],
      eventPreview: false,

      // data for location search
      location1: "",
      location1_lat: "",
      location1_long: "",
      location2: "",
      location2_lat: "",
      location2_long: "",
    };
  },
  computed: {
    mdBreakpoint() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },
  methods: {
    gotoEvent: function (id) {
      this.$router.push({ path: `/event?id=${id}` });
    },

    previewEvent: function (event) {
      this.eventPreview = event;
    },

    onLocationSelected1: function (selectedLocation) {
      this.location1 = selectedLocation;
      this.location1_lat = this.location1.LATITUDE;
      this.location1_long = this.location1.LONGITUDE;
    },

    onLocationSelected2: function (selectedLocation) {
      this.location2 = selectedLocation;
      this.location2_lat = this.location2.LATITUDE;
      this.location2_long = this.location2.LONGITUDE;
    },

    getDistanceFromLatLonInKm: function (lat1, lon1, lat2, lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
      var dLon = this.deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) *
          Math.cos(this.deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d.toFixed(2); //round to 2 dp
    },

    deg2rad: function (deg) {
      return deg * (Math.PI / 180);
    },

    searchLocation(val) {
      this.axios
        .get(
          `https://developers.onemap.sg/commonapi/search?searchVal=${val}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
        )
        .then((response) => {
          this.location1 = response.data.results[0];
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getAllSearchEvents: function (
      name,
      location,
      groupSize,
      startDate,
      endDate
    ) {
      this.events = [];
      for (let e of this.$store.state.events) {
        //get event name
        let eName = e.eventName.toLowerCase();

        //event group size search
        let eGroupSize = e.maxCapacity - e.attendees.length;
        let groupMatch = true;
        if (groupSize != "") {
          groupMatch = false;
          if (groupSize == 1) {
            if (eGroupSize >= parseInt(groupSize)) {
              groupMatch = true;
            }
          } else if (groupSize == 10) {
            if (eGroupSize >= 10) {
              groupMatch = true;
            }
          } else {
            let groupSizeArr = groupSize.split(" - ");
            if (eGroupSize >= parseInt(groupSizeArr[1])) {
              groupMatch = true;
            }
          }
        }

        //event date search
        let eDate = e.eventDate;
        let dateMatch = true;
        if (startDate != "" && endDate != "") {
          if (
            Date.parse(eDate) < Date.parse(startDate) ||
            Date.parse(eDate) > Date.parse(endDate)
          ) {
            dateMatch = false;
          }
        }

        //event location search
        let locationMatch = true;
        if (location != "") {
          locationMatch = false;
          this.onLocationSelected1(location);
          this.onLocationSelected2(e.eventLocation);
          let distanceBetween = this.getDistanceFromLatLonInKm(
            this.location1_lat,
            this.location1_long,
            this.location2_lat,
            this.location2_long
          );
          if (distanceBetween <= 5) {
            locationMatch = true;
          }
        }

        if (
          eName.includes(name.toLowerCase()) &&
          dateMatch &&
          locationMatch &&
          groupMatch
        ) {
          this.events.push(e);
        }
      }
    },
  },
  watch: {
    "$route.params": {
      handler() {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
        let nameSearch = this.$route.query.name;
        let locationSearch = this.$route.query.location;
        if (locationSearch != "") {
          this.searchLocation(locationSearch);
        }
        let groupSizeSearch = this.$route.query.groupSize;
        let startDateSearch = this.$route.query.startdate;
        let endDateSearch = this.$route.query.enddate;
        this.getAllSearchEvents(
          nameSearch,
          this.location1,
          groupSizeSearch,
          startDateSearch,
          endDateSearch
        );
        this.eventPreview = false;
      },
      immediate: true,
    },
  },
};
</script>

<style>
.preview {
  position: sticky;
  z-index: 1;
  top: 20px;
  margin: auto;
}
</style>
