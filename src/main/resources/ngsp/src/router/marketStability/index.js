const MarketStabilityRouter = {
  path: '/marketStability',
  name: 'marketStability',
  component: function (resolve) {
    require(['@/router/marketStability/index.vue'], resolve)
  },
  children: [
    {
      path: '/stabilityList',
      name: 'stabilityList',
      component: function (resolve) {
        require(['@/components/marketStability/StabilityList.vue'], resolve)
      }
    },
    {
      path: '/eDocumentSave',
      name: 'eDocumentSave',
      component: function (resolve) {
        require(['@/components/marketStability/eDocumentSave'], resolve)
      }
    },
    {
      path: '/eDocumentDetailSave',
      name: 'eDocumentDetailSave',
      component: function (resolve) {
        require(['@/components/marketStability/eDocumentDetailSave'], resolve)
      }
    }
  ]
}
export default MarketStabilityRouter;
