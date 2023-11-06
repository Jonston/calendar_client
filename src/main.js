import './assets/main.css';

import axios from 'axios';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = 'http://localhost:8000';
window.axios = axios;

import App from './App.vue';

import { createApp } from 'vue';
const app = createApp(App);

import store from './store/index';
app.use(store);

import router from './router';
app.use(router);

import Notifications from '@kyvg/vue3-notification'
app.use(Notifications);

app.mount('#app');
