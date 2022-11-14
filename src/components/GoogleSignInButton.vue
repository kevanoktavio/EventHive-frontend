<template>
  <a><img src="../assets/images/google_signin_btn.png" v-on:click="googleSignIn" width="30" height=30/></a>

</template>

<script>
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseAuth } from "../utils/firebaseInit"
import { googleAuthProvider } from '../utils/auth_google_provider_create'
import axios from "axios";

export default {
  name: "GoogleSignInButton",
  data() {
    return {
      errorMessage: "",
      googleUser: null
    }
  },
  methods: {
    googleSignIn: function() {
      signInWithPopup(firebaseAuth, googleAuthProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        this.googleUser = user
        console.log(this.googleUser.email)
        axios.get('https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/users')
        .then(result => {
          console.log(result.data)
          const allUsers = result.data
          var userExists = allUsers.find(user => user.userEmail == this.googleUser.email)
          console.log(this.userExists)
          if (userExists) {
            this.$store.commit("login", userExists)
            this.$router.go()
          } else {
            console.log("no google user found")
            axios.post('https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/users/register', 
            {
              userName: this.googleUser.email.split("@")[0],
              userPassword: null,
              userEmail: this.googleUser.email
            })
            .then(result => {
              this.$store.commit("login", result.data)
              this.$router.go()
            })
          }
        })
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        this.errorMessage = errorMessage
        console.log(this.errorMessage)
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    }
  }
}
</script>