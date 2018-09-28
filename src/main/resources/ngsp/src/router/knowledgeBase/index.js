const knowledgeBaseRouter = {
  path: '/knowledgeBase',
  name: 'knowledgeBase',
  component: function (resolve) {
    require(['@/router/knowledgeBase/index.vue'], resolve)
  },
  children: [
    {
      path: '/knowledgeBizSystem',
      name: 'knowledgeBizSystem',
      component: function (resolve) {
        require(['@/components/knowledgeBase/knowledgeBizSystem.vue'], resolve)
      }
    },
    {
      path: '/abnormalBehaveHistoryInformation',
      name: 'abnormalBehaveHistoryInformation',
      component: function (resolve) {
        require(['@/components/knowledgeBase/historySupervision/abnormalBehaveHistoryInformation'], resolve)
      }
    },
    {
      path: '/selfRegulatorymember',
      name: 'selfRegulatorymember',
      component: function (resolve) {
        require(['@/components/knowledgeBase/selfRegulatoryStatistics/selfRegulatorymember'], resolve)
      }
    },
    {
      path: '/allViewSearch',
      name: 'allViewSearch',
      component: function (resolve) {
        require(['@/components/knowledgeBase/allViewSearch'], resolve)
      }
    },
    {
      path: '/earlyWarningHistory',
      name: 'earlyWarningHistory',
      component: function (resolve) {
        require(['@/components/knowledgeBase/EarlyWarningHistory/Index'], resolve)
      }
    },
    {
      path: '/superviseLog',
      name: 'superviseLog',
      component: function (resolve) {
        require(['@/components/knowledgeBase/superviseLog'], resolve)
      }
    },
    {
      path: '/clueReportMain',
      name: 'clueReportMain',
      component: function (resolve) {
        require(['@/components/knowledgeBase/clueReport/clueReportMain'], resolve)
      }
    },
    {
      path: '/investorPicture',
      name: 'investorPicture',
      component: function (resolve) {
        require(['@/components/knowledgeBase/investorPicture'], resolve)
      }
    }
  ]
}

export default knowledgeBaseRouter
