import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import './assets/cards.css';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');