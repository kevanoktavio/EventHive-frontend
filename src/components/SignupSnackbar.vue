<template>
  <div class="text-center">
    <v-snackbar
      v-model="showSnackbar"
      :color="text == 'User created. Taking you to login page...' || text == 'Login successful. Redirecting you...'
      ? $vuetify.theme.themes.light.greenDark 
      : $vuetify.theme.themes.light.error"
      absolute
      top
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        required: true
      },
      showSnackbar: {
        type: Boolean,
        required: true
      }
    },
  }
</script>