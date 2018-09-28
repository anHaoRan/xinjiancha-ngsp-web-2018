import subMixIn from '../../subMixIn'
export default {
  props: [],
  components: {},
  mixins: [subMixIn],
  data () {
    return {
      flowList: 'flowList'
    }
  },
  computed: {},
  watch: {},
  methods: {
    getOperateStatus(row, type) {
      let operate = ''
      if (type === 'one') {
        if (row.operateProcess === '处理') {
          operate = '2'
        }
      } else if (type === 'two' || type === 'three') {
        operate = '1'
      }
      return operate
    },
    handle_obd_flow (row, type) {
      this.$router.push({
        path: '/surveyFormPage', query: {operate: this.getOperateStatus(row, type), taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handle_sls_flow (row, type) {
      this.$router.push({
        path: '/selfSupervisionFormPage', query: {operate: this.getOperateStatus(row, type), taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handle_sls (row, type) { // eslint-disable-line
      let isoperateCheck = ''
      if (type === 'one') {
        if (row.operateProcess == '处理') {
          isoperateCheck = '2'
        }
      }
      if (type === 'two') {
        isoperateCheck = '1'
      }
      if (type === 'three') {
        isoperateCheck = '1'
      }
      switch (row.localStatus) {
        case '创建中':
          this.$router.push({
            path: '/processform', query: {isoperateCheck: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, activityName: row.activityName, from: this.flowList}
          })
          break
        case '审核中':
          this.$router.push({
            path: '/checkform', query: {isoperateCheck: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, activityName: row.activityName, from: this.flowList}
          })
          break
        case '分配中':
          this.$router.push({
            path: '/assignform', query: {isoperateCheck: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, activityName: row.activityName, from: this.flowList}
          })
          break
        case '待发函':
          this.$router.push({
            path: '/sentform', query: {isoperateCheck: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, activityName: row.activityName, from: this.flowList}
          })
          break
        case '待回函':
          this.$router.push({
            path: '/returnform', query: {isoperateCheck: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, activityName: row.activityName, from: this.flowList}
          })
          break
        case '待归档':
          this.$router.push({
            path: '/archiveform', query: {isoperateCheck: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, activityName: row.activityName, from: this.flowList}
          })
          break
        case '已归档':
          this.$router.push({
            path: '/finishform', query: {isoperateCheck: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, activityName: row.activityName, from: this.flowList}
          })
          break
      }
    },
    handle_sendletter_flow (row, type) {
      this.$router.push({
        path: '/sendLetterFormPage', query: {operate: this.getOperateStatus(row, type), taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handle_replyletter_flow (row, type) {
      this.$router.push({
        path: '/replyLetterFormPage', query: {operate: this.getOperateStatus(row, type), taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handle_data_flow (row, type) {
      this.$router.push({
        path: '/dataAssocFormPage', query: {operate: this.getOperateStatus(row, type), taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    // handle_data (row, type) { // eslint-disable-line
    //   let isoperateCheck = ''
    //   if (type === 'one') {
    //     if (row.operateProcess == '处理') {
    //       isoperateCheck = '2'
    //     }
    //   }
    //   if (type === 'two') {
    //     isoperateCheck = '1'
    //   }
    //   if (type === 'three') {
    //     isoperateCheck = '1'
    //   }
    //   switch (row.localStatus) {
    //     case '分配中':
    //       this.$router.push({
    //         path: '/dataAssociationassign', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
    //       })
    //       break
    //     case '拟稿中':
    //       this.$router.push({
    //         path: '/dataAssociationdraft', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
    //       })
    //       break
    //     case '复核中':
    //       this.$router.push({
    //         path: '/dataAssociationdraft', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
    //       })
    //       break
    //     case '审核中':
    //       this.$router.push({
    //         path: '/dataAssociationdraft', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
    //       })
    //       break
    //     case '审批中':
    //       this.$router.push({
    //         path: '/dataAssociationdraft', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
    //       })
    //       break
    //     case '确认中':
    //       this.$router.push({
    //         path: '/dataAssociationdraft', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
    //       })
    //       break
    //     case '待发函':
    //       this.$router.push({
    //         path: '/dataAssociationsendletter', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
    //       })
    //       break
    //     case '办结':
    //       this.$router.push({
    //         path: '/dataAssociationsendletter', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
    //       })
    //       break
    //   }
    // },
    handle_lyr (row, type) { // eslint-disable-line
      let isoperateCheck = ''
      if (type === 'one') {
        if (row.operateProcess == '处理') {
          isoperateCheck = '2'
        }
      }
      if (type === 'two') {
        isoperateCheck = '1'
      }
      if (type === 'three') {
        isoperateCheck = '1'
      }
      this.$router.push({
        path: '/halfform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
      // switch (row.localStatus) {
      //   case '创建中':
      //     this.$router.push({
      //       path: '/halfform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      //     })
      //     break
      //   case '判断中':
      //     this.$router.push({
      //       path: '/halfform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      //     })
      //     break
      //   case '分配中':
      //     this.$router.push({
      //       path: '/halfform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      //     })
      //     break
      //   case '拟稿中':
      //     this.$router.push({
      //       path: '/fullform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      //     })
      //     break
      //   case '复核中':
      //     this.$router.push({
      //       path: '/fullform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      //     })
      //     break
      //   case '审核中':
      //     this.$router.push({
      //       path: '/fullform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      //     })
      //     break
      //   case '审批中':
      //     this.$router.push({
      //       path: '/fullform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      //     })
      //     break
      //   case '确认中':
      //     this.$router.push({
      //       path: '/fullform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      //     })
      //     break
      //   case '办结':
      //     this.$router.push({
      //       path: '/fullform', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      //     })
      //     break
      // }
    },
    handle_specialwork (row, type) {
      let isoperateCheck = ''
      if (type === 'one') {
        if (row.operateProcess == '处理') {
          isoperateCheck = '2'
        }
      }
      if (type === 'two') {
        isoperateCheck = '1'
      }
      if (type === 'three') {
        isoperateCheck = '1'
      }
      this.$router.push({
        path: '/creatingSpecialWork', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handle_cal (row, type) {
      let isoperateCheck = ''
      if (type === 'one') {
        if (row.operateProcess == '处理') {
          isoperateCheck = '2'
        }
      }
      if (type === 'two') {
        isoperateCheck = '1'
      }
      if (type === 'three') {
        isoperateCheck = '1'
      }
      this.$router.push({
        path: '/temporaryCalculationForm', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handle_access (row, type) {
      let isoperateCheck = ''
      if (type === 'one') {
        if (row.operateProcess == '处理') {
          isoperateCheck = '2'
        }
      }
      if (type === 'two') {
        isoperateCheck = '1'
      }
      if (type === 'three') {
        isoperateCheck = '1'
      }
      this.$router.push({
        path: '/accessRequestForm', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handle_demand (row, type) {
      let isoperateCheck = ''
      if (type === 'one') {
        if (row.operateProcess == '处理') {
          isoperateCheck = '2'
        }
      }
      if (type === 'two') {
        isoperateCheck = '1'
      }
      if (type === 'three') {
        isoperateCheck = '1'
      }
      this.$router.push({
        path: '/demandManagementForm', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handle_clueReport (row, type) {
      let isoperateCheck = ''
      if (type === 'one') {
        if (row.operateProcess == '处理') {
          isoperateCheck = '2'
        }
      }
      if (type === 'two') {
        isoperateCheck = '1'
      }
      if (type === 'three') {
        isoperateCheck = '1'
      }
      this.$router.push({
        path: '/clueReportForm', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handle_letterBorrow (row, type) {
      let isoperateCheck = ''
      if (type === 'one') {
        if (row.operateProcess == '处理') {
          isoperateCheck = '2'
        }
      }
      if (type === 'two') {
        isoperateCheck = '1'
      }
      if (type === 'three') {
        isoperateCheck = '1'
      }
      this.$router.push({
        path: '/letterBorrowForm', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handle_letterLend(row, type) {
      let isoperateCheck = ''
      if (type === 'one') {
        if (row.operateProcess == '处理') {
          isoperateCheck = '2'
        }
      }
      if (type === 'two') {
        isoperateCheck = '1'
      }
      if (type === 'three') {
        isoperateCheck = '1'
      }
      this.$router.push({
        path: '/letterLendFormPage', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handle_marketAnalysis (row, type) {
      let isoperateCheck = ''
      if (type === 'one') {
        if (row.operateProcess == '处理') {
          isoperateCheck = '2'
        }
      }
      if (type === 'two') {
        isoperateCheck = '1'
      }
      if (type === 'three') {
        isoperateCheck = '1'
      }
      this.$router.push({
        path: '/marketAnalysisForm', query: {operate: isoperateCheck, taskId: row.taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handle_logAudit (row, type) {
      let isoperateCheck = ''
      if (type === 'one') {
        if (row.operateProcess == '处理') {
          isoperateCheck = '2'
        }
      }
      if (type === 'two') {
        isoperateCheck = '1'
      }
      if (type === 'three') {
        isoperateCheck = '1'
      }
      let taskId = ''
      if (row.localStatus !== '办结') {
        for (let i = 0; i < row.currentUsers.split(',').length; i++) {
          if (row.currentUsers.split(',')[i] === this.gfnGetUsername()) {
            for (let j = 0; j < row.taskId.split(',').length; j++) {
              if (i === j) {
                taskId = row.taskId.split(',')[j]
              }
            }
          }
        }
      }
      this.$router.push({
        path: '/logAuditForm', query: {operate: isoperateCheck, taskId: taskId, instanceId: row.instanceId, processStatus: row.localStatusCode, from: this.flowList}
      })
    },
    handleform (row, type) { // eslint-disable-line
      switch (row.localProcessName) {
        case '自律监管':
          // this.handle_sls(row, type)
          this.handle_sls_flow(row, type) // 重构后
          break
        case '调取资料':
          // this.handle_obd(row, type)
          this.handle_obd_flow(row, type) // 重构后
          break
        case '联合监管发函':
          // this.handle_lettersend(row, type)
          this.handle_sendletter_flow(row, type) // 重构后
          break
        case '联合监管复函':
          // this.handle_letterreply(row, type)
          this.handle_replyletter_flow(row, type) // 重构后
          break
        case '数据协查':
          this.handle_data_flow(row, type)
          break
        case '舆情分析':
          this.handle_lyr(row, type)
          break
        case '专项工作':
          this.handle_specialwork(row, type)
          break
        case '临时计算':
          this.handle_cal(row, type)
          break
        case '权限申请':
          this.handle_access(row, type)
          break
        case '需求管理':
          this.handle_demand(row, type)
          break
        case '市场分析':
          this.handle_marketAnalysis(row, type)
          break
        case '日志审计':
          this.handle_logAudit(row, type)
          break
        case '线索报告':
          this.handle_clueReport(row, type)
          break
        case '函件借阅':
          this.handle_letterBorrow(row, type)
          break
        case '函件传阅':
          this.handle_letterLend(row, type)
          break
        case '重点监控账户组':
          if (type == 'one') {
            if (row.localStatus === '审批中') {
              this.$router.push({
                name: 'checkBuiltAccountGroup',
                query: {
                  instanceId: row.instanceId,
                  taskId: row.taskId,
                  processStatus: row.localStatusCode,
                  from: this.flowList
                }
              })
            } else if (row.localStatus === '确认中') {
              this.$router.push({
                name: 'affirmBuiltAccountGroup',
                query: {
                  instanceId: row.instanceId,
                  taskId: row.taskId,
                  processStatus: row.localStatusCode,
                  from: this.flowList
                }
              })
            } else {
              this.$router.push({
                name: 'newBuiltAccountGroup',
                query: {
                  instanceId: row.instanceId,
                  taskId: row.taskId,
                  processStatus: row.localStatusCode,
                  from: this.flowList
                }
              })
            }
          } else {
            this.$router.push({
              name: 'overBuiltAccountGroup',
              query: {
                instanceId: row.instanceId,
                taskId: row.taskId,
                processStatus: row.localStatusCode,
                from: this.flowList
              }
            })
          }
          break
        case '重点监控证券':
          if (type == 'one') {
            if (row.localStatus === '审批中') {
              this.$router.push({
                name: 'checkMonitorSecurity',
                query: {
                  instanceId: row.instanceId,
                  taskId: row.taskId,
                  processStatus: row.localStatusCode,
                  from: this.flowList
                }
              })
            } else if (row.localStatus === '确认中') {
              this.$router.push({
                name: 'affirmMonitorSecurity',
                query: {
                  instanceId: row.instanceId,
                  taskId: row.taskId,
                  processStatus: row.localStatusCode,
                  from: this.flowList
                }
              })
            } else {
              this.$router.push({
                name: 'newBuiltSecurity',
                query: {
                  instanceId: row.instanceId,
                  taskId: row.taskId,
                  processStatus: row.localStatusCode,
                  from: this.flowList
                }
              })
            }
          } else {
            this.$router.push({
              name: 'overMonitorSecurity',
              query: {
                instanceId: row.instanceId,
                taskId: row.taskId,
                processStatus: row.localStatusCode,
                from: this.flowList
              }
            })
          }
          break
      }
    }
  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
