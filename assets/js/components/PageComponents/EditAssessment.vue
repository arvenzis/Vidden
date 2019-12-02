<template>
    <div class="container dashboard-container">
        <div class="path"><router-link :to="'/summary/' + this.assessmentMetadataId" class="ml-2">Samenvatting beoordeling</router-link> &gt; Beoordeling bewerken</div>
        <section class="mt-5 mb-5">
            <spinner id="spinner--full-top" v-if="!dataReady"></spinner>
            <div v-else>
                <Sidebar class="sidebar" right :crossIcon="false">
                    <div v-for="(item, index) in menu" v-bind:key="item.index" class="group">
                        <h6 class="group-title">{{ item.group }}</h6>
                        <span v-for="child in item.children" v-bind:key="child.uuid" class="child" v-bind:class="child.result">
                            <router-link to="#" @click.native="deepLink(index, child.uuid)" class="link">    
                                <span class="child-title">{{ child.title }}</span>
                            </router-link>
                        </span>
                    </div>    
                </Sidebar>
                <vue-good-wizard
                        ref="wizard"
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
                            <div v-for="item in this.assertions" v-bind:key="item.groupName">
                                <section v-if="item.groupName.toLowerCase().replace(' ', '-') === currentSlot">
                                    <section>
                                        <div v-for="question in item.questions" v-bind:key="question.question">
                                            <h4 class="assessment__question d-sm-block" v-bind:id="'q' + item.groupId + question.categoryId + question.questionId">
                                                {{ question.question }}
                                                <popper trigger="hover" :options="{ placement: 'top' }">
                                                    <div class="popper">
                                                        <span v-for="keywords in question.children" v-bind:key="keywords" class="keyword"><strong>Sleutelwoorden:</strong> {{ keywords }}</span>
                                                    </div>
                                                    <i class="fa fa-info-circle cursor-pointer" slot="reference"></i>
                                                </popper>
                                            </h4>
                                            <div class="row row-eq-height">
                                                <div v-for="option in question.answers" v-bind:key="option.result" class="col-lg-6 col-md-6 col-sm-12">
                                                    <div class="assessment__answer" v-bind:id="option.grade" v-bind:class="[option.grade, { active: option.chosen === true }]">
                                                        <div class="assessment__answer-body">
                                                            <input type="radio" v-bind:id="option.grade" v-model="option.chosen" v-on:change="saveAnswer(question, option.id, option.grade, option.result, item.groupId)" v-bind:value="true" class="assessment__answer-radio" />
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
                                            <hr>
                                        </div>
                                    </section>
                                    <hr>
                                    <footer>
                                        <h4>Opmerkingen</h4>
                                        <div v-for="comment in item.comments" v-bind:key="comment.question">
                                            <div class="form-group">
                                                <label for="opmerkingen">{{ comment.question }}</label>
                                                <textarea name="opmerkingen" id="opmerkingen" v-model="comment.answer" v-on:change="saveComment(item.groupId, comment)" class="form-control" rows="3"></textarea>
                                            </div>
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
    import Sidebar from '../SingleComponents/Sidebar.vue'
    import Toasted from 'vue-toasted';
    import VueScrollTo from 'vue-scrollto';

    Vue.use(VueScrollTo)
    Vue.use(Popper);
    Vue.use(Toasted);

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
                previousStepLabel: 'Vorige',
                nextStepLabel: 'Volgende',
                finalStepLabel: 'Bevestigen',
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
                     response.data.groups.forEach(function(group) {
                         let questionObj = [];
                         let groupData = {
                             "groupId": group.id,
                             "groupName": group.name,
                             "comments": {
                                 "product": {
                                     "id": group.comments[0].id,
                                     "question": group.comments[0].question,
                                     "answer": group.comments[0].answer
                                 },
                                 "complexity": {
                                     "id": group.comments[1].id,
                                     "question": group.comments[1].question,
                                     "answer": group.comments[1].answer
                                 }
                             },
                             "questions": {}
                         };

                         group.questions.forEach(function(question) {
                            let questionsData = {
                                 "templateId": question.question.templateId,
                                 "assertionName": question.question.name,
                                 "categoryName": question.name,
                                 "categoryId": question.question.categoryId,
                                 "questionId": question.question.questionId,
                                 "children": [question.question.keywords],
                                 "question": question.question.question,
                                 "answers": {
                                     "excellent": {
                                         "id": question.question.answers[0].id,
                                         "description": question.question.answers[0].text,
                                         "grade": "excellent",
                                         "result": question.question.answers[0].mark,
                                         "chosen": question.question.answers[0].chosen
                                     },
                                     "good": {
                                         "id": question.question.answers[1].id,
                                         "description": question.question.answers[1].text,
                                         "grade": "good",
                                         "result":  question.question.answers[1].mark,
                                         "chosen": question.question.answers[1].chosen
                                     },
                                     "proficient": {
                                         "id": question.question.answers[2].id,
                                         "description": question.question.answers[2].text,
                                         "grade": "proficient",
                                         "result":  question.question.answers[2].mark,
                                         "chosen": question.question.answers[2].chosen
                                     },
                                     "poor": {
                                         "id": question.question.answers[3].id,
                                         "description": question.question.answers[3].text,
                                         "grade": "poor",
                                         "result":  question.question.answers[3].mark,
                                         "chosen": question.question.answers[3].chosen
                                     }
                                 },
                             };
                             questionObj.push(questionsData);
                         });

                         groupData.questions = questionObj;
                         self.assertions.push(groupData);
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

                    Vue.toasted.show('Items geladen', {
                        type: 'success',
                        duration: 1000
                    });
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
            saveAnswer(questionData, answerId, grade, result, groupId) {
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
                    "groupId": groupId,
                    "categoryId": questionData.categoryId,
                    "questionId": questionData.questionId,
                    "answerId": answerId,
                    "createdById": this.examinatorId,
                    "mark": result,
                    "isFinal": true,
                    "status": 0
                },
                {
                    headers: {"Authorization" : this.$session.get('jwt')}
                }).then(() => {
                    Vue.toasted.show('Het antwoord is opgeslagen', {
                        type: 'success',
                        duration: 1500
                    });
                }).catch(() => {
                    Vue.toasted.show('Er is iets misgegaan bij het opslaan van het antwoord', {
                        type: 'error',
                        duration: 1500
                    });
                });
            },
            saveComment(groupId, comment) {
                const ENDPOINTS = 'assessment/CommentsSave';

                axios.post(this.$store.state.apiBaseUrl + ENDPOINTS,
                    [
                        {
                            "id": comment.id,
                            "assessmentMetadataId": this.assessmentMetadataId,
                            "groupId":groupId,
                            "question":comment.question,
                            "answer":comment.answer
                        }
                    ]
                ,
                {
                    headers: {
                        "Authorization" : this.$session.get('jwt')
                    }
                }).then(() => {
                    Vue.toasted.show('De opmerking is opgeslagen', {
                        type: 'success',
                        duration: 1000
                    });
                }).catch(() => {
                    Vue.toasted.show('Er is iets misgegaan bij het opslaan van de opmerking', {
                        type: 'error',
                        duration: 1000
                    });
                });
            },
            buildMenu(array) {
                let tmpMenu = [];

                array.forEach(function (subject) {
                    let menuObj = [];
                    let groupId = subject.groupId;
                    let groupData = {
                        group: subject.groupName,
                        children: {}
                    }
                    for(var i in subject.questions) {
                        let children = {
                            uuid: 'q' + groupId + '' + subject.questions[i].categoryId + '' + subject.questions[i].questionId,
                            title: subject.questions[i].assertionName,
                            result: 
                                subject.questions[i].answers.excellent.chosen ? 'excellent'
                                : subject.questions[i].answers.good.chosen ? 'good'
                                : subject.questions[i].answers.proficient.chosen ? 'proficient'
                                : subject.questions[i].answers.poor.chosen ? 'poor'
                                : ''
                        };
                        menuObj.push(children);
                        i++;
                    }
                
                    groupData.children = menuObj;
                    tmpMenu.push(groupData);
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

                        // add the current item to o.
                        var obj = {
                            group: cur.group,
                            children: cur.children
                        };
                        o = o.concat([obj]);
                    }

                    return o;
                }, []);

                return this.menu = output;
            },
            deepLink(index, target) {
                if(index === this.currentStep) {
                    this.$scrollTo('#' + target);
                }
                else {
                    this.currentStep = index;
                    this.currentSlot = this.getCurrentSlot();
                    this.$refs.wizard.goTo(index);

                    // Give em just enough time to refresh the contents of the slot
                    setTimeout(() => { this.$scrollTo('#' + target) }, 100);
                    return true;
                }
            },
        },
        components: {
            'vue-good-wizard': GoodWizard,
            'popper': Popper,
            Spinner,
            Sidebar
        }
    };
</script>
