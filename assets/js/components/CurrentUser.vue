<template id="current-user">
    <router-link to="/settings"><span class="header__user">{{ this.$store.getters.getCurrentUserFull }}</span></router-link>
</template>

<script>
    export default {
        name: 'current-user'
    };
</script>