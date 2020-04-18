<template>
        <v-content>
                <v-card class="table-card">
                    <v-card-title class="justify-center">
                        <h2>Top 50 Cryptocurrencies by Market Capitalization</h2>
                    </v-card-title>
                    <v-data-table
                            class="currency-table"
                            :headers="headers"
                            :items="currency_list"
                            hide-default-footer
                            :items-per-page="50"
                    >
                        <template v-slot:item.name="{ item }">
                            <router-link :to="{name: 'currency-details', params: {id: item.id}}">{{ item.name }}</router-link>
                        </template>
                        <template v-slot:item.percent_change_24h="{ item }">
                            <span v-if="parseFloat(item.percent_change_24h) >= 0" class="green--text">{{ item.percent_change_24h }}</span>
                            <span v-else class="red--text">{{ item.percent_change_24h }}</span>
                        </template>
                    </v-data-table>
                </v-card>
        </v-content>
</template>

<script>
    import router from '../router/index'
    import axios from 'axios'
    import {BASE_API_URL} from "../router/index";

    export default {
        name: "CurrencyList",
        data: () => ({
            currency_list: []
        }),
        computed: {
            headers(){
                return [
                    {text: 'Name', value: 'name', sortable: false},
                    {text: 'Price', value: 'price', sortable: false},
                    {text: 'Market cap', value: 'market_cap', sortable: false},
                    {text: 'Volume (24h)', value: 'volume_24h', sortable: false},
                    {text: 'Circulating Supply', value: 'circulating_supply', sortable: false},
                    {text: 'Change (24h)', value: 'percent_change_24h', sortable: false}
                    ]
            }
        },
        methods: {
            getCurrencyList(){
                axios.get(BASE_API_URL+'/currency-list')
                    .then(res => {
                        console.log(res);
                        this.currency_list = res.data.result;
                    })
            }
        },
        created(){
            this.getCurrencyList();
        }
    }
</script>

<style scoped>
    .table-card{
        max-width: 90%;
        margin-left: auto;
        margin-right: auto;
    }
    .currency-table{
        max-width: 95%;
        margin-left: auto;
        margin-right: auto;
    }
    h2{
        margin-top: 10px;
        margin-bottom: 20px;
    }
</style>
