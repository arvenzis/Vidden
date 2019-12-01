import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export const store = new Vuex.Store({
	plugins: [createPersistedState({
		storage: window.sessionStorage
	})],
	state: {
		loggedIn: false,
		loggedOutSuccesfull: false,
		currentUser: "",
		currentUserId: null,
		accountNumber: "",
		apiBaseUrl: "https://vidden-api.azurewebsites.net/api/"
	},
	mutations: {
		login: state => {
			state.loggedIn = true
		},
		logout: state => {
			state.loggedIn = false,
				state.loggedOutSuccesfull = true,
			state.currentUser = '',
			state.currentUserId = null,
			state.accountNumber = ''
		},
		setCurrentUser: (state, payload) => {
			state.currentUser = payload
		},
		setCurrentUserId: (state, payload) => {
			state.currentUserId = payload
		},
		setAccountNumber: (state, payload) => {
			state.accountNumber = payload
		}
	}
});
