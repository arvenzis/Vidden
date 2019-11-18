<template>
    <div class="container dashboard-container">
        <router-link to="/browse" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar overzicht</router-link>
        <section class="mt-5 mb-5">
            <spinner id="spinner" v-if="!dataReady"></spinner>
            <div v-else>
                <div v-if="this.errorMessage" class="alert alert-danger">{{ this.errorMessage }}</div>
                <vue-good-wizard
                        :steps="steps"
                        :nextStepLabel="nextStepLabel"
                        :previousStepLabel="previousStepLabel"
                        :finalStepLabel="finalStepLabel"
                        :onNext="nextClicked"
                        :onBack="backClicked">

                        <article :slot="this.steps[this.currentStep].slot">
                            <header>
                                <h4 class="mb3">{{ this.steps[this.currentStep].label }}</h4>
                            </header>
                            <div v-for="item in this.assertions" v-bind:key="item.assertion">
                                <section v-bind:id="item.assertion" v-if="item.groupName.toLowerCase().replace(' ', '-') === currentSlot" ref="assertion">

                                <section>
                                    <h4 class="assessment__question d-none d-sm-block">
                                        {{ item.question }}
                                        <popper trigger="hover" :options="{ placement: 'top' }">
                                            <div class="popper">
                                                <span v-for="keywords in item.children" v-bind:key="keywords" class="keyword"><strong>Sleutelwoorden:</strong> {{ keywords }}</span>
                                            </div>
                                            <i class="fa fa-info-circle cursor-pointer" slot="reference"></i>
                                        </popper>
                                    </h4>
                                    <div class="d-flex row">
                                        <div v-for="option in item.answers" v-bind:key="option.result" class="d-lg-flex d-md-flex col-lg-6 col-md-6 col-sm-12">
                                            <div class="assessment__answer" v-bind:id="option.grade" v-bind:class="[option.grade, { active: item.checked === option.grade }]">
                                                <div class="assessment__answer-body">
                                                    <input type="radio" v-bind:name="item.assertion" v-bind:id="option.grade" v-model="item.checked" v-on:change="saveAnswer(item, option.id)" v-bind:value="option.grade" class="assessment__answer-radio" />
                                                    <label class="form-check-label" v-bind:for="option.grade">
                                                        <h1 class="assessment__answer-mark" v-bind:class="[option.grade, { active: item.checked === option.grade }]">
                                                            {{ option.result }}
                                                        </h1>
                                                        {{ option.description }}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <footer>
                                    <div class="form-group">
                                        <label for="opmerkingen">Aanvullende opmerkingen</label>
                                        <textarea name="opmerkingen" id="opmerkingen" v-model="comments" class="form-control" rows="3"></textarea>
                                    </div>
                                </footer>
                            </section>
                        </div>
                    </article>
            </vue-good-wizard>
            </div>
        </section>
    </div>
</template>

<script>
    import Vue from "vue";
    import { GoodWizard } from 'vue-good-wizard';
    import axios from 'axios';
    import Popper from 'vue-popperjs';
    import Spinner from "vue-simple-spinner";

    Vue.use(Popper);

    export default {
        name: 'edit',
        data () {
            return {
                // This is the id in the parameter of the URL
                id: this.$route.params.id,
                assessment: [],
                steps: [],
                group: '',
                category: '',
                assertions: [],
                previousStepLabel: 'Previous',
                nextStepLabel: 'Next',
                finalStepLabel: 'Confirm',
                currentStep: 0,
                currentSlot: "",
                dataReady: false,
                errorMessage: null
            }
        },
        created () {
            //ToDo: Get metadataid (en examinator id) from assessment (from Bernards PR)
            const ENDPOINTS = 'assessment/1/question/' + this.$store.state.currentUserId;
            axios.get(this.$store.state.apiBaseUrl + ENDPOINTS,
                {
                    headers: {"Authorization" : this.$session.get('jwt')}
                })
                .then(response => {
                    let self = this;
                    response.data.forEach(function(subject) {
                        let obj = {
                            "templateId": subject.question.templateId,
                            "assertionName": subject.question.name,
                            "groupName": subject.groupName,
                            "groupId": subject.question.groupId,
                            "categoryName": subject.name,
                            "categoryId": subject.question.categoryId,
                            "children": [subject.question.keywords],
                            "question": subject.question.question,
                            "questionId": subject.question.questionId,
                            "answers": {
                                "excellent": {
                                    "id": subject.question.answers[0].id,
                                    "description": subject.question.answers[0].text,
                                    "grade": "excellent",
                                    "result":  subject.question.answers[0].mark,
                                },
                                "good": {
                                    "id": subject.question.answers[1].id,
                                    "description": subject.question.answers[1].text,
                                    "grade": "good",
                                    "result":  subject.question.answers[1].mark,
                                },
                                "proficient": {
                                    "id": subject.question.answers[2].id,
                                    "description": subject.question.answers[2].text,
                                    "grade": "proficient",
                                    "result":  subject.question.answers[2].mark,
                                },
                                "poor": {
                                    "id": subject.question.answers[3].id,
                                    "description": subject.question.answers[3].text,
                                    "grade": "poor",
                                    "result":  subject.question.answers[3].mark,
                                }
                            },
                            checked: false
                        };

                        self.assertions.push(obj);
                    });

                    let array = [];
                    let tmpAssertions = this.assertions;
                    for (let i = 0; i < tmpAssertions.length; i++) {
                        let label = tmpAssertions[i].groupName;
                        let obj = { label: label, slot: label.toLowerCase().replace(' ', '-') };
                        if (!this.containsObject(obj, array)) {
                            array.push(obj);
                        }
                    }

                    this.steps = array;
                    this.currentSlot = this.getCurrentSlot();
                    this.dataReady = true;
                }).catch(() => {
                this.errorMessage = "Er is iets misgegaan bij het ophalen van de vragen.";
            });
        },
        methods: {
            getCurrentSlot() {
                return this.steps[this.currentStep].slot;
            },
            scrollToTop() {
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                })
            },
            nextClicked(currentPage) {
                // Check if this is the last page aka if you're clicking 'confirm'
                if (currentPage !== this.steps.length - 1) {
                    this.currentStep = this.currentStep + 1;
                    this.currentSlot = this.getCurrentSlot();
                    this.scrollToTop();
                    return true;
                }

                this.$router.push('/browse');
                return false;
            },
            backClicked() {
                this.currentStep = this.currentStep - 1;
                this.currentSlot = this.getCurrentSlot();
                this.scrollToTop();
                return true;
            },
            currentLabel() {
                return this.steps[this.currentPage].label;
            },
            containsObject(obj, list) {
                for (let x in list) {
                    if (list.hasOwnProperty(x) && list[x].label === obj.label) {
                        return true;
                    }
                }
                return false;
            },
            saveAnswer(questionData, answerId) {
                const ENDPOINTS = 'assessment/AnswerSave';
                axios.post(this.$store.state.apiBaseUrl + ENDPOINTS, {
                        "assessmentMetadataId": 1,
                        "templateId": questionData.templateId,
                        "groupId": questionData.groupId,
                        "categoryId": questionData.categoryId,
                        "questionId": questionData.questionId,
                        "answerId": answerId,
                        "userId": this.$store.state.currentUserId,
                    },
                    {
                        headers: {"Authorization" : this.$session.get('jwt')}
                    }).then(() => {}).catch(() => {
                    this.errorMessage = "Er is iets misgegaan bij het opslaan van het antwoord.";
                });
            },
        },
        components: {
            'vue-good-wizard': GoodWizard,
            'popper': Popper,
            Spinner
        }
    };
</script>