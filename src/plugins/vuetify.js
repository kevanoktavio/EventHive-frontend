import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '../assets/styles/material-icons.css';
import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

Vue.use(Vuetify);
Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        try {
          vnode.context[binding.expression](event);
        } catch (err) {
          console.log("Error: ", err);
        }
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});


export default new Vuetify({
  icons: {
    iconfont: 'fa' || 'mdi' ,
  },
  theme: {
    themes: {
      light: {
        brownDark: '#735019',
        brownMid: '#ffe9af',
        brownLight: '#fff1cd',
        greenDark: '#779977',
        greenMid: '#aed1ae',
        greenLight: '#D3E0D7',
        peachDark: '#BC7547',
        peachMid: '#fae3cd',
        peachLight: '#f6eee3',
        error: '#bd5959',
        success: '#86B71B',
        warning: '#FF853F'
      },
    },
  },
});
