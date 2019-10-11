<template id="current-user">
    <span class="header__user" @click="this.$parent.someMethod">{{this.$parent.currentUser}}</span>
</template>

<script>
    export default {
        name: 'current-user',
        template: '#current-user',
    };
</script>