<template>
    <div class="container dashboard-container">
        <router-link to="/browse" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar overzicht</router-link>
        <div class="card">
            <div class="card-body">
                <h1 class="mb3">Competentie: {{ this.group }} - {{ this.category }}</h1>
            </div>
        </div>
        <section class="mt-5 mb-5">
            <vue-good-wizard
                    :steps="steps"
                    :nextStepLabel="nextStepLabel"
                    :previousStepLabel="previousStepLabel"
                    :finalStepLabel="finalStepLabel"
                    :onNext="nextClicked"
                    :onBack="backClicked">
                <article v-bind:slot="this.steps[this.currentStep].slot" v-bind:ref="wizard">
                    <div v-for="item in this.assertions" v-bind:key="item.assertion">
                        <!-- TODO: only show the question belonging to this assertion -->
                        <section v-bind:id="item.assertion" v-if="this.currentAssertion === this.currentSlot" ref="assertion">
                            <header>
                                <h3>
                                    {{ item.assertion }}
                                    <small class="text-muted">
                                        <span v-for="keywords in item.children" v-bind:key="keywords" class="keyword">{{ keywords }}</span>
                                    </small>
                                </h3>
                            </header>
                            <section>
                                <h4 class="assessment__question d-none d-sm-block">{{ item.question }}</h4>
                                <div v-for="option in item.answers" v-bind:key="option.result">
                                    <!-- TODO: when clicked, fill the div in the right color -->
                                    <div class="assessment__answer" v-bind:id="option.grade" v-bind:class="option.grade">
                                        <div class="assessment__answer-body">
                                            <input type="radio" v-bind:name="item.assertion" v-bind:id="option.grade" v-model="checked" v-on:change="check(option.grade)" v-bind:value="option.grade" class="assessment__answer-radio" />
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
                                    <textarea name="opmerkingen" id="opmerkingen" v-model="comments" class="form-control" rows="3"/>
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
    import { GoodWizard } from 'vue-good-wizard';
    import axios from 'axios';

    export default {
        name: 'edit',
        created () {
            // const ENDPOINTS = 'Assessment/' + this.id;
            // axios.get(this.$store.state.apiBaseUrl + ENDPOINTS, { headers: {"Authorization" : this.$session.get('jwt')} })
            //     .then(response => {
            //         this.assessment = response.data;
            //         console.log(this.assessment);
            //     });
        },
        data () {
            return {
                // This is the id in the parameter of the URL
                // TODO: check if id is set, else, redirect to browse
                id: this.$route.params.id,
                // TODO: get this information from the api
                assessment: [],
                // For now, let's create a mock version
                group: 'Analyseren',
                category: 'Zelfstandigheid',
                assertions: [
                    {
                    assertion: 'Aanpak',
                    children: ['Gestructureerdheid', 'Samenhang', 'Flexibiliteit'],
                    question: 'De student heeft een gestructeerde beheeraanpak, wat leidt tot geplande stappen met als doel toewerken naar een mijlpaal. Nieuwe inzichten worden hierbij verwerkt. En de beheeraanpak wordt blijvend gevalideerd.',
                    answers: {
                        excellent: {
                            grade: 'excellent',
                            result: 9,
                            description: 'Werkt volgens geplande stappen naar een mijlpaal, verwerkt nieuwe inzichten; blijft beheeraanpak valideren.'
                        },
                        good: {
                            grade: 'good',
                            result: 8,
                            description: 'Werkt volgens geplande stappen naar een mijlpaal en verwerkt nieuwe inzichten.'
                        },
                        proficient: {
                            grade: 'proficient',
                            result: 6,
                            description: 'Werkt volgens geplande stappen naar een mijlpaal.'
                        },
                        poor: {
                            grade: 'poor',
                            result: 4,
                            description: 'Ongestructureerde beheeraanpak leidt tot weinig grip en sturing.'
                        }
                    }
                },
                {
                    assertion: 'Initiatief',
                    children: ['Grip', 'Sturing','Omgaan met risico\'s'],
                    question: 'De student beheert eigen proces en project. Daarnaast wordt er gereageerd op knelpunten en meevallers. Daarbij wordt hierop geanticipeert en worden onverwachte situaties opgevangen.',
                    answers: {
                        excellent: {
                            grade: 'excellent',
                            result: 9,
                            description: 'Reageert en anticipeert uit zichzelf op knelpunten en meevallers en vangt onverwachte situaties op.'
                        },
                        good: {
                            grade: 'good',
                            result: 8,
                            description: 'Reageert en anticipeert uit zichzelf op knelpunten en meevallers.'
                        },
                        proficient: {
                            grade: 'proficient',
                            result: 6,
                            description: 'Reageert uit zichzelf op knelpunten en meevallers.'
                        },
                        poor: {
                            grade: 'poor',
                            result: 4,
                            description: 'Is uit zichzelf weinig geneigd eigen project en proces te beheren.'
                        }
                    }
                },
                {
                    assertion: 'Keuzes maken',
                    children: ['Bronnen', 'Methoden', 'Technieken'],
                    question: 'De student verzamelt alternatieven, onderzoekt de impact. Daarbij maakt hij keuzes en kan deze onderbouwen.Daarnaast worden routes en kaders blijvend gevalideerd.',
                    answers: {
                        excellent: {
                            grade: 'excellent',
                            result: 9,
                            description: 'Verzamelt alternatieven, onderzoekt de impact, maakt onderbouwde keuzes; blijft gekozen routes en kaders valideren.'
                        },
                        good: {
                            grade: 'good',
                            result: 8,
                            description: 'Verzamelt alternatieven, onderzoekt de impact en maakt goed onderbouwde keuzes.'
                        },
                        proficient: {
                            grade: 'proficient',
                            result: 6,
                            description: 'Verzamelt alternatieven, onderzoekt de impact en maakt keuzes.'
                        },
                        poor: {
                            grade: 'poor',
                            result: 4,
                            description: 'Toont weinig vaardigheid in het maken van geschikte keuzes.'
                        }
                    }
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
                
                for(var i = 0; i < tmpAssertions.length; i++) {
                    let label = tmpAssertions[i].assertion;
                    let slot = tmpAssertions[i].assertion;

                    array.push({ label: label, slot: slot.toLowerCase().replace(' ', '-') });
                }
                return array;
            },
            currentSlot: function() {
                return this.$refs.wizard.getAttribute('slot');
                console.log(this.$refs.wizard.getAttribute('slot'));
            },
            currentAssertion: function() {
                return this.$refs.assertion.getAttribute('id').toLowerCase().replace(' ', '-');
                console.log(this.$refs.assertion.getAttribute('id').toLowerCase().replace(' ', '-'));
            }
        },
        methods: {
            nextClicked(currentPage) {
                console.log('next clicked', currentPage)
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
        }
    };
</script>