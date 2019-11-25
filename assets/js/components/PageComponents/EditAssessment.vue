<template>
    <div class="container dashboard-container">
        <router-link to="/browse" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar overzicht</router-link>
        <section class="mt-5 mb-5">
            <spinner id="spinner--full-top" v-if="!dataReady"></spinner>
            <div v-else>
                <Slide class="sidebar" noOverlay right :crossIcon="false">
                    <div v-for="item in menu" v-bind:key="item.id" class="group">
                        <h6 class="group-title">{{ item.group }}</h6>
                        <span v-for="child in item.children" v-bind:key="child.id" class="child" v-bind:class="child.result">
                            <a :href="child.href">
                                <span class="child-title">{{ child.title }}</span>
                            </a>
                        </span>
                    </div>    
                </Slide>
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
                            <div v-for="item in this.assertions">
                                <section v-if="item.groupName.toLowerCase().replace(' ', '-') === currentSlot">
                                    <section>
                                        <h4 class="assessment__question d-sm-block">
                                            <a :id="item.groupId + '' + item.categoryId + '' + item.questionId"></a>
                                            {{ item.question }}
                                            <popper trigger="hover" :options="{ placement: 'top' }">
                                                <div class="popper">
                                                    <span v-for="keywords in item.children" v-bind:key="keywords" class="keyword"><strong>Sleutelwoorden:</strong> {{ keywords }}</span>
                                                </div>
                                                <i class="fa fa-info-circle cursor-pointer" slot="reference"></i>
                                            </popper>
                                        </h4>
                                        <div class="row row-eq-height">
                                            <div v-for="option in item.answers" class="col-lg-6 col-md-6 col-sm-12">
                                                <div class="assessment__answer" v-bind:id="option.grade" v-bind:class="[option.grade, { active: option.chosen === true }]">
                                                    <div class="assessment__answer-body">
                                                        <input type="radio" v-bind:id="option.grade" v-model="option.chosen" v-on:change="saveAnswer(item, option.id, option.grade)" v-bind:value="true" class="assessment__answer-radio" />
                                                        <label class="form-check-label" v-bind:for="option.grade">
                                                            <h1 class="assessment__answer-mark" v-bind:class="[option.grade, { active: option.chosen === true }]">
                                                                {{ option.result }}
                                                            </h1>
                                                            {{ option.description }}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                    <hr>
                                    <!-- ToDo: opmerkingen per groep tonen -->
<!--                                    <footer>-->
<!--                                        <div class="form-group">-->
<!--                                            <label for="opmerkingen">Aanvullende opmerkingen</label>-->
<!--                                            <textarea name="opmerkingen" id="opmerkingen" v-model="comments" class="form-control" rows="3"></textarea>-->
<!--                                        </div>-->
<!--                                    </footer>-->
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
    import { Slide } from 'vue-burger-menu'

    Vue.use(Popper);

    export default {
        name: 'edit',
        data () {
            return {
                // These are the ids in the parameter of the URL
                assessmentMetadataId: this.$route.params.assessmentMetadataId,
                examinatorId: this.$route.params.examinatorId,
                assessment: [],
                steps: [],
                menu: [],
                group: '',
                category: '',
                assertions: [],
                previousStepLabel: 'Previous',
                nextStepLabel: 'Next',
                finalStepLabel: 'Confirm',
                currentStep: 0,
                currentSlot: "",
                dataReady: false,
                errorMessage: null,
            }
        },
        created () {
            const ENDPOINTS = `assessment/${this.assessmentMetadataId}/question/${this.examinatorId}`;
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
                                    "chosen": subject.question.answers[0].chosen
                                },
                                "good": {
                                    "id": subject.question.answers[1].id,
                                    "description": subject.question.answers[1].text,
                                    "grade": "good",
                                    "result":  subject.question.answers[1].mark,
                                    "chosen": subject.question.answers[1].chosen
                                },
                                "proficient": {
                                    "id": subject.question.answers[2].id,
                                    "description": subject.question.answers[2].text,
                                    "grade": "proficient",
                                    "result":  subject.question.answers[2].mark,
                                    "chosen": subject.question.answers[2].chosen
                                },
                                "poor": {
                                    "id": subject.question.answers[3].id,
                                    "description": subject.question.answers[3].text,
                                    "grade": "poor",
                                    "result":  subject.question.answers[3].mark,
                                    "chosen": subject.question.answers[3].chosen
                                }
                            }
                        };

                        self.assertions.push(obj);
                    });

                    let array = [];
                    for (let i = 0; i < this.assertions.length; i++) {
                        let label = this.assertions[i].groupName;
                        let obj = { label: label, slot: label.toLowerCase().replace(' ', '-') };
                        if (!this.containsObject(obj, array)) {
                            array.push(obj);
                        }
                    }

                    this.steps = array;
                    this.currentSlot = this.getCurrentSlot();
                    this.buildMenu(this.assertions);
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
            saveAnswer(questionData, answerId, grade) {
                //Make sure the answer that was chosen before is set to false so that the user will not see an incorrectly filled answer
                const answers = Object.values(questionData.answers);
                for (const answer of answers) {
                    if (answer.grade !== grade) {
                        answer.chosen = false;
                    }
                }

                const ENDPOINTS = 'assessment/AnswerSave';
                axios.post(this.$store.state.apiBaseUrl + ENDPOINTS, {
                        "assessmentMetadataId": this.assessmentMetadataId,
                        "templateId": questionData.templateId,
                        "groupId": questionData.groupId,
                        "categoryId": questionData.categoryId,
                        "questionId": questionData.questionId,
                        "answerId": answerId,
                        "userId": this.examinatorId,
                    },
                    {
                        headers: {"Authorization" : this.$session.get('jwt')}
                    }).then(() => {}).catch(() => {
                    this.errorMessage = "Er is iets misgegaan bij het opslaan van het antwoord.";
                });
            },
            buildMenu(array) {
                let tmpMenu = [];
                let i = 56; // Random number, but because of our not so smart identifier system in the backend this is neccessary

                array.forEach(function (subject) {
                    tmpMenu.push({
                        id: i,
                        group: subject.groupName,
                        children: [{
                            id: i / 2,
                            href: '#' + subject.groupId + '' + subject.categoryId + '' + subject.questionId,
                            title: subject.assertionName,
                            result: 
                                subject.answers.excellent.chosen ? 'excellent'
                                : subject.answers.good.chosen ? 'good'
                                : subject.answers.proficient.chosen ? 'proficient'
                                : subject.answers.poor.chosen ? 'poor'
                                : ''
                        }]
                    })
                    i++;
                });

                var output = tmpMenu.reduce(function (o, cur) {

                    // Get the index of the key-value pair.
                    var occurs = o.reduce(function (n, item, i) {
                        return (item.group === cur.group) ? i : n;
                    }, -1);

                    // If the name is found,
                    if (occurs >= 0) {

                        // append the current children to its list of children.
                        o[occurs].children = o[occurs].children.concat(cur.children);

                        // Otherwise,
                    } else {

                        // add the current item to o (but make sure the children is an array).
                        var obj = {
                            group: cur.group,
                            children: cur.children
                        };
                        o = o.concat([obj]);
                    }

                    return o;
                }, []);

                console.log(output);
                return this.menu = output;
            },
        },
        components: {
            'vue-good-wizard': GoodWizard,
            'popper': Popper,
            Spinner,
            Slide
        }
    };
</script>