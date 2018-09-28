export default {
  path: '/orderParticulars/:accountId/:pageIndex/:pageRows',
  name: 'orderParticulars',
  component: function (resolve) {
    require(['@/components/analysisTool/participatorType/orderParticulars.vue'], resolve)
  }
};
