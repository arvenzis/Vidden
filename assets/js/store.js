import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        loggedIn: false,
        currentUser: "",
        currentUserId: null,
        accountNumber: "",
        apiBaseUrl: "https://vidden-api.azurewebsites.net/api/"
    }
});
