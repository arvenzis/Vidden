<template id="current-user">
    <span class="header__user">{{this.$parent.currentUser}} ({{this.$parent.role}})</span>
</template>

<script>
    export default {
        name: 'current-user'
    };
</script>