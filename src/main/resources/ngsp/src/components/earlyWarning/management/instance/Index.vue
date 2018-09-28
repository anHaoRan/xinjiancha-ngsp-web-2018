<template>
    <div class="index">
        <el-card>
            <div slot="header" class="clearfix">
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
                            <el-input type="text" size="small" v-model="selectParams.caseName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="规则监控类型">
                            <el-input type="text" size="small" v-model="selectParams.caseType"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="监控对象名称">
                            <el-input type="text" size="small" v-model="selectParams.watchObName"></el-input>
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
                title="编辑实例"
                :visible.sync="dialogVisible"
                width="50%">
            <div>
                <h3>基础信息</h3>
                <el-form :inline="true" :model="dialogSelectParams" ref="dialogSelectParams" :rules="rules"
                         label-width="80px">
                    <el-row>
                        <el-col :xl="8" :md="12" :sm="24">
                            <el-form-item label="编号">
                                <el-input type="text" size="small" readonly
                                          v-model="dialogSelectParams.rule_deploy_id"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xl="8" :md="12" :sm="24">
                            <el-form-item label="实例名称">
                                <el-input type="text" size="small" readonly
                                          v-model="dialogSelectParams.rule_case_name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xl="8" :md="12" :sm="24">
                            <el-form-item label="模型编号">
                                <el-input type="text" size="small" readonly
                                          v-model="dialogSelectParams.rule_code"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xl="8" :md="12" :sm="24">
                            <el-form-item label="预警状态">
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
                <el-button type="primary" size="small" @click="ajaxUpdateAlarmCase">确定</el-button>
                <el-button type="info" size="small" @click="dialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import {
    alarmCaseQuery,
    updateAlarmCase,
    getAlarmCaseById,
    getWatchObList,
    alarmCaseExport
  } from '@/service/earlyWarning'
  import Operating from '@/components/base/Operating'
  import DialogInput from '../components/DialogInput'

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
        selectParams: {
          caseName: '',
          caseType: '',
          watchObName: ''
        },
        totalData: {
          data: [],
          total: 0,
          pageIndex: 1,
          pageRows: 10
        },
        columns: [
          {
            field: 'rule_deploy_id',
            align: 'center',
            label: '编号',
            width: '80'
          }, {
            field: 'rule_case_name',
            align: 'center',
            label: '实例名称',
            width: '150'
          }, {
            field: 'rule_code',
            align: 'center',
            label: '模型编号',
            width: '100'
          }, {
            field: 'rule_grade',
            align: 'center',
            label: '预警启动日期',
            width: '100'
          }, {
            field: 'rule_desc',
            align: 'center',
            label: '预警下线日期',
            width: '100'
          }, {
            field: 'update_status_date',
            align: 'center',
            label: '创建人',
            width: '100'
          }, {
            field: 'update_status_time',
            align: 'center',
            label: '上线流程单号',
            width: '100'
          }, {
            field: 'version',
            align: 'center',
            label: '下线流程单号',
            width: '100'
          }, {
            field: 'rule_status',
            align: 'center',
            label: '预警状态',
            width: '100'
          }, {
            field: 'version',
            align: 'center',
            label: '运行方式',
            width: '100'
          }, {
            field: 'watch_ob_id',
            align: 'center',
            label: '监控对象',
            width: '100'
          }, {
            field: 'version',
            align: 'center',
            label: '评估状态',
            width: '100'
          }, {
            field: 'rule_deploy_id',
            align: 'center',
            label: '操作',
            width: '150',
            template: Operating,
            buttonList: [
              {
                label: '编辑',
                func: this.handlerClickAdd
              },
              // {
              //   label: '删除',
              //   func: this.handlerClickDel
              // }
            ]
          }
        ],
        dialogVisible: false,
        dialogSelectParams: {
          rule_deploy_id: '',
          rule_case_name: '',
          rule_code: '',
          rule_status: '',
          watch_ob_id: '',
        },
        rules: {
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
      this.ajaxAlarmCaseQuery()
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
      ajaxAlarmCaseQuery () {
        this.isLoading = true
        alarmCaseQuery(this.selectParams).then(res => {
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
        this.gfnExportFileWithForm(alarmCaseExport(), params)
      },
      handlerClickAdd (pms) {
        this.ajaxGetAlarmCaseById(pms)
        this.dialogVisible = true
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
      ajaxGetAlarmCaseById (pms) {
        getAlarmCaseById({ruleDeployId: pms}).then(res => {
          this.dialogSelectParams = res.ruleDeploy
          this.dialogTotalData[1].data = res.paramDeploy
          this.dialogTotalData[2].data = res.limitDeploy
        })
      },
      ajaxUpdateAlarmCase () {
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
            updateAlarmCase(paramList).then(res => {
              this.dialogVisible = false
              this.$message.success('修改成功')
            })
          }
        })
      },
    }
  }
</script>

<style lang="less" scoped>
    .index {
    }
</style>