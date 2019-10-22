import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import VueSession from "vue-session";
import Spinner from 'vue-simple-spinner'
import AppLogin from './components/AppLogin.vue'
import CurrentUser from './components/CurrentUser.vue'

Vue.use(VueRouter);
Vue.use(VueSession);

const router = new VueRouter({routes});

new Vue({
    router,
    el: '#app',
    data: {
        emailaddress: "",
        password: "",
        loggedIn: false,
        loggedInUnsuccessful: false,
        currentUser: "",
        accountNumber: "",
        errorMessage: "",
        loading: false,
        function() {
            return {
                loggedIn
            };
        }
    },
    components: {
        AppLogin,
        CurrentUser
    },
});