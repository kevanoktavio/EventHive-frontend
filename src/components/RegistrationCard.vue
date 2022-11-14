<template>
    <v-card
      class="mx-auto px-10 py-6"
      :width="width"
      outlined
      data-aos="zoom-in"
    >
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
        label="Name"
        :rules="nameRules"
        append-icon="mdi-account"
        v-model="actualName"
      required
      ></v-text-field>

    <v-text-field
        color="#000000"
        dense
        outlined
        label="Email"
        :rules="emailRules"
        append-icon="mdi-email"
        v-model="email"
        @keyup.enter="signup"
      ></v-text-field>

      <v-text-field
        color="#000000"
        dense
        outlined
        label="Username"
        append-icon="mdi-account"
        :rules="usernameRules"
        v-model="userName"
        @keyup.enter="signup"
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
        @keyup.enter="signup"
      ></v-text-field>

      <v-text-field
        color="#000000"
        dense
        outlined
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="confirmPasswordRules"
        :type="show1 ? 'text' : 'password'"
        name="input-10-1"
        label="Confirm Password"
        hint="Must match password above"
        @click:append="show1 = !show1"
        @keyup.enter="signup"
      ></v-text-field>
      <v-btn
        class="text-none my-1 mb-4"
        :color="isDisabled ? 'grey' : 'greenDark'"
        dark
        block
        @click.native="signup"
      >
      Sign Up
      </v-btn>

      <v-btn
        class="btn-multiline"
        text
        @click.native="pushToLogin"
      >
        <span class="text-wrap">Already have an account? Log in here!</span>
      </v-btn>
    </v-form>
      
      <SignupSnackbar :show-snackbar="showSnackbar" :text="snackbarText"></SignupSnackbar>
    </v-card>

  </template>
   
  <script>
  import SignupSnackbar from "./SignupSnackbar.vue";
  import {firebaseAuth} from '../utils/firebaseInit'
  import {createUserWithEmailAndPassword} from 'firebase/auth'
  import AOS from 'aos'
  export default {
    components: {SignupSnackbar},
    name: "RegistrationCard",
    mounted() {
      AOS.init()
    },
      data () {
        return {
          isDisabled: false,
          show1: false,
          email: '',
          userName: '',
          password: '',
          showSnackbar: false,
          snackbarText: '',
          actualName: '',
          passwordRules: [
            v => !!v || 'Password is required',
            value => (value && value.length >= 6) || 'Minimum 6 characters',
            v => v && /(?=.*?[0-9])(?=.*?[A-Za-z]).+/.test(v) || 'At least one number and one letter',
          ],
          confirmPasswordRules: [
            v => !!v || 'Please confirm password',
            v =>v === this.password || 'The passwords do not match',
            ],
          emailRules: [
            v => !!v || 'Email is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
          ],
          usernameRules: [
          v => !!v || 'Username is required',
        ],
          nameRules: [
          v => !!v || 'Name is required', 
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
        signup: function(event) {
            if (this.$refs.form.validate()) {
              this.emailExists = false
              this.usernameExists = false
              this.bothExists = false
              this.isDisabled = true
              this.axios.post("https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/users/register",
                  {
                      userName: this.userName,
                      userPassword: this.password,
                      userEmail: this.email,
                      actualName: this.actualName
                  }
              ).then(response => {
                this.showSnackbar = true
                this.snackbarText = "User created. Taking you to login page..."
                this.userCreated = true
                this.isDisabled = false
                createUserWithEmailAndPassword(firebaseAuth, this.email, this.password)
                .then((userCredential) => {
                  const user = userCredential.user
                })
                .catch((error) => {
                  const errorCode = error.code 
                  const errorMessage = error.message
                })
                setTimeout(
                  ()=>{
                    this.$router.push({name: "login", params: {email: this.email}})
                  }, 3500
                )
              }).catch(error => {
                console.log(error)
                if (error.response.data == "Email is in use") {
                  this.emailExists = true
                  this.snackbarText = "This email already exists. Please log in!"
                  this.showSnackbar = true
                }
                else if (error.response.data == "Username is in use") {
                  this.snackbarText = "This username has been taken. Please choose another one!"
                  this.showSnackbar = true
                  this.usernameExists = true
                } else {
                  this.snackbarText = "This email and username already exists. Please login!"
                  this.showSnackbar = true
                  this.bothExists = true
                }
                this.isDisabled = false
                setTimeout(()=> this.showSnackbar = false, 3500)
              })
            }
        },
        pushToLogin: function(event) {
          this.$router.push({name: 'login', params: {email: this.email}})
      }
      }
    }
  </script>
  <style scoped>
  .v-text-field--outlined >>> fieldset {
    border-color: #A9C4BB;
  }

  .btn-multiline > span {
    width: 100%
  }

  </style>