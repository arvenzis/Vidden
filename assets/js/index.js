import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import AppLogin from './components/AppLogin.vue'
import CurrentUser from './components/CurrentUser.vue'

Vue.use(VueRouter);

const router = new VueRouter({routes});

new Vue({
    router,
    el: '#app',
    data: {
        emailaddress: "",
        password: "",
        loggedIn: false
    },
    created: function () {
        if (Vue.prototype.$session.exists()) {
            this.loggedIn = true;
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