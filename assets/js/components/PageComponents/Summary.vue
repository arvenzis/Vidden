<template>
    <div class="container dashboard-container">
        <router-link to="/browse" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar overzicht</router-link>
        <section class="mt-5 mb-5">
            <p>Id: {{ this.id }}</p>
        </section>
    </div>
</template>

<script>
    import Vue from "vue";
    import axios from 'axios';
    import Popper from 'vue-popperjs';

    Vue.use(Popper);

    export default {
        name: 'edit',
        data () {
            return {
                // This is the id in the parameter of the URL
                id: this.$route.params.id,
            }
        },
        created() {
            const ENDPOINTS = 'Assessment/' + this.id;
            axios.get(this.$store.state.apiBaseUrl + ENDPOINTS, {
                    headers: {
                        "Authorization": this.$session.get('jwt')
                    }
                })
                .then(response => {
                    // Do something
                });
        },
        methods() {
            
        },
        components() {
            Popper
        }
    };
</script>