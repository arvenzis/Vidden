<template>
    <div class="container dashboard-container">
        <div class="path"><router-link to="/" class="ml-2">{{ $t('common.dashboard') }}</router-link> &gt; {{ $t('common.settings') }}</div>
        <div class="mt-5 mb-5">
            <h1>{{ $t('common.settings') }}</h1>
            <table class="table table-responsive table-striped">
                <tr>
                    <td>
                        <h4>
                            {{ $t('settings.give_assessment_in') }}
                            <popper trigger="hover" :options="{ placement: 'top' }">
                                <div class="popper">
                                    <span>{{ $t('settings.terms_instead_of_numbers_explanation') }}</span>
                                </div>
                                <i class="fa fa-info-circle cursor-pointer" slot="reference"></i>
                            </popper>
                        </h4>
                        <input type="checkbox" data-toggle="toggle" v-bind:data-on="$t('settings.terms')" v-bind:data-off="$t('settings.numbers')">
                    </td>
                </tr>
            </table>

        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import Popper from "vue-popperjs";

    Vue.use(Popper);

    export default {
        name: 'settings',

        components: {
            'popper': Popper,
        }
    };
</script>