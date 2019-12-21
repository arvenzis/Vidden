<template>
  <div class="container dashboard-container">
    <flash-message class="flashpool"></flash-message>
    <div class="path"><router-link to="/browse" class="ml-2">{{ $t('common.browse') }}</router-link> &gt; {{ $t('common.summary') }}</div>
    <article class="mt-5 mb-5">
      <spinner id="spinner" v-if="loading"></spinner>
      <div v-else v-for="item in this.items" :key="item.id">
        <span v-for="student in item.student" v-bind:key="student.account">
          <h3 class="mt-3">{{ $t('summary.title', { oeCode: item.oeCode, user: student.name + ' (' + student.account + ')' }) }}</h3>  
        </span>
        <table class="table">
          <tr>
            <td>{{ $t('summary.course') }}</td>
            <td>{{ item.oeCode }}</td>
          </tr>
          <tr>
            <td>{{ $t('summary.status') }}</td>
            <td>{{ $t('status.' + item.status) }}</td>
          </tr>
          <tr>
            <td>{{ $t('summary.template') }}</td>
            <td>{{ item.templateName }}</td>
          </tr>
          <tr>
            <td>{{ $t('summary.result') }}</td>
            <td>
              <span v-if="item.finalmark == 0">
                {{ $t('summary.no_final_result') }}
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
                  <h5 class="card-title mb-3">{{ $t('summary.form_by', { user: examinator.name + ' (' + examinator.account + ')' }) }}</h5>
                  <div class="row">
                    <div class="col-6 col-md-4">
                      <router-link :to="'/edit/' + item.id + '/' + examinator.id ">
                        <button class="btn btn-windesheim" :disabled="assessment.status === 'final'">{{ $t('summary.open') }}</button>
                      </router-link>
                    </div>
                    <div class="col-6 col-md-5">
                      <router-link :to="'/finish/' + item.id + '/' + examinator.id ">
                        <button class="btn btn-windesheim" :disabled="assessment.status !== 'final'">{{ $t('summary.show_summary') }}</button>
                      </router-link>
                    </div>
                  </div>
                <div class="badge badge-pill badge" v-bind:class="assessment.status">{{ $t('status.' + assessment.status) }}</div>
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
            templateName: response.data.templateName,
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
          Vue.toasted.show(this.$t('success.loading'), {
            type: 'success',
            duration: 1000
          });

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;

          Vue.toasted.show(this.$t('error.loading'), {
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
