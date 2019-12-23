<template>
    <div class="container dashboard-container">
        <div class="path"><router-link to="/" class="ml-2">{{ $t('common.dashboard') }}</router-link> &gt; {{ $t('common.settings') }}</div>
        <div class="mt-5 mb-5">
            <spinner id="spinner--full-top" v-if="!dataReady"></spinner>
            <div v-else>
                <h1>{{ $t('common.settings') }}</h1>
                <table class="table table-responsive table-striped">
                    <tr>
                        <td>
                            <div class="custom-control custom-switch">
                                <input type="checkbox" v-model="prefersNumbers" data-toggle="toggle" class="custom-control-input" id="termsOrNumbersSwitch">
                                <label class="custom-control-label" for="termsOrNumbersSwitch">{{ $t('settings.give_assessment_in') }}</label>
                            </div>
                        </td>
                        <td>
                            <popper trigger="hover" :options="{ placement: 'top' }">
                                <div class="popper">
                                    <span>{{ $t('settings.terms_instead_of_numbers_explanation') }}</span>
                                </div>
                                <i class="fa fa-info-circle cursor-pointer" slot="reference"/>
                            </popper>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="form-group">
                                <label for="langSwitch">{{ $t('settings.language') }}</label>
                                <model-select :options="langOptions"
                                      v-model="switchLanguage"
                                      :placeholder="$t('settings.language')">
                                </model-select>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import Popper from "vue-popperjs";
    import axios from "axios";
    import Spinner from "vue-simple-spinner";
    import { ModelSelect } from 'vue-search-select'

    Vue.use(Popper);

    export default {
        name: 'settings',
        data() {
          return {
              dataReady: false,
              prefersNumbers: false,
              language: "nl_NL",
              langOptions: [
                  "nl_NL", 
                  "en_US"
              ],
              langPreference: {
                value: '',
                text: '' 
             },
          }
        },
        created() {
            let self = this;
            
            // Since we have a different endpoint for each preference
            // we put all endpoints in an array for use in axios all
            let settingsEndpointsArray = [
                `userpreference/getshowgradinginwords/${self.$store.state.currentUserId}`
            ];

            axios.all(
                settingsEndpointsArray
                .map(u => axios
                    .get(self.$store.state.apiBaseUrl + u, {
                        headers: {
                            "Authorization": self.$session.get('jwt')
                        }
                    }))
            ).then(response => {
                this.prefersNumbers = response.data;
                this.dataReady = true;
            }).catch(() => {
                Vue.toasted.show(this.$t('error.loading'), {
                    type: 'error',
                    duration: 1000
                });
            });

        },
        watch: {
            prefersNumbers: function (val) {
                let endpoints = `userpreference/putshowgradinginwords/${this.$store.state.currentUserId}/${val}`;

                axios.put(this.$store.state.apiBaseUrl + endpoints, {}, {
                    headers: {"Authorization" : this.$session.get('jwt')}
                }).then(() => {
                    if(val) {
                        this.$store.commit("useNumbers");
                    } else {
                        this.$store.commit("useTerms");
                    }                    
                    Vue.toasted.show(this.$t('success.setting_save'), {
                        type: 'success',
                        duration: 1000
                    });
                }).catch(() => {
                    Vue.toasted.show(this.$t('error.setting_save'), {
                        type: 'error',
                        duration: 1000
                    });
                });
            },
            switchLanguage: function (lang) {
                let endpoints = '';

                axios.put(this.$store.state.apiBaseUrl + endpoints, {}, {
                    headers: {"Authorization" : this.$session.get('jwt')}
                }).then(() => {
                    this.$store.commit("switchLanguage", lang);

                    Vue.toasted.show(this.$t('success.setting_save'), {
                        type: 'success',
                        duration: 1000
                    });
                }).catch(() => {
                    Vue.toasted.show(this.$t('error.setting_save'), {
                        type: 'error',
                        duration: 1000
                    });
                });
            }
        },
        components: {
            'popper': Popper,
            Spinner,
        }
    };
</script>