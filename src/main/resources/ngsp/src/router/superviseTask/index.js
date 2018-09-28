const superviseTaskRouter = {
  path: '/superviseTask', // 监察任务
  name: 'superviseTask',
  component: function (resolve) {
    require(['@/router/superviseTask/index.vue'], resolve)
  },
  children: [
    {
      path: '/topPage', // 我的流程列表
      name: 'topPage',
      component: function (resolve) {
        require(['@/components/superviseTask/superviseTaskTopPage/topPage'], resolve)
      }
    },
    {
      path: '/disciplinaryRegistrationList', // 重点监控账户-纪律处分登记单列表（可进行处理，删除操作）
      name: 'disciplinaryRegistrationList',
      component: function (resolve) {
        require(['@/components/superviseTask/keyMonitoringAccounts/disciplinaryRegistrationList'], resolve)
      }
    },
    {
      path: '/disciplinaryRegistrationForm', // 重点监控账户-纪律处分登记单表单页面
      name: 'disciplinaryRegistrationForm',
      component: function (resolve) {
        require(['@/components/superviseTask/keyMonitoringAccounts/disciplinaryRegistrationForm'], resolve)
      }
    },
    {
      path: '/keyMonitoringAccountQuery', // 重点监控账户-重点监控账户列表查询页面
      name: 'keyMonitoringAccountQuery',
      component: function (resolve) {
        require(['@/components/superviseTask/keyMonitoringAccounts/keyMonitoringAccountQuery'], resolve)
      }
    },
    {
      path: '/registrationFormQuery', // 重点监控账户-纪律处分登记单列表查询
      name: 'registrationFormQuery',
      component: function (resolve) {
        require(['@/components/superviseTask/keyMonitoringAccounts/registrationFormQuery'], resolve)
      }
    },
    {
      path: '/feedbackAccountQuery', // 重点监控账户-中登反馈账户查询列表页面
      name: 'feedbackAccountQuery',
      component: function (resolve) {
        require(['@/components/superviseTask/keyMonitoringAccounts/feedbackAccountQuery'], resolve)
      }
    },
    {
      path: '/selfregulation', // 自律监管重构
      name: 'selfregulation',
      component: function (resolve) {
        require(['@/components/superviseTask/selfsupervision/list'], resolve)
      }
    },
    {
      path: '/selfSupervisionFormPage', // 自律监管重构表单
      name: 'selfSupervisionFormPage',
      component: function (resolve) {
        require(['@/components/superviseTask/selfsupervision/form'], resolve)
      }
    },
    {
      path: '/informationtable', // 调取资料列表重构
      name: 'informationtable',
      component: function (resolve) {
        require(['@/components/superviseTask/retrieveinformation/list'], resolve)
      }
    },
    {
      path: '/surveyFormPage', // 调取资料表单重构
      name: 'surveyFormPage',
      component: function (resolve) {
        require(['@/components/superviseTask/retrieveinformation/form'], resolve)
      }
    },
    {
      path: '/sendLetterFormPage', // 联合监管发函表单重构
      name: 'sendLetterFormPage',
      component: function (resolve) {
        require(['@/components/superviseTask/jointregulation/sendletter/form'], resolve)
      }
    },
    {
      path: '/replyLetterFormPage', // 联合监管复函表单重构
      name: 'replyLetterFormPage',
      component: function (resolve) {
        require(['@/components/superviseTask/jointregulation/replyletter/form'], resolve)
      }
    },
    {
      path: '/letterlist', // 联合监管
      name: 'letterlist',
      component: function (resolve) {
        require(['@/components/superviseTask/jointregulation/letterlist'], resolve)
      }
    },
    {
      path: '/tablelist', // 数据协查 跳重构的页面
      name: 'tablelist',
      component: function (resolve) {
        require(['@/components/superviseTask/dataAssociation/tablelist2'], resolve)
      }
    },
    {
      path: '/tablelist2', // 数据协查 原来的页面
      name: 'tablelist2',
      component: function (resolve) {
        require(['@/components/superviseTask/dataAssociation/tablelist'], resolve)
      }
    },
    {
      path: '/dataAssocFormPage', // 数据协查表单重构
      name: 'dataAssocFormPage',
      component: function (resolve) {
        require(['@/components/superviseTask/dataAssociation/dataAssocFormPage'], resolve)
      }
    },
    {
      path: '/dataAssociationdraft', // 数据协查表单
      name: 'dataAssociationdraft',
      component: function (resolve) {
        require(['@/components/superviseTask/dataAssociation/dataAssociationdraft'], resolve)
      }
    },
    {
      path: '/dataAssociationassign', // 数据协查表单
      name: 'dataAssociationassign',
      component: function (resolve) {
        require(['@/components/superviseTask/dataAssociation/dataAssociationassign'], resolve)
      }
    },
    {
      path: '/dataAssociationsendletter', // 数据协查表单
      name: 'dataAssociationsendletter',
      component: function (resolve) {
        require(['@/components/superviseTask/dataAssociation/dataAssociationsendletter'], resolve)
      }
    },
    {
      path: '/lyricTablelist', // 舆情分析
      name: 'lyricTablelist',
      component: function (resolve) {
        require(['@/components/superviseTask/lyricAnalisis/list'], resolve)
      }
    },
    {
      path: '/halfform', // 舆情分析表单(已重构)
      name: 'halfform',
      component: function (resolve) {
        require(['@/components/superviseTask/lyricAnalisis/halfform'], resolve)
      }
    },
    {
      path: '/fullform', // 舆情分析表单
      name: 'fullform',
      component: function (resolve) {
        require(['@/components/superviseTask/lyricAnalisis/fullform'], resolve)
      }
    },
    {
      path: '/specialWorkTablelist', // 专项工作
      name: 'specialWorkTablelist',
      component: function (resolve) {
        require(['@/components/superviseTask/specialWork/specialWorkTablelist'], resolve)
      }
    },
    {
      path: '/creatingSpecialWork', // 专项工作表单
      name: 'creatingSpecialWork',
      component: function (resolve) {
        require(['@/components/superviseTask/specialWork/creatingSpecialWork'], resolve)
      }
    },
    {
      path: '/temporaryCalculationTablelist', // 临时计算
      name: 'temporaryCalculationTablelist',
      component: function (resolve) {
        require(['@/components/superviseTask/temporaryCalculation/temporaryCalculationTablelist'], resolve)
      }
    },
    {
      path: '/temporaryCalculationForm', // 临时计算表单
      name: 'temporaryCalculationForm',
      component: function (resolve) {
        require(['@/components/superviseTask/temporaryCalculation/temporaryCalculationForm'], resolve)
      }
    },
    {
      path: '/accessRequestTablelist', // 权限申请
      name: 'accessRequestTablelist',
      component: function (resolve) {
        require(['@/components/superviseTask/accessRequest/accessRequestTablelist'], resolve)
      }
    },
    {
      path: '/accessRequestForm', // 权限申请表单
      name: 'accessRequestForm',
      component: function (resolve) {
        require(['@/components/superviseTask/accessRequest/accessRequestForm'], resolve)
      }
    },
    {
      path: '/demandManagementTablelist', // 需求管理
      name: 'demandManagementTablelist',
      component: function (resolve) {
        require(['@/components/superviseTask/demandManagement/demandManagementTablelist'], resolve)
      }
    },
    {
      path: '/demandManagementForm', // 需求管理表单
      name: 'demandManagementForm',
      component: function (resolve) {
        require(['@/components/superviseTask/demandManagement/demandManagementForm'], resolve)
      }
    },
    {
      path: '/letterBorrowTablelist', // 函件借阅
      name: 'letterBorrowTablelist',
      component: function (resolve) {
        require(['@/components/superviseTask/letterBorrow/list'], resolve)
      }
    },
    {
      path: '/letterBorrowForm', // 函件借阅表单
      name: 'letterBorrowForm',
      component: function (resolve) {
        require(['@/components/superviseTask/letterBorrow/form'], resolve)
      }
    },
    {
      path: '/letterLendFormPage', // 函件传阅表单
      name: 'letterLendFormPage',
      component: function (resolve) {
        require(['@/components/superviseTask/letterBorrow/letterLendFormPage'], resolve)
      }
    },
    {
      path: '/marketAnalysisTable', // 市场分析
      name: 'marketAnalysisTable',
      component: function (resolve) {
        require(['@/components/superviseTask/marketAnalysis/marketAnalysisTable'], resolve)
      }
    },
    {
      path: '/marketAnalysisForm', // 市场分析表单
      name: 'marketAnalysisForm',
      component: function (resolve) {
        require(['@/components/superviseTask/marketAnalysis/marketAnalysisForm'], resolve)
      }
    },
    {
      path: '/focusMonitorSecurity', // 重点监控证券列表
      name: 'focusMonitorSecurity',
      component: function (resolve) {
        require(['@/components/superviseTask/focusMonitorSecurity'], resolve)
      }
    },
    {
      path: '/newBuiltSecurity', // 重点监控证券新建
      name: 'newBuiltSecurity',
      component: function (resolve) {
        require(['@/components/superviseTask/focusMonitorSecurity/newBuiltSecurity'], resolve)
      }
    },
    {
      path: '/changeMonitorSecurity', // 重点监控证券变更
      name: 'changeMonitorSecurity',
      component: function (resolve) {
        require(['@/components/superviseTask/focusMonitorSecurity/changeMonitorSecurity'], resolve)
      }
    },
    {
      path: '/checkMonitorSecurity', // 重点监控证券审核
      name: 'checkMonitorSecurity',
      component: function (resolve) {
        require(['@/components/superviseTask/focusMonitorSecurity/checkMonitorSecurity'], resolve)
      }
    },
    {
      path: '/affirmMonitorSecurity', // 重点监控证券确认
      name: 'affirmMonitorSecurity',
      component: function (resolve) {
        require(['@/components/superviseTask/focusMonitorSecurity/affirmMonitorSecurity'], resolve)
      }
    },
    {
      path: '/overMonitorSecurity', // 重点监控证券办结
      name: 'overMonitorSecurity',
      component: function (resolve) {
        require(['@/components/superviseTask/focusMonitorSecurity/overMonitorSecurity'], resolve)
      }
    },
    {
      path: '/focusMonitorAccountGroup', // 重点监控账户组列表查询
      name: 'focusMonitorAccountGroup',
      component: function (resolve) {
        require(['@/components/superviseTask/focusMonitorAccountGroup'], resolve)
      }
    },
    {
      path: '/newBuiltAccountGroup', // 重点监控账户组新建
      name: 'newBuiltAccountGroup',
      component: function (resolve) {
        require(['@/components/superviseTask/focusMonitorAccountGroup/newBuiltAccountGroup'], resolve)
      }
    },
    {
      path: '/checkBuiltAccountGroup', // 重点监控账户组审核
      name: 'checkBuiltAccountGroup',
      component: function (resolve) {
        require(['@/components/superviseTask/focusMonitorAccountGroup/checkBuiltAccountGroup'], resolve)
      }
    },
    {
      path: '/changeBuiltAccountGroup', // 重点监控账户组变更
      name: 'changeBuiltAccountGroup',
      component: function (resolve) {
        require(['@/components/superviseTask/focusMonitorAccountGroup/changeBuiltAccountGroup'], resolve)
      }
    },
    {
      path: '/overBuiltAccountGroup', // 重点监控账户组办结
      name: 'overBuiltAccountGroup',
      component: function (resolve) {
        require(['@/components/superviseTask/focusMonitorAccountGroup/overBuiltAccountGroup'], resolve)
      }
    },
    {
      path: '/affirmBuiltAccountGroup', // 重点监控账户组确认
      name: 'affirmBuiltAccountGroup',
      component: function (resolve) {
        require(['@/components/superviseTask/focusMonitorAccountGroup/affirmBuiltAccountGroup'], resolve)
      }
    },
    {
      path: '/logAuditTablelist', // 日志审计
      name: 'logAuditTablelist',
      component: function (resolve) {
        require(['@/components/superviseTask/logAudit/logAuditTablelist'], resolve)
      }
    },
    {
      path: '/logAuditForm', // 日志审计表单
      name: 'logAuditForm',
      component: function (resolve) {
        require(['@/components/superviseTask/logAudit/logAuditForm'], resolve)
      }
    },
    {
      path: '/clueReportTablelist', // 线索报告
      name: 'clueReportTablelist',
      component: function (resolve) {
        require(['@/components/superviseTask/clueReport/list'], resolve)
      }
    },
    {
      path: '/clueReportForm', // 线索报告表单
      name: 'clueReportForm',
      component: function (resolve) {
        require(['@/components/superviseTask/clueReport/form'], resolve)
      }
    }
  ]
}

export default superviseTaskRouter;
