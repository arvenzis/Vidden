<template id="app-login">
  <div class="container dashboard-container">
    <div class="row justify-content-center">
      <div class="col-md-7">
        <div class="card">
          <spinner id="spinner" v-if="loading"></spinner>
          <div class="card-body" v-bind:class="{ overlay : loading}">
            <h5 class="card-title mb-3">{{ $t('login.title') }}</h5>
            <form id="app" @submit="validateCredentials" method="post">
              <flash-message class="flashpool"></flash-message>
              <div class="form-group row">
                <label
                  for="emailaddress"
                  class="col-md-4 col-form-label text-md-right"
                >{{ $t("login.username") }}</label>

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
                <label for="password" class="col-md-4 col-form-label text-md-right">{{ $t("login.password") }}</label>

                <div class="col-md-6 password_field">
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    class="form-control"
                    name="password"
                    required
                    :disabled="loading"
                    autocomplete="current-password"
                    ref="passwordInput"
                  />
                  <span class="d-none d-md-block password_field__toggle" @mouseover="showPassword" @mouseleave="hidePassword" ref="passwordToggle">🙈</span>
                </div>
              </div>

              <div class="form-group row">
                <div class="col-md-6 offset-md-4">
                  <a href="https://password.windesheim.nl">{{ $t("login.password_forgot") }}?</a>
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4" id="buttonLoader">
                  <button type="submit" class="btn btn-primary btn-windesheim">{{ $t('login.title') }}</button>
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
          this.$store.commit("login");
          this.$store.commit("setCurrentUser", response.data.fullName);
          this.$store.commit("setCurrentUserId", response.data.id);
          this.$store.commit("setAccountNumber", response.data.accountNumber);
          
          this.getUserPreferences(response.data.id);
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
          this.loggedInUnsuccessful = true;
          if (e == "Error: Request failed with status code 400") {
            this.displayMessage(this.$t('error.login_400'), "error", 4000)
          } else if (e == "Error: Request failed with status code 500") {
            this.displayMessage(this.$t('error.login_500'), "error", 4000)
          } else {
            this.displayMessage(this.$t('error.login_else', { error: e } ), "error", 2500)
          }
        });
      },
      displayMessage(message, type, duration) {
        Vue.toasted.show(message, {
          type: type,
          duration: duration
        });
      },
      showPassword() {
        this.$refs.passwordToggle.innerHTML = "🐵";
        this.$refs.passwordInput.setAttribute('type','text');
      },
      hidePassword() {
        this.$refs.passwordToggle.innerHTML = "🙈";
        this.$refs.passwordInput.setAttribute('type','password');
      },
      getUserPreferences(userId) {
        let self = this;

        // Since we have a different endpoint for each preference
        // we put all endpoints in an array for use in axios all
        let settingsEndpointsArray = [
            `userpreference/getshowgradinginwords/${userId}`,
            `userpreference/getlanguagepreference/${userId}`
        ];

        axios.all(
            settingsEndpointsArray
            .map(u => axios
                .get(self.$store.state.apiBaseUrl + u, {
                    headers: {
                        "Authorization": self.$session.get('jwt')
                    }
                }))
        ).then(axios.spread(function (useNumbersInGrading, languagePreference) {
            self.$store.commit("setUseNumbersInGrading", useNumbersInGrading.data)
            self.$store.commit("setLanguage", languagePreference.data)
            
            // If in a magical way the languagepreference was changed
            // outside the app, then set use this one
            self.$root.$i18n.locale = languagePreference.data;
          })
        ).catch(() => {
            // Failed to set the preferences, set the defaults
            self.$store.commit("setUseNumbersInGrading", true)
            self.$store.commit("setLanguage", "nl_NL")
        })     
    },
    components: {
      Spinner
    }
  }
}
</script>