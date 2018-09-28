import Vue from 'vue'
import Router from 'vue-router'
import {checkPermissions} from '../service/sidebar/index' // eslint-disable-line
import Homepage from './homepage/index'
import AlarmMonitor from './alarmMonitor/index'
import AnalysisTool from './analysisTool/index'
import BusinessAudit from './businessAudit/index'
import KnowledgeBase from './knowledgeBase/index'
import MarketSupervise from './marketSupervise/index'
import PublicSupervise from './publicSupervise/index'
import Sensation from './sensation/Index'
import EarlyWarning from './earlyWarning/Index'
import MarketStabilityRouter from './marketStability/index'
import SuperviseTask from './superviseTask/index'
import SystemManage from './systemManage/index'
import WorkStatistics from './workStatistics/index'
import MarketStability from './newOpen/marketStability/index'
import OrderParticularsRouter from './newOpen/OrderParticulars/index'
import realTimeDetection from './newOpen/realTimeDetection/index'
import capitalFlowDetail from './newOpen/capitalFlowDetail/index'
import PDF from './newOpen/pdf/index'
import Error404 from './error404/index'

import {Message} from 'element-ui'
import {
  getTokenWithType,
  removeAuthedInfos
} from './../utils/storageUtil.js'

Vue.use(Router)

let IndexChildren = [
  Homepage, // 首页
  AlarmMonitor, // 预警监控
  AnalysisTool, // 分析工具
  BusinessAudit, // 操作日志审计
  Sensation, // 舆情
  EarlyWarning, // 预警管理
  KnowledgeBase, // 知识库
  MarketSupervise, // 市场运行监测
  PublicSupervise, //
  MarketStabilityRouter, // 市场维稳
  SuperviseTask, // 监察任务
  SystemManage, // 系统管理
  WorkStatistics, // 系统管理-模块管理
  Error404
]
let NewOpenChildren = [
  MarketStability, // 维稳新开页
  OrderParticularsRouter, // 参与者查询新开页
  realTimeDetection, // 实时分析工具
  capitalFlowDetail, // 资金流向详情
  PDF
]

const router = new Router({
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: function (resolve) {
        require(['@/components/Login.vue'], resolve)
      }
    },
    {
      path: '/index',
      name: 'Index',
      component: function (resolve) {
        require(['@/components/Index.vue'], resolve)
      },
      redirect: '/homepage',
      children: IndexChildren
    },
    {
      path: '/newopen',
      name: 'NewOpen',
      component: function (resolve) {
        require(['@/components/NewOpen.vue'], resolve)
      },
      children: NewOpenChildren
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]
})

// 登陆钩子
router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    next()
  } else {
    let token = getTokenWithType()
    if (!token) {
      Message.error('您的登陆已过期，请重新登录!')
      removeAuthedInfos()
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    } else {
      // TODO 路由访问权限监测
      // let isAllow = false
      // checkPermissions(to.path).then(resp => {
      //   isAllow = eval(resp.toLowerCase())
      //   if (to.path !== '/404' && !isAllow) {
      //     Message.error('该用户没有访问此菜单权限！');
      //     next({
      //       path: '/homepage'
      //     });
      //   } else {
      //     next();
      //   }
      // }, (err) => {
      //   next({
      //     path: '/homepage'
      //   });
      // })
      next()
    }
  }
})
export default router
