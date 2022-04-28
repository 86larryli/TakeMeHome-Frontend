import Vue from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';
import router from './router'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(VueCookies);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { App },
    router,
    template: '<App/>'
});