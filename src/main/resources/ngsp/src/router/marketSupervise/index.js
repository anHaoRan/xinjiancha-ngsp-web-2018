const marketSuperviseRouter = {
  path: '/marketSupervise',
  name: 'marketSupervise',
  component: function (resolve) {
    require(['@/router/marketSupervise/index.vue'], resolve)
  },
  children: [
    {
      path: '/stockMarketOverview',
      name: 'stockMarketOverview',
      component: function (resolve) {
        require(['@/components/marketSupervise/stockMarketOverview'], resolve)
      }
    },
    {
      path: '/stockOperationMonitor',
      name: 'stockOperationMonitor',
      component: function (resolve) {
        require(['@/components/marketSupervise/stockOperationMonitor'], resolve)
      }
    },
    {
      path: '/classifiedInvestorMonitoring',
      name: 'classifiedInvestorMonitoring',
      component: function (resolve) {
        require(['@/components/marketSupervise/classifiedInvestorMonitoring'], resolve)
      }
    },
    {
      path: '/halfHourInvestorMonitoring',
      name: 'halfHourInvestorMonitoring',
      component: function (resolve) {
        require(['@/components/marketSupervise/halfHourInvestorMonitoring'], resolve)
      }
    },
    {
      path: '/classifiedInvestorHistoryMonitoring',
      name: 'classifiedInvestorHistoryMonitoring',
      component: function (resolve) {
        require(['@/components/marketSupervise/classifiedInvestorHistoryMonitoring'], resolve)
      }
    },
    {
      path: '/customMultidimensionalQuery',
      name: 'customMultidimensionalQuery',
      component: function (resolve) {
        require(['@/components/marketSupervise/customMultidimensionalQuery'], resolve)
      }
    },
    {
      path: '/classifiedInvestorDealCount',
      name: 'classifiedInvestorDealCount',
      component: function (resolve) {
        require(['@/components/marketSupervise/classifiedInvestorDealCount'], resolve)
      }
    },
    {
      path: '/classifiedInvestorReportStatistics',
      name: 'classifiedInvestorReportStatistics',
      component: function (resolve) {
        require(['@/components/marketSupervise/classifiedInvestorReportStatistics'], resolve)
      }
    },
    {
      path: '/waveMonitor',
      name: 'waveMonitor',
      component: function (resolve) {
        require(['@/components/marketSupervise/waveMonitor'], resolve)
      }
    },
    {
      path: '/areaTradeLiveness',
      name: 'areaTradeLiveness',
      component: function (resolve) {
        require(['@/components/marketSupervise/areaTradeLiveness'], resolve)
      }
    },
    {
      path: '/abnormolTransaction',
      name: 'abnormolTransaction',
      component: function (resolve) {
        require(['@/components/marketSupervise/abnormolTransaction'], resolve)
      }
    },
    {
      path: '/creaditdeal',
      name: 'creaditdeal',
      component: function (resolve) {
        require(['@/components/marketSupervise/marginTmding'], resolve)
      }
    },
    {
      path: '/operationMonitorWarn',
      name: 'operationMonitorWarn',
      component: function (resolve) {
        require(['@/components/marketSupervise/operationMonitorWarn'], resolve)
      }
    },
    // {
    //   path: '/monitorWarnDetail/:alarmID/:alarmRuleCode/:alarmType/:alarmStartTime/:alarmEndTime',
    //   name: 'monitorWarnDetail',
    //   component: function (resolve) {
    //     require(['@/components/marketSupervise/operationMonitorWarn/monitorWarnDetail'], resolve)
    //   }
    // },
    {
      path: '/monitorWarnDetail',
      name: 'monitorWarnDetail',
      component: function (resolve) {
        require(['@/components/marketSupervise/operationMonitorWarn/monitorWarnDetail'], resolve)
      }
    },
    {
      path: '/marketFluctuationAnalysis',
      name: 'marketFluctuationAnalysis',
      component: function (resolve) {
        require(['@/components/marketSupervise/marketFluctuationAnalysis'], resolve)
      }
    },
    {
      path: '/highQuery',
      name: 'highQuery',
      component: function (resolve) {
        require(['@/components/marketSupervise/highQuery'], resolve)
      }
    },
    {
      path: '/dataBrowser',
      name: 'dataBrowser',
      component: function (resolve) {
        require(['@/components/marketSupervise/dataBrowser'], resolve)
      }
    },
    {
      path: '/capitalFlow',
      name: 'capitalFlow',
      component: function (resolve) {
        require(['@/components/marketSupervise/capitalFlow'], resolve)
      }
    }
  ]
}

export default marketSuperviseRouter
