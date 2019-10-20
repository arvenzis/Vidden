<template>
    <div class="container dashboard-container">
        <router-link to="/" class="ml-2"><i class="fa fa-arrow-left"></i> Terug naar dashboard</router-link>
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
                        <select class="form-control" v-bind="getTemplateType()">
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
                    <strong>Karen Bosch (S1120990)</strong><br>
                    <span>1 Sept. 2019 - 2 Feb. 2020</span><br><br>

                    <strong>Stage/afstudeerbedrijf</strong><br>
                    <span>Windesheim</span><br>
                    <span>Campus 2, 8017 CA Zwolle</span><br>
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
            }
        },
        methods: {
            nextClicked(currentPage) {
                if (currentPage === 0) {
                    return this.validateStepOne();
                }
                else if (currentPage === 1) {
                    return this.validateStepTwo();
                }
            },
            backClicked(currentPage) {
                return true;
            },
            getTemplateType() {
                // const Url = 'https://vidden-api.azurewebsites.net/api/template/';
                // axios.get(Url).then((response) => {
                //     console.log(response);
                // });
            },
            validateStepOne() {
                if (this.student.text === "") {
                    window.alert("Je hebt geen student ingevuld.");
                    return false;
                }

                return true;
            },
            validateStepTwo() {
                if (this.startDate === "" || this.endDate === "" || this.company === "" || this.address === "") {
                    window.alert("Niet alle gegevens zijn ingevuld.");
                    return false;
                }

                if (new Date(this.startDate) > new Date(this.endDate)) {
                    window.alert("De begindatum mag niet na de einddatum liggen.");
                    return false;
                }

                return true;
            },
        },
        components: {
            ModelSelect,
            'vue-good-wizard': GoodWizard,
        }
    };
</script>