const sensationRouter = {
  path: '/earlyWarning',
  name: 'earlyWarning',
  component: function (resolve) {
    require(['@/router/earlyWarning/Index.vue'], resolve)
  },
  children: [
    {
      path: '/earlyWarningManagement/:type',
      name: 'earlyWarningManagement',
      component: function (resolve) {
        require(['@/components/earlyWarning/management/Index.vue'], resolve)
      }
    }, {
      path: '/intelligentEarlyWarningAssessment',
      name: 'intelligentEarlyWarningAssessment',
      component: function (resolve) {
        require(['@/components/earlyWarning/assessment/Index.vue'], resolve)
      }
    },
    {
      path: '/earlyWarningMonitoring/:type',
      name: 'earlyWarningMonitoring',
      component: function (resolve) {
        require(['@/components/earlyWarning/monitoring/Index.vue'], resolve)
      }
    }
  ]
}
export default sensationRouter
