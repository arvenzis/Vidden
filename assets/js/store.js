import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export const store = new Vuex.Store({
	plugins: [createPersistedState({
		storage: window.localStorage
	})],
	state: {
		loggedIn: false,
		currentUser: null,
		currentUserId: null,
		accountNumber: null,
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
			state.currentUser = null,
			state.currentUserId = null,
			state.accountNumber = null
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
		getLoginStatus: state => {
			return state.loggedIn
		},
		getCurrentUser: state => {
			return state.currentUser
		},
		getCurrentUserId: state => {
			return state.currentUserId
		},
		getCurrentUserFull: state => {
			return state.currentUser + ' (' + state.accountNumber + ')'
		},
		getAccountNumber: state => {
			return state.accountNumber
		},
		getApiBaseUrl: state => {
			return state.apiBaseUrl
		},
		getUseNumbers: state => {
			return state.useNumbers
		},
		getLanguage: state => {
		  return state.language
		}
	  }
});