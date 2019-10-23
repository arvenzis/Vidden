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
            <div class="col flex-column padding-right-0" @click="getAssessments">
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
                <div class="action__container" @click="this.$parent.logout">
                    <i class="fa fa-3x fa-sign-out"></i><br>
                    UITLOGGEN
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'dashboard',
        methods: {
            getAssessments: function (e) {
                const Url = 'https://vidden-api.azurewebsites.net/api/Assessment/GetAssessments/';
                e.preventDefault();
                const yourConfig = {
                    headers: {
                        Authorization: this.$session.get("jwt")
                    }
                }
                axios.get(Url, yourConfig
                ).then((response) => {
                    const allAssessments = response.data;
                })
            }
        }
    };
</script>