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
		apiBaseUrl: "https://vidden-api.azurewebsites.net/api/",
		useNumbers: null,
		language: null
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
			state.accountNumber = '',
			state.useNumbers = null,
			state.language = null
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
		setUseNumbersInGrading: (state, payload) => {
			state.useNumbers = payload
		},
		setLanguage: (state, payload) => {
			state.language = payload
		}
	},
	getters: {
		language: state => {
		  return state.language
		}
	  }
});