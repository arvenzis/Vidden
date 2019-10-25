<template>
    <div class="container dashboard-container">
        <router-link to="/" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar dashboard</router-link>
        <div class="card">
            <h1 class="mb3">Competentie: {{ this.group }} - {{ this.category }}</h1>
            </div>
        <div class="mt-5 mb-5" v-for="item in assertions" v-bind:key="item.assertion">
            <vue-good-wizard
                    :steps="steps"
                    :nextStepLabel="nextStepLabel"
                    :previousStepLabel="previousStepLabel"
                    :finalStepLabel="finalStepLabel"
                    :onNext="nextClicked"
                    :onBack="backClicked">
                <div v-bind:slot="item.assertion">
                    <h2 class="mb-3">{{ item.assertion }}</h2>
                    <small class="text-muted">
                        <span v-for="keywords in item.children" v-bind:key="keywords" class="keyword">{{ keywords }}</span>
                    </small>
                    <h3>{{ item.question }}</h3>
                    <div class="form-group" v-for="option in item.answer" v-bind:key="option.result">
                        <input type="radio" v-bind:name="option.grade" v-bind:id="option.grade" v-model="mark" class="form-check-input" />
                        <label class="form-check-label" v-bind:for="option.grade">
                            {{ option.description }}
                        </label>
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
        created () {
            const ENDPOINTS = 'Assessment/' + this.id;
            axios.get(this.$store.state.apiBaseUrl + ENDPOINTS, { headers: {"Authorization" : this.$session.get('jwt')} })
                .then(response => {
                    this.assessment = response.data;
                    console.log(this.assessment);
                });
        },
        data () {
            return {
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
                            grade: 'Excellent',
                            result: 9,
                            description: 'Werkt volgens geplande stappen naar een mijlpaal, verwerkt nieuwe inzichten; blijft beheeraanpak valideren.'
                        },
                        good: {
                            grade: 'Good',
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
                            grade: 'Excellent',
                            result: 9,
                            description: 'Reageert en anticipeert uit zichzelf op knelpunten en meevallers en vangt onverwachte situaties op.'
                        },
                        good: {
                            grade: 'Good',
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
                            grade: 'Excellent',
                            result: 9,
                            description: 'Verzamelt alternatieven, onderzoekt de impact, maakt onderbouwde keuzes; blijft gekozen routes en kaders valideren.'
                        },
                        good: {
                            grade: 'Good',
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
                previousStepLabel: 'Previous',
                nextStepLabel: 'Next',
                finalStepLabel: 'Confirm',
            }
        },
        computed: {
            steps: function() {
                let array = [];
                let tmpAssertions = this.assertions;
                
                for(var i = 0; i < tmpAssertions.length; i++) {
                    array.push({ label: tmpAssertions[i].assertion, slot: tmpAssertions[i].assertion });
                }

                return array;

                console.log(array);
            }
        },
        methods: {
            nextClicked(currentPage) {
                // validateStep()
            },
            getTemplateGroups() {
                //
            },
            validateStep() {
                //
            }
        },
        components: {
            ModelSelect,
            'vue-good-wizard': GoodWizard,
        }
    };
</script>
<style>
.keyword + .keyword:before {
  content: ", ";
}
</style>