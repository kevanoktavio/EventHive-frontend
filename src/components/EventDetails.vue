<template>
    <div class="brownLight py-4 py-lg-8 px-lg-16"
    >
        <v-card
        class="mx-auto mt-2 pt-4"
        :width="cardWidth"
        data-aos="zoom-in"
        data-aos-duration="800"

        >
        <v-container>
            <v-row>
                <v-card
                class="mx-auto mt-5"
                :width="width"
                outlined
                color="transparent"
                data-aos="flip-up"
                data-aos-duration="1200"
                >
                  <img v-bind:src="this.specificEvent.eventPhotoURL"
                      aspect-ratio="16/9"
                      width="100%"
                  >
                </v-card>
                <v-card
                class="mx-auto"
                :width="width"
                outlined
                color="transparent"
                data-aos="flip-up"
                data-aos-duration="1200"
                >
                    <v-container class="fill-height">
                    <v-row class="d-flex flex-column">
                        <v-col>
                            <h2 class="text-left font-weight-medium">{{this.newDate(this.specificEvent.eventDate)}}</h2>
                        </v-col>
                        <v-col>
                            <h1 class="text-left"> {{this.specificEvent.eventName}} </h1>
                        </v-col>
                        <v-col class="justify-start">
                            <span>
                            <h3 class="text-left font-weight-medium">by
                            <v-btn
                            v-if="this.specificEvent.eventHost"
                            @click="hostProfile()"
                            text
                            tile
                            color=""
                            class="pd ml-2"
                            x-large
                            > {{this.specificEvent.eventHost.userName}}</v-btn></h3> 

                        </span>
                        </v-col>
                        <v-col class="text-left">
                            <template v-if="this.registered">
                                <v-card
                                color="greenLight"
                            >
                            <v-card-title
                            class="justify-center greenDark--text"
                            >
                            <v-icon color="greenDark" class="mr-10">mdi-flower</v-icon>
                            Registered!
                            <v-icon color="greenDark" class="ml-10">mdi-flower</v-icon>
                            </v-card-title>
                            </v-card>
                        </template>
                        <template v-else-if="!(this.$store.state.user == null) && (this.specificEvent.eventHost._id == this.$store.state.user._id)">
                            <v-card
                                class="peachDark"
                            >
                            <v-card-title
                            class="justify-center white--text"
                            >
                            <v-icon color="#FFFFFF" class="mr-10"> mdi-bee </v-icon>
                                You are hosting!
                            <v-icon color="#FFFFFF" class="ml-10"> mdi-bee </v-icon>
                            </v-card-title>
                            
                            </v-card>
                        </template>
                        <template v-else-if="this.specificEvent.attendees.length >= this.specificEvent.maxCapacity">
                            <v-card
                                class="peachDark"
                            >
                            <v-card-title
                            class="justify-center white--text"
                            >
                            <v-icon color="#FFFFFF" class="mr-10">mdi-beehive-off-outline</v-icon>
                            Event Full
                            <v-icon color="#FFFFFF" class="ml-10">mdi-beehive-off-outline</v-icon>
                            </v-card-title>
                            </v-card>
                        </template>
                        <template v-else-if="this.specificEvent.eventDate < this.today">
                            <v-card
                                color="#90A4AE"
                            >
                            <v-card-title
                            class="justify-center white--text"
                            >
                            <v-icon color="#FFFFFF" class="mr-10">mdi-beehive-off-outline</v-icon>
                            Event passed
                            <v-icon color="#FFFFFF" class="ml-10">mdi-beehive-off-outline</v-icon>
                            </v-card-title>
                            </v-card>
                        </template>
                        <template v-else>
                            <div>
                            <v-dialog
                            v-model="dialog"
                            width="500"
                            >
                            <template v-slot:activator="{ on, attrs }">
                                <v-card
                                    block
                                    color="greenDark"
                                    class="white--text no-text-transform btn-multiline"
                                    v-bind="attrs"
                                    v-on="on"
                                    
                                >
                                <v-card-title
                                class="justify-center"
                                >
                                <v-icon color="#FFFFFF" class="mr-10">mdi-bee-flower</v-icon>
                                    Register
                                <v-icon color="#FFFFFF" class="ml-10">mdi-bee-flower</v-icon>
                            </v-card-title>
                                </v-card>
                        </template>
                        <v-card>
                            <v-card-title class="peachMid brownDark--text" color="#735019"><strong>
                                Confirmation
                            </strong></v-card-title>

                            <v-card-text class="pt-3">
                                You are signing up for the event: <strong>{{this.specificEvent.eventName}}</strong>.
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                color="greenDark darken-1 white--text"
                                
                                @click="intermediate"
                                >
                                Confirm
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                        </v-dialog>
                        </div>
                        </template>
                        </v-col>
                    </v-row>
                    <v-row class= "align-end justify-left">
                        
                    </v-row>
                </v-container>
                </v-card>
            </v-row>
            <v-row>
                <v-card
                class="mx-auto px-4 px-2 pt-8"
                :width="width"
                outlined
                color="transparent"
                data-aos="flip-up"
                data-aos-duration="1000"
                >
                    <h2 class="text-left font-weight-medium mb-12">Description</h2>
                    <span v-html="desc" class="text-left">
                    </span>
                </v-card>
                <v-card
                class="mx-auto px-4 pt-8 pb-9"
                :width="width"
                outlined
                color="transparent"
                >
                    <div class="d-flex flex-column">

                            <v-card class="mb-4 pa-4" data-aos="flip-up" data-aos-duration="1000">
                                <v-container fill-height>
                                <v-row class="justify-start align-center mb-1">
                                    <v-col cols="1">
                                        <v-icon>mdi-calendar</v-icon>
                                    </v-col>
                                    <v-col cols="11" >
                                        <h2 class="text-left font-weight-medium">Date and Time</h2>
                                    </v-col>
                                </v-row>
                        <v-row align-center class="justify-start">
                            <p class="text-left ml-3 overflow-auto">
                                {{getFormattedDate}}
                            </p>
                        </v-row>
                        <v-row align-center class="justify-start">
                            <p class="text-left ml-3 overflow-auto">
                                {{ this.specificEvent.eventTime ? getFormattedTime : "TBD" }}
                            </p>
                        </v-row>
                        </v-container>
                    </v-card>
                    <v-card 
                      class="pa-4 mt-4" 
                      :width="width"
                      data-aos="flip-up"
                      data-aos-duration="1000">
                        <v-container fill-height>
                        <v-row class="justify-start align-center mb-1">
                            <v-col cols="1">
                                <v-icon>mdi-map-marker</v-icon>
                            </v-col>
                            <v-col cols="11">
                                <h2 class="text-left align-center font-weight-medium">Location</h2>
                            </v-col>
                        </v-row >
                        <v-row class="justify-start my-3">
                            <p class="text-left ml-3">
                                {{this.specificEvent.eventLocation.ADDRESS}}
                                
                            </p>
                        </v-row>
                        <v-row class="justify-center">
                          <GoogleMap 
                            :long="this.specificEvent.eventLocation.LONGITUDE" 
                            :lat="this.specificEvent.eventLocation.LATITUDE"
                            :locationName="this.specificEvent.eventLocation.SEARCHVAL"
                          >
                          </GoogleMap>

                            <v-btn
                                block
                                color="greenDark"
                                class="white--text"
                                @click="redirect"
                            >
                                View Map
                            </v-btn>
                        </v-row>
                    </v-container>
                    </v-card>

                    <br>
                    <br>
                    </div>
                    
                    <v-card
                        elevation="0"
                        max-width="500"
                        class="mx-auto text-start"
                        border="1px solid"
                        data-aos="flip-up"
                        data-aos-duration="1000"
                    >
                        <h2 class="my-4 font-weight-medium">Reviews</h2>
                        <div v-if="this.specificEvent.eventReviews.length > 0">
                        <v-virtual-scroll
                        :items="this.specificEvent.eventReviews"

                        height="400"
                        item-height="200"
                        >
                        <template v-slot:default="{ item }">
                            <v-list-item :key="item">

                
                            <v-list-item-content>
                                <v-list-item-title class="d-flex flex-wrap flex-grow-1">
                                <p><strong class="mb-2">{{item.userName}}</strong></p>
                                <v-spacer></v-spacer>
                                <v-rating
                                :value="item.numStars"
                                color="amber"
                                dense
                                half-increments
                                readonly
                                size="14"
                                ></v-rating>
                            </v-list-item-title>
                            <v-list-item-subtitle class="d-flex flex-wrap flex-grow-1">
                                <p size="0.75rem" class="">{{item.dateReviewed}}</p>
                            </v-list-item-subtitle>
                                {{item.reviewText}}
                                
                            </v-list-item-content>
                            </v-list-item>
                

                        </template>
                        </v-virtual-scroll>
                    </div>
                    <div v-else>
                        <p>No reviews yet!</p>
                    </div>
                </v-card>

                            </v-card>
                        </v-row>
                        
                    </v-container>
                    
                    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css" rel="stylesheet">
                    
                </v-card>
                
                </div>
    
</template>

<script>
  import GoogleMap from "@/components/GoogleMap.vue"
  import AOS from 'aos'
    export default {
        name: 'EventDetails',

        data() { return {
            isLoading: true,
            benched: 10,
            events: [this.$store.state.events],
            eventID: null,
            specificEvent: null,
            date: null,
            reviews: null,
            desc: "",
            userlist: [],
            acctUser: null,
            registered: false,
            dialog: false,
            isHost: false,
            today: new Date().toISOString(),
            
        }
    },
    props: {
      GoogleMap,
    },
    methods: {
        redirect() {
            window.open('https://www.google.com/maps/search/' + this.specificEvent.eventLocation.SEARCHVAL, '_blank');
        },

        findCorrectEvent() {
            this.specificEvent = this.events[0].find(event => event._id === this.eventID)
            this.reviews = this.specificEvent.eventReviews
            this.desc = this.specificEvent.eventDesc
        },

        newDate(inputDate) {
            var test = new Date(inputDate)
            return(test.toDateString())
        },
        hostProfile () {
            this.$router.push("/hostview/?id=" + this.eventID)
        },
        isBuzzing () {
            if (this.specificEvent.attendees.length > this.specificEvent.maxCapacity) {
                this.specificEvent.isBuzzing = true
            }
        },
        intermediate () {
            this.dialog = false
            this.noUser()
            this.eventPatch()
            this.userPatch()
            this.isRegistered()
            this.setup()
            this.$store.dispatch('getUser')
        },
        isRegistered() {
            // console.log(this.host)
            this.$store.dispatch('getUser')
            console.log("user registered events" , this.acctUser.registeredEvents)
            console.log("event attendees" , this.specificEvent.attendees)
            if(this.acctUser.registeredEvents.includes(this.specificEvent._id)){
                this.registered = true
                console.log('event registered already')
            }
            else {
                this.registered = false
            }
        },
        noUser() {
            if(this.$store.state.user == null){
            this.$router.push("/login")
        }
        else{
            this.acctUser = this.$store.state.user
        }
    },
        eventPatch () {
            if(this.$store.state.user == null){
                this.$router.push("/login")
            }
            else{
            let eventList = this.specificEvent.attendees
            // console.log(eventList)
            eventList.push(this.$store.state.user)
            var data = JSON.stringify({
                "_id": this.eventID,
                "attendees": eventList
                });

            var config = {
            method: 'put',
            url: 'https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/events/attendees',
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
            };

            this.axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
            console.log(error);
            });
        }},
        userPatch () {
            let regList = this.acctUser.registeredEvents
            regList.push(this.eventID)
            var data = JSON.stringify({
                "userEmail": this.acctUser.userEmail,
                "registeredEvents": regList
                });

            var config = {
            method: 'put',
            url: 'https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/users/registered',
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
            };

            this.axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
            console.log(error);
            });
        },
        async setup() {
            await this.findCorrectEvent(),
            this.acctUser = this.$store.state.user,
            this.isBuzzing()

    }
 },
created() {
    this.$store.dispatch('getEvents')
    this.$store.dispatch('getUser')
},
    async mounted()  {
        AOS.init()
        await this.setup()
        console.log(this.specificEvent.eventDate)
        this.isRegistered()
        setTimeout(() => {
      this.isLoading = false;
    },1500);
    },
    watch: {
    '$route.params': {
        handler() {
            this.eventID = this.$route.query.id
        },
        immediate: true,
    }
},
computed: {
        getFormattedDate() {
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let date = new Date(this.specificEvent.eventDate);
            return date.getDate() + " " + months[date.getMonth()] + ", " + date.getFullYear();
        },
        getFormattedTime() {
            const unformattedTime = this.specificEvent.eventTime
            const unformattedTimeList = unformattedTime.split(":")
            const hours = (unformattedTimeList[0] % 12) || 12
            const suffix = unformattedTimeList[0] >= 12 ? 'PM' : 'AM'
            return hours + '.' + unformattedTimeList[1] + " " + suffix
        },
        width () {
            switch(this.$vuetify.breakpoint.name) {
            case 'xs': return 450
            case 'sm': return 450
            case 'md': return 450
            case 'lg': return 500
            case 'xl': return 500
            }
        },
        cardWidth() {
            switch(this.$vuetify.breakpoint.name) {
            case 'xs': return 500
            case 'sm': return 760
            case 'md': return 1000
            case 'lg': return 1300
            case 'xl': return 1500
            }
    }
    }
}
    
</script>
