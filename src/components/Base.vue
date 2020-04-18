<template>
    <v-app>
        <v-container fluid>
            <v-app-bar app height="90"
                       color="indigo darken-1"
            >
                <v-toolbar-title class="white--text">CryptoCurrencies List</v-toolbar-title>
            </v-app-bar>
        </v-container>
        <router-view></router-view>
    </v-app>
</template>

<script>
    export default {
        name: "Base"
    }
</script>

<style scoped>

</style>