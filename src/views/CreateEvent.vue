<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else class="fill-height peachLight py-4">
    <!-- class="mx-auto px-10 pt-8 pb-9" -->
    <v-card
      class="mx-auto my-8 px-0 pt-6 pb-6"
      :width="width"
      outlined
      data-aos="zoom-in"
    >
      <br>
      <h1 class="px-5">
        Fancy A New Event?
      </h1>
      <p style="color: grey;" class="px-10">
        Create a cool name and tell event-goers why they should come!
      </p>

      <v-form ref="form" v-model="valid" lazy-validation class="mx-16">
        <v-text-field v-model="eventName" :counter="50" :rules="nameRules" label="Event Name" required></v-text-field>

        <div v-if="xsBreakpoint()">
          <v-textarea v-model="eventDescription" clearable clear-icon="mdi-close-circle" label="Event Description"
            :rules="descriptionRules" required>
          </v-textarea>
        </div>
        
        <div v-else>
          <p v-if="descriptionEmpty()" style="color: #bd5959; margin-top: 10px" class="text-left">
            Event Description
          </p>
          <p v-else style="color: grey; margin-top: 10px" class="text-left">
            Event Description
          </p>
          <tiptap-vuetify v-model="eventDescription" :extensions="extensions"/>
          <p v-if="descriptionEmpty()" style="font-size: 12px; color: #bd5959; text-align: left; margin-top: 5px; margin-bottom: 10px;">
            Nobody is gonna come if you don't add fun details! manual lmao
          </p>
          <!-- {{ eventDescription }} -->
        </div>

        <v-select v-model="selectedCategory" :items="category" :rules="categoryRules" label="Category" required>
        </v-select>

        <LocationSearchBar @locationSelected="onLocationSelected" style="margin-top: 10px"></LocationSearchBar>
        <!-- location: {{ location }} -->

        <br>

        <v-text-field v-model="maxCapacity" :rules="capacityRules" label="Max Capacity" required></v-text-field>
        <v-slider v-model="maxCapacity" color="orange" label="Fun Slider" hint="Be honest" min="0" max="200" thumb-label>
        </v-slider>

        <!-- mobile view -->
        <v-expansion-panels v-if="xsBreakpoint()">
          <v-expansion-panel>
            <v-expansion-panel-header v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="12">
                  Event date and time
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-around" no-gutters>
                <v-col cols="12">
                  <v-menu ref="dateMenu" :close-on-content-click="false" :return-value.sync="eventDate" offset-y
                    min-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="eventDate" label="Date" prepend-icon="mdi-calendar" readonly
                        v-bind="attrs" v-on="on" :rules="dateRules"></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title scrollable :min="new Date().toISOString().substr(0, 10)">
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="$refs.dateMenu.isActive = false">
                        Cancel
                      </v-btn>
                      <v-btn text color="primary" @click="$refs.dateMenu.save(date)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
  
                <v-col cols="12">
                  <!-- https://vuetifyjs.com/en/components/time-pickers/#misc -->
                  <v-dialog ref="dialog" v-model="modal2" :return-value.sync="eventTime" persistent width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="eventTime" label="Time" prepend-icon="mdi-clock-time-four-outline"
                        readonly v-bind="attrs" v-on="on" :rules="timeRules"></v-text-field>
                    </template>
                    <v-time-picker v-if="modal2" v-model="eventTime" full-width>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal2 = false">
                        Cancel
                      </v-btn>
                      <v-btn text color="primary" @click="$refs.dialog.save(eventTime)">
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
                <v-col cols="4">
                  Event date and time
                </v-col>
                <v-col cols="8" class="text--secondary">
                  <v-fade-transition leave-absolute>
                    <span v-if="open">When is your event going to be held?</span>
                    <v-row v-else no-gutters style="width: 100%">
                      <v-col cols="6">
                        Event date: {{ eventDate || 'Not set' }}
                      </v-col>
                      <v-col cols="6">
                        Event time: {{ eventTime || 'Not set' }}
                      </v-col>
                    </v-row>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-around" no-gutters>
                <v-col cols="3">
                  <v-menu ref="dateMenu" :close-on-content-click="false" :return-value.sync="eventDate" offset-y
                    min-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="eventDate" label="Event date" prepend-icon="mdi-calendar" readonly
                        v-bind="attrs" v-on="on" :rules="dateRules"></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title scrollable :min="new Date().toISOString().substr(0, 10)">
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="$refs.dateMenu.isActive = false">
                        Cancel
                      </v-btn>
                      <v-btn text color="primary" @click="$refs.dateMenu.save(date)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
  
                <v-col cols="3">
                  <!-- https://vuetifyjs.com/en/components/time-pickers/#misc -->
                  <v-dialog ref="dialog" v-model="modal2" :return-value.sync="eventTime" persistent width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="eventTime" label="Event time" prepend-icon="mdi-clock-time-four-outline"
                        readonly v-bind="attrs" v-on="on" :rules="timeRules"></v-text-field>
                    </template>
                    <v-time-picker v-if="modal2" v-model="eventTime" full-width>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal2 = false">
                        Cancel
                      </v-btn>
                      <v-btn text color="primary" @click="$refs.dialog.save(eventTime)">
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        
        <!-- UPLOAD IMAGE SECTION -->
        <br>
        <div v-if="!image">
          <!-- <h3>Upload cool photo below!</h3> -->
          <!-- <input type="file" @change="onFileChange" accept="image/jpeg"> -->
          <v-file-input :rules="imageRules" @change="onFileChange()" accept="image/jpeg,image/png" class="text-center" label="Upload cool photo here!" prepend-icon="mdi-camera" v-model="uploadedImage"></v-file-input>
        </div>
        <div v-else>
          <img :src="image" style="border:2px grey" width="250" height=auto />
          <br>
          <v-btn outlined v-if="!uploadURL" @click="removeImage">Remove image</v-btn>
        </div>

        <!-- LET'S GO UPLOAD BUTTON -->
        <br>
        <v-btn x-large :disabled="!valid" color="success" v-on:click="submitCreateEvent()">
          Let's go!
        </v-btn>
        <!-- <v-btn x-large :disabled="!valid" color="success" v-on:click="updateCreatedEvents()">
          Test update created events
        </v-btn> -->
      </v-form>
      <!-- <br> -->
      <!-- Checking if the component is imported correctly, here is eventName: {{eventName}}<br>
        Checking if the component is imported correctly, here is eventDescription: {{eventDescription}}<br>
      Checking if the component is imported correctly, here is selectedCategory: {{selectedCategory}}<br>
      Checking if the component is imported correctly, here is select: {{select}}<br>

      Checking if the component is imported correctly, here is location: {{location}}<br>
      Checking if the component is imported correctly, here is maxCapacity: {{maxCapacity}}<br>
      Checking if the component is imported correctly, here is eventTime: {{eventTime}}<br>
      Checking if the component is imported correctly, here is eventDate: {{eventDate}}<br> -->
      <!-- <br> -->


      <!-- OVERLAY PROCESSING CREATE EVENT STARTS HERE -->
    </v-card>
    <v-overlay :value="processingCreateEvent">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <!-- OVERLAY ONCE EVENT CREATED STARTS HERE -->
    <v-overlay :value="createEventSuccess" :opacity="0.9">
      <h1>
        BUZZ BUZZ!
        Your event has gone live 👍
      </h1>
      <br>
      <v-btn color="success" @click="toEvent()">
        Take me to my event!
        <v-icon right>
          mdi-bee-flower
        </v-icon>
      </v-btn>
    </v-overlay>
    <!-- <hr>
    =========================== Search distance between 2 locations ===================
    <br><br>
    <LocationSearchBar @locationSelected="onLocationSelected1"></LocationSearchBar>

    <br>
    selected location 1: {{ location1 }}
    <br>
    location 1 lat: {{ location1_lat }}
    <br>
    location 1 long: {{ location1_long }}

    <LocationSearchBar @locationSelected="onLocationSelected2"></LocationSearchBar>

    <br>
    selected location 2: {{ location2 }}
    <br>
    location 2 lat: {{ location2_lat }}
    <br>
    location 2 long: {{ location2_long }}
    <br>
    <v-btn color="success" class="mr-4"
      v-on:click="getDistanceFromLatLonInKm(location1_lat, location1_long, location2_lat, location2_long)">
      Calculate Distance
    </v-btn>
    <br>
    Distance between the 2 locations: {{ calculatedDistance }} KM -->


  </div>
</template>

<script>
import LoadingScreen from '../components/LoadingScreen.vue';
import { TiptapVuetify, Heading, Bold, Italic, Strike, Underline, Code, Paragraph, BulletList, OrderedList, ListItem, Link, Blockquote, HardBreak, HorizontalRule, History } from 'tiptap-vuetify'
import AOS from 'aos'

// variables to upload image
const MAX_IMAGE_SIZE = 10000000

/* ENTER YOUR ENDPOINT HERE */

const API_ENDPOINT = 'https://xt96j6drmd.execute-api.ap-southeast-1.amazonaws.com/uploads' // e.g. https://ab1234ab123.execute-api.us-east-1.amazonaws.com/uploads


export default {
  name: "createEvent",
  components: { LoadingScreen, TiptapVuetify },
  mounted() {
    AOS.init({
      duration: 800
    })
    console.log('======== retrieving all stored events ========'),
    console.log(this.allStoredEvents[0]),
    console.log('======== all stored events retrieved. if null, navigate to homepage first then try again ========'),
    console.log('======== retrieving current user ========'),
    console.log(this.currentUser),
    console.log('======== current user retrieved ========'),
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  },
  data() {
    return {
      isLoading: true,
      valid: true,
      eventName: '',
      nameRules: [
        v => !!v || 'No name? Come on you can do better than that',
        v => (v && v.length <= 50) || 'Name must be less than 50 characters',
      ],

      eventDescription: ``,
      descriptionRules: [
        v => !!v || `Nobody is gonna come if you don't add fun details!`,
      ],

      // category: '',
      category: ['Sports', 'Arts', 'Music', 'Food', 'Pets', 'Games', 'Others'],
      selectedCategory: '',
      categoryRules: [
        v => !!v || 'Please indicate what category your event BEE-longs to',
      ],

      select: null,

      location: '',
      // locationRules: [
      //   v => !!v || 'Please tell us where is your event located at',
      // ],
      maxCapacity: null,
      capacityRules: [
        v => v != 0 || "I don't believe you!",
      ],

      eventDate: null,
      dateRules: [
        v => !!v || "Is it today? In the future? Must we time travel back?",
      ],
      eventTime: null,
      timeRules: [
        v => !!v || 'We need to know so we can plan our nap time!',
      ],
      modal2: false,
      date: null,

      image: '',
      uploadURL: '',
      imageRules: [
        v => !!v || 'An image speaks a thousand BZZZZs!',
      ],
      
      currentUser: this.$store.state.user,

      processingCreateEvent: false,
      createEventSuccess: false,

      // DATA FOR DISTANCE CALCULATION
      allStoredEvents: [this.$store.state.events],
      location1: '',
      location1_lat: '',
      location1_long: '',
      location2: '',
      location2_lat: '',
      location2_long: '',
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
        [Heading, {
          options: {
            levels: [1, 2, 3]
          }
        }],
        Bold,
        Code,
        HorizontalRule,
        Paragraph,
        HardBreak
      ],
      newEventID: '',
      uploadedImage: null
    }
  },
  computed: {
    width () {
      switch(this.$vuetify.breakpoint.name) {
        case 'xs': return 450
        case 'sm': return 540
        case 'md': return 720
        case 'lg': return 960
        case 'xl': return 1140
      }
    }
  },
  methods: {
    toEvent() {
      this.$store.dispatch('getEvents')
                this.$router.push("/event/?id=" + this.newEventID);
            },
    submitCreateEvent: async function () {
      if(this.$refs.form.validate()) {
        console.log('===== START OF CREATE EVENT =======')
        this.processingCreateEvent = true //loading screen
        await this.uploadImage()
  
        var self = this;
        var data = JSON.stringify({
          "eventName": self.eventName,
          "eventDesc": self.eventDescription,
          "eventLocation": self.location,
          "maxCapacity": self.maxCapacity,
          "eventDate": self.eventDate,
          "eventCategory": self.selectedCategory,
          "eventTime": self.eventTime, 
          "eventPhotoURL": self.uploadURL,
          "eventHost": this.currentUser
        });
  
        var config = {
          method: 'post',
          url: 'https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/events',
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        };
  
        await this.axios(config)
          .then(response => {
            console.log("id of newly created event below:");
            console.log(JSON.stringify(response.data));
            this.newEventID = response.data;
            console.log('Event Successfuly Created')
            this.processingCreateEvent = false
            this.createEventSuccess = true
            console.log('===== END OF CREATE EVENT =======')
          })
          // .then(function (response) {
          //   console.log(JSON.stringify(response.data));
          //   console.log('Event Successfuly Created')
          //   this.processingCreateEvent = false
  
          //   console.log('===== END OF CREATE EVENT =======')
  
          // })
          .catch(function (error) {
            console.log(error);
            console.log('Event NOT created')
            console.log('===== END OF CREATE EVENT =======')
          });
          
        await this.updateCreatedEvents();
      }      
    },

    updateCreatedEvents(){
      console.log("======== updating host's createdEvents ===========")
      // console.log(this.currentUser)
      var userEmail = this.currentUser.userEmail
      var newCreatedEvents = this.currentUser.createdEvents
      console.log(userEmail)
      var newEvent = this.newEventID
      newCreatedEvents.push(newEvent)
      console.log(newCreatedEvents)

      var data = JSON.stringify({
        "userEmail": userEmail,
        "createdEvents": newCreatedEvents
      });
      
      var config = {
        method: 'put',
        url: 'https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/users/created',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };

      this.axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          console.log("new event ID added to host's createdEvents field on database")
        })
        .catch(function (error) {
          console.log(error);
        });

    },

    xsBreakpoint() {
        return this.$vuetify.breakpoint.width <= 700
    },
    onLocationSelected: function (selectedLocation) {
      this.location = selectedLocation
    },

    onFileChange(e) {
      console.log('======onfilechange fired========')
      console.log(e)
      console.log(this.uploadedImage)
      let files = this.uploadedImage
      // let files = e.target.files || e.dataTransfer.files
      console.log(files)
      if (files == null) return
      this.createImage(files)
    },
    createImage(file) {
      // var image = new Image()
      let reader = new FileReader()
      reader.onload = (e) => {
        console.log('length: ', e.target.result.includes('data:image/jpeg'))
        if (e.target.result.length > MAX_IMAGE_SIZE) {
          return alert('Image is loo large.')
        }
        this.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage: function (e) {
      console.log('Remove clicked')
      this.image = ''
    },
    uploadImage: async function (e) {
      console.log('Upload clicked')
      // Get the presigned URL
      const response = await this.axios({
        method: 'GET',
        url: API_ENDPOINT
      })
      console.log('Response: ', response)
      console.log('Uploading: ', this.image)
      let binary = atob(this.image.split(',')[1])
      let array = []
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      let blobData = new Blob([new Uint8Array(array)], { type: 'image/jpeg' })
      console.log('Uploading to: ', response.data.uploadURL)
      const result = await fetch(response.data.uploadURL, {
        method: 'PUT',
        body: blobData
      })
      console.log('Result: ', result)
      // Final URL for the user doesn't need the query string params
      this.uploadURL = response.data.uploadURL.split('?')[0]
      console.log(`image url at ${result.url.split("?")[0]}`);
    },
    descriptionEmpty() {
      if (this.eventDescription == '<p></p>'){
        return true
      }
    }
  }
};

</script>
