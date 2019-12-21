<template>
  <spinner id="spinner" v-if="loading"></spinner>
  <div class="container dashboard-container" v-else>
    <flash-message class="flashpool"/>
    <div class="path">
      <router-link to="/browse" class="ml-2" v-if="this.items[0].definitive">{{ $t('common.browse') }}</router-link>

      <router-link :to="'/edit/' + this.assessmentMetadataId + '/' + this.examinatorId" class="ml-2" v-else>
        {{ $t('common.edit') }}
      </router-link>
      &gt; {{ $t('common.finish') }}
    </div>
    <article class="mt-5 mb-5">
      <div v-for="item in this.items" :key="item.id">
        <span v-for="student in item.student" v-bind:key="student.accountNumber">
          <h3
            class="mt-3"
          >{{ $t('summary.title', { oeCode: item.oeCode, user: student.fullName + ' (' + student.accountNumber + ')' }) }}</h3>
        </span>

        <div class="row">
          <div class="col-sm-8 col-md-8 mt-3">
            <table class="table table-summary">
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
            </table>
          </div>
          <div class="col-sm-4 col-md-4">
            <span v-for="finalMark in item.finalMark" :key="finalMark.result">
              <div class="card" :class="finalMark.description.toLowerCase()">
                <div class="card-body">
                  <h6 class="card-heading">{{ $t('summary.computed_result') }}</h6>
                  <h1 class="text-center"><input type="number" v-model.number="finalMark.result" step="any" class="finalMarkInput" :disabled="item.definitive" /></h1>
                  <button type="button" class="btn btn-light btn-block mt-1" @click="completeAssessment(finalMark.result)" :disabled="item.definitive">{{ $t('summary.finalize_mark') }}</button>
                </div>
              </div>
            </span>
          </div>
        </div>

        <section class="mt-2">
          <div class="row justify-content-center">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>
                    {{ $t('common.group') }}
                  </th>
                  <th>
                    {{ $t('summary.result')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="group in item.groups" :key="group.groupId">
                  <td>{{ group.groupName }}</td>
                  <span v-for="mark in group.groupMark" :key="mark.result">
                    <td class="text-right">{{ mark.result }}</td>
                  </span>
                </tr>
              </tbody>
            </table>

          </div>
        </section>
      </div>
    </article>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import Spinner from "vue-simple-spinner";

export default {
  name: "finish",
  data() {
    return {
      assessmentMetadataId: this.$route.params.assessmentMetadataId,
      examinatorId: this.$route.params.examinatorId,
      items: [],
      currentUserId: this.$store.state.currentUserId,
      loading: false
    };
  },
  created() {
    this.loading = true;
    this.getData();
  },
  methods: {
    getData() {
      axios.all([
        axios.get(this.$store.state.apiBaseUrl + `assessment/${this.assessmentMetadataId}/fullsummary/${this.examinatorId}`, { headers: { Authorization: this.$session.get("jwt") } }),
        axios.get(this.$store.state.apiBaseUrl + `assessment/${this.assessmentMetadataId}`, { headers: { Authorization: this.$session.get("jwt") } }),
      ])
      .then(response => {
        // response[0] = the summary response
        // response[1] = the assessment data response
        let self = this;
        let dataObj = [];

        let metaData = {
          templateId: response[1].data.templateId,
          templateName: response[1].data.templateName,
          status: this.$parent.getStatusText(response[1].data.status),
          oeCode: response[1].data.oeCode,
          definitive: true, //ToDo: ophalen uit api
          student: [{
            id: response[1].data.studentId,
            accountNumber: response[1].data.student.accountNumber,
            fullName: response[1].data.student.fullName
          }],
          finalMark: [{
            result: response[0].data.suggestedMark,
            description: (response[0].data.suggestedMarkDescription === 'Insufficient' ? 'poor' : response[0].data.suggestedMarkDescription)
          }],
          groups: {}
        };

        for(var i in response[0].data.summaries) {
          let groupData = {
            groupId: response[0].data.summaries[i].group.id,
            groupName: response[0].data.summaries[i].group.name,
            groupStatus: this.$parent.getStatusText(response[0].data.summaries[i].group.groupStatus),
            groupMark: [{
              result: response[0].data.summaries[i].mark,
              description: (response[0].data.summaries[i].markDescription === 'Insufficient' ? 'poor' : response[0].data.summaries[i].markDescription)
            }]
          };
          dataObj.push(groupData);
        };

        metaData.groups = dataObj;
        self.items.push(metaData);

        Vue.toasted.show(this.$t("success.loading"), {
          type: "success",
          duration: 1000
        });

        this.loading = false;
      })
      .catch(error => {

        Vue.toasted.show(this.$t("error.loading"), {
          type: "error",
          duration: 2000
        });

        this.loading = false;
      })
    },
    completeAssessment(mark) {
      if (this.items[0].definitive) {
        return false;
      }

      if (confirm(this.$t('summary.finalize_mark_confirm'))) {
        const ENDPOINTS = 'assessment/finalize';

        axios.post(this.$store.state.apiBaseUrl + ENDPOINTS,
                {
                  "userId": this.examinatorId,
                  "assessmentMetaId": this.assessmentMetadataId,
                  "finalMark": mark
                }, {
                  headers: {
                    "Authorization": this.$session.get('jwt')
                  }
                })
                .then(() => {
                  Vue.toasted.show(this.$t('success.mark_final'), {
                    type: 'success',
                    duration: 1000
                  });
                })
                .catch(() => {
                  Vue.toasted.show(this.$t('error.mark_final'), {
                    type: 'error',
                    duration: 1000
                  });
                });
      }

    }
  },
  components: {
    Spinner
  }
};
</script>
