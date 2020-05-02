<template>
    <v-content>
        <v-container>
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
                    <h3>About {{metadata.name}}</h3>
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
            metadata: {
                urls: {
                    website: [
                        "https://bitcoin.org/"
                    ],
                    technical_doc: [
                        "https://bitcoin.org/bitcoin.pdf"
                    ],
                    twitter: [],
                    reddit: [
                        "https://reddit.com/r/bitcoin"
                    ],
                    message_board: [
                        "https://bitcointalk.org"
                    ],
                    announcement: [],
                    chat: [],
                    explorer: [
                        "https://blockchain.coinmarketcap.com/chain/bitcoin",
                        "https://blockchain.info/",
                        "https://live.blockcypher.com/btc/",
                        "https://blockchair.com/bitcoin",
                        "https://explorer.viabtc.com/btc"
                    ],
                    source_code: [
                        "https://github.com/bitcoin/"
                    ]
                },
                logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
                id: 1,
                name: "Bitcoin",
                symbol: "BTC",
                slug: "bitcoin",
                description: "Bitcoin (BTC) is a consensus network that enables a new payment system and a completely digital currency. Powered by its users, it is a peer to peer payment network that requires no central authority to operate. On October 31st, 2008, an individual or group of individuals operating under the pseudonym \"Satoshi Nakamoto\" published the Bitcoin Whitepaper and described it as: \"a purely peer-to-peer version of electronic cash, which would allow online payments to be sent directly from one party to another without going through a financial institution.\"",
                notice: null,
                date_added: "2013-04-28T00:00:00.000Z",
                tags: [
                    "mineable"
                ],
                tag_names: [
                    "Mineable"
                ],
                tag_groups: [
                    "APPLICATION"
                ],
                is_hidden: 0,
                platform: null,
                category: "coin"
            },
            quotes: {
                id: 1,
                name: "Bitcoin",
                symbol: "BTC",
                slug: "bitcoin",
                num_market_pairs: 7868,
                date_added: "2013-04-28T00:00:00.000Z",
                tags: [
                    "mineable"
                ],
                max_supply: 21000000,
                circulating_supply: 18332350,
                total_supply: 18332350,
                platform: null,
                cmc_rank: 1,
                last_updated: "2020-04-18T18:12:52.000Z",
                quote: {
                    USD: {
                        price: 7233.53,
                        volume_24h: 32509859356.40,
                        percent_change_1h: -0.02,
                        percent_change_24h: 2.11,
                        percent_change_7d: 5.95,
                        market_cap: 132607706601.03,
                        last_updated: "2020-04-18T18:12:52.000Z"
                    }

                }},
            converted_price: '',
            chartData: {}
        }),
        methods: {
            getCurrencyMetadata(id){
                axios.get(BASE_API_URL+'/currency-metadata/'+id)
                    .then(res => {
                        this.metadata = res.data.result;
                        console.log(1, this.metadata)
                    })
                    .catch(err => {
                        console.log('Internal server error. ' +  err);
                    })
            },
            getCurrencyQuotes(id){
                axios.get(BASE_API_URL+'/currency-quotes/'+id)
                    .then(res => {
                        console.log(res)
                        this.quotes = res.data.result;
                        console.log(2, this.quotes)
                    })
                    .catch(err => {
                        console.log('Internal server error. ' +  err);
                    })
            },
            loadDetails(id){
                this.getCurrencyMetadata(id);
                this.getCurrencyQuotes(id);
                console.log(this.metadata);
                console.log(this.quotes)
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
        // filters:{
        //     decimalToRepresentation(val){
        //         let decimalPart = val.toString().split('.')[1];
        //         let str = Math.trunc(val).toString();
        //         for (let i = str.length - 3; i >= 0; i-=3){
        //             if (i){
        //                 str = str.slice(0, i) + ',' + str.slice(i)
        //             }
        //         }
        //         if (decimalPart)
        //             return str + '.'+ decimalPart
        //         return str
        //     }
        // }
        // beforeRouteEnter(to, from, next){
        //     let id = to.params.id;
        //     next(vm => {
        //         vm.loadDetails(id);
        //     });
        // }
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