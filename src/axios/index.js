import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://1.15.129.51:3000'
Vue.prototype.$ajax = axios
