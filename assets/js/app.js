import Vue from 'vue'
import VueRouter from 'vue-router'
import CurrentUser from "./components/CurrentUser.vue";

import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({routes});

new Vue({
    router,
    el: '#app',
    data: {
        emailaddress: "",
        password: "",
        loggedIn: false,
        function() {
            return {
                loggedIn
            };
        }
    },
    components: {
        CurrentUser
    },
    methods: {
        checkForm: function (e) {
            const Url = 'http://vidden-api.azurewebsites.net/api/User/Authenticate/';
            e.preventDefault();
            axios.post(Url, {
                emailaddress: this.emailaddress,
                password: this.password
            }).then((response) => {
                alert("Welkom, "+response.data.firstName+"!");
                this.loggedIn = true;
                router.push({ path: 'dashboard' });
            })
                .catch((e) => {
                    console.error(e);
                    alert(e);
                })
        }
    }
});

