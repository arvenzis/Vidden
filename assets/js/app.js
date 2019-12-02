import 'es6-promise/auto'
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { store } from './store';
import AppLogin from './components/AppLogin.vue'
import CurrentUser from './components/CurrentUser.vue'
import VueFlashMessage from 'vue-flash-message';

Vue.use(VueRouter);
Vue.use(VueFlashMessage);

const router = new VueRouter({routes});

new Vue({
  router,
  store,
  el: '#app',
  data: {
    emailaddress: "",
    password: "",
  },
  methods: {
    getStatusText: function (status) {
      switch (status) {
        case 0:
          return 'New';
          break;
        case 1:
          return 'In Progress';
          break;
        case 2:
          return 'Completed';
          break;
        case 3:
          return 'Final';
          break;
        default:
          return 'New';
      }
    }
  },
  created: function () {
    if (Vue.prototype.$session.exists()) {
      this.$store.state.loggedIn = true;
    }
  },
  components: {
    AppLogin,
    CurrentUser
  },
});

Vue.component('current-user', {
    template: '#current-user',
});
