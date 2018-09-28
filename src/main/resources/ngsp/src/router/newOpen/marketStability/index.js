const NewOpenWindow = {
  path: '/marketStabilityN',
  name: 'marketStabilityN',
  component: function (resolve) {
    require(['@/router/newOpen/marketStability/index.vue'], resolve)
  },
  children: [
    {
      path: '/securitiesDetail/:isincode/:tradedate/:code/:timePicker',
      name: 'securitiesDetail',
      component: function (resolve) {
        require(['@/components/marketStability/stabilitylistcomponents/SecuritiesNewOpen/Detail.vue'], resolve)
      }
    },
    {
      path: '/customPlate',
      name: 'customPlate',
      component: function (resolve) {
        require(['@/components/marketStability/stabilitylistcomponents/SecuritiesNewOpen/CustomPlate.vue'], resolve)
      }
    },
    {
      path: '/institutionsDetail/:companycode/:compname/:orgflg/:companyseq/:tradedate/:tradeDirection/:codeType/:code',
      name: 'institutionsDetail',
      component: function (resolve) {
        require(['@/components/marketStability/stabilitylistcomponents/InstitutionsNewOpen/Detail.vue'], resolve)
      }
    },
    {
      path: '/institutionsNewOpen',
      name: 'institutionsNewOpen',
      component: function (resolve) {
        require(['@/components/marketStability/stabilitylistcomponents/InstitutionsNewOpen/CustomAgencies.vue'], resolve)
      }
    },
    {
      path: '/dealMarkDefine',
      name: 'dealMarkDefine',
      component: function (resolve) {
        require(['@/components/marketStability/stabilitylistcomponents/AccountNewOpen/DealMarkDefine.vue'], resolve)
      }
    },
    {
      path: '/accountDetail/:accOrYmtNo/:tradedate/:trdAcctType/:trdDirection/:startTime/:endTime/:accDetail',
      name: 'accountDetail',
      component: function (resolve) {
        require(['@/components/marketStability/stabilitylistcomponents/AccountNewOpen/Detail.vue'], resolve)
      }
    },
    {
      path: '/accountDetailYmt/:accOrYmtNo/:tradedate/:trdAcctType/:trdDirection/:startTime/:endTime/:accDetail',
      name: 'accountDetailYmt',
      component: function (resolve) {
        require(['@/components/marketStability/stabilitylistcomponents/AccountNewOpen/DetailYmt.vue'], resolve)
      }
    },
    {
      path: '/processingTagExport/:type/:tradedate',
      name: 'processingTagExport',
      component: function (resolve) {
        require(['@/components/marketStability/stabilitylistcomponents/AccountNewOpen/ProcessingTagExport.vue'], resolve)
      }
    },
    {
      path: '/financeLoansecOpen/:type/:tradDate/:securityId',  //  融资融券弹出框
      name: 'financeLoansecOpen',
      component: function (resolve) {
        require(['@/components/analysisTool/MarginTrading/securitiesMarginTrading/openNewWindow.vue'], resolve)
      }
    }
  ]
}
export default NewOpenWindow;
