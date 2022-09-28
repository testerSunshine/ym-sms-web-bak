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
import vueMeta from 'vue-meta'
import echarts from 'echarts'

Vue.use(vueMeta)

VueClipboard.config.autoSetContainer = true // add this line
Vue.config.productionTip = false

Vue.use(Element)
Vue.use(ElementPersonal)
Vue.use(filters)
Vue.use(globalMethod)

Vue.use(VueClipboard)
Vue.prototype.$echarts = echarts


new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
