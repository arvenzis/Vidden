import 'es6-promise/auto'
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { store } from './store';
import AppLogin from './components/AppLogin.vue'
import CurrentUser from './components/CurrentUser.vue'
import VueFlashMessage from 'vue-flash-message';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);
Vue.use(VueRouter);
Vue.use(VueFlashMessage);

const router = new VueRouter({routes});

const i18n = new VueI18n({
  locale: 'nl_NL',
  fallbackLocale: 'en_US',
  messages: {
    'nl_NL': require('../lang/nl_NL.json'),
    'en_US': require('../lang/en_US.json')
  }
})

new Vue({
  router,
  store,
  el: '#app',
  i18n,
  data: {
    emailaddress: "",
    password: "",
  },
  methods: {
    getStatusText: function (status) {
      switch (status) {
        case 0:
          return 'new';
          break;
        case 1:
          return 'in_progress';
          break;
        case 2:
          return 'completed';
          break;
        case 3:
          return 'final';
          break;
        default:
          return 'new';
      }
    }
  },
  created: function () {
    if (Vue.prototype.$session.exists()) {
      this.$store.commit("login");
    }

    this.$i18n.locale = this.$store.getters.getLanguage;
  },
  components: {
    AppLogin,
    CurrentUser
  },
});

Vue.component('current-user', {
    template: '#current-user',
});