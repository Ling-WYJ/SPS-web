import Vue from 'vue'
// import { MessageBox,Message, Table,TableColumn,Tag,Row, Col, Container,Button, Input, Loading, Dialog, Dropdown, DropdownMenu, DropdownItem, Checkbox, CheckboxGroup, Divider, Popover, Collapse, CollapseItem, Form, FormItem, Header,Select, Option, Main, Menu, MenuItem, MenuItemGroup, Submenu, Tooltip,Descriptions} from 'element-ui'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Avatar from './components/avatar.vue'
import Index from './index.vue'
import store from './store/index'
import router from './router/index'
import tim from 'tim'
import TIM from 'tim-js-sdk/tim-js-friendship.js'
import TWebLive from 'tweblive'
import VueClipboard from 'vue-clipboard2'
import './assets/icon/iconfont.css'
import './assets/icon/tim.css'
import './assets/css/animate.css'
import './axios'

import trtcCalling from './trtc-calling'
import TRTCCalling from 'trtc-calling-js'





window.tim = tim
window.TIM = TIM
window.TRTCCalling = TRTCCalling
window.trtcCalling = trtcCalling
window.store = store
Vue.prototype.$bus = new Vue() // event Bus 用于无关系组件间的通信。
Vue.prototype.tim = tim
Vue.prototype.TIM = TIM
Vue.prototype.TWebLive = TWebLive
Vue.prototype.$store = store
// Vue.prototype.$confirm = MessageBox.confirm
// Vue.prototype.$message = Message
Vue.prototype.trtcCalling = trtcCalling
Vue.prototype.TRTCCalling = TRTCCalling
// Vue.use(Button)
// Vue.use(Row)
// Vue.use(Col)
// Vue.use(Container)
// Vue.use(Header)
// Vue.use(Loading)
// Vue.use(Dialog)
// Vue.use(Dropdown)
// Vue.use(DropdownMenu)
// Vue.use(DropdownItem)
Vue.use(VueClipboard)
Vue.use(ElementUI)
// Vue.use(Checkbox)
// Vue.use(CheckboxGroup)
// Vue.use(Divider)
// Vue.use(Popover)
// Vue.use(Collapse)
// Vue.use(CollapseItem)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)
// Vue.use(Select)
// Vue.use(Option)
// Vue.use(Main)
// Vue.use(Menu)
// Vue.use(MenuItem)
// Vue.use(MenuItemGroup)
// Vue.use(Submenu)
// Vue.use(Table)
// Vue.use(TableColumn)
// Vue.use(Tag)
// Vue.use(Tooltip)
// Vue.use(Descriptions)
Vue.component('avatar', Avatar)
new Vue({
  router,
  render: h => h(Index)
}).$mount('#app')
