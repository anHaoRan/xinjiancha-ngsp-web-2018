<template>
    <div class="index">
        <el-card>
            <div slot="header" class="clearfix">
                <el-radio-group v-model="modelType" size="small" class="el-radio-group">
                    <el-radio-button label="1">固化模型</el-radio-button>
                    <el-radio-button label="2">自定义模型</el-radio-button>
                </el-radio-group>
                <el-button
                        type="info"
                        size="small"
                        @click="reset">清空
                </el-button>
                <el-button
                        type="primary"
                        size="small"
                        @click="select">查询
                </el-button>
            </div>
            <el-form :inline="true" :model="selectParams" ref="selectParams" style="margin-top: 20px;">
                <el-row>
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="模型名称">
                            <el-input type="text" size="small" v-model="selectParams.ruleName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="规则监控类型">
                            <el-input type="text" size="small" v-model="selectParams.ruleType"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <s-table ref="managementTable" title="查询结果" :columns="columns" :loading="isLoading" :data="totalData"
                 :isPageination="false">
            <el-dropdown @command="handleDownload" slot="elCardHeader">
                <el-button type="info" size="small">
                    导出<i class="el-icon-arrow-down el-icon-right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="excel">
                        <i class="el-icon-document"></i>导出为EXCEL
                    </el-dropdown-item>
                    <el-dropdown-item command="csv">
                        <i class="el-icon-tickets"></i>导出为CSV
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </s-table>

        <el-dialog
                class="early-warning-dialog"
                title="新增实例"
                :visible.sync="dialogVisible"
                width="50%">
            <div>
                <h3>基础信息</h3>
                <el-form :inline="true" :model="dialogSelectParams" ref="dialogSelectParams" :rules="rules"
                         label-width="80px">
                    <el-row>
                        <el-col :xl="8" :md="12" :sm="24">
                            <el-form-item label="模型编号">
                                <el-input type="text" size="small" readonly
                                          v-model="dialogSelectParams.rule_code"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xl="8" :md="12" :sm="24">
                            <el-form-item label="预警状态" prop="rule_status">
                                <el-select v-model="dialogSelectParams.rule_status" size="small" filterable>
                                    <el-option v-for="(item,index) in ruleStatusList"
                                               :key="index"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xl="8" :md="12" :sm="24">
                            <el-form-item label="监控对象" prop="watch_ob_id">
                                <el-select v-model="dialogSelectParams.watch_ob_id" size="small" filterable>
                                    <el-option v-for="(item,index) in WatchObList"
                                               :key="index"
                                               :label="item.watch_ob_name"
                                               :value="item.watch_ob_id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-tabs v-model="dialogActiveName" @tab-click="handleTabsClickDialog">
                    <el-tab-pane label="参数" name="parameter">
                        <margin-table :isPageination="false" :height="240" :columns="dialogColumns[1]"
                                      :data="dialogTotalData[1]">
                            <el-button type="info" size="small" slot="tableFooter"
                                       @click="handlerClickAddDialogTable('parameter')">新增
                            </el-button>
                        </margin-table>
                    </el-tab-pane>
                    <el-tab-pane label="门限" name="threshold">
                        <margin-table :isPageination="false" :height="240" :columns="dialogColumns[2]"
                                      :data="dialogTotalData[2]">
                            <el-button type="info" size="small" slot="tableFooter"
                                       @click="handlerClickAddDialogTable('threshold')">新增
                            </el-button>
                        </margin-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <span slot="footer">
                <el-button type="primary" size="small" @click="ajaxAddAlarmCase">确定</el-button>
                <el-button type="info" size="small" @click="dialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import {
    solidModelQuery, addAlarmCase, getWatchObList, solidModelExport, getRuleParam, getRuleLimit, updateRuleStatus
  } from '@/service/earlyWarning'
  import Operating from '@/components/base/Operating'
  import DialogInput from '../components/DialogInput'
  import ThresholdTable from './ThresholdTable'

  export default {
    name: 'index',
    props: [],
    components: {
      STable: () => import('@/components/base/STable'),
      MarginTable: () => import('@/components/base/MarginTable')
    },
    mixins: [],
    data () {
      return {
        isLoading: false,
        modelType: '1',
        selectParams: {
          ruleName: '',
          ruleType: ''
        },
        totalData: {
          data: [],
          total: 0,
          pageIndex: 1,
          pageRows: 10
        },
        columns: [
          {
            field: 'rule_code',
            align: 'center',
            label: '模型代码',
            width: '80'
          }, {
            field: 'rule_name',
            align: 'center',
            label: '模型名称',
            width: '150'
          }, {
            field: 'behavior_code',
            align: 'center',
            label: '规则监控类型',
            width: '100'
          }, {
            field: 'rule_grade',
            align: 'center',
            label: '预警级别',
            width: '100'
          }, {
            field: 'rule_status',
            align: 'center',
            label: '模型状态',
            width: '100',
            formatter: this.ruleStatusFormatter
          }, {
            field: 'rule_desc',
            align: 'center',
            label: '模型描述',
            width: '100'
          },
          // {
          //   field: 'rule_code',
          //   align: 'center',
          //   label: '模型阈值表',
          //   width: '100',
          //   template: ThresholdTable
          // },
          {
            field: 'rule_algorithm',
            align: 'center',
            label: '规则算法描述',
            width: '200'
          }, {
            field: 'trigger_mode',
            align: 'center',
            label: '触发模式',
            width: '100'
          }, {
            field: 'update_status_date',
            align: 'center',
            label: '更新日期',
            width: '100'
          }, {
            field: 'update_status_time',
            align: 'center',
            label: '更新时间',
            width: '100'
          }, {
            field: 'version',
            align: 'center',
            label: '版本',
            width: '100'
          }, {
            field: 'rule_code',
            align: 'center',
            label: '操作',
            width: '200',
            template: Operating,
            buttonList: [
              {
                label: '新增实例',
                func: this.handlerClickAdd
              }, {
                label: this.formatterButtonLabel,
                func: this.ajaxUpdateRuleStatus
              }
            ]
          }
        ],
        dialogVisible: false,
        dialogSelectParams: {
          rule_code: '',
          rule_status: '0',
          watch_ob_id: '',
        },
        rules: {
          rule_status: [
            {type: 'string', required: true, message: '请选择预警状态', trigger: 'change'}
          ],
          watch_ob_id: [
            {type: 'string', required: true, message: '请选择监控对象', trigger: 'change'}
          ]
        },
        dialogActiveName: 'parameter',
        dialogColumns: {
          1: [
            {
              field: 'parameter_name',
              align: 'center',
              label: '参数名称',
              readonly: true,
              template: DialogInput
            }, {
              field: 'parameter_value',
              align: 'center',
              label: '参数值',
              template: DialogInput
            }, {
              field: 'parameter_unit',
              align: 'center',
              label: '参数单位',
              readonly: true,
              template: DialogInput
            }
          ],
          2: [
            {
              field: 'limitation_name',
              align: 'center',
              label: '规则阀值名称',
              readonly: true,
              template: DialogInput
            }, {
              field: 'limitation_value',
              align: 'center',
              label: '门限值',
              template: DialogInput
            }, {
              field: 'limitation_unit',
              align: 'center',
              label: '门限单位',
              readonly: true,
              template: DialogInput
            }
          ]
        },
        dialogTotalData: {
          1: {
            data: [],
            total: 0,
            pageIndex: 1,
            pageRows: 10
          },
          2: {
            data: [],
            total: 0,
            pageIndex: 1,
            pageRows: 10
          }
        },
        WatchObList: [],
        ruleStatusList: [
          {
            label: '下线',
            value: '0'
          },
          {
            label: '准上线',
            value: '1'
          },
          {
            label: '上线',
            value: '2'
          }
        ]
      }
    },
    computed: {},
    watch: {},
    created () {
      this.ajaxSolidModelQuery()
      this.ajaxGetWatchObList()
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      select () {
        this.$refs['selectParams'].validate(valid => {
          if (valid) {
            this.ajaxSolidModelQuery()
          }
        })
      },
      reset () {
        this.$refs['selectParams'].resetFields()
      },
      ajaxSolidModelQuery () {
        this.isLoading = true
        solidModelQuery(this.selectParams).then(res => {
          this.isLoading = false
          this.totalData.data = res.bizData.metaData
        })
      },
      ajaxGetWatchObList () {
        getWatchObList().then(res => {
          this.WatchObList = res.bizData.metaData
        })
      },
      handleDownload (val) {
        let params = this.selectParams
        params.exportType = val
        let [...columns] = this.columns
        columns = columns.slice(0, columns.length - 1)
        params.tableColumns = columns
        console.log(JSON.stringify(params))
        this.gfnExportFileWithForm(solidModelExport(), params)
      },
      handlerClickAdd (pms) {
        this.dialogSelectParams = {
          rule_code: '',
          rule_status: '0',
          watch_ob_id: '',
        }
        this.dialogTotalData = {
          1: {
            data: [],
            total: 0,
            pageIndex: 1,
            pageRows: 10
          },
          2: {
            data: [],
            total: 0,
            pageIndex: 1,
            pageRows: 10
          }
        }
        this.dialogSelectParams.rule_code = pms
        this.promiseAll(pms)
        this.dialogVisible = true
      },
      promiseAll (pms) {
        if (pms) {
          let index = this.totalData.data.findIndex(item => {
            return item.rule_code == pms
          })
          let ruleId = this.totalData.data[index].rule_id
          Promise.all([this.ajaxGetRuleParam(ruleId), this.ajaxGetRuleLimit(ruleId)]).then(res => {
            for (let key of res[0].bizData.metaData) {
              this.dialogTotalData[1].data.push({
                parameter_name: key.parameter_name,
                parameter_value: key.parameter_default_value,
                parameter_unit: key.parameter_unit
              })
            }
            for (let key of res[1].bizData.metaData) {
              this.dialogTotalData[2].data.push({
                limitation_name: key.limitation_name,
                limitation_value: key.limitation_default_value,
                limitation_unit: key.limitation_unit
              })
            }
          })
        }
      },
      ajaxGetRuleParam (rule_id) {
        return getRuleParam({ruleId: rule_id})
      },
      ajaxGetRuleLimit (rule_id) {
        return getRuleLimit({ruleId: rule_id})
      },
      handlerClickDel (pms) {
        this.$confirm('确定删除这些内容吗，删除后将不可见？', '提示').then(() => {
          this.$message('没有删除')
        }).catch(() => {
        })
      },
      handleTabsClickDialog () {},
      handlerClickAddDialogTable (key) {
        let map = {
          parameter: () => {
            this.dialogTotalData[1].data.push(
            {
              parameter_name: '',
              parameter_value: '',
              parameter_unit: '',
              isEdit: true
            }
            )
          },
          threshold: () => {
            this.dialogTotalData[2].data.push(
            {
              limitation_name: '',
              limitation_value: '',
              limitation_unit: '',
              isEdit: true
            }
            )
          }
        }
        map[key]()
      },
      ajaxAddAlarmCase () {
        let paramList = this.dialogSelectParams
        for (let val in this.dialogTotalData) {
          for (let key of this.dialogTotalData[val].data) {
            for (let val2 in key) {
              if (key[val2] == '') {
                this.$message.error('参数不能为空')
                return
              }
            }
          }
        }
        this.$refs['dialogSelectParams'].validate(valid => {
          if (valid) {
            paramList.params = JSON.stringify(this.dialogTotalData[1].data)
            paramList.limits = JSON.stringify(this.dialogTotalData[2].data)
            addAlarmCase(paramList).then(res => {
              this.dialogVisible = false
              this.$message.success('新增成功')
            })
          }
        })
      },
      ruleStatusFormatter (row, column, cellValue) {
        let index = this.ruleStatusList.findIndex(item => {
          return item.value == cellValue
        })
        return this.ruleStatusList[index].label
      },
      formatterButtonLabel ({row}) {
        return row.rule_status == '0' ? '上线' : '下线'
      },
      ajaxUpdateRuleStatus (pms) {
        let index = this.totalData.data.findIndex(item => {
          return item.rule_code == pms
        })
        let ruleStatus = this.totalData.data[index].rule_status
        let params = {
          ruleCode: pms,
          ruleStatus: ruleStatus == '0' ? '2' : '0'
        }
        this.$confirm(`确认${ruleStatus == 0 ? '上线' : '下线'}？`, '提示').then(() => {
          updateRuleStatus(params).then(res => {
            this.totalData.data[index].rule_status = params.ruleStatus
          })
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="less">
    .index {
        .early-warning-dialog {
            .el-dialog__body {
                padding: 0 20px;
            }
        }
    }
</style>