
import CurrentUser from "./components/CurrentUser.vue";

new Vue({
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