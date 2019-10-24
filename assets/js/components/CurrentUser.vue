<template id="current-user">
    <span class="header__user">{{this.$store.state.currentUser}} ({{this.$store.state.accountNumber}})</span>
</template>

<script>
    // console.log(store.state.count);
    export default {
        name: 'current-user'
    };
</script>