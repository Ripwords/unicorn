import { createApp } from 'vue'
import { createPinia } from "pinia"
import App from './App.vue'
import router from './router/index'
// @ts-ignore
var AutoLaunch = require('auto-launch')

var unicornAutoLauncher = new AutoLaunch({
  name: "unicorn",
})

unicornAutoLauncher.enable()
createApp(App).use(createPinia()).use(router).mount('#app')
