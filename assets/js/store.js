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
		loggedOutSuccessful: false,
		currentUser: "",
		currentUserId: null,
		accountNumber: "",
		apiBaseUrl: "https://localhost:5001/api/",
		numbers: true,
		language: "nl_NL"
	},
	mutations: {
		login: state => {
			state.loggedIn = true
		},
		logout: state => {
			state.loggedIn = false,
				state.loggedOutSuccessful = true,
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
		},
		useTerms: (state) => {
			state.numbers = false
		},
		useNumbers: (state) => {
			state.numbers = true
		},
		switchLanguage: (state, payload) => {
			state.language = payload
		}

	}
});
