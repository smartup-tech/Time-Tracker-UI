import { createApp } from 'vue';
import 'ant-design-vue/dist/reset.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';

import { errorHandler } from '@/shared/lib';

import App from './app/App.vue';
import router from './router';
import store from './store';

import toISODate from '@/shared/lib/plugins/to-iso-date';

dayjs.locale('ru');
dayjs.extend(toISODate);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const app = createApp(App);

app.use(store).use(router);

app.config.errorHandler = errorHandler;

app.mount('#app');
