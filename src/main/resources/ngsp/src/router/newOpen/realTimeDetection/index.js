export default {
  path: '/realTimeDetection/:params',
  name: 'realTimeDetection',
  component: function (resolve) {
    require(['@/components/analysisTool/realTimeDetection/Index.vue'], resolve)
  }
}
