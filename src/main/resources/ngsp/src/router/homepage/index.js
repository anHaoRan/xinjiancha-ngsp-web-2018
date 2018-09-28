const homepageRouter = {
  path: '/homepage',
  name: 'homepage',
  component: function (resolve) {
    require(['@/router/homepage/index.vue'], resolve)
  }
}

export default homepageRouter;
