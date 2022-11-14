<template>
  <LandingScreen v-if="isLoading"></LandingScreen>
  <div v-else class="fill-height brownLight py-10">
      <LoginCard></LoginCard>
  </div>
</template>

<script>
import LoginCard from "../components/LoginCard.vue";
import LandingScreen from '../components/LandingScreen.vue';


export default {
  name: "Login",
  components: {LandingScreen, LoginCard },
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
