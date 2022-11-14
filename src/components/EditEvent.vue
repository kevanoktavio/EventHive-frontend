<template>
  <div class="flex">
    <!-- class="mx-auto px-10 pt-8 pb-9" -->
    <v-container class="mx-auto my-8 px-0 pt-6 pb-6" width="100%" >
      <br>
      <v-form ref="form" v-model="valid" lazy-validation class="mx-16">
        <v-text-field
          v-model="eventName"
          :counter="50"
          :rules="nameRules"
          label="Event Name"
          required
        ></v-text-field>

        <div v-if="xsBreakpoint()">
          <v-textarea
            v-model="eventDescription"
            clearable
            clear-icon="mdi-close-circle"
            label="Event Description"
            :rules="descriptionRules"
            required
          >
          </v-textarea>
        </div>

        <div v-else>
          <p
            v-if="descriptionEmpty()"
            style="color: #bd5959; margin-top: 10px"
            class="text-left"
          >
            Event Description
          </p>
          <p v-else style="color: grey; margin-top: 10px" class="text-left">
            Event Description
          </p>
          <tiptap-vuetify v-model="eventDescription" :extensions="extensions" />
          <p
            v-if="descriptionEmpty()"
            style="
              font-size: 12px;
              color: #bd5959;
              text-align: left;
              margin-top: 5px;
              margin-bottom: 10px;
            "
          >
            Nobody is gonna come if you don't add fun details! manual lmao
          </p>
          <!-- {{ eventDescription }} -->
        </div>

        <v-select
          v-model="selectedCategory"
          :items="category"
          :rules="categoryRules"
          label="Category"
          required
          class="mt-8"
        >
        </v-select>

        <LocationSearchBar
          @locationSelected="onLocationSelected"
          style="margin-top: 10px"
        ></LocationSearchBar>
        <!-- location: {{ location }} -->

        <br />

        <v-text-field
          v-model="maxCapacity"
          :rules="capacityRules"
          label="Max Capacity"
          required
        ></v-text-field>
        <v-slider
          v-model="maxCapacity"
          color="orange"
          label="Fun Slider"
          hint="Be honest"
          min="0"
          max="200"
          thumb-label
        >
        </v-slider>

        <!-- mobile view -->
        <v-expansion-panels v-if="xsBreakpoint()">
          <v-expansion-panel>
            <v-expansion-panel-header v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="12"> Event date and time </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-around" no-gutters>
                <v-col cols="12">
                  <v-menu
                    ref="dateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="eventDate"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="eventDate"
                        label="Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="dateRules"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      no-title
                      scrollable
                      :min="new Date().toISOString().substr(0, 10)"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dateMenu.isActive = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dateMenu.save(date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <!-- https://vuetifyjs.com/en/components/time-pickers/#misc -->
                  <v-dialog
                    ref="dialog"
                    v-model="modal2"
                    :return-value.sync="eventTime"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="eventTime"
                        label="Time"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="timeRules"
                      ></v-text-field>
                    </template>
                    <v-time-picker v-if="modal2" v-model="eventTime" full-width>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal2 = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog.save(eventTime)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- desktop view -->
        <v-expansion-panels v-else>
          <v-expansion-panel>
            <v-expansion-panel-header v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="4"> Event date and time </v-col>
                <v-col cols="8" class="text--secondary">
                  <v-fade-transition leave-absolute>
                    <span v-if="open"
                      >When is your event going to be held?</span
                    >
                    <v-row v-else no-gutters style="width: 100%">
                      <v-col cols="6">
                        Event date: {{ eventDate || "Not set" }}
                      </v-col>
                      <v-col cols="6">
                        Event time: {{ eventTime || "Not set" }}
                      </v-col>
                    </v-row>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-around" no-gutters>
                <v-col cols="3">
                  <v-menu
                    ref="dateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="eventDate"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="eventDate"
                        label="Event date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="dateRules"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      no-title
                      scrollable
                      :min="new Date().toISOString().substr(0, 10)"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dateMenu.isActive = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dateMenu.save(date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="3">
                  <!-- https://vuetifyjs.com/en/components/time-pickers/#misc -->
                  <v-dialog
                    ref="dialog"
                    v-model="modal2"
                    :return-value.sync="eventTime"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="eventTime"
                        label="Event time"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="timeRules"
                      ></v-text-field>
                    </template>
                    <v-time-picker v-if="modal2" v-model="eventTime" full-width>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal2 = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog.save(eventTime)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- LET'S GO UPLOAD BUTTON -->
        <br />
        <v-btn
          x-large
          :disabled="!valid"
          color="success"
          v-on:click="editEvent()"
        >
          Edit Event
        </v-btn>
        <v-btn class="ma-2" x-large color="error" @click="clickDelete">
          delete event
        </v-btn>
        <div v-if="alert">
        <v-alert
      prominent
      type="error"
    >
      <v-row align="center">
        <v-col class="grow">
          Are you sure you want to delete this event?
        </v-col>
        <v-col class="shrink">
          <v-btn color="white" class="error--text" @click="deleteEvent">Confirm</v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </div>

      </v-form>

    </v-container>
   
  </div>
</template>

<script>
import LoadingScreen from "../components/LoadingScreen.vue";
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
} from "tiptap-vuetify";
import AOS from "aos";

// variables to upload image
const MAX_IMAGE_SIZE = 10000000;

/* ENTER YOUR ENDPOINT HERE */

const API_ENDPOINT =
  "https://xt96j6drmd.execute-api.ap-southeast-1.amazonaws.com/uploads"; // e.g. https://ab1234ab123.execute-api.us-east-1.amazonaws.com/uploads

export default {
  name: "createEvent",
  components: { LoadingScreen, TiptapVuetify },
  props: {
    eventobject: {
      type: Object,
    },
  },
  mounted() {
    AOS.init({
      duration: 800,
    });
    console.log("======== retrieving all stored events ========"),
      console.log(this.allStoredEvents[0]),
      console.log(
        "======== all stored events retrieved. if null, navigate to homepage first then try again ========"
      ),
      console.log("======== retrieving current user ========"),
      console.log(this.currentUser),
      console.log("======== current user retrieved ========"),
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
  },
  data() {
    return {
      alert: false,
      isLoading: true,
      valid: true,
      eventName: this.eventobject.eventName,
      nameRules: [
        (v) => !!v || "No name? Come on you can do better than that",
        (v) => (v && v.length <= 50) || "Name must be less than 50 characters",
      ],

      eventDescription: this.eventobject.eventDesc,
      descriptionRules: [
        (v) => !!v || `Nobody is gonna come if you don't add fun details!`,
      ],

      // category: '',
      category: ["Sports", "Arts", "Music", "Food", "Pets", "Games", "Others"],
      selectedCategory: this.eventobject.eventCategory,
      categoryRules: [
        (v) => !!v || "Please indicate what category your event BEE-longs to",
      ],

      select: null,

      location: this.eventobject.eventLocation,
      // locationRules: [
      //   v => !!v || 'Please tell us where is your event located at',
      // ],
      maxCapacity: this.eventobject.maxCapacity,
      capacityRules: [(v) => v != 0 || "I don't believe you!"],

      eventDate: this.eventobject.eventDate.split("T")[0],
      dateRules: [
        (v) => !!v || "Is it today? In the future? Must we time travel back?",
      ],
      eventTime: this.eventobject.eventTime,
      timeRules: [(v) => !!v || "We need to know so we can plan our nap time!"],
      modal2: false,
      date: null,

      currentUser: this.$store.state.user,

      processingCreateEvent: false,
      createEventSuccess: false,

      // DATA FOR DISTANCE CALCULATION
      allStoredEvents: [this.$store.state.events],
      location1: "",
      location1_lat: "",
      location1_long: "",
      location2: "",
      location2_lat: "",
      location2_long: "",
      calculatedDistance: null,

      //FOR RICH TEXT
      extensions: [
        History,
        Blockquote,
        Link,
        Underline,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        [
          Heading,
          {
            options: {
              levels: [1, 2, 3],
            },
          },
        ],
        Bold,
        Code,
        HorizontalRule,
        Paragraph,
        HardBreak,
      ],
      newEventID: "",
    };
  },
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 450;
        case "sm":
          return 540;
        case "md":
          return 720;
        case "lg":
          return 960;
        case "xl":
          return 1140;
      }
    },
  },
  methods: {
    toEvent() {
      this.$store.dispatch("getEvents");
      this.$router.push("/event/?id=" + this.newEventID);
    },
    editEvent: async function () {
      // this.processingCreateEvent = true; //loading screen

      var self = this;
      var data = {
        eventName: self.eventName,
        eventDesc: self.eventDescription,
        eventLocation: self.location,
        maxCapacity: self.maxCapacity,
        eventDate: self.eventDate,
        eventCategory: self.selectedCategory,
        eventTime: self.eventTime,
        eventPhotoURL: this.eventobject["eventPhotoURL"],
        eventHost: this.currentUser,
      };

      // await this.axios
      //   .put(
      //     `https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/events/capacity`,
      //     data
      //   )
      //   .then(function (response) {
      //     console.log('update works')
      //     console.log(JSON.stringify(response.data));
      //     return
      //     
          
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
      
      var config = {
        method: 'put',
        url: 'https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/events/edit/'+this.eventobject["_id"],
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };

      this.axios(config)
      .then( (response) => {
      console.log('update works')
      console.log(JSON.stringify(response.data));
      this.$store.dispatch("getEvents");
      this.$router.push("/event/?id=" + this.eventobject["_id"]);
      })
      .catch(function (error) {
        console.log(error);
      });
      
    },

    xsBreakpoint() {
      return this.$vuetify.breakpoint.width <= 700;
    },
    onLocationSelected: function (selectedLocation) {
      this.location = selectedLocation;
    },
    descriptionEmpty() {
      if (this.eventDescription == "<p></p>") {
        return true;
      }
    },
    deleteEvent() {

          this.axios.delete(
            `https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/events/delete/${this.eventobject["_id"]}`
          );
          console.log("Delete success")
          this.alert=false;
          this.$store.dispatch("getEvents");
          this.$router.push("/");
          
      },
      clickDelete() {
        this.alert=true;
      }
  },
};
</script>
