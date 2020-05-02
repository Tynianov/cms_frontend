<template>
    <v-app>
        <v-container fluid>
            <v-app-bar app height="90"
                       color="black"
            >
                <v-toolbar-title class="white--text">
                    <router-link class="link" :to="{name: 'currency-list'}">CryptoCurrencies List</router-link>
                </v-toolbar-title>
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
    .link{
        color: white;
        text-decoration: none;
    }
</style>