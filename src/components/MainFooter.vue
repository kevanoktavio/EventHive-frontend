<template>
<footer>
  <div>
    <v-footer color="brownMid">
      <v-container >
        <v-row justify="end" dense >
          <v-col>
            <v-icon class="mx-5">phone</v-icon>
            +65 1234 5678
          </v-col>
        </v-row>
        <v-row justify="end" dense>
          <v-col>
            <v-icon class="mx-5">email</v-icon>
            hello@eventhive.com.sg
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </div>
  <!-- <toast/>
  <simple-dialog/> -->
</footer>
</template>

<script>
// import Toast from './Toast.vue';
// import SimpleDialog from './SimpleDialog.vue';

export default {
  name: 'MainFooter'
};
</script>

<!-- <style>
  footer{
    cursor: url('../assets/images/bee.png')
  }
</style> -->