<template id="browse">
  <div class="container dashboard-container">
    <div class="row">
      <div class="col-6">
        <router-link to="/">
          <i class="fa fa-arrow-left"></i> Terug naar dashboard
        </router-link>
      </div>
      <div class="col-6">
        <h2>Bladeren</h2>
      </div>
    </div>

    <!--De title die ik aan b-tab hieronder meegeef wordt niet gerenderd in html, als ik dezelfde code in codepen/fiddle probeer lukt het wel. Weet jij waarom?-->
    <!--Er verschijnen 10 vue-errors bij het laden van deze pagina:-->
    <!--5 x [Vue warn]: $attrs is readonly-->
    <!--5 x [Vue warn]: $listeners is readonly-->
    <!--Deze verschijnen paarsgewijs bij 1 x b-tabs, 3 x b-tab en 1 x b-pagination: weet jij hoe dit te voorkomen is?-->
    <!--Er verschijnt nog een 11e vue-error bij totalRows: weet jij hoe ik dit kan oplossen?-->
    <!--Er verschijnt nog een 12e vue-error als je van pagina wisselt: value (wat verwijst naar currentPageAll). Weet jij hoe ik dit zou kunnen oplossen?-->
    <div>
      <b-card no-body>
        <b-tabs pills card>
          <b-tab title="Tab 1" active><b-card-text>Tab Contents 1</b-card-text></b-tab>
          <b-tab title="Tab 2"><b-card-text>Tab Contents 2</b-card-text></b-tab>
          <b-tab title="Tab 3"><b-card-text>Tab Contents 3</b-card-text></b-tab>
        </b-tabs>
      </b-card>
    </div>

    <div v-if="navigationToggle">
      <b-pagination v-model="currentPageAll"
                    :total-rows="rowsAll"
                    :per-page="perPage"
                    aria-controls="assessment-listAll"></b-pagination>

      <p class="mt-3">Current Page: {{ currentPageAll }}</p>

      <div id="assessment-listAll">
        <div class="card" v-for="item in itemsAll" v-bind:key="item.id">
          <div class="card-body">
            <h5 class="card-title">
              Beoordeling {{ item.vak }}
              <span v-for="student in item.student"
                    v-bind:key="student.account">{{ student.naam }}({{ student.account }})</span>
            </h5>
            <h6 class="card-subtitle mb-2 text-muted">{{ item.code }}</h6>
            <a href="#" class="btn btn-info">Open beoordeling</a>
          </div>
          <div class="card-footer">
            <small class="text-muted">
              Laatst bijgewerkt: {{ item.date_last_modified }} door
              <span v-for="examinator in item.examinator"
                    v-bind:key="examinator.account">{{ examinator.naam }}({{ examinator.account }})</span>
            </small>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!navigationToggle">
      <b-pagination v-model="currentPageAccount"
                    :total-rows="rowsAccount"
                    :per-page="perPage"
                    aria-controls="assessment-listAccount"></b-pagination>

      <p class="mt-3">Current Page: {{ currentPageAccount }}</p>

      <div id="assessment-listAccount">
        <div class="card" v-for="item in itemsAccount" v-bind:key="item.id">
          <div class="card-body">
            <h5 class="card-title">
              Beoordeling {{ item.vak }}
              <span v-for="student in item.student"
                    v-bind:key="student.account">{{ student.naam }}({{ student.account }})</span>
            </h5>
            <h6 class="card-subtitle mb-2 text-muted">{{ item.code }}</h6>
            <a href="#" class="btn btn-info">Open beoordeling</a>
          </div>
          <div class="card-footer">
            <small class="text-muted">
              Laatst bijgewerkt: {{ item.date_last_modified }} door
              <span v-for="examinator in item.examinator"
                    v-bind:key="examinator.account">{{ examinator.naam }}({{ examinator.account }})</span>
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import { BTabs, BTab, BCard, BCardText, BPagination } from 'bootstrap-vue'

  export default {
    name: "browse",
    data() {
      return {
        // algemeen
        navigationToggle: true,
        perPage: 1,

        // voor lijst met alle beoordelingen
        currentPageAll: 1,
        rowsAll: null,
        itemsAll: [],  

        // voor lijst met beoordelingen van beoordelaar met ingelogde account
        currentPageAccount: 1,
        rowsAccount: null,
        itemsAccount: [],
      };
    },
    methods: {      
      getAssessments: function () {
        const ENDPOINTS = "Assessment/GetAssessments/";
        axios
          .get(this.$store.state.apiBaseUrl + ENDPOINTS, {
            headers: {
              Authorization: this.$session.get("jwt")
            }
          })
          .then(response => {
            this.itemsAll = [];
            for (var x in response.data) {
              var createdAt = new Date(response.data[x].createdAt);
              var updatedAt = new Date(response.data[x].updatedAt);
              if (
                this.$store.state.accountNumber ==
                response.data[x].firstTeacher.accountNumber
              ) {
                this.itemsAll.push({
                  id: response.data[x].id,
                  status: "onbekend",
                  vak: "onbekend",
                  code: response.data[x].OeCode,
                  student: [
                    {
                      account: response.data[x].student.accountNumber,
                      naam: response.data[x].student.fullName
                    }
                  ],
                  date_created: createdAt.toLocaleString().slice(0, -3),
                  date_last_modified: updatedAt.toLocaleString().slice(0, -3),
                  examinator: [
                    {
                      account: response.data[x].firstTeacher.accountNumber,
                      naam: response.data[x].firstTeacher.fullName
                    }
                  ]
                });
              }
            }
            this.rowsAll = this.itemsAll.length;
          });
      }
    },
    components: {
      'b-tabs': BTabs,
      'b-tab': BTab,
      'b-card': BCard,
      'b-card-text': BCardText,
      'b-pagination': BPagination
    },
    created: function () {
      this.getAssessments();
    }
  };
</script>
