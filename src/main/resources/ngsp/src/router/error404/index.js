const error404Router = {
  path: '/404',
  name: 'error404',
  component: function (resolve) {
    require(['@/router/error404/index.vue'], resolve)
  }
}

export default error404Router;
