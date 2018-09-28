export default {
  path: '/capitalFlowDetail',
  name: 'capitalFlowDetail',
  component: function (resolve) {
    require(['@/components/marketSupervise/capitalFlow/detailTable.vue'], resolve)
  }
}
