<template>
    <div class="container dashboard-container">
        <router-link to="/browse" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar overzicht</router-link>
        <section class="mt-5 mb-5">
            <vue-good-wizard
                    :steps="steps"
                    :nextStepLabel="nextStepLabel"
                    :previousStepLabel="previousStepLabel"
                    :finalStepLabel="finalStepLabel"
                    :onNext="nextClicked">
                <article v-bind:slot="this.steps[this.currentStep].slot" v-bind:ref="wizard">
                    <h4 class="mb3">{{ this.group }} - {{ this.category }}</h4>
                    <div v-for="item in this.assertions" v-bind:key="item.assertion">
                        <!-- TODO: only show the question belonging to this assertion -->
                        <section v-bind:id="item.assertion" v-if="this.currentAssertion === this.currentSlot" ref="assertion">
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
        created () {
            const ENDPOINTS = 'assessment/' + this.id + '/start/' + this.$store.state.currentUserId;
            axios.post(this.$store.state.apiBaseUrl + ENDPOINTS, null,
                {
                    headers: {"Authorization" : this.$session.get('jwt')}
                })
                .then(response => {
                    console.log(response.data);
                    this.assertions[0].children = [response.data.keywords];
                    this.assertions[0].question = response.data.question;
                    this.assertions[0].answers.excellent.description = response.data.answers[0].text;
                    this.assertions[0].answers.good.description = response.data.answers[1].text;
                    this.assertions[0].answers.proficient.description = response.data.answers[2].text;
                    this.assertions[0].answers.poor.description = response.data.answers[3].text;
                }); //ToDo: catch die bende
        },
        data () {
            return {
                // This is the id in the parameter of the URL
                id: this.$route.params.id,
                // TODO: get this information from the api
                assessment: [],
                group: 'Analyseren',
                category: 'Zelfstandigheid',
                assertions: [
                    {
                        assertion: 'Aanpak', //ToDo: nog niet beschikbaar in de api
                        children: [],
                        question: '',
                        answers: {
                            excellent: {
                                grade: 'excellent',
                                result: 9,
                                description: ''
                            },
                            good: {
                                grade: 'good',
                                result: 8,
                                description: ''
                            },
                            proficient: {
                                grade: 'proficient',
                                result: 6,
                                description: ''
                            },
                            poor: {
                                grade: 'poor',
                                result: 4,
                                description: ''
                            }
                        },
                        checked: false
                    }],
                currentStep: 0,
                previousStepLabel: 'Previous',
                nextStepLabel: 'Next',
                finalStepLabel: 'Confirm'
            }
        },
        computed: {
            steps: function() {
                let array = [];
                let tmpAssertions = this.assertions;

                for (let i = 0; i < tmpAssertions.length; i++) {
                    let label = tmpAssertions[i].assertion;
                    let slot = tmpAssertions[i].assertion;

                    array.push({ label: label, slot: slot.toLowerCase().replace(' ', '-') });
                }
                console.log(array);
                return array;
            },
            currentSlot: function() {
                return this.$refs.wizard.getAttribute('slot');
            },
            currentAssertion: function() {
                return this.$refs.assertion.getAttribute('id').toLowerCase().replace(' ', '-');
            }
        },
        methods: {
            nextClicked(currentPage) {
                console.log('next clicked', currentPage);
                return true;
            },
            getTemplateGroups() {
                //
            },
            validateStep() {
                //
            },
            // Below methods don't work as of yet
            // currentSlot() {
            //     return this.$refs.wizard.getAttribute('slot');
            // },
            currentLabel() {
                return this.steps[this.currentPage].label;
            },
            // This one does
            check(option) {
                console.log(option + ' checked.');
            }
        },
        components: {
            'vue-good-wizard': GoodWizard,
            'popper': Popper
        }
    };
</script>