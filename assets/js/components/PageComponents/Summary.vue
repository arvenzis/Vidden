<template>
  <div class="container dashboard-container">
    <flash-message class="flashpool"></flash-message>
    <div class="path"><router-link to="/browse" class="ml-2">Bladeren</router-link> &gt; Samenvatting beoordeling</div>
    <article class="mt-5 mb-5">
      <spinner id="spinner" v-if="loading"></spinner>
      <div v-else v-for="item in this.items" :key="item.id">
        <h3 class="mt-3">Beoordeling {{ item.oeCode }} voor
          <span v-for="student in item.student" v-bind:key="student.account">{{ student.name }}
            ({{ student.account }})</span>
        </h3>
        <table class="table">
          <tr>
            <td>Vak</td>
            <td>{{ item.oeCode }}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{{ item.status }}</td>
          </tr>
          <!-- <tr>
            <td>Template</td>
            <td>{{ item.templateName }}</td>
          </tr> -->
          <tr>
            <td>Resultaat</td>
            <td>
              <span v-if="item.finalmark == 0">
                Nog geen eindresultaat berekend
              </span>
              <span v-else>
                {{ item.finalMark }}
              </span>
            </td>
          </tr>
        </table>

        <section>
          <div class="row justify-content-center">
            <div class="card col-12 col-md-5" v-for="assessment in item.assessments" :key="assessment.id">
              <div class="card-body" v-for="examinator in assessment.examinator" :key="examinator.account">
                <span v-if="examinator.id != null">
                  <h5 class="card-title mb-3">Formulier door {{ examinator.name }} ({{ examinator.account }})</h5>
                  <router-link :to="'/edit/' + item.id + '/' + examinator.id ">
                    <button class="btn btn-windesheim">Open formulier</button>
                  </router-link>
                  <div class="badge badge-pill badge-secondary">{{ assessment.status }}</div>   
                </span>
                <span v-else>
                  <h5 class="card-title mb-3">Nog geen tweede formulier ingevuld</h5>
                  <router-link :to="'/edit/' + item.id + '/' + currentUserId ">
                    <button class="btn btn-windesheim">Start een nieuw formulier</button>
                  </router-link>
                </span>
              </div>              
            </div>
          </div>
        </section>
      </div>
    </article>
  </div>
</template>

<script>
  import Vue from "vue";
  import axios from 'axios';
  import Spinner from "vue-simple-spinner";
  import Toasted from 'vue-toasted';

  Vue.use(Toasted)

  export default {
    name: 'edit',
    data () {
      return {
        id: this.$route.params.id,
        items: [],
        currentUserId: this.$store.state.currentUserId,
        loading: false
      }
    },
    methods: {
      // Zoekt status eerste assessment van betreffende teacher
      // Geen invullingen: return 0/New 
      getAssessmentStatus(assessments, teacherId) {
        if (assessments.length == 0) { return 0 }
        var p = assessments.find(assessment => assessment.createdById == teacherId)
        if (p == null) { return 0 }
        return p.status
      }
    },
    created() {
      this.loading = true;
      const ENDPOINTS = 'Assessment/' + this.id;
      axios.get(this.$store.state.apiBaseUrl + ENDPOINTS, {
        headers: {
          "Authorization": this.$session.get('jwt')
        }
      })
        .then(response => {          
          let tmpItems = [];
          tmpItems.push({
            id: response.data.id,
            templateId: response.data.templateId,
            templateName: response.data.name,
            status: this.$parent.getStatusText(response.data.status),
            oeCode: response.data.oeCode,
            finalmark: response.data.finalMark,
            student: [{
              id: response.data.studentId,
              account: response.data.student.accountNumber,
              name: response.data.student.fullName
            }],
            assessments: [
              {
                id: response.data.firstTeacherId,
                examinator: [{
                  id: response.data.firstTeacherId,
                  account: response.data.firstTeacher.accountNumber,
                  name: response.data.firstTeacher.fullName
                }],
                status: this.$parent.getStatusText(this.getAssessmentStatus(response.data.assesments, response.data.firstTeacherId))
              },
              {
                id: (response.data.secondTeacherId != null ? response.data.secondTeacherId : null),
                examinator: [{
                  id: (response.data.secondTeacherId != null ? response.data.secondTeacherId : null),
                  account: (response.data.secondTeacher != null ? response.data.secondTeacher.accountNumber : null),
                  name: (response.data.secondTeacher != null ? response.data.secondTeacher.fullName : null)
                }],
                status: this.$parent.getStatusText(this.getAssessmentStatus(response.data.assesments, response.data.secondTeacherId))
              }
            ],
            assessmentDate: response.data.assessmentDate,
            startDatePeriod: response.data.startDatePeriod,
            endDatePeriod: response.data.endDatePeriod
          });

          this.items = tmpItems;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;

          Vue.toasted.show('Er was een probleem met het laden van de gegevens. Herlaad de pagina om het opnieuw te proberen.', {
            type: 'error',
            duration: 2000
          });
        });
    },
    components: {
      Spinner
    }
  };
</script>
