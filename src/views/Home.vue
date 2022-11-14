<template>
  <LandingScreen v-if="isLoading"></LandingScreen>

  <div v-else>
    <div v-if="xsBreakpoint">
      <img class="mt-3" src="../assets/images/graphics1.png" width="70%" data-aos="fade-left">
      <div class="mt-6 mb-2 pt-6 pb-6 greenLight">
        <h1 class="mb-3 font-weight-bold text-center"><a class="greenDark--text" @click="pushToBuzzing">BUZZING NOW</a></h1>
        <EventCarousel :allEvents="buzzingEvents"></EventCarousel>
      </div>
      <div class="mb-2 pt-6 pb-6" v-if="this.$store.state.user">
        <h1 class="mb-3 font-weight-bold text-center"><a class="greenDark--text" @click="pushToForYou">JUST FOR YOU</a></h1>
        <EventCarousel :allEvents="userForYou"></EventCarousel>
      </div>
      <div class="mt-2 pt-6 pb-16">
        <h2 class="mb-6 brownDark--text">Don't buzz off by yourself...</h2>
        <img src="../assets/images/homepage-1.png" width="80%" class="mt-2 mb-6 mx-auto"/>
        <img src="../assets/images/homepage-2.png" width="80%" class="mb-4 mx-auto"/>
      </div>
    </div>

    <div v-else>
      <WelcomeImage></WelcomeImage>
      <div class="mb-2 mt-3 pt-6 px-sm-3 px-md-6 px-lg-10 pb-10 greenLight">
        <h1 class="mb-0 mt-1 font-weight-bold carouselheader ml-16 pl-16 text-start"><a class="greenDark--text" @click="pushToBuzzing">BUZZING NOW</a></h1>
        <EventCarousel :allEvents="buzzingEvents"></EventCarousel>
      </div>
      <div class="mb-2 mt-10 pt-6 px-10 pb-16" v-if="this.$store.state.user">
        <h1 class="font-weight-bold carouselheader ml-16 pl-16 text-start mb-2"><a class="greenDark--text" @click="pushToForYou">JUST FOR YOU</a></h1>
        <EventCarousel :allEvents="userForYou"></EventCarousel>
      </div>
      <div class="mt-2 pt-6 px-10 pb-16">
        <h1 id="headerDesc" class="mb-6 brownDark--text" data-aos="zoom-in" data-aos-duration="1200">Don't buzz off by yourself...</h1>
        <div class="d-flex">
          <img src="../assets/images/homepage-1.png" width="60%" class="mt-4 ml-16 pl-16" data-aos="fade-right" data-aos-duration="1200"/>
        </div>
        <div class="d-flex justify-end">
          <img src="../assets/images/homepage-2.png" width="60%" class="mb-4 mr-16 pr-16" data-aos="fade-left" data-aos-duration="1200"/>
        </div>      
      </div>
    </div>
    <RandomEventPrompt class="bottom-stick"></RandomEventPrompt>
    </div>

</template>

<script>
import LandingScreen from '../components/LandingScreen.vue';
import EventCarousel from '@/components/EventCarousel.vue';
import RandomEventPrompt from '@/components/RandomEventPrompt.vue';
import WelcomeImage from '@/components/WelcomeImage.vue';
import AOS from 'aos'

export default {
    name: "Home",
    components: { LandingScreen, EventCarousel, RandomEventPrompt, WelcomeImage },
    mounted() {
      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
      AOS.init()

      if (this.$store.state.user != null) {
        console.log(`current user: ${this.$store.state.user.userName}`)
      }
    },
    data() {
      return {
        drawer: false,
        isLoading: true
      }
    },
    methods: {
      showDrawer(){
        this.drawer = true
      },
      getAllBuzzing (events){
        var buzzingEvents = [];
        for (let indiv of events){
          if (indiv.isBuzzing && (indiv.eventDate >= new Date().toISOString())){
            buzzingEvents.push(indiv)
          }
        }
        return buzzingEvents
      },
      getAllUser: function (events, user){
        var reccEvents = [];
        for (let indiv of events){
          if (user.categoryPrefs.includes(indiv.eventCategory) && (indiv.eventDate >= new Date().toISOString())){
            reccEvents.push(indiv)
          }
        }
        return reccEvents
      },
      pushToBuzzing: function() {
        this.$router.push( {
          name: 'Buzzing',
          params: {
            events: this.buzzingEvents
          }
        })
      },
      pushToForYou: function() {
        this.$router.push( {
          name: 'For You',
          params: {
            events: this.userForYou
          }
        })
      },
      createEvent() {
        if (this.$store.state.user == null){
          this.$router.push("/login");
        }
        else {
          this.$router.push("/events/create");
        }
      },
    },
    computed: {
      userForYou() {
        return this.getAllUser(this.$store.state.events, this.$store.state.user)
      },
      buzzingEvents() {
        return this.getAllBuzzing(this.$store.state.events)
      },
      xsBreakpoint() {
        return this.$vuetify.breakpoint.width <= 750
      }
    }
};
</script>

<style>


.carouselheader{
  font-size: 3em
}

.bottom-stick {
  z-index: 999;
  position: fixed;
  bottom: 0;
}

#headerDesc{
  font-size: 4em
}

</style>