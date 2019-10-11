import Vue from 'vue'
import VueRouter from 'vue-router'
import CurrentUser from './components/CurrentUser.vue'

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
        loggedInUnsuccessfull: false,
        currentUser: "",
        errorMessage: "",
        loggedInWaiting: false,
        waitMessage: "Moment geduld a.u.b.\nUw gegevens worden gecontroleerd...",
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
        validateCredentials: function (e) {
            const Url = 'https://vidden-api.azurewebsites.net/api/User/Authenticate/';
            e.preventDefault();
            this.loggedInWaiting = true;
            axios.post(Url, {
                emailaddress: this.emailaddress,
                password: this.password
            })
                .then((response) => {
                    this.loggedInWaiting = false;
                    this.loggedIn = true;
                    router.push({ path: 'dashboard' });
                    this.currentUser = response.data.fullName;
                })
                .catch((e) => {
                    this.loggedInWaiting = false;
                    this.loggedInUnsuccessfull = true;
                    if (e == "Error: Request failed with status code 400") {
                        this.errorMessage = "Uw gebruikersnaam en / of wachtwoord is onjuist.";                        
                    } else if (e == "Error: Request failed with status code 404") {
                        this.errorMessage = "Problemen met server, probeer het nog eens."
                    } else {
                        this.errorMessage = e;
                    }
                })
        },
        someMethod() {
            alert(this.currentUser);
        }
    }
});

Vue.component('current-user', {
    template: '#current-user',
});



