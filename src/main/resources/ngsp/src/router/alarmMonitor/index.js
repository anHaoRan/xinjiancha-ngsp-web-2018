const alarmMonitorRouter = {
  path: '/alarmMonitor',
  name: 'alarmMonitor',
  component: function (resolve) {
    require(['@/router/alarmMonitor/index.vue'], resolve)
  },
  children: [
    {
      path: '/alarmList',
      name: 'alarmList',
      component: function (resolve) {
        require(['@/components/alarmMonitor/alarmList/alarmList.vue'], resolve)
      }
    },
    {
      path: '/tdateAlarmDetail/:alarmId',
      name: 'tdateAlarmDetail',
      component: function (resolve) {
        require(['@/components/alarmMonitor/alarmDetail/TdateAlarmDetail.vue'], resolve)
      }
    },
    {
      path: '/clueRadar',
      name: 'clueRadar',
      component: function (resolve) {
        require(['@/components/alarmMonitor/clueRadar/index.vue'], resolve)
      }
    }
  ]
}
export default alarmMonitorRouter
