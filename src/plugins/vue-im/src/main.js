// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import { imServerStore } from './store/imServerStore.js';
// axios
import http from '@/common/http.js';
Vue.prototype.$http = http;
// ak
import ak from '@/common/ak.js';
Vue.prototype.$ak = ak;
// element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// font-awesome
import 'font-awesome/css/font-awesome.min.css'

// config
Vue.config.productionTip = false;

/* eslint-disable no-new */
window.polkVue = new Vue({
    el: '#app',
    router,
    components: { App },
    store: {
        imServerStore: imServerStore
    },
    template: '<App/>'
});
