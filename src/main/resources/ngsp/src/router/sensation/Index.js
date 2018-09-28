const sensationRouter = {
  path: '/sensation',
  name: 'sensation',
  component: function (resolve) {
    require(['@/router/sensation/Index.vue'], resolve)
  },
  children: [
    {
      path: '/sensationHome',
      name: 'sensationHome',
      component: function (resolve) {
        require(['@/components/sensation/home/Index.vue'], resolve)
      }
    },
    {
      path: '/sensationHomeDetail/:id',
      name: 'sensationHomeDetail',
      component: function (resolve) {
        require(['@/components/sensation/home/details/Index.vue'], resolve)
      }
    },
    {
      path: '/sensationDisplay',
      name: 'sensationDisplay',
      component: function (resolve) {
        require(['@/components/sensation/display/Index.vue'], resolve)
      }
    },
    {
      path: '/sensationDisplayDetail/:id',
      name: 'sensationDisplayDetail',
      component: function (resolve) {
        require(['@/components/sensation/display/details/Index.vue'], resolve)
      }
    },
    {
      path: '/announcement',
      name: 'announcement',
      component: function (resolve) {
        require(['@/components/sensation/display/announcement/Index.vue'], resolve)
      }
    },
    {
      path: '/thematicTracking',
      name: 'thematicTracking',
      component: function (resolve) {
        require(['@/components/sensation/monitor/thematicTracking/Index.vue'], resolve)
      }
    },
    {
      path: '/thematicTrackingDetail',
      name: 'thematicTrackingDetail',
      component: function (resolve) {
        require(['@/components/sensation/monitor/thematicTracking/detail/Index.vue'], resolve)
      }
    }
  ]
}
export default sensationRouter
