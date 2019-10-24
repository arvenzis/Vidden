import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        loggedIn: false,
        currentUser: "",
        accountNumber: "",
        apiBaseUrl: "https://vidden-api.azurewebsites.net/api/"
    }
});
