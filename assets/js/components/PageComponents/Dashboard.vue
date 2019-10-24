<template id="dashboard-template">
    <div class="container dashboard-container">
        <div class="row m-0">
            <div class="col flex-column padding-left-0 padding-right-0">
                <router-link to="/new-assessment" class="action">
                    <div class="action__container">
                        <i class="fa fa-3x fa-plus"></i><br>
                        NIEUW
                    </div>
                </router-link>
            </div>
            <div class="col flex-column padding-right-0">
                <router-link to="/browse" class="action">
                    <div class="action__container">
                        <i class="fa fa-3x fa-archive"></i><br>
                        BLADEREN
                    </div>
                </router-link>
            </div>
        </div>
        <div class="row m-0">
            <div class="col flex-column padding-left-0 padding-right-0">
                <router-link to="/settings" class="action">
                    <div class="action__container">
                        <i class="fa fa-3x fa-cog"></i><br>
                        INSTELLINGEN
                    </div>
                </router-link>
            </div>
            <div class="col flex-column padding-right-0">
                <div class="action__container" @click="this.logout">
                    <i class="fa fa-3x fa-sign-out"></i><br>
                    UITLOGGEN
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AppLogin from '../AppLogin.vue'

    export default {
        name: 'dashboard',

        methods: {
            logout: function () {
                this.$session.destroy();
                this.$store.state.loggedIn = false;
                AppLogin.loggedOutSuccessful = true;
                AppLogin.successMessage = "U bent uitgelogd.";
            }
        }
    };
</script>