<template>
    <div class="container dashboard-container">
        <router-link to="/" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar dashboard</router-link>
        <div class="mt-5 mb-5">
            <vue-good-wizard
                    :steps="steps"
                    :nextStepLabel="nextStepLabel"
                    :previousStepLabel="previousStepLabel"
                    :finalStepLabel="finalStepLabel"
                    :onNext="nextClicked"
                    :onBack="backClicked">
                <div slot="step-1">
                    <h2 class="mb-3">Bewerken beoordeling {{ $route.params.id }}</h2>
                    <div class="form-group">
                        <label>Sample label</label>
                        <input type="text" name="sampleInput" id="sampleInput" placeholder="sampleInput" v-model="sampleInput" class="form-control" />
                    </div>
                </div>
                <div slot="step-2">
                    <h2 class="mb-3">Details</h2>
                    <div class="form-group">
                        <label>Sample label</label>
                        <input type="text" name="sampleInput" id="sampleInput" placeholder="sampleInput" v-model="sampleInput" class="form-control" />
                    </div>
                </div>
                <div slot="step-3">
                   <div class="form-group">
                        <label>Sample label</label>
                        <input type="text" name="sampleInput" id="sampleInput" placeholder="sampleInput" v-model="sampleInput" class="form-control" />
                    </div>
                </div>
            </vue-good-wizard>
        </div>
    </div>
</template>

<script>
    import { ModelSelect } from 'vue-search-select'
    import { GoodWizard } from 'vue-good-wizard';
    import axios from 'axios';

    export default {
        name: 'edit',
        data () {
            return {
                id: this.$route.params.id,
                //TODO: get this information from the api
                // assessment: {
                //     metadata: {
                //         student: {

                //         },
                //         startDate: '',
                //         endDate: '',
                //         company: '',
                //         address: '',
                //     },
                //     template: 1,
                //     templateGroups: [],
                //     groups: [],
                //     categoryGroups: [],
                //     categories: [],
                //     questionAnswers: [],
                //     questions: [],
                //     answers: []
                // },
                assessment: [],
                previousStepLabel: 'Previous',
                nextStepLabel: 'Next',
                finalStepLabel: 'Confirm',
                saveStepLabel: 'Save',
                steps: [
                    {
                        label: 'Algemene informatie',
                        slot: 'step-1'
                    },
                    {
                        label: 'Details',
                        slot: 'step-2'
                    },
                    {
                        label: 'Overzicht',
                        slot: 'step-3'
                    },
                ],
            }
        },
        mounted () {
            const ENDPOINTS = 'Assessment/' + this.id;
            axios.get(this.$store.state.apiBaseUrl + ENDPOINTS, { headers: {"Authorization" : this.$session.get('jwt')} })
                .then(response => {
                    // let tmpAssessment = [];
                    // response.data.forEach(function(assessment) {
                    //     tmpAssessment.push({ template: templateID });
                    // });
                    // this.assessment = tmpAssessment;
                    this.assessment = response.data;
                    console.log(this.assessment);
                });
        },
        methods: {
            nextClicked(currentPage) {
                if (currentPage === 0) {
                    return this.validateStepOne();
                } else if (currentPage === 1) {
                    return this.validateStepTwo();
                }
            },
            getTemplateGroups() {
                //
            },
            validateStepOne() {
                if (this.student.text === "") {
                    window.alert("Je hebt geen student ingevuld.");
                    return false;
                }

                return true;
            },
            validateStepTwo() {
                if (this.startDate === "" || this.endDate === "" || this.company === "" || this.address === "") {
                    window.alert("Niet alle gegevens zijn ingevuld.");
                    return false;
                }

                if (new Date(this.startDate) > new Date(this.endDate)) {
                    window.alert("De begindatum mag niet na de einddatum liggen.");
                    return false;
                }

                return true;
            },
        },
        components: {
            ModelSelect,
            'vue-good-wizard': GoodWizard,
        }
    };
</script>