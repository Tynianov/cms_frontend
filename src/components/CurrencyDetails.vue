<template>
    <v-content>
        <v-container v-if="loaded">
            <v-row>
                <v-col class="coin-data">
                    <v-img :src="metadata.logo" id="logo"/>
                    <h3>{{metadata.name}} ({{metadata.symbol}})</h3>
                    <div class="urls-box">
                        <p><v-icon>link</v-icon><a :href="metadata.urls.website"> Website</a></p>
                        <p><v-icon>description</v-icon><a :href="metadata.urls.technical_doc"> Documentation</a></p>
                        <p><v-icon>code</v-icon><a :href="metadata.urls.source_code"> Source code</a></p>
                        <v-icon>search</v-icon><span> Explorers: ( </span>
                        <span class="explorers" v-for="(item, i) in metadata.urls.explorer"><a :href="item">{{i+1}}</a></span>
                        <span> )</span>
                        <p mt-5><v-icon>insert_comment</v-icon><a :href="metadata.urls.message_board"> Message Board</a></p>
                    </div>
                </v-col>
                <v-col>
                    <span class="price-tag">Price ${{quotes.quote.USD.price | decimalToRepresentation}}</span>
                    <v-data-table
                        class="table"
                        :headers="tableHeaders"
                        hide-default-footer
                        :items="tableItems"
                    >
                        <template v-slot:item.market_cap="{ item }">
                            <span>${{item.market_cap | decimalToRepresentation}}</span>
                        </template>
                        <template v-slot:item.volume_24h="{ item }">
                            <span>${{item.volume_24h | decimalToRepresentation}}</span>
                        </template>
                        <template v-slot:item.circulating_supply="{ item }">
                            <span>{{metadata.symbol}} {{item.circulating_supply | decimalToRepresentation}}</span>
                        </template>
                        <template v-slot:item.total_supply="{ item }">
                            <span>{{metadata.symbol}}  {{item.total_supply | decimalToRepresentation}}</span>
                        </template>
                    </v-data-table>
                    <h3 style="margin-bottom: 20px; margin-top: 20px">About {{metadata.name}}</h3>
                    <p class="text-start">{{metadata.description}}</p>
                </v-col>
                <v-col>
                    <div class="converter">
                        <v-flex row>
                            <v-text-field
                                class="converter-input"
                                placeholder="Enter amount"
                                :label="metadata.symbol"
                                @input="(val) => {this.$router.push({query: {...this.$route.query, ['amount']: val}})}"
                            />
                            <v-icon>arrow_forward</v-icon>
                            <v-spacer/>
                            <v-select
                                label="To"
                                class="converter-input"
                                :items="availableCurrency"
                                @change="(val) => {this.$router.push({query: {...this.$route.query, ['convert']: val}})}"
                            />
                        </v-flex>
                        <v-flex column class="justify-center convert-result">
                            <v-btn
                            @click="convert"
                            :disabled="$route.query.amount===undefined || $route.query.convert===undefined"
                            >Convert
                            </v-btn>
                            <v-text-field
                                v-model="converted_price"
                                readonly
                            />
                        </v-flex>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-content>
</template>

<script>
    import axios from 'axios'
    import {BASE_API_URL} from "../router/index";
    import decimalRepresentationMixin from "@/mixins/decimalRepresentationMixin";

    export default {
        name: "CurrencyDetails",
        mixins: [decimalRepresentationMixin],
        data: () => ({
            loaded: false,
            metadata: {},
            quotes: {},
            converted_price: ''
        }),
        methods: {
            getCurrencyMetadata(id){
                axios.get(BASE_API_URL+'/currency-metadata/'+id)
                    .then(res => {
                        this.metadata = res.data.result;
                    })
                    .catch(err => {
                        console.log('Internal server error. ' +  err);
                    })
            },
            getCurrencyQuotes(id){
                axios.get(BASE_API_URL+'/currency-quotes/'+id)
                    .then(res => {
                        this.quotes = res.data.result;
                    })
                    .catch(err => {
                        console.log('Internal server error. ' +  err);
                    })
            },
            loadDetails(id){
                this.getCurrencyMetadata(id);
                this.getCurrencyQuotes(id);
                this.loaded = true;
            },
            convert(){
                const params = {
                    id: this.metadata.id,
                    convert: this.$route.query.convert,
                    amount: this.$route.query.amount
                }
                axios.get(BASE_API_URL+'/convert', {params: params})
                    .then(resp => {
                            this.converted_price = resp.data.price;
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        computed:{
            tableHeaders(){
                return [
                    {text: 'Market Cap', value: 'market_cap', sortable: false},
                    {text: 'Volume (24h)', value: 'volume_24h', sortable: false},
                    {text: 'Circulating Supply', value: 'circulating_supply', sortable: false},
                    {text: 'Max Supply', value: 'total_supply', sortable: false},
                ]
            },
            tableItems(){
                return [{
                    market_cap: this.quotes.quote.USD.market_cap,
                    volume_24h: this.quotes.quote.USD.volume_24h,
                    circulating_supply: this.quotes.circulating_supply,
                    total_supply: this.quotes.total_supply
                }]
            },
            availableCurrency(){
                return ['USD', 'EUR', 'UAH']
            }
        },
        beforeRouteEnter(to, from, next){
            let id = to.params.id;
            next(vm => {
                vm.loadDetails(id);
            });
        }
    }
</script>

<style scoped>
    #logo{
        width: 75px;
        height: 75px;
        margin-bottom: 10px;
    }
    .coin-data{
        text-align: left !important;
        max-width: 70%;
    }
    .urls-box{
        margin-top: 25px;
        padding-left: 5px;
        border-left-style: solid;
        border-left-width: 1px;
    }
    .explorers{
        margin-right: 5px;
    }
    .price-tag{
        margin-bottom: 50px!important;
    }
    .converter-input{
        max-width: 45%;
    }
    .converter{
        margin-left: 55px;
    }
    .convert-result{
        margin-top: 20px;
    }
    thead.table{
        background-color: aqua !important;
    }
</style>
<style>
    .container{
        max-width: 75%;
    }
    .v-data-table thead{
        background-color: #aaa8a8;
    }
</style>