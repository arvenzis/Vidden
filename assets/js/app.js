import Vue from 'vue'
import VueRouter from 'vue-router'
import CurrentUser from './components/CurrentUser.vue'
import routes from './routes'
import Spinner from 'vue-simple-spinner'
import VueSession from 'vue-session'

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
        CurrentUser,
        Spinner
    },
    methods: {
        validateCredentials: function (e) {
            const Url = 'https://vidden-api.azurewebsites.net/api/User/Authenticate/';
            e.preventDefault();
            this.loading = true;
            axios.post(Url, {
                emailaddress: this.emailaddress,
                password: this.password
            }).then((response) => {
                if (response.status === 200 && 'token' in response.data) {
                    this.$session.start();
                    this.$session.set('jwt', response.data.token);
                }
                this.loading = false;
                this.loggedIn = true;
                router.push({ path: 'dashboard' });
                this.currentUser = response.data.fullName;
                this.accountNumber = response.data.accountNumber;
            })
                .catch((e) => {
                    this.loading = false;
                    this.loggedInUnsuccessful = true;
                    if (e == "Error: Request failed with status code 400") {
                        this.errorMessage = "Uw gebruikersnaam en / of wachtwoord is onjuist.";
                    } else if (e == "Error: Request failed with status code 500") {
                        this.errorMessage = "Problemen met server, probeer het nog eens."
                    } else {
                        this.errorMessage = e;
                    }
                })
        }
    }
});

Vue.component('current-user', {
    template: '#current-user',
});
