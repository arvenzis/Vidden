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
    import axios from 'axios'
    console.log(router);

    export default {
        name: 'app-login',

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
                    this.router.push({ path: 'dashboard' });
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
    };
</script>