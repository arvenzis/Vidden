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
                                <input type="checkbox" v-model="useNumbers" data-toggle="toggle" class="custom-control-input" id="termsOrNumbersSwitch">
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
                                <select class="form-control" v-on:change="setLanguage($event)" v-model="this.currentLanguage">
                                    <option value="nl_NL">🇳🇱 {{ $t('language.nl_NL') }}</option>
                                    <option value="en_US">🇺🇸 {{ $t('language.en_US') }}</option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <popper trigger="hover" :options="{ placement: 'top' }">
                                <div class="popper">
                                    <span>{{ $t('settings.language_explanation') }}</span>
                                </div>
                                <i class="fa fa-info-circle cursor-pointer" slot="reference"/>
                            </popper>
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

    Vue.use(Popper);

    export default {
        name: 'settings',
        data() {
          return {
            dataReady: false,
            useNumbers: this.$store.state.useNumbers,
            currentLanguage: this.$store.getters.language,
          }
        },
        created() {
            this.dataReady = true;
        },
        methods: {
            setLanguage(event) {
                let lang = event.target.value;
                let endpoints = `userpreference/putlanguagepreference/${this.$store.state.currentUserId}/${lang}`;

                axios.put(this.$store.state.apiBaseUrl + endpoints, {}, {
                    headers: {"Authorization" : this.$session.get('jwt')}
                }).then(() => {
                    this.$store.commit("setLanguage", lang);
                    this.$root.$i18n.locale = this.$store.getters.language;

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
        watch: {
            useNumbers: function (val) {
                let endpoints = `userpreference/putshowgradinginwords/${this.$store.state.currentUserId}/${val}`;

                axios.put(this.$store.state.apiBaseUrl + endpoints, {}, {
                    headers: {"Authorization" : this.$session.get('jwt')}
                }).then(() => {
                    if(val) {
                        this.$store.commit("setUseNumbersInGrading", true);
                    } else {
                        this.$store.commit("setUseNumbersInGrading", false);
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
            }
        },
        components: {
            'popper': Popper,
            Spinner,
        }
    };
</script>