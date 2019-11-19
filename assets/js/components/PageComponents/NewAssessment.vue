<template>
    <div class="container dashboard-container">
        <router-link to="/" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar dashboard</router-link>
        <div class="mt-5 mb-5">
            <div v-if="this.errorMessage" class="alert alert-danger">{{ this.errorMessage }}</div>
            <vue-good-wizard
                    :steps="steps"
                    :nextStepLabel="nextStepLabel"
                    :previousStepLabel="previousStepLabel"
                    :finalStepLabel="finalStepLabel"
                    :onNext="nextClicked">
                <div slot="step-1">
                    <h2 class="mb-3">Nieuwe beoordeling</h2>
                    <div class="form-group">
                        <label>Soort beoordeling</label>
                        <model-select :options="templateOptions"
                                      v-model="template"
                                      placeholder="Selecteer een template">
                        </model-select>
                    </div>
                    <div class="form-group">
                        <label>Student</label>
                        <model-select :options="studentOptions"
                                      v-model="student"
                                      placeholder="Selecteer een student">
                        </model-select>
                    </div>
                    <div class="form-group">
                        <label>Onderwijseenheid</label>
                        <model-select :options="oecodeOptions"
                                      v-model="oecode"
                                      placeholder="Selecteer de onderwijseenheid">
                        </model-select>
                    </div>
                </div>
                <div slot="step-2">
                    <h2 class="mb-3">Details</h2>
                    <div class="form-group">
                        <label class="font-weight-bold">Periode</label>
                        <div class="row">
                            <div class="col-6">
                                <label for="start-date">Van</label>
                                <input type="date" name="start-date" id="start-date" class="form-control" v-model="startDate" />
                            </div>
                            <div class="col-6">
                                <label for="end-date">Tot</label>
                                <input type="date" name="end-date" id="end-date" class="form-control" v-model="endDate" />
                            </div>
                        </div>
                    </div>
                    <strong>Stage/afstudeerbedrijf</strong>
                    <div class="form-group">
                        <label for="company">Naam</label>
                        <input type="text" name="company" id="company" placeholder="Windesheim" v-model="company" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label for="address">Adres</label>
                        <input type="text" name="address" id="address" placeholder="Campus 2, 8017 CA Zwolle" v-model="address" class="form-control" />
                    </div>
                </div>
                <div slot="step-3">
                    <h2 class="mb-3">Overzicht beoordeling</h2>
                    <strong>{{this.student.text}}</strong><br>
                    <span>{{ this.startDate }} - {{ this.endDate }}</span><br><br>

                    <strong>Stage/afstudeerbedrijf</strong><br>
                    <span>{{ this.company }}</span><br>
                    <span>{{ this.address }}</span><br>
                </div>
            </vue-good-wizard>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import { ModelSelect } from 'vue-search-select'
    import { GoodWizard } from 'vue-good-wizard';
    import axios from 'axios';
    import Toasted from 'vue-toasted';

    Vue.use(Toasted)

    export default {
        name: 'new-assessment',
        data () {
            return {
                studentOptions: [],
                templateOptions: [],
                oecodeOptions: [],
                student: {
                    value: '',
                    text: ''
                },
                template: {
                    value: '',
                    text: ''
                },
                oecode: {
                    value: '',
                    text: '' 
                },
                startDate: '',
                endDate: '',
                company: '',
                address: '',
                previousStepLabel: 'Vorige',
                nextStepLabel: 'Volgende',
                finalStepLabel: 'Bevestigen',
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
                errorMessage: null
            }
        },
        mounted () {
            this.getTemplateType();
            this.getStudents();
            this.getOeCodes();
        },
        methods: {
            getTemplateType() {
                const ENDPOINTS = 'Template/';
                axios.get(this.$store.state.apiBaseUrl + ENDPOINTS, { headers: {"Authorization" : this.$session.get('jwt')} })
                     .then(response => {
                         let templates = [];
                         response.data.forEach(function(template) {
                             templates.push({ value: template.id, text: template.name});
                         });
                         this.templateOptions = templates;
                     });
            },
            getStudents() {
                const ENDPOINTS = 'Student/GetStudents';
                axios.get(this.$store.state.apiBaseUrl + ENDPOINTS, { headers: {"Authorization" : this.$session.get('jwt')} })
                     .then(response => {
                        let students = [];
                        response.data.forEach(function(student) {
                            students.push({ value: student.id, text: student.fullName + ' (' + student.accountNumber + ')'});
                        });
                        this.studentOptions = students;
                     });
            },
            getOeCodes() {
                this.oecodeOptions = [
                    {
                        value: 'ICT.AFSTSE.D19',
                        text: 'Afstudeeropdracht Software Engineering 2019-2020'
                    }
                ]
            },
            createAssessmentMetaData() {
                const ENDPOINTS = 'assessment';
                axios.post(this.$store.state.apiBaseUrl + ENDPOINTS, {
                    "Name": this.template.text,
                    "IsActive": 1,
                    "CreatedAt": new Date().toISOString().slice(0,10),
                    "CreatedbyId": this.$store.state.currentUserId,
                    "UpdatedAt": new Date().toISOString().slice(0,10),
                    "UpdatedbyId": this.$store.state.currentUserId,
                    "TemplateId": this.template.value,
                    "StudentId": this.student.value,
                    "CompanyId": 1,
                    "FirstTeacherId": this.$store.state.currentUserId,
                    "OeCode": this.oecode.value,
                    "AssessmentDate": new Date().toISOString().slice(0,10),
                    "StartDatePeriod": this.startDate,
                    "EndDatePeriod": this.endDate
                    },
                    {
                        headers: {"Authorization" : this.$session.get('jwt')}
                    }).then((response) => {
                        if (response.status === 200) {
                            // Get assessmentmetadataid
                            let assessmentmetadataid = response.data;

                            // Set a success message
                            this.flash('Je beoordeling is succesvol aangemaakt', 'success', {
                                timeout: 2000
                            });

                            // Push to summary page
                            // Note the backticks
                            this.$router.push({ path: `/summary/${assessmentmetadataid}` })
                        }
                    }).catch(() => {
                        Vue.toasted.show('Er is iets misgegaan bij het opslaan van de beoordeling.', {
                        type: 'error',
                        duration: 2000
                    });
                });
            },
            nextClicked(currentPage) {
                if (currentPage === 0) {
                    return this.validateStepOne();
                } else if (currentPage === 1) {
                    return this.validateStepTwo();
                } else if (currentPage === 2) { //final step
                    this.createAssessmentMetaData();
                }
            },
            validateStepOne() {
                if (this.student.text === "" || this.template.text === "" || this.oecode.text === "") {
                    this.errorMessage = "Je hebt geen template, student of onderwijseenheid gekozen.";
                    return false;
                }

                this.errorMessage = null;
                return true;
            },
            validateStepTwo() {
                if (this.startDate === "" || this.endDate === "" || this.company === "" || this.address === "") {
                    this.errorMessage = "Niet alle gegevens zijn ingevuld.";
                    return false;
                }

                if (new Date(this.startDate) > new Date(this.endDate)) {
                    this.errorMessage = "De begindatum mag niet na de einddatum liggen.";
                    return false;
                }

                this.errorMessage = null;
                return true;
            },
        },
        components: {
            ModelSelect,
            'vue-good-wizard': GoodWizard,
        }
    };
</script>