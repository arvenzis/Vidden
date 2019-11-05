<template id="app-login">
    <div>
        

        <div>
            <b-card no-body>
                <b-tabs pills card>
                    <b-tab title="Tab 1" active><b-card-text>Tab Contents 1</b-card-text></b-tab>
                    <b-tab title="Tab 2"><b-card-text>Tab Contents 2</b-card-text></b-tab>
                    <b-tab title="Tab 3"><b-card-text>Tab Contents 2</b-card-text></b-tab>
                </b-tabs>
            </b-card>
        </div>



        <div class="tabs">
            <b-nav pills align="center">
                <b-nav-item to="#" :active="$route.hash === '#' || $route.hash === ''">
                    One
                </b-nav-item>
                <b-nav-item to="#two" :active="$route.hash === '#two'">
                    Two
                </b-nav-item>
                <b-nav-item to="#three" :active="$route.hash === '#three'">
                    Three
                </b-nav-item>
            </b-nav>
            <div class="tab-content">
                <div :class="['tab-pane', { 'active': $route.hash === '#' || $route.hash === '' }]" class="p-2">
                    <p>Tab One (default) with no hash</p>
                </div>
                <div :class="['tab-pane', { 'active': $route.hash === '#two' }]" class="p-2">
                    <p>Tab One with hash #two</p>
                </div>
                <div :class="['tab-pane', { 'active': $route.hash === '#three' }]" class="p-2">
                    <p>Tab One with hash #three</p>
                </div>
            </div>
        </div>

        <div>
            <b-nav pills align="center">
                <div :active="navigationtoggle"><b-nav-item v-on:click="navigationToggling(true)">Alle beoordelingen</b-nav-item></div>
                <div :active="!navigationtoggle"><b-nav-item v-on:click="navigationToggling(false)">Mijn beoordelingen</b-nav-item></div>
            </b-nav>
        </div>

        <div v-if="navigationToggle">
            <b-pagination v-model="currentPageAll"
                          :total-rows="rowsall"
                          :per-page="perPage"
                          aria-controls="assessment-list"></b-pagination>

            <p class="mt-3">Current Page: {{ currentPageAll }}</p>

            <div id="assessment-list">
                <div class="card" v-for="item in itemsAll" v-bind:key="item.id">
                    <div class="card-body">
                        <h5 class="card-title">
                            Beoordeling {{ item.vak }}
                            <span v-for="student in item.student"
                                  v-bind:key="student.account">{{ student.naam }}({{student.account}})</span>
                        </h5>
                        <h6 class="card-subtitle mb-2 text-muted">{{ item.code }}</h6>
                        <a href="#" class="btn btn-info">Open beoordeling</a>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">
                            Laatst bijgewerkt: {{ item.date_last_modified }} door
                            <span v-for="examinator in item.examinator"
                                  v-bind:key="examinator.account">{{ examinator.naam }}({{examinator.account}})</span>
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!navigationToggle">
            <b-pagination v-model="currentPageAccount"
                          :total-rows="rowsaccount"
                          :per-page="perPage"
                          aria-controls="assessment-list"></b-pagination>

            <p class="mt-3">Current Page: {{ currentPageAccount }}</p>

            <div id="assessment-list">
                <div class="card" v-for="item in itemsAccount" v-bind:key="item.id">
                    <div class="card-body">
                        <h5 class="card-title">
                            Beoordeling {{ item.vak }}
                            <span v-for="student in item.student"
                                  v-bind:key="student.account">{{ student.naam }}({{student.account}})</span>
                        </h5>
                        <h6 class="card-subtitle mb-2 text-muted">{{ item.code }}</h6>
                        <a href="#" class="btn btn-info">Open beoordeling</a>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">
                            Laatst bijgewerkt: {{ item.date_last_modified }} door
                            <span v-for="examinator in item.examinator"
                                  v-bind:key="examinator.account">{{ examinator.naam }}({{examinator.account}})</span>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>https://unpkg.com/bootstrap@next/dist/css/bootstrap.min.css</script>
<script>https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.css</script>
<script>https://unpkg.com/vue</script>
<script>https://unpkg.com/babel-polyfill@latest/dist/polyfill.min.js</script>
<script>https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.js</script>



<script>
    import Vue from 'vue'
    import { BTable, BPagination, BTabs, BTab, BCard, BCardText, BNav, BNavItem } from 'bootstrap-vue'
    import { TabsPlugin } from 'bootstrap-vue'




    Vue.use(TabsPlugin)

    export default {
        name: 'app-login',
        data() {
            return {
                navigationToggle: true,
                perPage: 3,
                currentPageAll: 1,
                currentPageAccount: 1,
                rowsAll: 3,
                rowsAccount: 3,
                itemsAll: [
                    {
                        id: 1,
                        status: "Draft",
                        vak: "Afstuderen",
                        code: "ICT.AFSTSE.V19",
                        student: [{ account: "S1019744", naam: "Bernard Bos" }],
                        date_created: "09-10-2019 22:12",
                        date_last_modified: "09-10-2019 22:16",
                        examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
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
                ],
                itemsAccount: [
                    {
                        id: 1,
                        status: "Draft",
                        vak: "Afstuderen",
                        code: "ICT.AFSTSE.V19",
                        student: [{ account: "S1019744", naam: "Bernard Bos" }],
                        date_created: "09-10-2019 22:12",
                        date_last_modified: "09-10-2019 22:16",
                        examinator: [{ account: "BV0111996", naam: "Arjen Korevaar" }]
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
                    }
                ],
                tabIndex: 1
            }
        },
        methods: {
            linkClass(idx) {
                if (this.tabIndex === idx) {
                    return ['bg-primary', 'text-light']
                } else {
                    return ['bg-light', 'text-info']
                }
            },
            navigationToggling(bool) {
                if (bool == true) {
                    this.navigationToggle = true;
                } else {
                    this.navigationToggle = false;
                }
            }
        },
        computed: {
            rowsall() {
                return this.rowsAll
            },
            rowsaccount() {
                return this.rowsAccount
            },
            navigationtoggle() {
                return this.navigationToggle
            }
        },
        components: {
            'b-table': BTable,
            'b-pagination': BPagination,
            'b-tabs': BTabs,
            'b-tab': BTab,
            'b-card': BCard,
            'b-card-text': BCardText,
            'b-nav': BNav,
            'b-nav-item': BNavItem,
        }
    }
</script>

<style>
    .nav-link.active {
        background-color: rgb(0, 123, 255);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        box-sizing: border-box;
        color: rgb(255, 255, 255);
        cursor: pointer;
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        font-size: 16px;
        font-weight: 400;
        height: 40px;
        line-height: 24px;
        list-style-image: none;
        list-style-position: outside;
        list-style-type: none;
        overflow-wrap: break-word;
        padding-bottom: 8px;
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 8px;
        text-align: left;
        text-decoration-color: rgb(255, 255, 255);
        text-decoration-line: none;
        text-decoration-style: solid;
        text-size-adjust: 100%;
        width: 69.15px;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
</style>
<!--<template>
    <paginate :page-count="20"
              :page-range="3"
              :margin-pages="1"
              :initial-page="1"
              :click-handler="clickCallback"
              :prev-text="'&laquo;'"
              :next-text="'&raquo;'"
              :container-class="'dashboard-container'"
              :page-class="'page-item'">
    </paginate>
</template>

<script>
    import Vue from 'vue'
    import Paginate from 'vuejs-paginate'
    Vue.component('paginate', Paginate)

    export default {
        data() {
            return {
                showAll: true,
                page: 1,
                perPage: 5,
                pages: [],
                items: [],
                currentPageItems: []
            };
        },
        methods: {
            clickCallback: function (pageNum) {
                console.log(pageNum)
            }
        }
    }
</script>

<style lang="css">
    .pagination {
    }

    .page-item {
    }
</style>-->
<!--<template id="app-login">
    <div class="container dashboard-container">
        <div>
            <b-tabs content-class="mt-3">
                <b-tab title="First" active><p>I'm the first tab</p></b-tab>
                <b-tab title="Second"><p>I'm the second tab</p></b-tab>
                <b-tab title="Disabled" disabled><p>I'm a disabled tab!</p></b-tab>
            </b-tabs>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card">
                    <div class="card-header">Inloggen</div>
                    <spinner id="spinner" v-if="loading"></spinner>
                    <div class="card-body" v-bind:class="{ overlay : loading}">
                        <form id="app" @submit="validateCredentials" method="post">
                            <div v-if="loggedInUnsuccessful" class="form-group row">
                                <label class="alert alert-danger col-md-6 offset-md-4" role="alert">
                                    {{errorMessage}}
                                </label>
                            </div>
                            <div v-if="this.$store.state.loggedOutSuccessful" class="form-group row">
                                <label class="alert alert-success col-md-6 offset-md-4" role="alert">
                                    {{successMessage}}
                                </label>
                            </div>
                            <div class="form-group row">
                                <label for="emailaddress" class="col-md-4 col-form-label text-md-right">Gebruikersnaam</label>

                                <div class="col-md-6">
                                    <input id="emailaddress" v-model="emailaddress" type="email" class="form-control" name="emailaddress" required autocomplete="email" :disabled="loading" autofocus>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="password" class="col-md-4 col-form-label text-md-right">Wachtwoord</label>

                                <div class="col-md-6">
                                    <input id="password" v-model="password" type="password" class="form-control" name="password" required :disabled="loading" autocomplete="current-password">
                                </div>
                            </div>

                            <div class="form-group row">
                                <div class="col-md-6 offset-md-4">
                                    <a href="#">
                                        Wachtwoord vergeten?
                                    </a>
                                </div>
                            </div>

                            <div class="form-group row mb-0">
                                <div class="col-md-8 offset-md-4" id="buttonLoader">
                                    <button type="submit" class="btn btn-primary btn-windesheim">
                                        Inloggen
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import VueSession from "vue-session"
    import Spinner from 'vue-simple-spinner'
    import { BTabs, BTab } from 'bootstrap-vue'

    Vue.use(VueSession);

    export default {
        name: 'app-login',

        data() {
            return {
                loggedInUnsuccessful: false,
                currentUser: "",
                accountNumber: "",
                errorMessage: "",
                successMessage: "U bent uitgelogd.",
                loading: false,
            }
        },
        methods: {
            validateCredentials: function (e) {
                const ENDPOINTS = 'User/Authenticate/';
                e.preventDefault();
                this.loading = true;
                axios.post(this.$store.state.apiBaseUrl + ENDPOINTS, {
                    emailaddress: this.emailaddress,
                    password: this.password
                }).then((response) => {
                    if (response.status === 200 && 'token' in response.data) {
                        this.$session.start();
                        this.$session.set('jwt', response.data.token);
                    }
                    this.loading = false;
                    this.$store.state.loggedIn = true;
                    this.$store.state.currentUser = response.data.fullName;
                    this.$store.state.currentUserId = response.data.id;
                    this.$store.state.accountNumber = response.data.accountNumber;
                })
                    .catch((e) => {
                        this.loading = false;
                        this.loggedInUnsuccessful = true;
                        if (e == "Error: Request failed with status code 400") {
                            this.errorMessage = "Uw gebruikersnaam en / of wachtwoord is onjuist.";
                        } else if (e == "Error: Request failed with status code 500") {
                            this.errorMessage = "Problemen met server, probeer het nog eens."
                        } else {
                            this.errorMessage = e;
                        }
                    })
            },
        },
        components: {
            Spinner,
            'b-tabs': BTabs,
            'b-tab': BTab,
        }
    };
</script>-->
