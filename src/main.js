import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from 'axios'
import VueAxios from 'vue-axios'
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
// don't forget to import CSS styles
import 'tiptap-vuetify/dist/main.css'
// Vuetify's CSS styles 
import 'vuetify/dist/vuetify.min.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import GmapVue from 'gmap-vue'


import 'aos/dist/aos.css'

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueAxios, axios)

Vue.use(TiptapVuetifyPlugin, {
  // the next line is important! You need to provide the Vuetify Object to this place.
  vuetify, // same as "vuetify: vuetify"
  // optional, default to 'md' (default vuetify icons before v2.0.0)
  iconsGroup: 'md'
})

Vue.use(GmapVue, {
  load: {
    key: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: 'places',
    v: '3.26',
    customCallback: 'MyCustomCallback',
  },
  autoBindAllEvents: false,
  installComponents: true,
  dynamicLoad: false,
})

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
  mounted() {
    this.$store.dispatch('getEvents')
  }
}).$mount('#app');
