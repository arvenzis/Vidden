<template>
  <div class="container dashboard-container">
    <flash-message class="flashpool"/>
    <div class="path"><router-link to="/browse" class="ml-2">{{ $t('common.browse') }}</router-link> &gt; {{ $t('common.summary') }}</div>
    <article class="mt-5 mb-5">
      <spinner id="spinner" v-if="loading"/>
      <div v-else v-for="item in this.items" :key="item.id">
        <span v-for="student in item.student" v-bind:key="student.account">
          <h3 class="mt-3">{{ $t('summary.title', { oeCode: item.oeCode, user: student.name + ' (' + student.account + ')' }) }}</h3>  
        </span>
        <div class="row">
          <div class="col-sm-8 col-md-8 mt-3">
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
                  <span v-if="item.finalMark === 0">
                    {{ $t('summary.no_final_result') }}
                  </span>
                  <span v-else>
                    {{ item.finalMark }}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          <div class="col-sm-4 col-md-4" v-if="item.finalMark === 0 && item.definitive">
            <div class="card" :class="finalMarkDescription">
              <div class="card-body">
                <h6 class="card-heading">{{ $t('summary.computed_result') }}</h6>
                <h1 class="text-center"><input type="number" v-model.number="finalMark" step="0.0" class="finalMarkInput" :disabled="item.assessments[0].examinator[0].id !== currentUserId" /></h1>
                <button type="button" class="btn btn-light btn-block mt-1" @click="finalizeAssessmentMeta(finalMark)" :disabled="item.assessments[0].examinator[0].id !== currentUserId">{{ $t('summary.finalize_mark') }}</button>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div class="row justify-content-center">
            <div class="card col-12 col-md-5" v-for="assessment in item.assessments" :key="assessment.id">
              <div class="card-body" v-for="examinator in assessment.examinator" :key="examinator.account">
                  <h5 class="card-title mb-3">{{ $t('summary.form_by', { user: examinator.name + ' (' + examinator.account + ')' }) }}</h5>
                  <div class="row">
                    <div class="col-6 col-md-4">
                      <router-link :to="(assessment.status !== 'final') ? '/edit/' + item.id + '/' + examinator.id : '#' ">
                        <button class="btn btn-windesheim" :disabled="assessment.status === 'final'">{{ $t('summary.open') }}</button>
                      </router-link>
                    </div>
                    <div class="col-6 col-md-5">
                      <router-link :to="(assessment.status === 'final') ? '/finish/' + item.id + '/' + examinator.id : '#'">
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

  export default {
    name: 'edit',
    data () {
      return {
        id: this.$route.params.id,
        items: [],
        currentUserId: this.$store.state.currentUserId,
        finalMarkDescription: null,
        loading: false
      }
    },
    methods: {
      // Zoekt status eerste assessment van betreffende teacher
      // Geen invullingen: return 0/New 
      getAssessmentStatus(assessments, teacherId) {
        if (assessments.length === 0) { return 0 }
        let p = assessments.find(assessment => assessment.createdById === teacherId);
        if (p === undefined) { return 0 }
        return p.status
      },
      calculateAverageMark(firstTeacherMark, secondTeacherMark) {
        return ((firstTeacherMark + secondTeacherMark) / 2).toFixed(1);
      },
      getMarkDescription(mark) {
        if (mark < 5.5) {
          return 'poor';
        } else if (mark < 7.0) {
          return 'proficient';
        } else if (mark < 9.0) {
          return 'good';
        } else if (mark < 10) {
          return 'excellent';
        }
      },
      finalizeAssessmentMeta(finalMark) {
        if (this.items[0].assessments[0].examinator[0].id !== this.currentUserId) {
          Vue.toasted.show(this.$t("error.wrong_examinator_id"), {
            type: "error",
            duration: 2000
          });
        }

        if (confirm(this.$t('summary.finalize_mark_confirm'))) {
          const ENDPOINTS = 'assessment/finalizemeta';
          axios.post(this.$store.state.apiBaseUrl + ENDPOINTS,
                  {
                    "userId": this.currentUserId,
                    "assessmentMetaId": this.id,
                    "finalMark": finalMark
                  }, { headers: {"Authorization": this.$session.get('jwt') }
          }).then(() => {
            Vue.toasted.show(this.$t("success.mark_final"), {
              type: "success",
              duration: 2000
            });
          }).catch(() => {
              Vue.toasted.show(this.$t("error.finalize_assessment"), {
                type: "error",
                duration: 2000
              });
          });
        }
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
            definitive: (response.data.status === 2),
            finalMark: response.data.finalMark,
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
console.log(response.data.status);
          this.items = tmpItems;

          this.finalMark = this.calculateAverageMark(response.data.firstTeacherMark, response.data.secondTeacherMark);
          this.finalMarkDescription = this.getMarkDescription(this.finalMark);

          Vue.toasted.show(this.$t('success.loading'), {
            type: 'success',
            duration: 1000
          });

          this.loading = false;
        })
        .catch(() => {
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
