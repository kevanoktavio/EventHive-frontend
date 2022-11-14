<template>
  <v-app class="d-flex align-start">
    <NavBar @drawerShown="showDrawer"></NavBar>
    <v-main>
      <router-view />
    </v-main>
    <div v-if="xsBreakpoint">
      <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list
        nav
        dense
        class="mt-6"
      >
        <v-list-item class="d-flex justify-center my-5">
          <h1 class="brownDark--text">CATEGORIES</h1>
        </v-list-item>
        <v-list-item class="mb-5">
          <Categories></Categories>
        </v-list-item>
        <v-list-item class="d-flex justify-center my-5">
          <v-btn x-large class="px-auto brownDark font-weight-medium white--text mt-8" elevation="0" @click="createEvent()">Create Event</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    </div>
    <MainFooter/>
  </v-app>
</template>

<script>
import MainFooter from '@/components/MainFooter.vue';
import Navbar from '@/components/NavBar.vue'

export default {
  name: 'Base',
  components: {
    MainFooter, Navbar
  },
  data() {
      return {
        drawer: false,
      }
    },
    methods: {
      showDrawer(){
        this.drawer = true
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
      xsBreakpoint() {
        return this.$vuetify.breakpoint.width <= 700
      }
    }
};
</script>
