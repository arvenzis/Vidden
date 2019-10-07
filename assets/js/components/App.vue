<script>
    import CurrentUser from "CurrentUser";

    new Vue({
        el: '#app',
        data: function() {
            return {
                loggedIn: true
            };
        },
        components: {
            'current-user': CurrentUser
        }
    });
</script>