<template>
    <v-btn text v-if="this.$store.state.user == null" 
      class="login-btn px-xs-1 greenDark--text font-weight-medium" 
      id="login-btn" 
      @click="login">
      Log In
    </v-btn>

    <v-menu
      v-else
      open-on-hover
      open-on-click
      offset-y
      bottom
      left
      min-width="auto"
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <button >
          <v-avatar
            class="white--text ml-4"
            id="profile-btn"
            size="36"
            color="brownDark"
            v-bind="attrs"
            v-on="on"
          >
            <img v-if="$store.state.user.userPhotoURL" :src="$store.state.user.userPhotoURL"> 
            <img v-else src="../assets/images/test.jpg">
          </v-avatar>
        </button>
      </template>
      <v-list>
        <v-list-item @click="myProfile"> My Profile </v-list-item>
        <v-list-item @click="registered"> Registered Events </v-list-item>
        <v-list-item @click="history"> Attended Events </v-list-item>
        <v-list-item @click="hosted"> Hosted Events </v-list-item>
        <v-list-item @click="logout"> Log Out </v-list-item>
      </v-list>
    </v-menu>
</template>

<script>
// javascript
export default {
  name: "ProfileButton",
  data() {
    return {
      initials: null,
    };
  },
  mounted() {
    this.getInitials();
  },
  methods: {
    login() {
      this.$router.push("/login");
    },
    logout() {
      this.$store.commit("logout");
    },
    getInitials() {
      if (this.$store.state.user != null) {
        var userName = this.$store.state.user.userName;
        var userNameArr = userName.split(" ");
        if (userNameArr.length > 1) {
          this.initials =
            userNameArr[0][0].toUpperCase() + userNameArr[1][0].toUpperCase();
        } else {
          this.initials = userNameArr[0][0].toUpperCase();
        }
      }
    },
    myProfile() {
      this.$router.push("/profile");
    },
    registered() {
      this.$router.push("/user?type=registered");
    },
    history() {
      this.$router.push("/user?type=attended");
    },
    hosted() {
      this.$router.push("/user?type=hosted");
    },
  },
};
</script>

