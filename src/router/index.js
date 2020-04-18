import Vue from 'vue'
import Router from 'vue-router'
import CurrencyList from "@/components/CurrencyList";
import Base from "@/components/Base";
import CurrencyDetails from "@/components/CurrencyDetails";

export const BASE_API_URL = process.env.VUE_APP_CORE_SERVER_ORIGIN + '/api/v1';

Vue.use(Router);
const router =  new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Base,
            children: [{
                path: '',
                name: 'currency-list',
                component: CurrencyList
            },
            {
                path: '/details/:id',
                name: 'currency-details',
                component: CurrencyDetails
            }
            ]
        }
    ]
})

export default router