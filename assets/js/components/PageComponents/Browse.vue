<template>
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

    <tabs :onSelect="showTab">
      
      <tab title="Alle beoordelingen">
        <div id="assessment-listAll" v-if="showAll">
          <p class="mt-3">Pagina: {{ pageAll }} van {{ totalPagesAll }}</p>
          <div class="card" v-for="item in itemsCurrentPageAll" v-bind:key="item.id">
            <div class="card-body">
              <h5 class="card-title">
                Beoordeling
                <span v-for="student in item.student" v-bind:key="student.account">{{ student.naam }}
                  ({{ student.account }})</span>
              </h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ item.code }}</h6>
              <router-link :to="'/summary/' + item.id">
                <button class="btn btn-info">Open beoordeling</button>
              </router-link>
            </div>
            <div class="card-footer">
              <small class="text-muted">
                Laatst bijgewerkt: {{ item.date_last_modified }} door
                <span v-for="examinator in item.examinator" v-bind:key="examinator.account">{{ examinator.naam }}
                  ({{ examinator.account }})</span>
              </small>
            </div>
          </div>
        </div>
        <paginate v-model="pageAll" :page-count="totalPagesAll" :page-range="3" :margin-pages="2"
          :prev-text="'&lsaquo;'" :next-text="'&rsaquo;'" :container-class="'pagination'" :page-class="'page-item'"
          :first-last-button="true" :first-button-text="'&laquo;'" :last-button-text="'&raquo;'">
        </paginate>
      </tab>
      
      <tab title="Mijn beoordelingen">
        <div id="assessment-listAll" v-if="!showAll">
          <p class="mt-3">Pagina: {{ pageAccount }} van {{ totalPagesAccount }}</p>
          <div id="assessment-listAll">
            <div class="card" v-for="item in itemsCurrentPageAccount" v-bind:key="item.id">
              <div class="card-body">
                <h5 class="card-title">
                  Beoordeling
                  <span v-for="student in item.student" v-bind:key="student.account">{{ student.naam }}
                    ({{ student.account }})</span>
                </h5>
                <h6 class="card-subtitle mb-2 text-muted">{{ item.code }}</h6>
                <router-link :to="'/summary/' + item.id">
                  <button class="btn btn-info">Open beoordeling</button>
                </router-link>
              </div>
              <div class="card-footer">
                <small class="text-muted">
                  Laatst bijgewerkt: {{ item.date_last_modified }} door
                  <span v-for="examinator in item.examinator" v-bind:key="examinator.account">{{ examinator.naam }}
                    ({{ examinator.account }})</span>
                </small>
              </div>
            </div>
          </div>
        </div>
        <paginate v-model="pageAccount" :page-count="totalPagesAccount" :page-range="3" :margin-pages="2"
          :prev-text="'&lsaquo;'" :next-text="'&rsaquo;'" :container-class="'pagination'" :page-class="'page-item'"
          :first-last-button="true" :first-button-text="'&laquo;'" :last-button-text="'&raquo;'">
        </paginate>
      </tab>
    </tabs>
  </div>

</template>

<script>
  import Vue from 'vue'
  import axios from "axios";
  import { Tabs, Tab } from 'vue-slim-tabs'
  import Paginate from 'vuejs-paginate'

  Vue.component('paginate', Paginate)

  export default {
    name: "browse",
    data() {
      return {
        //algemeen
        perPage: 3,
        showAll: true,

        // voor lijst met alle beoordelingen
        pageAll: 1,
        itemsAll: [],
        totalPagesAll: 0,
        itemsCurrentPageAll: [],

        // voor lijst met beoordelingen deze docent
        pageAccount: 1,
        itemsAccount: [],
        totalPagesAccount: 0,
        itemsCurrentPageAccount: [],  
      };
    },
    methods: {
      showTab: function (e, index) {
        if (index == 0) {
          this.showAll = true
        } else {
          this.showAll = false
        }
      },
      //totaal aantal pagina's per lijst
      getNumberOfPages: function (items) {
        var numberItems = items.length;
        var pages = (numberItems - (numberItems % this.perPage)) / this.perPage
        if (numberItems % this.perPage > 0) {
          pages++;
        }
        return pages;
      },
      //alle items van één pagina
      getPageItems: function (items, page) {
        const arr = []
        for (var j = (page - 1) * this.perPage; j < this.perPage * page && j < items.length; j++) {
            arr.push(items[j])
        }
        return arr;    
      },
      //alle items van de account-lijst
      getItemsAccount: function (items) {
        var accountLoggedIn = (this.$store.state.accountNumber)
        var allAccountItems = []
        for (var i = 0; i < items.length; i++) {
          if (accountLoggedIn == items[i].examinator[0].account) {
            allAccountItems.push(items[i])
          }
          else {
            //niet alle beoordelingen hebben een tweede examinator
            try {
              if (typeof items[i].examinator[1].account != undefined) {
                if (accountLoggedIn == items[i].examinator[1].account) {
                  allAccountItems.push(items[i])
                }
              }
            }
            catch (e) { /* ignore */ }
          }
        }
        return allAccountItems
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
            var items = []
            for (var x in response.data) {
              var createdAt = new Date(response.data[x].assessmentDate);
              var updatedAt = new Date(response.data[x].assessmentDate);
              items.push({
                id: response.data[x].id,
                status: response.data[x].status,
                code: response.data[x].oeCode,
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
            this.itemsAll = items
            this.totalPagesAll = this.getNumberOfPages(items)
            this.itemsCurrentPageAll = this.getPageItems(items, this.pageAll)
            this.itemsAccount = this.getItemsAccount(items)
            this.totalPagesAccount = this.getNumberOfPages(this.itemsAccount)
            this.itemsCurrentPageAccount = this.getPageItems(this.itemsAccount, this.pageAccount)
          });
        
      }
    },
    components: {
      Tabs,
      Tab,
    },
    watch: {
      pageAll: function () {
        this.itemsCurrentPageAll = this.getPageItems(this.itemsAll, this.pageAll)
      },
      pageAccount: function () {
        this.itemsAccount = this.getItemsAccount(this.itemsAll)
        this.totalPagesAccount = this.getNumberOfPages(this.itemsAccount)
        this.itemsCurrentPageAccount = this.getPageItems(this.itemsAccount, this.pageAccount)
      },
    },
    mounted: function () {
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