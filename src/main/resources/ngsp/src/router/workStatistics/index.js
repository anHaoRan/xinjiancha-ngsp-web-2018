const workStatisticsRouter = {
  path: '/workStatistics',
  name: 'workStatistics',
  component: function (resolve) {
    require(['@/router/workStatistics/index.vue'], resolve)
  },
  children: [
    // {
    //   path: '/warningStatistics', // 预警数据统计
    //   name: 'warningStatistics',
    //   component: function (resolve) {
    //     require(['@/components/workStatistics/warningStatistics'], resolve)
    //   }
    // },
    {
      path: '/selfRegulationStatistic', // 自律监管统计
      name: 'selfRegulationStatistic',
      component: function (resolve) {
        require(['@/components/workStatistics/selfRegulation'], resolve)
      }
    },
    {
      path: '/abnormalBehaviorStatistic', // 异常行为统计
      name: 'abnormalBehaviorStatistic',
      component: function (resolve) {
        require(['@/components/workStatistics/abnormalBehavior'], resolve)
      }
    },
    {
      path: '/analysisReportStatistic', // 分析报告统计
      name: 'analysisReportStatistic',
      component: function (resolve) {
        require(['@/components/workStatistics/analysisReport'], resolve)
      }
    },
    {
      path: '/dataInvestigationStatistic', // 数据协查统计
      name: 'dataInvestigationStatistic',
      component: function (resolve) {
        require(['@/components/workStatistics/dataInvestigation'], resolve)
      }
    },
    {
      path: '/peopleWorkStatistic', // 人员工作量统计
      name: 'peopleWorkStatistic',
      component: function (resolve) {
        require(['@/components/workStatistics/peopleWork'], resolve)
      }
    }
  ]
}

export default workStatisticsRouter;
