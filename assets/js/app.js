import Vue from 'vue'
import VueRouter from 'vue-router'
import CurrentUser from './components/CurrentUser.vue'

import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({routes});

new Vue({
    router,
    el: '#app',
    data: function() {
        return {
            loggedIn: true
        };
    },
    components: {
        CurrentUser
    }
});

