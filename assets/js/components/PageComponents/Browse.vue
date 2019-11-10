<template id="browse">
  <div class="container dashboard-container">
    <div class="row">
      <div class="col-6">
        <router-link to="/">
          <i class="fa fa-arrow-left"></i> Terug naar dashboard
        </router-link>
      </div>
      
    </div>

    <tabs>
      <tab title="Alle beoordelingen">
        </tab>
      <tab title="Mijn beoordelingen">
        </tab>
    </tabs>
    
    <b-pagination v-model="currentPage"
                  :total-rows="rows"
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
</template>

<script>
  import Vue from 'vue'
  import axios from "axios";
  import { BPagination, BTable } from 'bootstrap-vue'
  import { Tabs, Tab } from 'vue-slim-tabs'

  Vue.component('b-pagination', BPagination)

  export default {
    name: "browse",
    data() {
      return {
        perPage: 3,
        currentPage: 1,

        // algemeen
        navigationToggle: true,
        perPage: 1,

        // voor lijst met alle beoordelingen
        currentPageAll: 1,
        rowsAll: null,
        itemsAll: [{
          id: 1,
          status: "Draft",
          vak: "Afstuderen",
          code: "ICT.AFSTSE.V19",
          student: [{ account: "S1019744", naam: "Bernard Bos" }],
          date_created: "09-10-2019 22:12",
          date_last_modified: "09-10-2019 22:16",
          examinator: [{ account: "BV0111997", naam: "Eugen van Roden" }]
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
        },
        {
          id: 3,
          status: "Draft",
          vak: "Afstuderen",
          code: "ICT.AFSTSE.V19",
          student: [{ account: "S1019744", naam: "Bernard Bos" }],
          date_created: "09-10-2019 22:12",
          date_last_modified: "09-10-2019 22:16",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 4,
          status: "Draft",
          vak: "Stage",
          code: "ICT.STAGE.V19",
          student: [{ account: "S1120990", naam: "Karen Bosch" }],
          date_created: "06-10-2019 08:13",
          date_last_modified: "06-10-2019 08:18",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 5,
          status: "Draft",
          vak: "Afstuderen",
          code: "ICT.AFSTSE.V19",
          student: [{ account: "S1019744", naam: "Bernard Bos" }],
          date_created: "09-10-2019 22:12",
          date_last_modified: "09-10-2019 22:16",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 6,
          status: "Draft",
          vak: "Stage",
          code: "ICT.STAGE.V19",
          student: [{ account: "S1120990", naam: "Karen Bosch" }],
          date_created: "06-10-2019 08:13",
          date_last_modified: "06-10-2019 08:18",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 7,
          status: "Draft",
          vak: "Afstuderen",
          code: "ICT.AFSTSE.V19",
          student: [{ account: "S1019744", naam: "Bernard Bos" }],
          date_created: "09-10-2019 22:12",
          date_last_modified: "09-10-2019 22:16",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 8,
          status: "Draft",
          vak: "Stage",
          code: "ICT.STAGE.V19",
          student: [{ account: "S1120990", naam: "Karen Bosch" }],
          date_created: "06-10-2019 08:13",
          date_last_modified: "06-10-2019 08:18",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 9,
          status: "Draft",
          vak: "Afstuderen",
          code: "ICT.AFSTSE.V19",
          student: [{ account: "S1019744", naam: "Bernard Bos" }],
          date_created: "09-10-2019 22:12",
          date_last_modified: "09-10-2019 22:16",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 10,
          status: "Draft",
          vak: "Stage",
          code: "ICT.STAGE.V19",
          student: [{ account: "S1120990", naam: "Karen Bosch" }],
          date_created: "06-10-2019 08:13",
          date_last_modified: "06-10-2019 08:18",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 11,
          status: "Draft",
          vak: "Afstuderen",
          code: "ICT.AFSTSE.V19",
          student: [{ account: "S1019744", naam: "Bernard Bos" }],
          date_created: "09-10-2019 22:12",
          date_last_modified: "09-10-2019 22:16",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 12,
          status: "Draft",
          vak: "Stage",
          code: "ICT.STAGE.V19",
          student: [{ account: "S1120990", naam: "Karen Bosch" }],
          date_created: "06-10-2019 08:13",
          date_last_modified: "06-10-2019 08:18",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 13,
          status: "Draft",
          vak: "Afstuderen",
          code: "ICT.AFSTSE.V19",
          student: [{ account: "S1019744", naam: "Bernard Bos" }],
          date_created: "09-10-2019 22:12",
          date_last_modified: "09-10-2019 22:16",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 14,
          status: "Draft",
          vak: "Stage",
          code: "ICT.STAGE.V19",
          student: [{ account: "S1120990", naam: "Karen Bosch" }],
          date_created: "06-10-2019 08:13",
          date_last_modified: "06-10-2019 08:18",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 15,
          status: "Draft",
          vak: "Afstuderen",
          code: "ICT.AFSTSE.V19",
          student: [{ account: "S1019744", naam: "Bernard Bos" }],
          date_created: "09-10-2019 22:12",
          date_last_modified: "09-10-2019 22:16",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        },
        {
          id: 16,
          status: "Draft",
          vak: "Stage",
          code: "ICT.STAGE.V19",
          student: [{ account: "S1120990", naam: "Karen Bosch" }],
          date_created: "06-10-2019 08:13",
          date_last_modified: "06-10-2019 08:18",
          examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
        }],

         //voor lijst met beoordelingen van beoordelaar met ingelogde account
        currentPageAccount: 1,
        rowsAccount: 6,
        itemsAccount: [],
      };
    },
    methods: {
      onComplete: function () {
        alert('Yay. Done!');
      },
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
        this.rowsAll = this.itemsAll.length;
      }
    },
    components: {
      
      Tabs,
      Tab,
      'b-table': BTable
    },
    computed: {
      rows() {
        return this.itemsAll.length
      },
      currentpage: {
        get: function () {
          alert("get currentpage");
          if (this.navigationToggle) {
            return this.currentPageAll
          } else {
            return this.currentPageAccount
          }
        },
        set: function (newValue) {
          alert("set currentpage")
          if (this.navigationToggle) {
            this.currentPageAll = newValue
          } else {
            this.currentPageAccount = newValue
          }
        }
      },
      assessmentlist: function () {
        alert("assessmentlist");
        if (this.navigationToggle) {
          return this.itemsAll
        } else {
          return this.itemsAccount
        }
      },
      perpage: function () {
        alert("perpage")
        return this.perPage
      },
      rowsx: function () {
        if (this.navigationToggle) {
          return this.rowsAll
        } else {
          return this.rowsAccount
        }
      },
      currentpagex: {
        get: function () {
          if (this.navigationToggle) {
            return this.currentPageAll
          } else {
            return this.currentPageAccount
          }
        },
        set: function (newValue) {
          if (this.navigationToggle) {
            this.currentPageAll = newValue
          } else {
            this.currentPageAccount = newValue
          }
        }
      },
      assessmentlistx: function () {
        alert("assessmentlistx")
        if (this.navigationToggle) {
          return this.itemsAll
        } else {
          return this.itemsAccount
        }
      },
      perpagex: function () {
        return this.perPage
      },
      currentTabComponent: function () {
        return 'b-pagination'
      },
      nextTabComponent: function () {
        return 'b-pagination'
      }
    },
    created: function () {
      this.getAssessments();
    }
  };
</script>
