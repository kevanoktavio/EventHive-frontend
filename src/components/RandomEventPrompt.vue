<template>
  <v-btn @click="toRandomEvent" elevation="4" class="greenLight ma-5 d-none d-sm-flex" icon height="100px" width="100px" absolute bottom right>
    <v-img transition="scale-transition" 
      :src="require('../assets/images/beebutton.png')"
      height="80px" contain></v-img>
  </v-btn>
</template>
<script>

export default {
  name: 'RandomEventPrompt',
  methods: {
    toRandomEvent() {
       // console.log(this.events[0])
            var all_events = this.$store.state.events
            var keys = Object.keys(all_events)
            // console.log(keys)
            var random_key = keys[Math.floor(Math.random() * keys.length)]
            console.log('specificEvent got:', random_key, all_events[random_key])
            this.specificEvent = all_events[random_key]
      this.$router.push("/event?id=" + this.specificEvent["_id"]);
    }
  }
}
</script>

