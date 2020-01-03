<template id="current-user">
    <router-link to="/settings"><span class="header__user">{{this.$store.state.currentUser}} ({{this.$store.state.accountNumber}})</span></router-link>
</template>

<script>
    export default {
        name: 'current-user'
    };
</script>