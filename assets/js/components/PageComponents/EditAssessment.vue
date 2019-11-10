<template>
    <div class="container dashboard-container">
        <router-link to="/browse" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar overzicht</router-link>
        <section class="mt-5 mb-5">
            <div v-if="dataReady">
            <vue-good-wizard
                    :steps="steps"
                    :nextStepLabel="nextStepLabel"
                    :previousStepLabel="previousStepLabel"
                    :finalStepLabel="finalStepLabel"
                    :onNext="nextClicked">
                    <article :slot="this.steps[this.currentStep].slot"  :data-currentslot="this.steps[this.currentStep].label" ref="slot">
                        <h4 class="mb3">{{ this.group }} - {{ this.category }}</h4>
                        <div v-for="item in this.assertions" v-bind:key="item.assertion">
                            {{item.assertionName.toLowerCase()}} {{ currentSlot()}}
                            <section v-bind:id="item.assertion" v-if="item.assertionName.toLowerCase() === currentSlot()" ref="assertion">
                                <header>
                                    <h3>
                                        {{ item.assertion }}
                                        <popper trigger="hover" :options="{placement: 'top'}">
                                            <div class="popper">
                                                <span v-for="keywords in item.children" v-bind:key="keywords" class="keyword">{{ keywords }}</span>
                                            </div>

                                            <i class="fa fa-info-circle cursor-pointer" slot="reference"></i>
                                        </popper>
                                    </h3>
                                </header>
                                <section>
                                    <h4 class="assessment__question d-none d-sm-block">{{ item.question }}</h4>
                                    <div v-for="option in item.answers" v-bind:key="option.result">
                                        <div class="assessment__answer" v-bind:id="option.grade" v-bind:class="[option.grade, { active: item.checked === option.grade }]">
                                            <div class="assessment__answer-body">
                                                <input type="radio" v-bind:name="item.assertion" v-bind:id="option.grade" v-model="item.checked" v-on:change="check(option.grade)" v-bind:value="option.grade" class="assessment__answer-radio" />
                                                <label class="form-check-label" v-bind:for="option.grade">
                                                    {{ option.description }}
                                                </label>
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

    Vue.use(Popper);

    export default {
        name: 'edit',
        data () {
            return {
                // This is the id in the parameter of the URL
                id: this.$route.params.id,
                assessment: [],
                steps: [],
                group: '', //Analyseren
                category: '',  //Zelfstandigheid
                assertions: [],
                previousStepLabel: 'Previous',
                nextStepLabel: 'Next',
                finalStepLabel: 'Confirm',
                currentStep: 0,
                dataReady: false
            }
        },
        created () {
            //ToDo: Get metadataid from assessment
            const ENDPOINTS = 'assessment/1/question/' + this.$store.state.currentUserId;
            axios.get(this.$store.state.apiBaseUrl + ENDPOINTS,
                {
                    headers: {"Authorization" : this.$session.get('jwt')}
                })
                .then(response => {
                    let self = this;
                    response.data.forEach(function(subject) {
                        let obj = {
                            "assertionName": subject.question.name,
                            "children": [subject.question.keywords],
                            "question": subject.question.question,
                            "answers": {
                                "excellent": {
                                    "description": subject.question.answers[0].text,
                                    "grade": "excellent",
                                    "result":  subject.question.answers[0].mark,
                                },
                                "good": {
                                    "description": subject.question.answers[1].text,
                                    "grade": "good",
                                    "result":  subject.question.answers[1].mark,
                                },
                                "proficient": {
                                    "description": subject.question.answers[2].text,
                                    "grade": "proficient",
                                    "result":  subject.question.answers[2].mark,
                                },
                                "poor": {
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
                        let label = tmpAssertions[i].assertionName;
                        let obj = { label: label, slot: label.toLowerCase().replace(' ', '-') };
                        if (!this.containsObject(obj, array)) {
                            array.push(obj);
                        }
                    }

                    this.steps = array;

                    this.dataReady = true;
                }); //ToDo: catch die bende
        },
        methods: {
            currentSlot: function() {
                if (!this.$refs.slot)
                    return;
                return this.$refs.slot.dataset.currentslot.toLowerCase();
                // return "hoer";
            },
            nextClicked(currentPage) {
                // console.log('next clicked', currentPage);
                return true;
            },
            getTemplateGroups() {
                //
            },
            validateStep() {
                //
            },
            currentLabel() {
                return this.steps[this.currentPage].label;
            },
            check(option) {
                console.log(option + ' checked.');
            },
            containsObject(obj, list) {
                for (let x in list) {
                    if (list.hasOwnProperty(x) && list[x].label === obj.label) {
                        return true;
                    }
                }
                return false;
            }
        },
        components: {
            'vue-good-wizard': GoodWizard,
            'popper': Popper
        }
    };
</script>