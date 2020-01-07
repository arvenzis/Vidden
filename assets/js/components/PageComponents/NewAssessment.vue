<template>
    <div class="container dashboard-container">
        <div class="path"><router-link to="/" class="ml-2">{{ $t('common.dashboard') }}</router-link> &gt; {{ $t('common.new') }}</div>
        <div class="mt-5 mb-5">
            <div v-if="this.errorMessage" class="alert alert-danger">{{ this.errorMessage }}</div>
            <vue-good-wizard
                    :steps="steps"
                    :nextStepLabel="nextStepLabel"
                    :previousStepLabel="previousStepLabel"
                    :finalStepLabel="finalStepLabel"
                    :onNext="nextClicked">
                <div slot="step-1">
                    <h2 class="mb-3">{{ $t('assessment.new') }}</h2>
                    <div class="form-group">
                        <label>{{ $t('assessment.template') }}</label>
                        <model-select :options="templateOptions"
                                      v-model="template"
                                      :placeholder="$t('assessment.template_select')">
                        </model-select>
                    </div>
                    <div class="form-group">
                        <label>{{ $t('assessment.student') }}</label>
                        <model-select :options="studentOptions"
                                      v-model="student"
                                      :placeholder="$t('assessment.student_select')">
                        </model-select>
                    </div>
                    <div class="form-group">
                        <label>{{ $t('assessment.course') }}</label>
                        <model-select :options="oecodeOptions"
                                      v-model="oecode"
                                      :placeholder="$t('assessment.course_select')">
                        </model-select>
                    </div>
                    <div class="form-group">
                        <label>{{ $t('assessment.second_teacher') }}</label>
                        <model-select :options="teacherOptions"
                                      v-model="teacher"
                                      :placeholder="$t('assessment.second_teacher_select')">
                        </model-select>
                    </div>
                </div>
                <div slot="step-2">
                    <h2 class="mb-3">{{ $t('assessment.details') }}</h2>
                    <div class="form-group">
                        <label class="font-weight-bold">{{ $t('assessment.period') }}</label>
                        <div class="row">
                            <div class="col-6">
                                <label for="start-date">{{ $t('assessment.period_from') }}</label>
                                <input type="date" name="start-date" id="start-date" class="form-control" v-model="startDate" />
                            </div>
                            <div class="col-6">
                                <label for="end-date">{{ $t('assessment.period_to') }}</label>
                                <input type="date" name="end-date" id="end-date" class="form-control" v-model="endDate" />
                            </div>
                        </div>
                    </div>
                    <strong>{{ $t('assessment.company') }}</strong>
                    <div class="form-group">
                        <label for="company">{{ $t('assessment.company_name') }}</label>
                        <input type="text" name="company" id="company" placeholder="Windesheim" v-model="company" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label for="address">{{ $t('assessment.company_address') }}</label>
                        <input type="text" name="address" id="address" placeholder="Campus 2, 8017 CA Zwolle" v-model="address" class="form-control" />
                    </div>
                </div>
                <div slot="step-3">
                    <h2 class="mb-3">{{ $t('assessment.summary') }}</h2>
                    <strong>{{this.student.text}}</strong><br>
                    <span>{{ this.startDate }} - {{ this.endDate }}</span><br><br>

                    <strong>{{ $t('assessment.company') }}</strong><br>
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
                currentUserId: this.$store.getters.getCurrentUserId,
                // Next eight properties are necessary because of using the ModelSelect component
                studentOptions: [],
                templateOptions: [],
                oecodeOptions: [],
                teacherOptions: [],
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
                teacher: {
                    value: '',
                    text: ''
                },
                startDate: '',
                endDate: '',
                company: '',
                address: '',
                previousStepLabel: this.$t('assessment.previous'),
                nextStepLabel: this.$t('assessment.next'),
                finalStepLabel: this.$t('assessment.confirm'),
                steps: [
                    {
                        label: this.$t('assessment.general'),
                        slot: 'step-1'
                    },
                    {
                        label: this.$t('assessment.details'),
                        slot: 'step-2'
                    },
                    {
                        label: this.$t('assessment.overview'),
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
            this.getTeachers();
        },
        methods: {
            getTemplateType() {
                const ENDPOINTS = 'Template/';
                axios.get(this.$store.getters.getApiBaseUrl + ENDPOINTS, { headers: {"Authorization" : this.$session.get('jwt')} })
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
                axios.get(this.$store.getters.getApiBaseUrl + ENDPOINTS, { headers: {"Authorization" : this.$session.get('jwt')} })
                     .then(response => {
                        let students = [];
                        response.data.forEach(function(student) {
                            students.push({ value: student.id, text: student.fullName + ' (' + student.accountNumber + ')'});
                        });
                        this.studentOptions = students;
                     });
            },
            getTeachers() {
                const ENDPOINTS = 'Teacher/GetTeachers';
                axios.get(this.$store.getters.getApiBaseUrl + ENDPOINTS, { headers: {"Authorization" : this.$session.get('jwt')} })
                     .then(response => {
                        let self = this;
                        let teachers = [];
                        response.data.forEach(function(teacher) {
                            if(teacher.id != self.currentUserId) {
                                teachers.push({ value: teacher.id, text: teacher.fullName + ' (' + teacher.accountNumber + ')'});
                            }
                        });
                        this.teacherOptions = teachers;
                     });
            },
            getOeCodes() {
                // Currently there is only one code available
                // if we expand the application then it makes sense to put these in a db table
                // and make an api call
                this.oecodeOptions = [
                    {
                        value: 'ICT.AFSTSE.D19',
                        text: 'Afstudeeropdracht Software Engineering 2019-2020'
                    }
                ]
            },
            createAssessmentMetaData() {
                const ENDPOINTS = 'assessment';
                axios.post(this.$store.getters.getApiBaseUrl + ENDPOINTS, {
                    "Name": this.template.text,
                    "IsActive": 1,
                    "CreatedAt": new Date().toISOString().slice(0,10),
                    "CreatedbyId": this.$store.getters.getCurrentUserId,
                    "UpdatedAt": new Date().toISOString().slice(0,10),
                    "UpdatedbyId": this.$store.getters.getCurrentUserId,
                    "TemplateId": this.template.value,
                    "StudentId": this.student.value,
                    "CompanyId": 1,
                    "FirstTeacherId": this.$store.getters.getCurrentUserId,
                    "secondTeacherId": this.teacher.value,
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
                            this.flash(this.$t('success.new_assessment_save'), 'success', {
                                timeout: 2000
                            });

                            // Push to summary page
                            // Note the backticks
                            this.$router.push({ path: `/summary/${assessmentmetadataid}` })
                        }
                    }).catch(() => {
                        Vue.toasted.show(this.$t('error.new_assessment_save'), {
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
                if (this.student.text === "" || this.template.text === "" || this.oecode.text === "" || this.teacher.text === "") {
                    this.errorMessage = this.$t('error.new_assessment_validation_first_step');
                    return false;
                }

                this.errorMessage = null;
                return true;
            },
            validateStepTwo() {
                if (this.startDate === "" || this.endDate === "" || this.company === "" || this.address === "") {
                    this.errorMessage = this.$t('error.new_assessment_validation_second_step');
                    return false;
                }

                if (new Date(this.startDate) > new Date(this.endDate)) {
                    this.errorMessage = this.$t('error.new_assessment_validation_date');
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