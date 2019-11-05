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

    <div class="btn-group" role="group">
      <button
        type="button"
        v-on:click="showAll = true"
        v-bind:class="{ 'btn btn-info active': showAll, 'btn btn-info': !showAll }"
      >Alle beoordelingen</button>
      <!--btn btn-info in class zetten, active kan apart in deze v-bind-->
      <button
        type="button"
        v-on:click="showAll = false"
        v-bind:class="{ 'btn btn-info active': !showAll, 'btn btn-info': showAll }"
      >Mijn beoordelingen</button>
    </div>

    <paginate
      :page-count="20"
      :page-range="3"
      :margin-pages="2"
      :click-handler="clickCallback"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    ></paginate>

    <div class="container" v-if="pages.length>1">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" @click="page=1" href="#">First</a>
        </li>
        <!-- << hieronder vervangen -->
        <li class="page-item">
          <a class="page-link" @click="page>1 ? page-- : page=page " href="#"><<</a>
        </li>
        <!-- page>1 vervangen door page > 1 -->
        <!-- hier wat comment toevoegen over hoe getFirstNavigationButton werkt -->
        <li
          v-bind:class="{ 'page-item active': page==pageNumber, 'page-item': page!=pageNumber }"
          @click="page=pageNumber"
          v-for="pageNumber in pages.slice( getFirstNavigationButton(), getFirstNavigationButton() + 3 )"
        >
          <a class="page-link" href="#">{{pageNumber}}</a>
        </li>
        <li class="page-item">
          <a class="page-link" @click="page<pages.length ? page++ : page=page" href="#">>></a>
        </li>
        <li class="page-item">
          <a class="page-link" @click="page=pages.length" href="#">Last</a>
        </li>
      </ul>
    </div>
    <!-- spul hieronder wat tussen dubbele {} staat in computed zetten -->
    <div
      v-if="items.length>0"
    >Items {{ (page-1)*perPage + 1 }} t/m {{ (page-1)*perPage + currentPageItems.length }} van {{ items.length }}</div>

    <div id="assessment-list">
      <div class="card" v-for="item in currentPageItems" v-bind:key="item.id">
        <div class="card-body">
          <h5 class="card-title">
            Beoordeling {{ item.vak }}
            <span
              v-for="student in item.student"
              v-bind:key="student.account"
            >{{ student.naam }}({{student.account}})</span>
          </h5>
          <h6 class="card-subtitle mb-2 text-muted">{{ item.code }}</h6>
          <a href="#" class="btn btn-info">Open beoordeling</a>
        </div>
        <div class="card-footer">
          <small class="text-muted">
            Laatst bijgewerkt: {{ item.date_last_modified }} door
            <span
              v-for="examinator in item.examinator"
              v-bind:key="examinator.account"
            >{{ examinator.naam }}({{examinator.account}})</span>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css">
.pagination {
}
.page-item {
}
</style>

<script>
    import Vue from 'vue'
import axios from "axios";
import Paginate from 'vuejs-paginate'

Vue.component("paginate", Paginate);

export default {
  name: "browse",
  data() {
    return {
      showAll: true,
      posts: [""] /*<!-- weghalen want niet gebruikt -->*/,
      page: 1,
      perPage: 5,
      pages: [],
      items: [],
      currentPageItems: []
    };
  },
  methods: {
    clickCallback: function(pageNum) {
      console.log(pageNum);
    },
    getAssessments: function() {
      const ENDPOINTS = "Assessment/GetAssessments/";
      axios
        .get(this.$store.state.apiBaseUrl + ENDPOINTS, {
          headers: {
            Authorization: this.$session.get("jwt")
          }
        })
        .then(response => {
          this.items = [];
          for (var x in response.data) {
            var createdAt = new Date(response.data[x].createdAt);
            var updatedAt = new Date(response.data[x].updatedAt);
            // api wordt onnodig vaak aangeroepen
            if (
              this.showAll ||
              this.$store.state.accountNumber ==
                response.data[x].firstTeacher.accountNumber
            ) {
              this.items.push({
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
          this.setPages();
        });
    },
    setPages() {
      this.pages = [];
      let numberOfPages = Math.ceil(this.items.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
      this.paginate();
    },
    paginate() {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      this.currentPageItems = this.items.slice(from, to);
    },
    getFirstNavigationButton() {
      if (this.pages.length > 2) {
        if (this.page == 1) {
          return 0;
        } else if (this.page == this.pages.length) {
          return this.page - 3;
        } else {
          return this.page - 2;
        }
      } else if (this.pages.length == 2) {
        return 0;
      }
    }
  },
  components: {
    'paginate': Paginate,
  },
  watch: {
    page: function() {
      this.paginate();
    },
    showAll: function() {
      this.page = 1;
      this.setPages();
      this.getAssessments();
    }
  },
  created: function() {
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