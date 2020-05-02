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
                        <template v-slot:item.price="{ item }">
                            <span>${{item.price | decimalToRepresentation}}</span>
                        </template>
                        <template v-slot:item.market_cap="{ item }">
                            <span>${{ item.market_cap | decimalToRepresentation }}</span>
                        </template>
                        <template v-slot:item.volume_24h="{ item }">
                            <span>${{ item.volume_24h | decimalToRepresentation }}</span>
                        </template>
                        <template v-slot:item.circulating_supply="{ item }">
                            <span>{{ item.circulating_supply | decimalToRepresentation }} {{item.symbol}}</span>
                        </template>
                        <template v-slot:item.market_cap="{ item }">
                            <span>${{item.market_cap | decimalToRepresentation}}</span>
                        </template>
                        <template v-slot:item.percent_change_24h="{ item }">
                            <span v-if="parseFloat(item.percent_change_24h) >= 0" class="green--text"><v-icon>arrow_drop_up</v-icon>{{ item.percent_change_24h }}%</span>
                            <span v-else class="red--text"><v-icon>arrow_drop_down</v-icon>{{ item.percent_change_24h }}%</span>
                        </template>
                    </v-data-table>
                </v-card>
        </v-content>
</template>

<script>
    import router from '../router/index'
    import axios from 'axios'
    import {BASE_API_URL} from "../router/index";
    import decimalRepresentationMixin from "@/mixins/decimalRepresentationMixin";

    export default {
        name: "CurrencyList",
        mixins: [decimalRepresentationMixin],
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
                        this.currency_list = res.data.result;
                    })
            }
        },
        filters: {
            toRepresentation(val){
                let stringRepresentation = val.toString();
                for (let i = stringRepresentation.length; i > 0; i--){
                    if (i % 3 === 0){
                        stringRepresentation[i+1] = ',';
                    }
                }
                console.log('!', stringRepresentation)
                return stringRepresentation
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
