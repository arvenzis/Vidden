<template id="dashboard-template">
  <div class="container dashboard-container">
    <div class="row m-0">
      <div class="col flex-column padding-left-0 padding-right-0">
        <router-link to="/new-assessment" class="action">
          <div class="action__container">
            <i class="fa fa-3x fa-plus"></i>
            <br />NIEUW
          </div>
        </router-link>
      </div>
      <div class="col flex-column padding-right-0">
        <router-link to="/browse" class="action">
          <div class="action__container">
            <i class="fa fa-3x fa-archive"></i>
            <br />BLADEREN
          </div>
        </router-link>
      </div>
    </div>
    <div class="row m-0">
      <div class="col flex-column padding-left-0 padding-right-0">
        <router-link to="/settings" class="action">
          <div class="action__container">
            <i class="fa fa-3x fa-cog"></i>
            <br />INSTELLINGEN
          </div>
        </router-link>
      </div>
      <div class="col flex-column padding-right-0">
        <div class="action__container" @click="this.logout">
          <i class="fa fa-3x fa-sign-out"></i>
          <br />UITLOGGEN
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "dashboard",
  methods: {
    logout: function() {
      const ENDPOINTS = "User/Logout/";
      axios
        .get(this.$store.state.apiBaseUrl + ENDPOINTS, {
          headers: {
            Authorization: this.$session.get("jwt")
          }
        })
        .then(response => {
          if (response.status === 200) {
            this.$session.destroy();
            this.$store.commit("logout");
            this.flash('Je bent uitgelogd', 'success', {
                timeout: 2000
            });
          }
        });
    }
  }
};
</script>