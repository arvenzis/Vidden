<template>
    <div class="container dashboard-container">
        <router-link to="/" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar dashboard</router-link>
        <!-- ToDo: check if we can use this -->
<!--        <div class="spinner-border" role="status">-->
<!--            <span class="sr-only">Loading...</span>-->
<!--        </div>-->
        <div class="mt-5 mb-5">
            <vue-good-wizard
                    :steps="steps"
                    :nextStepLabel="nextStepLabel"
                    :previousStepLabel="previousStepLabel"
                    :finalStepLabel="finalStepLabel"
                    :onNext="nextClicked"
                    :onBack="backClicked">
                <div slot="step-1">
                    <h2 class="mb-3">Nieuwe beoordeling</h2>
                    <div class="form-group">
                        <label>Soort beoordeling</label>
                        <select class="form-control">
                            <option value="Stage en afstuderen">Stage en afstuderen</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Student</label>
                        <model-select :options="options"
                                      v-model="student"
                                      placeholder="Selecteer een student">
                        </model-select>
                    </div>
                </div>
                <div slot="step-2">
                    <h2 class="mb-3">Details</h2>
                    <div class="form-group">
                        <label>Periode</label>
                        <div class="col-6">
                            <input type="date" name="start-date" class="form-control" />
                        </div>
                        <div class="col-6">
                            <input type="date" name="end-date" class="form-control" />
                        </div>
                    </div>
                    <strong>Stage/afstudeerbedrijf</strong>
                    <div class="form-group">
                        <label>Naam</label>
                        <input type="text" name="company" placeholder="IMPRES" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label>Adres</label>
                        <input type="text" name="address" placeholder="Dokter van Deenweg 162, 8025 BM Zwolle" class="form-control" />
                    </div>
                </div>
                <div slot="step-3">
                    <h2 class="mb-3">Overzicht</h2>

                </div>
            </vue-good-wizard>
        </div>
    </div>
</template>

<script>
    import { ModelSelect } from 'vue-search-select'
    import { GoodWizard } from 'vue-good-wizard';

    export default {
        name: 'new-assessment',
        data () {
            return {
                options: [ //ToDo: Dynamische invulling
                    { value: '1', text: 'Karen Bosch (S1120990)' },
                    { value: '2', text: 'Bernard Bos (S1111111)' },
                    { value: '3', text: 'Diederick Prins (S1111111)' },
                    { value: '4', text: 'Klaas Hakvoort (S1111111)' },
                    { value: '5', text: 'Joost Reijmer (S1111111)' },
                ],
                student: {
                    value: '',
                    text: ''
                },
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
            }
        },
        methods: {
            nextClicked(currentPage) {
                console.log('next clicked', currentPage);
                return true; //return false if you want to prevent moving to next page
            },
            backClicked(currentPage) {
                console.log('back clicked', currentPage);
                return true; //return false if you want to prevent moving to previous page
            }
        },
        components: {
            ModelSelect,
            'vue-good-wizard': GoodWizard,
        }
    };
</script>