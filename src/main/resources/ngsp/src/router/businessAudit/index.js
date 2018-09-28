const businessAuditRouter = {
  path: '/businessAudit',
  name: 'businessAudit',
  component: function (resolve) {
    require(['@/components/businessAudit/index.vue'], resolve)
  }
}

export default businessAuditRouter;
