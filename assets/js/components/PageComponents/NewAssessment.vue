<template>
    <div class="container dashboard-container">
        <div class="row">
            <div class="col-4">
                <router-link to="/"><i class="fa fa-arrow-left"></i> Terug naar dashboard</router-link>
            </div>
            <div class="col-8">
                <h2>Nieuwe beoordeling</h2>
            </div>
        </div>
        <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>
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
</template>

<script>
    import { ModelSelect } from 'vue-search-select'
    export default {
        name: 'new-assessment',
        data () {
            return {
                options: [ //ToDo: Dynamische invulling
                    { value: '1', text: 'Karen Bosch (S1120990)' },
                    { value: '2', text: 'Bernard Bos (S1111111)' },
                    { value: '3', text: 'Diederick Prins (S1111111)' },
                    { value: '4', text: 'Klaas Hakvoort (S1111111)' },
                    { value: '5', text: 'Joost Reijmer (S1111111)' }
                ],
                student: {
                    value: '',
                    text: ''
                },
            }
        },
        components: {
            ModelSelect
        }
    };
</script>