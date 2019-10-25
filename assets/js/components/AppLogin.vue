<template id="app-login">
    <div class="container dashboard-container">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card">
                    <div class="card-header">Inloggen</div>

                    <div class="card-body">
                        <form id="app" @submit="validateCredentials" method="post">
                            <div class="form-group row">
                                <label for="emailaddress" class="col-md-4 col-form-label text-md-right">Gebruikersnaam</label>

                                <div class="col-md-6">
                                    <input id="emailaddress" v-model="emailaddress" type="email" class="form-control" name="emailaddress" required autocomplete="email" autofocus>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="password" class="col-md-4 col-form-label text-md-right">Wachtwoord</label>

                                <div class="col-md-6">
                                    <input id="password" v-model="password" type="password" class="form-control" name="password" required autocomplete="current-password">
                                </div>
                            </div>

                            <div v-if="loggedInUnsuccessful" class="form-group row">
                                <label class="alert alert-danger col-md-6 offset-md-4" role="alert">
                                    {{errorMessage}}
                                </label>
                            </div>
                            <div v-if="loggedOutSuccessful" class="form-group row">
                                <label class="alert alert-success col-md-6 offset-md-4" role="alert">
                                    {{successMessage}}
                                </label>
                            </div>

                            <div class="form-group row">
                                <div class="col-md-6 offset-md-4">
                                    <a href="#">
                                        Wachtwoord vergeten?
                                    </a>
                                </div>
                            </div>

                            <div class="form-group row mb-0">
                                <div class="col-md-8 offset-md-4" id="buttonLoader">
                                    <button type="submit" class="btn btn-primary btn-windesheim">
                                        Inloggen
                                    </button>
                                    <spinner id="spinner" v-if="loading"></spinner>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import VueSession from "vue-session";
    import Spinner from 'vue-simple-spinner'

    Vue.use(VueSession);

    export default {
        name: 'app-login',

        data() {
            return {
                loggedInUnsuccessful: false,
                loggedOutSuccessful: false,
                currentUser: "",
                accountNumber: "",
                errorMessage: "",
                successMessage: "",
                loading: false,
            }
        },
        methods: {
            validateCredentials: function (e) {
                const ENDPOINTS = 'User/Authenticate/';
                e.preventDefault();
                this.loading = true;
                axios.post(this.$store.state.apiBaseUrl + ENDPOINTS, {
                    emailaddress: this.emailaddress,
                    password: this.password
                }).then((response) => {
                    if (response.status === 200 && 'token' in response.data) {
                        this.$session.start();
                        this.$session.set('jwt', response.data.token);
                    }
                    this.loading = false;
                    this.$store.state.loggedIn = true;
                    this.$store.state.currentUser = response.data.fullName;
                    this.$store.state.accountNumber = response.data.accountNumber;
                })
                .catch((e) => {
                    this.loading = false;
                    this.loggedInUnsuccessful = true;
                    this.errorMessage = e.response.data;
                })
            },
        },
        components: {
            Spinner
        }
    };
</script>