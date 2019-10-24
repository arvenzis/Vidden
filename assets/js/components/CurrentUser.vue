<template id="current-user">
    <span class="header__user">{{this.$store.state.currentUser}} ({{this.$store.state.accountNumber}})</span>
</template>

<script>
    export default {
        name: 'current-user'
    };
</script>