<template>
  <LandingScreen v-if="isLoading"></LandingScreen>
  <div v-else fluid class="peachLight fill-height py-8">
      <RegistrationCard></RegistrationCard>
  </div>
</template>

<script>
import RegistrationCard from "../components/RegistrationCard.vue";
import LandingScreen from '../components/LandingScreen.vue';


export default {
  name: "Register",
  components: {LandingScreen, RegistrationCard},
  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  },
  data() {
    return {
      isLoading: true,
    };
  },
};
</script>
