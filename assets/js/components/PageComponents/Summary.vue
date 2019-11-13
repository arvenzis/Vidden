<template>
    <div class="container dashboard-container">
        <router-link to="/browse" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar overzicht</router-link>
        <article class="mt-5 mb-5">
            <h3 class="mt-3">Beoordeling {{ response.oeCode }} voor {{ fullName(response) }}</h3>

            <section id="assessment-list">
                <div v-for="item in response" v-bind:key="item.metadataId">
                    <div class="card" v-for="assessment in item.assessments" v-bind:key="assessment.id">
                        <div class="card-body">
                            <router-link :to="'/summary/' + assessment.id">
                                <button class="btn btn-info">Open beoordeling</button>
                            </router-link>
                        </div>
                        <div class="card-footer">
                            <small class="text-muted">
                            Laatst bijgewerkt: {{ assessment.date_last_modified }} door
                            <span v-for="examinator in assessment.examinator" v-bind:key="examinator.account">{{ examinator.name }}
                                ({{ examinator.account }})</span>
                            </small>
                        </div>
                    </div>
                </div>
            </section>
        </article>
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
                // For now mock data
                response: [{
                    metadataId: this.$route.params.id,
                    status: 1,
                    oeCode: "ICTAFSTSE.D19",
                    student: [{
                        account: "S1019744",
                        name: "Bernard Bos"
                    }],
                    examinator: [{
                        account: "BV0111996",
                        name: "Arjen Korevaar"
                    }],
                    date_created: "12-11-2019 11:47",
                    date_last_modified: "13-11-2019 09:18",
                    // Dit zijn de invullingen
                    assessments: [{ 
                            id: 1,
                            date_created: "12-11-2019 11:47",
                            date_last_modified: "13-11-2019 09:18",
                            examinator: [{
                                account: "BV0111996",
                                name: "Arjen Korevaar"
                            }]
                        },
                        {
                            id: 2,
                            date_created: "12-11-2019 11:47",
                            date_last_modified: "13-11-2019 09:18",
                            examinator: [{
                                account: "P98273498",
                                name: "Eugene van Roden"
                            }]
                        },
                    ]
                }]
            }
        },
        // created() {
        //     const ENDPOINTS = 'Assessment/' + this.id;
        //     axios.get(this.$store.state.apiBaseUrl + ENDPOINTS, {
        //             headers: {
        //                 "Authorization": this.$session.get('jwt')
        //             }
        //         })
        //         .then(response => {
        //             // Do something
        //         });
        // },
        methods: {
            fullName(array) {
                return array[0].student[0].name + ' (' + array[0].student[0].account + ')';
            }    
        },
        components: {
            Popper
        }
    };
</script>
<style scoped>
.card {
  border-radius: none;
  margin: 15px 0px;
}
</style>