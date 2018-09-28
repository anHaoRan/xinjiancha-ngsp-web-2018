import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store/index'
import VueResource from 'vue-resource'
import 'font-awesome/css/font-awesome.css'
import 'normalize.css'
import './assets/styles/base.css'
// import './assets/styles/theme_light.less'
import './assets/styles/theme_yahei.less'
import './assets/styles/theme_dark.less'
// import './assets/styles/theme_green.less'
import './registerServiceWorker'

// 引入全局方法
import gfnSortUtil from './utils/global/gfnSortUtil'
import gfnFormatUtil from './utils/global/gfnFormatUtil'
import gfnStorageUtil from './utils/global/gfnStorageUtil'
import gfnFileSteamUtil from './utils/global/gfnFileSteamUtil'
import gfnConstansUtil from './utils/global/gfnConstansUtil'
import gfnRegUtil from './utils/global/gfnRegUtil'
import gfnEvents from './utils/global/gfnEvents'

import HttpReqDefine from './utils/HttpReqDefine'

// 全局过滤器
import './utils/FilterDefine'
import { chalk } from './assets/styles/echarts/chalk'
import { macarons } from './assets/styles/echarts/macarons'
// Echarts主题注册
let echarts = require('echarts')

echarts.registerTheme('theme_dark', chalk)
echarts.registerTheme('theme_light', macarons)
echarts.registerTheme('theme_green', chalk)
echarts.registerTheme('theme_yahei', chalk)

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(VueResource)

// ElementUI 注册
Vue.use(ElementUI)

// 注册全局方法
Vue.use(gfnSortUtil)
Vue.use(gfnFormatUtil)
Vue.use(gfnStorageUtil)
Vue.use(gfnFileSteamUtil)
Vue.use(gfnConstansUtil)
Vue.use(gfnRegUtil)
Vue.use(gfnEvents)

// v-tableLoadMore: 用于Elemnet ui的Table懒加载
Vue.directive('tableLoadMore', {
    bind(el, binding) {
        const SELECT_WRAP = el.querySelector('.el-table__body-wrapper')
        SELECT_WRAP.addEventListener('scroll', function() {
            let sign = 40
            const CONDITION = ((this.scrollHeight - this.scrollTop === this.clientHeight) && this.scrollTop > sign)
            if (CONDITION) {
                binding.value()
            }
        })
    }
})

// v-selectLoadMore: 用于Elemnet ui的Select懒加载
Vue.directive('selectLoadMore', {
    bind(el, binding) {
        const SELECT_WRAP_CON = el.querySelector('.el-scrollbar__wrap')
        SELECT_WRAP_CON.addEventListener('scroll', function() {
            let sign = 80
            const SELECT_CONDITION = ((this.scrollHeight - this.scrollTop === this.clientHeight) && this.scrollTop > sign)
            if (SELECT_CONDITION) {
                binding.value()
            }
        })
    }
})
// v-focus: 用于Elemnet ui的Select的focus事件
Vue.directive('focus', {
    bind(el, binding) {
        const TARGET_DOM = el.querySelector('.el-input__inner')
        TARGET_DOM.addEventListener('focus', function() {
            binding.value()
        })
    }
})

Vue.http.interceptors.push(HttpReqDefine)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')