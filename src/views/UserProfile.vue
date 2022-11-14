<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>
  <div v-else-if="this.$store.state.user == null" class="my-16 py-16">
    <div class="py-16">
      <v-alert class="brownLight ma-2 my-16">
      You are not logged in. Please login to view your profile.
    </v-alert>
    </div>
  </div>
  <div v-else>
    <v-container>
      <br />
      <h1 class="d-flex brownDark--text font-weight-bold ma-4 mb-6">
        My Profile
      </h1>
      <!-- upload image section -->
      <v-row class="col-12 pt-3 ma-0">
        <div v-if="!image" class="col-12">
          <!-- <h3>Upload cool photo below!</h3> -->
          <!-- <input type="file" @change="onFileChange" accept="image/jpeg"> -->
          <v-file-input outlined dense @change="onFileChange()" accept="image/jpeg,image/png" label="Upload here!" prepend-icon="mdi-camera" v-model="uploadedImage"></v-file-input>
        </div>
        <div v-else>
          <img :src="image" style="border:1px grey; border-radius: 3%;" width="250" height=auto />
          <br>
          <v-btn outlined @click="removeImage">Choose another picture?</v-btn>
        </div>
      </v-row>
      <hr class="my-8">
      <v-row class="col-12 pa-0 ma-0">
        <v-text-field
          v-model="userName"
          outlined
          label="Username"
          required
          hide-details
          class="ma-2 col-sm"
        ></v-text-field>

        <v-text-field
          v-model="email"
          :rules="emailRules"
          outlined
          disabled
          hide-details
          label="Email"
          class="ma-2 col-sm"
        ></v-text-field>
      </v-row>

      <v-row class="col-12 pa-0 ma-0">
        <v-text-field
        v-model="contact"
        outlined
        hide-details
        label="Phone number"
        class="ma-2"
        ></v-text-field>
        <v-text-field
        v-model="fullName"
        outlined
        hide-details
        label="Full Name"
        class="ma-2"
        ></v-text-field>
      </v-row>

      <v-row class="col-12 pa-0 ma-0">
        <v-select
          v-model="gender"
          :items="['Male', 'Female']"
          :menu-props="{ bottom: true, offsetY: true }"
          label="Gender"
          outlined
          hide-details
          class="ma-2 col-sm"
        ></v-select>
        <v-text-field
          v-model="age"
          outlined
          type="number"
          label="Age"
          hide-details
          class="ma-2 col-sm"
        ></v-text-field>
      </v-row>

      <v-row class="col-12 pa-0 ma-0">
        <v-text-field
          v-model="password"
          :append-icon="showPass ? 'visibility' : 'visibility_off'"
          :rules="[passwordRules.min]"
          :type="showPass ? 'text' : 'password'"
          label="New Password"
          hint="At least 8 characters"
          outlined
          class="ma-2 col-sm"
          hide-details
          @click:append="showPass = !showPass"
        ></v-text-field>
        <v-text-field
          v-model="password2"
          :append-icon="showPass ? 'visibility' : 'visibility_off'"
          :rules="[passwordRules.match]"
          :type="showPass ? 'text' : 'password'"
          label="Confirm Password"
          hint="At least 8 characters"
          outlined
          class="ma-2 col-sm"
          hide-details
          @click:append="showPass = !showPass"
        ></v-text-field>
      </v-row>

      <hr class="my-12">

      <h1 class="d-flex brownDark--text font-weight-bold ma-4">
        General Information
      </h1>

      <h3 class="d-flex brownDark--text mx-4 mt-6 font-weight-medium">
        My Interests
      </h3>
      <v-row class="col-12 pa-0 ma-0">
      <v-chip-group
          multiple
          v-model="chips"
          active-class="greenDark--text"
          class="ma-2"
          column
        >
          <v-chip
            v-for="tag in items"
            :key="tag"
          >
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </v-row>
      <h3 class="d-flex brownDark--text mx-4 mt-6 font-weight-medium">
        About me
      </h3>
      <v-row class="col-12 pa-0 ma-0">
        <tiptap-vuetify class="ma-2" v-model="userDescription" :extensions="extensions" />
      </v-row>

      <v-row class="d-flex align-center mb-12 mt-8">
        <v-btn
          color="greenDark"
          class="white--text ma-4 pa-1 px-3"
          @click="updateProfile()"
          elevation="0"
          large
          >Update Profile</v-btn
        >
        <v-icon
          v-if="updateSuccess"
          color="greenDark"
          transition="scale-transition"
          large
        >
          check_circle
        </v-icon>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import LoadingScreen from "../components/LoadingScreen.vue";
import { TiptapVuetify, Heading, Bold, Italic, Strike, Underline, Code, Paragraph, BulletList, OrderedList, ListItem, Link, Blockquote, HardBreak, HorizontalRule, History } from 'tiptap-vuetify'

// variables to upload image
const MAX_IMAGE_SIZE = 10000000
const API_ENDPOINT = 'https://xt96j6drmd.execute-api.ap-southeast-1.amazonaws.com/uploads' // e.g. https://ab1234ab123.execute-api.us-east-1.amazonaws.com/uploads


export default {
  name: "UserProfile",
  components: { LoadingScreen, TiptapVuetify},
  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
    this.setExistingPrefs();
    this.$store.dispatch('getUser') // use this to get the current user after updating their particulars in db
  },
  data() {
    return {
      isLoading: true,
      updateSuccess: false,
      email:
        this.$store.state.user["userEmail"] == null
          ? ""
          : this.$store.state.user["userEmail"],
      userName:
        this.$store.state.user["userName"] == null
          ? ""
          : this.$store.state.user["userName"],
      gender:
        this.$store.state.user["userGender"] == null
          ? ""
          : this.$store.state.user["userGender"],
      age:
        this.$store.state.user["userAge"] == null
          ? ""
          : this.$store.state.user["userAge"],
      password: "",
      password2: "",
      showPass: false,
      passwordRules: {
        match: (v) => v == this.password || "Passwords do not the match",
        min: (v) => v.length == 0 || v.length >= 8 || "Min 8 characters",
      },
      nameRules: [
        (v) => /^[a-zA-Z-']+$/.test(v) || "Name cannot have special characters",
      ],
      emailRules: [(v) => /.+@.+\..+/.test(v) || "E-mail must be valid"],

      chips: [],
      items: ['Sports', 'Arts', 'Music', 'Food', 'Pets', 'Games'],

      contact: this.$store.state.user["userPhone"] == null ? "" : this.$store.state.user["userPhone"],
      userDescription: this.$store.state.user["userDesc"] == null ? "" : this.$store.state.user["userDesc"],
      fullName: this.$store.state.user["userFullName"] == null ? "" : this.$store.state.user["userFullName"],

      // FOR UPLOADING IMAGE
      image: this.$store.state.user["userPhotoURL"] == null ? "": this.$store.state.user["userPhotoURL"],
      uploadURL : '',
      uploadedImage: null,

      //FOR RICH TEXT
      extensions: [
        History,
        Blockquote,
        Link,
        Underline,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        [Heading, {
          options: {
            levels: [1, 2, 3]
          }
        }],
        Bold,
        Code,
        HorizontalRule,
        Paragraph,
        HardBreak
      ],
    };
  },
  methods: {
    setAlertTimeout() {
      setTimeout(() => {
        this.updateSuccess = false;
      }, 2000);
    },
    updateProfile: async function () {
      let reqBody = {};
      
      // UPLOAD IMAGE
      await this.uploadImage()
      console.log(this.uploadURL)
      reqBody['userPhotoURL'] = this.uploadURL;
      
      // update categoryPrefs
      if (this.chips.length > 0) {
        reqBody["userEmail"] = this.email;
        let newCategoryPrefs = [];
        for(let index of this.chips) {
          if (this.items[index] != null) {
            newCategoryPrefs.push(this.items[index]);
          }
        }
        if (newCategoryPrefs.length == 0) {
          reqBody["categoryPrefs"] = ["Others"];
        } else {
          reqBody["categoryPrefs"] = newCategoryPrefs;
        }
      }

      // update other details
      if (this.userName != "") {
        reqBody["userName"] = this.userName;
      }
      if (this.password != "") {
        reqBody["userPassword"] = this.password;
      } else {
        reqBody["userPassword"] = this.$store.state.user["userPassword"];
      }
      if (this.age > 0) {
        reqBody["userAge"] = this.age;
      }
      if (this.gender != "") {
        reqBody["userGender"] = this.gender;
      }
      if (this.userDescription != "") {
        reqBody["userDesc"] = this.userDescription;
      }
      if (this.contact != "") {
        reqBody["userPhone"] = this.contact;
      }
      if (this.fullName != "") {
        reqBody["userFullName"] = this.fullName;
      }

      this.axios
        .put(
          `https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/users/${this.$store.state.user["_id"]}`,
          reqBody
        )
        .then((response) => {
          if (response.data == "Update Success") {
            this.updateSuccess = true;
            this.setAlertTimeout();
            this.$store.dispatch('getUser') // use this to get the current user after updating their particulars in db
          }
        });

      
    },
    setExistingPrefs() {
      if (this.$store.state.user["categoryPrefs"] == null) {
        this.chips = [];
      } else {
        let existingPrefs = []
        for (let category of this.$store.state.user["categoryPrefs"]) {
          existingPrefs.push(this.items.indexOf(category));
        }
        this.chips = existingPrefs;
      }
    },
    photo_submit (e) {
      console.log("test", e)
      // console.log(e.target.result)
      // // variables to upload image
      // // const MAX_IMAGE_SIZE = 1000000
      // const API_ENDPOINT = 'https://xt96j6drmd.execute-api.ap-southeast-1.amazonaws.com/uploads' // e.g. https://ab1234ab123.execute-api.us-east-1.amazonaws.com/uploads

      // // s3 code
      // // Get the presigned URL
      // console.log("")
      // const response = this.axios({
      //   method: 'GET',
      //   url: API_ENDPOINT
      // })
      // console.log('Response: ', response)
      // console.log('Uploading: ', this.image)
      // let binary = atob(this.image.split(',')[1])
      // let array = []
      // for (var i = 0; i < binary.length; i++) {
      //   array.push(binary.charCodeAt(i))
      // }
      // let blobData = new Blob([new Uint8Array(array)], { type: 'image/jpeg' })
      // console.log('Uploading to: ', response.data.uploadURL)
      // const result = fetch(response.data.uploadURL, {
      //   method: 'PUT',
      //   body: blobData
      // })
      // console.log('Result: ', result)
      // // Final URL for the user doesn't need the query string params
      // this.uploadURL = response.data.uploadURL.split('?')[0]
      // console.log(`image url at ${result.url.split("?")[0]}`);

    },

    // UPLOAD IMAGE FUNCTIONS
    onFileChange(e) {
      console.log('======onfilechange fired========')
      console.log(e)
      console.log(this.uploadedImage)
      let files = this.uploadedImage
      // let files = e.target.files || e.dataTransfer.files
      console.log(files)
      if (files == null) return
      this.createImage(files)
    },
    createImage(file) {
      // var image = new Image()
      let reader = new FileReader()
      reader.onload = (e) => {
        console.log('length: ', e.target.result.includes('data:image/jpeg'))
        if (e.target.result.length > MAX_IMAGE_SIZE) {
          return alert('Image is loo large.')
        }
        this.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage: function (e) {
      console.log('Remove clicked')
      this.image = ''
    },
    uploadImage: async function (e) {
      console.log('Upload clicked')
      // Get the presigned URL
      const response = await this.axios({
        method: 'GET',
        url: API_ENDPOINT
      })
      console.log('Response: ', response)
      console.log('Uploading: ', this.image)
      let binary = atob(this.image.split(',')[1])
      let array = []
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      let blobData = new Blob([new Uint8Array(array)], { type: 'image/jpeg' })
      console.log('Uploading to: ', response.data.uploadURL)
      const result = await fetch(response.data.uploadURL, {
        method: 'PUT',
        body: blobData
      })
      console.log('Result: ', result)
      // Final URL for the user doesn't need the query string params
      this.uploadURL = response.data.uploadURL.split('?')[0]
      console.log(`image url at ${result.url.split("?")[0]}`);
    },
  },
};
</script>
