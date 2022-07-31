import Vue from 'vue'
import Element from 'element-ui'
import ElementPersonal from '@ele'
import './style/index.scss'
import './asset/icon'
import './directive'
import App from './App'
import store from './store'
import router from './router'
import filters from './filter'
import globalMethod from './globalMethod'
import VueClipboard from 'vue-clipboard2'

VueClipboard.config.autoSetContainer = true // add this line
Vue.config.productionTip = false

Vue.use(Element)
Vue.use(ElementPersonal)
Vue.use(filters)
Vue.use(globalMethod)

Vue.use(VueClipboard)

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})

//页面刷新时websocket重连
store.dispatch('websocket/init').catch()
