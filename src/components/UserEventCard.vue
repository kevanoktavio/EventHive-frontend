<template>
    <v-card elevation="2" >
      <div v-if="xsBreakpoint" class="">
        <v-col class="pa-5">
          <v-img
          contain
          class="v-img my-auto mx-auto "
          :src="eventObj.eventPhotoURL"
          max-height="300"
          >
          </v-img>
        </v-col>
      <div class="my-auto px-3">
        <p class="ml-4 mb-0 font-weight-medium text-left">{{eventDateString}}</p>
        <v-card-title class="text-h5 text-left mb-3 font-weight-bold ">{{eventObj.eventName}}</v-card-title>
        <v-card-subtitle class="text-left text-h6 font-weight-medium mb-1"><v-icon class="mx-1">place</v-icon>{{eventObj.eventLocation.SEARCHVAL}}</v-card-subtitle>
        <v-col
          v-if="this.eventType=='Registered Events'"
          class="text-left pt-0"
        >
          <v-btn 
          block
          class="text-none mb-2"
          color="greenDark"
          dark
          >
          View event details
          </v-btn>
        </v-col>
        <v-col
          v-else-if="this.eventType=='Hosted Events'"
          class="text-left pt-0">
            <v-btn 
              class="text-none mb-2 mr-2"
              color="greenDark"
              dark
              @click="redirectToEventPage"
            >
            View event details
            </v-btn>
            <v-btn 
              class="text-none mb-2"
              color="brownDark"
              dark
              >
              Edit event details
            </v-btn>
        </v-col>
        <v-col class="text-left pt-0" v-else>
          <Review></Review>
        </v-col>
        
      </div>
    </div>
    
    <div v-else class="d-flex flex-no-wrap justify-start">
      <v-avatar
        tile
        size="250"
        class="ma-4"
       >
        <v-img
          contain
          class="v-img my-auto"
          :src="eventObj.eventPhotoURL"
          max-height="225"
          max-width="225"
          >
        </v-img>
      </v-avatar>
      <div class="my-auto flex">
        <h3 class="ml-4 mb-5 font-weight-medium text-left mt-3">{{eventDateString}}</h3>
        <v-card-title class="text-left mb-5"><h3>{{eventObj.eventName}}</h3></v-card-title>
        <v-card-subtitle class="text-left mb-5"><h3 class="font-weight-medium"><v-icon class="mx-1" color="greenDark">place</v-icon>{{eventObj.eventLocation.SEARCHVAL}}</h3></v-card-subtitle>
        <v-col
          v-if="this.eventType=='Registered Events'"
          class="text-left pt-0"
        >
          <v-btn 
          class="text-none mb-2 mr-2"
          color="greenDark"
          dark
          @click="redirectToEventPage"
          >
          View event details 
          </v-btn>
          <v-dialog
            v-model="dialog"
            width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn 
                class="text-none mb-2"
                color="error"
                dark
                v-bind="attrs"
                v-on="on"
                >
                Buzz off from event
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="peachMid brownDark--text" color="#735019"><strong>
                  Confirmation
              </strong></v-card-title>
              <v-card-text class="pt-3">
                  You are unregistering from the event: <strong>{{this.eventObj.eventName}}</strong>.
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                  color="greenDark darken-1 white--text"
                  @click="unregister"
                  >
                  Confirm
                  </v-btn>
              </v-card-actions>
          </v-card>
          </v-dialog>
        </v-col>
        <v-col
          v-else-if="this.eventType=='Hosted Events'"
          class="text-left pt-0">
            <v-btn 
              class="text-none mb-2 mr-2"
              color="greenDark"
              dark
              @click="redirectToEventPage"
              >
              View event details
            </v-btn>
            <v-btn 
            class="text-none mb-2"
            color="brownDark"
            dark
            @click="editEvent"
            >
            Edit event details
            </v-btn>
        </v-col>
        <v-col class="text-left pt-0" v-else>
          <Review :event="this.eventObj"></Review>
        </v-col>
        
      </div>
    </div>
      
    

    </v-card>        
</template>

<script>
import Review from './Review.vue'

    export default {
    name: "UserEventCard",
    data() {
      return {
        registeredEventsList: [],
        dialog: false,
      }
    },
    props: {
        eventObj: {
            type: Object
        },
        eventType: {
            type: String
        }
    },
    methods: {
        getFormattedDate() {
            const eventDate = new Date(this.eventObj.eventDate).toString();
            const eventDateList = eventDate.split(" ");
            const day = eventDateList[0];
            var formattedDay = "";
            switch (day) {
                case "Mon":
                    formattedDay = "Monday";
                case "Tue":
                    formattedDay = "Tuesday";
                case "Wed":
                    formattedDay = "Wednesday";
                case "Thu":
                    formattedDay = "Thursday";
                case "Fri":
                    formattedDay = "Friday";
                case "Sat":
                    formattedDay = "Saturday";
                case "Sun":
                    formattedDay = "Sunday";
            }
            this.eventDateString = eventDateList[2] + " " + eventDateList[1] + " " + eventDateList[3] + ", " + formattedDay;
        },
        redirectToEventPage() {
            this.$router.push({ path: `/event?id=${this.eventObj._id}` });
        },
        editEvent() {
            console.log("going to ", this.eventObj._id);
            this.$router.push({ path: `/hostmgmt?id=${this.eventObj._id}` });
        },
        async unregister(){
          this.dialog=false
          var newAttendees = []
          var newUserRegisteredList = []
          for (let x in this.eventObj.attendees){
            if (this.eventObj.attendees[x]._id !== this.$store.state.user._id){
              newAttendees.push(this.eventObj.attendees[x])
            }
          }
          for (let x in this.registeredEventsList) {
            if (this.registeredEventsList[x] !== this.eventObj._id) {
              newUserRegisteredList.push(this.registeredEventsList[x])
            }
          }
          this.axios.put(`https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/events/attendees`,
            {
              '_id': this.eventObj._id, 
              'attendees': newAttendees
            })
          .then(()=> {
            this.axios.put(`https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/users/registered`,
            {
              'userEmail': this.$store.state.user.userEmail, 
              'registeredEvents': newUserRegisteredList
            })
            .then(() => {
              this.$emit('unregistered', newUserRegisteredList)
              
              this.$store.dispatch('getUser')
              this.$store.dispatch('getEvents')
              .then(()=> {
              })
            })
          })
      }
    },
    computed: {
        xsBreakpoint() {
            return this.$vuetify.breakpoint.name == "xs";
        }
    },
    data() {
        return {
            eventDateString: null
        };
    },
    mounted() {
        this.$store.dispatch('getUser')
        .then(() => {
          this.registeredEventsList = this.$store.state.user.registeredEvents
        })
        this.getFormattedDate();
    },
    components: { Review }
}
</script>

<style>

    .event-card-date{
      font-weight: bold;
    }
    .event-card-img{
        justify-content: center;
        display: flex;
        padding: 20px;
    }

</style>
