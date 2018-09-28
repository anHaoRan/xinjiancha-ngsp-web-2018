const systemManageRouter = {
  path: '/systemManage',
  name: 'systemManage',
  component: function (resolve) {
    require(['@/router/systemManage/index.vue'], resolve)
  },
  children: [
    {
      path: '/moduleManage',
      name: 'moduleManage',
      component: function (resolve) {
        require(['@/components/systemManage/moduleManage'], resolve)
      }
    }, {
      path: '/templateManage',
      name: 'templateManage',
      component: function (resolve) {
        require(['@/components/systemManage/templateManage'], resolve)
      }
    }, {
      path: '/securityPlateSet', // 证券板块设置
      name: 'securityPlateSet',
      component: function (resolve) {
        require(['@/components/systemManage/securityPlateSet/securityPlateSet'], resolve)
      }
    }, {
      path: '/accountTypeSet', // 账户组类型设置
      name: 'accountTypeSet',
      component: function (resolve) {
        require(['@/components/systemManage/securityPlateSet/accountTypeSet'], resolve)
      }
    }, {
      path: '/accountGroup', // 账户组设置
      name: 'accountGroup',
      component: function (resolve) {
        require(['@/components/systemManage/securityPlateSet/accountGroup'], resolve)
      }
    }, {
      path: '/accountGroupCode', // 账户组设置- 增加代码
      name: 'accountGroupCode',
      component: function (resolve) {
        require(['@/components/systemManage/securityPlateSet/accountGroupCode'], resolve)
      }
    }, {
      path: '/monitoringObjectSet', // 监控对象设置
      name: 'monitoringObjectSet',
      component: function (resolve) {
        require(['@/components/systemManage/securityPlateSet/monitoringObjectSet'], resolve)
      }
    }, {
      path: '/monitoringObjectSetTab', // 监控对象设置tab 表
      name: 'monitoringObjectSetTab',
      component: function (resolve) {
        require(['@/components/systemManage/securityPlateSet/monitoringObjectSetTab'], resolve)
      }
    }, {
      path: '/emphasisMontioring', // 重点监控设置
      name: 'emphasisMontioring',
      component: function (resolve) {
        require(['@/components/systemManage/securityPlateSet/emphasisMontioring'], resolve)
      }
    }, {
      path: '/plateSet', // 证券板块列表- 证券板块编号
      name: 'plateSet',
      component: function (resolve) {
        require(['@/components/systemManage/securityPlateSet/plateSet'], resolve)
      }
    }, {
      path: '/systemParameterSetting', //  系统管理/产品权限管理/系统参数设置
      name: 'systemParameterSetting',
      component: function (resolve) {
        require(['@/components/systemManage/securityPlateSet/systemParameterSetting'], resolve)
      }
    }, {
      path: '/travelAgent',
      name: 'travelAgent',
      component: function (resolve) {
        require(['@/components/systemManage/otherManage/travelAgent'], resolve)
      }
    }, {
      path: '/onlineUserView', // 证券板块设置
      name: 'onlineUserView',
      component: function (resolve) {
        require(['@/components/systemManage/otherManage/onlineUserView'], resolve)
      }
    }, {
      path: '/userManagement',
      name: 'userManagement',
      component: function (resolve) {
        require(['@/components/systemManage/userManage'], resolve)
      }
    }
  ]
  // children: [
  //   {
  //     path: '/productAuthorityManagement',
  //     name: 'productAuthorityManagement',
  //     component: function (resolve) {
  //       require(['@/components/systemManage/productAuthorityManagement/productAuthorityManagement.vue'], resolve)
  //     }
  //   },
  //   {
  //     path: '/accountGroupSettings',
  //     name: 'accountGroupSettings',
  //     component: function (resolve) {
  //       require(['@/components/systemManage/productAuthorityManagement/productAuthorityManagementComponents/accountGroupSettings.vue'], resolve)
  //     }
  //   },
  //   {
  //     path: '/accountGroupTypeSettings',
  //     name: 'accountGroupTypeSettings',
  //     component: function (resolve) {
  //       require(['@/components/systemManage/productAuthorityManagement/productAuthorityManagementComponents/accountGroupTypeSettings.vue'], resolve)
  //     }
  //   },
  //   {
  //     path: '/insTypeSettings',
  //     name: 'insTypeSettings',
  //     component: function (resolve) {
  //       require(['@/components/systemManage/productAuthorityManagement/productAuthorityManagementComponents/insTypeSettings.vue'], resolve)
  //     }
  //   },
  //   {
  //     path: '/roleKeyMonitoringSettings',
  //     name: 'roleKeyMonitoringSettings',
  //     component: function (resolve) {
  //       require(['@/components/systemManage/productAuthorityManagement/productAuthorityManagementComponents/roleKeyMonitoringSettings.vue'], resolve)
  //     }
  //   },
  //   {
  //     path: '/supervisionSettings',
  //     name: 'supervisionSettings',
  //     component: function (resolve) {
  //       require(['@/components/systemManage/productAuthorityManagement/productAuthorityManagementComponents/supervisionSettings.vue'], resolve)
  //     }
  //   },
  // ]
}

export default systemManageRouter
