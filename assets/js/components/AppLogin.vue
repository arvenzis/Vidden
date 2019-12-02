<template id="app-login">
  <div class="container dashboard-container">
    <div class="row justify-content-center">
      <div class="col-md-7">
        <div class="card">
          <spinner id="spinner" v-if="loading"></spinner>
          <div class="card-body" v-bind:class="{ overlay : loading}">
            <h5 class="card-title mb-3">Inloggen</h5>
            <form id="app" @submit="validateCredentials" method="post">
              <flash-message class="flashpool"></flash-message>
              <div class="form-group row">
                <label
                  for="emailaddress"
                  class="col-md-4 col-form-label text-md-right"
                >Gebruikersnaam</label>

                <div class="col-md-6">
                  <input
                    id="emailaddress"
                    v-model="emailaddress"
                    type="email"
                    class="form-control"
                    name="emailaddress"
                    required
                    autocomplete="email"
                    :disabled="loading"
                    autofocus
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="password" class="col-md-4 col-form-label text-md-right">Wachtwoord</label>

                <div class="col-md-6">
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    class="form-control"
                    name="password"
                    required
                    :disabled="loading"
                    autocomplete="current-password"
                  />
                </div>
              </div>

              <div class="form-group row">
                <div class="col-md-6 offset-md-4">
                  <a href="https://password.windesheim.nl">Wachtwoord vergeten?</a>
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4" id="buttonLoader">
                  <button type="submit" class="btn btn-windesheim">Inloggen</button>
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
import Vue from "vue";
import axios from "axios";
import VueSession from "vue-session";
import Spinner from "vue-simple-spinner";
import Toasted from 'vue-toasted';

Vue.use(Toasted)
Vue.use(VueSession);

export default {
  name: "app-login",

  data() {
    return {
      loggedInUnsuccessful: false,
      currentUser: "",
      accountNumber: "",
      errorMessage: "",
      loading: false
    };
  },
  methods: {
    validateCredentials: function (e) {
      const ENDPOINTS = "User/Authenticate/";
      e.preventDefault();
      this.loading = true;
      axios
        .post(this.$store.state.apiBaseUrl + ENDPOINTS, {
          emailaddress: this.emailaddress,
          password: this.password
        })
        .then(response => {
          if (response.status === 200 && "token" in response.data) {
            this.$session.start();
            this.$session.set("jwt", response.data.token);
          }
          this.loading = false;
          this.$store.commit("login");
          this.$store.commit("setCurrentUser", response.data.fullName);
          this.$store.commit("setCurrentUserId", response.data.id);
          this.$store.commit("setAccountNumber", response.data.accountNumber);
        })
        .catch(e => {
          this.loading = false;
          this.loggedInUnsuccessful = true;
          if (e == "Error: Request failed with status code 400") {
            this.displayMessage("Je gebruikersnaam en / of wachtwoord is onjuist", "error", 4000)
          } else if (e == "Error: Request failed with status code 500") {
            this.displayMessage("Er was een probleem bij het communiceren met de server. Probeer het nog eens", "error", 4000)
          } else {
            this.displayMessage(e + " Probeer het nog eens.", "error", 2500)
          }
        });
      },
      displayMessage(message, type, duration) {
        Vue.toasted.show(message, {
          type: type,
          duration: duration
        });
      }
    },
    components: {
      Spinner
    }
  };
</script>
