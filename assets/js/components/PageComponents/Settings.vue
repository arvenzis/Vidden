<template>
    <div class="container dashboard-container">
        <div class="path"><router-link to="/" class="ml-2">{{ $t('common.dashboard') }}</router-link> &gt; {{ $t('common.settings') }}</div>
        <div class="mt-5 mb-5">
            <h1>{{ $t('settings') }}</h1>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'settings'
    };
</script>