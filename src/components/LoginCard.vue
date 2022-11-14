<template>
    <v-card
      class="mx-auto px-10 pt-8 pb-6"
      :width="width"
      outlined
      data-aos="zoom-in"
    >
    <SignupSnackbar :show-snackbar="showSnackbar" :text="snackbarText"></SignupSnackbar>
      <img
          class="img pa-3"
          src="../assets/images/logo-cropped.png"
          alt="loading..."
          width="100%"
        />
      <v-form ref="form">
      <v-text-field
        color="#000000"
        dense
        outlined
        label="E-mail"
        v-model="email"
        :rules="emailRules"
        append-icon="mdi-email"
        @keyup.enter="login"
      ></v-text-field>

      <v-text-field
        color="#000000"
        dense
        outlined
        v-model="password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordRules"
        :type="show1 ? 'text' : 'password'"
        name="input-10-1"
        label="Password"
        hint="At least 6 characters"
        @click:append="show1 = !show1"
        @keyup.enter="login"
      ></v-text-field>
      <v-btn
        class="text-none my-1"
        :color="isDisabled ? 'grey' : 'greenDark'"
        dark
        block
        @click.native="login"
      >
        Log in
      </v-btn>
        or
      <v-btn
        class="text-none my-1 mb-4"
        color=brownDark
        dark
        block
        @click="googleSignIn"
      >
        Continue with&nbsp&nbsp
        <img src="../assets/images/google_signin_btn.png" width="18" height="18" alt=""
        
        >
      </v-btn>

      <v-btn
        class="btn-multiline"
        text
        @click.native="pushToSignUp"
      >
        <span class="text-wrap">Don't have an account? Sign up here!</span>
      </v-btn>
      </v-form>
      
  </v-card>
  
</template>
 
<script>
import SignupSnackbar from "./SignupSnackbar.vue";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseAuth } from "../utils/firebaseInit"
import { googleAuthProvider } from '../utils/auth_google_provider_create'
import AOS from 'aos'
export default {
  components: {SignupSnackbar},
  name: "LoginCard",
    mounted() {
      AOS.init()
    },
    data () {
      return {
        wrongPassword: false,
        mustRegister: false,
        isDisabled: false,
        loginSuccessful: false,
        show1: false,
        email: this.$route.params.email || '',
        password: '',
        showSnackbar: false,
        googleUser: null, 
        snackbarText: '',
        emailRules: [
          v => !!v || 'Email is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        passwordRules: [
          v => !!v || 'Password is required',
        ]
      }
    },
    computed: {
      width () {
        switch(this.$vuetify.breakpoint.name) {
          case 'xs': return 360
          case 'sm': return 450
          case 'md': return 450
          case 'lg': return 450
          case 'xl': return 450
        }
      }
    },
    methods: {
      login: function (event) {
        if(this.$refs.form.validate()) {
          this.isDisabled = true
          this.axios.post("https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/users/signin",
            {
              userEmail: this.email,
              userPassword: this.password
            }
          ).then(response => {
            this.showSnackbar = true
            if (typeof response.data == "string") {
              if (response.data == "Register") {
                this.snackbarText = 'Email does not exist. Please register!'
              } else {
                this.password = ""
                this.snackbarText = 'Incorrect password entered :('
              }
            }
            else if ('userName' in response.data) {
              this.snackbarText = 'Login successful. Redirecting you...'
              const user = response.data
              this.$store.commit("login", user)
              setTimeout(
                () => {this.$router.push("/");},
                3000
              )
            }
            this.isDisabled = false
            setTimeout(
              () => {this.showSnackbar = false},
              3000
            )
          })
        }
      },
      pushToSignUp: function(event) {
        this.$router.push({name: 'register', params: {email: this.email}})
      },
      googleSignIn: function() {
        console.log("googlesign in")
        signInWithPopup(firebaseAuth, googleAuthProvider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          this.googleUser = user
          console.log(this.googleUser.email)
          this.axios.get('https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/users')
          .then(result => {
            console.log(result.data)
            const allUsers = result.data
            var userExists = allUsers.find(user => user.userEmail == this.googleUser.email)
            console.log(this.userExists)
            if (userExists) {
              this.$store.commit("login", userExists)
              this.$router.push('/')
            } else {
              console.log("no google user found")
              this.axios.post('https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/users/register', 
              {
                userName: this.googleUser.email.split("@")[0],
                userPassword: null,
                userEmail: this.googleUser.email
              })
              .then(result => {
                this.$store.commit("login", result.data)
                this.$router.push('/')
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
<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: #A9C4BB;
}
</style>