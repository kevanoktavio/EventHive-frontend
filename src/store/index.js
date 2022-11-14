import Vue from 'vue';
import Vuex from 'vuex';
import toast from './moduleToast';
import dialog from './moduleDialog';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
  state: {
    user: null,
    events : null,
    categories: [
      { title: 'Sports', src: 'fa-solid fa-volleyball', filter: 'Sports'},
      { title: 'Arts', src: 'fa-solid fa-palette', filter: 'Arts'},
      { title: 'Music', src: 'fa-solid fa-music', filter: 'Music'},
      { title: 'Food', src: 'fa-solid fa-utensils', filter: 'Food'},
      { title: 'Pets', src: "fa-solid fa-dog", filter: 'Pets'},
      { title: 'Games', src: "fa-solid fa-gamepad", filter: 'Games'},
      { title: 'Others', src: "fa-solid fa-shuffle", filter: 'Others'},
    ],
    buzzingEvents: null
  },

  mutations: {
    login (state, user) {
      state.user = user
    },
    logout (state) {
      state.user = null
    },
    saveEvents(state, events) {
      state.events = events
    },
    saveBuzzingEvents(state, buzzingEvents) {
      state.buzzingEvents = buzzingEvents
    },
    saveUser(state, userObj) {
      state.user = userObj
    },
  },
  actions: {
    getEvents({commit}) {
      Vue.axios.get('https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/events')
        .then(result => {
          commit('saveEvents', result.data)
        })
        .catch(console.log("Get events error"))
    },
    getUser({commit}) {
      Vue.axios.get('https://us-central1-wad2-eventhive-backend-d0f2c.cloudfunctions.net/app/api/users')
        .then(result => {
          var currUser = null
          const users = result.data
          users.forEach(userObj => {
            if (userObj._id == this.state.user._id) {
              currUser = userObj
            }
          })
          commit('saveUser', currUser)
        })
        .catch(error => {
          console.log("Get users error", error)
        })
    },
  },
  
  modules: {
    toast,
    dialog,
  },
});
