
const publicSuperviseRouter = {
  path: '/publicSupervise',
  name: 'publicSupervise',
  component: function (resolve) {
    require(['@/router/publicSupervise'], resolve)
  }
}

export default publicSuperviseRouter;
