<template>
    <div class="container dashboard-container">
        <router-link to="/browse" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar overzicht</router-link>
        <spinner id="spinner" v-if="loading"></spinner>
        <article class="mt-5 mb-5" v-if="!loading">
            <h3 class="mt-3">Beoordeling {{ response[0].oeCode }} voor {{ fullNameStudent(response) }}</h3>
            <p><strong>Vak</strong><br> {{ response[0].oeCode }}</p>
            <p><strong>Status</strong><br> {{ response[0].status }}</p>
            <p class="mb-3"><strong>Eerste examinator</strong><br> {{ fullNameTeacher(response) }}</p>

            <section id="assessment-list">
                <div v-for="item in response" v-bind:key="item.metadataId">
                    <div class="card" v-for="assessment in item.assessments" v-bind:key="assessment.id">
                        <div class="card-body" v-for="examinator in assessment.examinator" v-bind:key="examinator.account">
                            <h5 class="card-title mb-3">Invulling door {{ examinator.name }} ({{ examinator.account }})</h5>
                            <router-link :to="'/edit/' + item.metadataId + '/' + examinator.id ">
                                <button class="btn btn-info">Open invulling</button>
                            </router-link>
                        </div>
                        <div class="card-footer">
                            <small class="text-muted">Laatst bijgewerkt: {{ assessment.date_last_modified }} {Remove)</small>
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
    import Spinner from "vue-simple-spinner";

    export default {
        name: 'edit',
        data () {
            return {
                // This is the id in the parameter of the URL
                id: this.$route.params.id,
                // For now mock data
                response: [{
                    metadataId: this.$route.params.id,
                    templateId: 1,
                    status: 1,
                    oeCode: "ICTAFSTSE.D19",
                    student: [{
                        id: 4,
                        account: "S1019744",
                        name: "Bernard Bos"
                    }],
                    examinator: [{
                        id: 6,
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
                                id: 6,
                                account: "BV0111996",
                                name: "Arjen Korevaar"
                            }]
                        },
                        {
                            id: 2,
                            date_created: "12-11-2019 11:47",
                            date_last_modified: "13-11-2019 09:18",
                            examinator: [{
                                id: 7,
                                account: "P69750694",
                                name: "Eugene van Roden"
                            }]
                        },
                    ]
                }],
                loading: false,
                template: ""
            }
        },
        created() {
            // this.loading = false;
            // const ENDPOINTS = 'Assessment/' + this.id;
            // axios.get(this.$store.state.apiBaseUrl + ENDPOINTS, {
            //         headers: {
            //             "Authorization": this.$session.get('jwt')
            //         }
            //     })
            //     .then(response => {
            //         this.loading = false;
            //         // Do something
            //     })
            //     .catch(error => {
            //         .this.loading = false;
            //         // Do something
            //     });
        },
        methods: {
            fullNameStudent(array) {
                return array[0].student[0].name + ' (' + array[0].student[0].account + ')';
            },
            fullNameTeacher(array) {
                return array[0].examinator[0].name + ' (' + array[0].examinator[0].account + ')';
            },
            getTemplate(id) {
                const ENDPOINTS = 'Template/' + id;
                axios.get(this.$store.state.apiBaseUrl + ENDPOINTS, 
                    { 
                        headers: { "Authorization" : this.$session.get('jwt') } 
                    })
                    .then(response => {
                        this.template = response.name;
                    });
            }   
        },
        components: {
            Spinner
        }
    };
</script>