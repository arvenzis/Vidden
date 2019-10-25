<template>
    <div class="container dashboard-container">
        <div class="row">
            <div class="col-4">
                <router-link to="/">
                    <i class="fa fa-arrow-left"></i> Terug naar dashboard
                </router-link>
            </div>
            <div class="col-8">
                <h2>Blader door beoordelingen</h2>
            </div>
        </div>
        <!--
        <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    -->
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-info">Alle beoordelingen</button>
            <button type="button" class="btn btn-info active">Mijn beoordelingen</button>
        </div>
        
        <div id="assessment-list">
            <div class="card" v-for="item in items" v-bind:key="item.id">
                <div class="card-body">
                    <h5 class="card-title">
                        Beoordeling {{ item.vak }}
                        <span v-for="student in item.student"
                              v-bind:key="student.account">{{ student.naam }}({{student.account}})</span>
                    </h5>
                    <h6 class="card-subtitle mb-2 text-muted">{{ item.code }}</h6>
                    <a href="#" class="btn btn-info">Open beoordeling</a>
                </div>
                <div class="card-footer">
                    <small class="text-muted">
                        Laatst bijgewerkt: {{ item.date_last_modified }} door
                        <span v-for="examinator in item.examinator"
                              v-bind:key="examinator.account">{{ examinator.naam }}({{examinator.account}})</span>
                    </small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "browse",
        data() {
            return {
                items: [
                    {
                        id: 1,
                        status: "Draft",
                        vak: "Afstuderen",
                        code: "ICT.AFSTSE.V19",
                        student: [{ account: "S1019744", naam: "Bernard Bos" }],
                        date_created: "09-10-2019 22:12",
                        date_last_modified: "09-10-2019 22:16",
                        examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
                    },
                    {
                        id: 2,
                        status: "Draft",
                        vak: "Stage",
                        code: "ICT.STAGE.V19",
                        student: [{ account: "S1120990", naam: "Karen Bosch" }],
                        date_created: "06-10-2019 08:13",
                        date_last_modified: "06-10-2019 08:18",
                        examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
                    }
                ]
            };
        },
        methods: {
            getAssessments: function () {
                const ENDPOINTS = 'Assessment/GetAssessments/';                
                axios.get(this.$store.state.apiBaseUrl + ENDPOINTS, {
                    headers: {
                        Authorization: this.$session.get("jwt")
                    }
                }
                ).then((response) => {
                    for (var x in response.data) {
                        var createdAt = new Date(response.data[x].createdAt);
                        var updatedAt = new Date(response.data[x].updatedAt);
                        this.items.push(
                            {
                                id: response.data[x].id,
                                status: "onbekend",
                                vak: "onbekend",
                                code: response.data[x].OeCode,
                                student: [{ account: response.data[x].student.accountNumber, naam: response.data[x].student.fullName }],
                                date_created: createdAt.toLocaleString().slice(0, -3),
                                date_last_modified: updatedAt.toLocaleString().slice(0, -3),
                                examinator: [{ account: response.data[x].firstTeacher.accountNumber, naam: response.data[x].firstTeacher.fullName }]
                            });
                    }
                    const allAssessments = response.data;
                })
            }
        },
        created: function () {
            this.getAssessments();
        }
    };
</script>

<style scoped>
.card {
  border-radius: none;
  margin: 15px 0px;
}
</style>