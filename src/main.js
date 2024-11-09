import { createApp } from "vue";
import App from "./App.vue";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import Vue3DraggableResizable from 'vue3-draggable-resizable'
//需引入默认样式
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

const app = createApp(App);

app.use(Antd).use(Vue3DraggableResizable).mount('#app');