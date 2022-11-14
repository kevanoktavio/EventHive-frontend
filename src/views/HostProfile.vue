<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>
    <div>
      <v-container fluid class="brownLight pb-16 pt-8">
        <v-row
          class="mx-4 mb-16"
        >
          <v-col
            class="col-12 col-md-3"
          >
            <v-card
              class="py-4 px-3 mr-4 rounded-lg"
              data-aos="flip-up"
              data-aos-duration="1000"
              elevation="0"
            >
            <v-avatar size="150" class="mt-2">
                <img :src="host['userPhotoURL']">
            </v-avatar>
            <v-rating
              :value="avgRating"
              color="greenDark"
              background-color="greenMid"
              dense
              half-increments
              readonly
              size="20"
              class="mt-4 mb-2"
              ></v-rating>
            
              <div class="rounded greenDark px-4 py-3 mx-4 my-4 white--text font-weight-medium">
                <h3>Contact Info</h3>
              </div>
              <h3 class="mb-1 peachDark--text text-decoration-underline">
                Email
              </h3>
              <div class="mx-2 text-truncate">
                {{ host["userEmail"] }}
              </div>
              <h3 class="mb-1 mt-5 peachDark--text text-decoration-underline">
                Phone No.
              </h3>
              <div >
                {{ host['userPhone'] ? host['userPhone'] : "N.A."}}
              </div>
            </v-card>
          </v-col>
          <v-col
            style="min-width: 100px; max-width: 100%;"
            class="col-12 col-md-9"
          >
            <v-card
              class="pa-2 text-left px-8 pt-4 rounded-lg"
              data-aos="flip-up"
              data-aos-duration="1000"
              elevation="0"
            >
              <h1 class="mb-5 mt-2 greenDark--text">Hey, I'm {{ host["userName"] }}!</h1>
              <hr>
              <h1 class="mb-6 mt-5 peachDark--text">About Me</h1>
              <p v-if="host['userDesc']" v-html="host['userDesc']" class="mb-10"></p>
              <p v-else>No introduction yet...</p>
              <hr>
              <h1 class="mb-6 mt-5 peachDark--text">Rating & Reviews</h1>
              
              <div v-if="reviews.length==0">
                <p>No reviews yet...</p>
              </div>
              <div v-else>
                <HostEventReview  v-for="review of reviews" :eventReview="review"></HostEventReview>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
  import LoadingScreen from '../components/LoadingScreen.vue';
  import HostEventReview from '@/components/HostEventReview.vue';
  import AOS from 'aos'


  export default {
      name: "Home",
      components: { LoadingScreen, HostEventReview },
      mounted() {
      this.axios.get('https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/users').
      then(result=>{
        this.allUsers = result.data
      })
      AOS.init()
      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
      },
      data() {
        return {
          isLoading: true,
          eventID: "",
          eventDetails: {
                type: Object,
                required: true    
            },
          allUsers: null
        }
      },
      computed: {
        host() {
          var eventHost
          for (let event of this.$store.state.events) {
            if (event["_id"]==this.eventID) {
              eventHost = event["eventHost"]
            }
          }
          for (let user of this.allUsers) {
            if (user['_id'] == eventHost['_id']) {
              return user
            }
          }

        },
        reviews() {
          let returnArray = []
          for (let event of this.$store.state.events) {
            if (event["eventHost"]!=null && event["eventHost"]["_id"]==this.host["_id"]) {
              returnArray=returnArray.concat(event["eventReviews"]) 
            }
          }
          return returnArray
        },
        xsBreakpoint() {
          return this.$vuetify.breakpoint.name == 'xs' 
        },
      avgRating() {
        let count = this.reviews.length
        let total = 0
        for (let review of this.reviews) {
          total += review["numStars"]      
        }
        return total/count
      }
      },

      watch: {
    '$route.params': {
        handler() {
            this.eventID = this.$route.query.id
        },
        immediate: true,
      }
    },
  }
</script>
  