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
                        <el-form-item label="监控对象类型" prop="watchOBType">
                            <el-select
                                    v-model="selectParams.watchOBType"
                                    placeholder="请选择账户组类型"
                                    size="small"
                                    style="width: 100%;">
                                <el-option
                                        v-for="item in watchOBTypeOptions"
                                        :key="item.value"
                                        :label="item.text"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="监控对象名称" prop="modelName">
                            <el-input type="text" size="small" v-model="selectParams.modelName"></el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :xl="8" :md="12" :sm="24">-->
                        <!--<el-form-item label="监控对象大类">-->
                            <!--<el-input type="text" size="small"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :xl="8" :md="12" :sm="24">-->
                        <!--<el-form-item label="监控对象小类">-->
                            <!--<el-input type="text" size="small"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                </el-row>
            </el-form>
        </el-card>
        <s-table ref="curingTable" :isHeader="false" :columns="columns" :data="totalData"
                 :loading="isLoading"
                 @getPageination="getPageination">
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
                title="批量部署"
                :visible.sync="dialogVisible"
                width="50%">
            <el-collapse accordion style="height: 500px;overflow-y: auto" @change="handlerChange">
                <el-collapse-item v-for="(item,index) in dialogData" :key="index" :name="item.rule_id">
                    <div slot="title" style="display: flex">
                        <div @click.stop="" style="margin-left: 20px;">
                            <el-checkbox name="rule_name"
                                         v-model="dialogRuleCode"
                                         :label="item.rule_id">&nbsp;
                            </el-checkbox>
                        </div>
                        {{item.rule_name}}
                    </div>
                    <div style="display: flex">
                        <margin-table style="flex: 1" :height="240" :columns="dialogColumns[1]"
                                      :loading="isLoading2"
                                      :data="dialogTotalData[1]"
                                      :isPageination="false"></margin-table>
                        <margin-table style="flex: 1" :height="240" :columns="dialogColumns[2]"
                                      :loading="isLoading2"
                                      :data="dialogTotalData[2]"
                                      :isPageination="false"></margin-table>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <span slot="footer">
        <el-button type="primary" size="small" @click="ajaxBatchDeployAlarmCase">批量部署</el-button>
        <el-button type="info" size="small" @click="dialogVisible=false">取消</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
  import {
    searchWatchobjectBycondition,
    solidModelQuery,
    batchDeployAlarmCase,
    getRuleParam,
    getRuleLimit
  } from '@/service/earlyWarning'
  import { getNoTag1MetaData } from '@/service/common/commonFunc'
  import Operating from '@/components/base/Operating'

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
          watchOBType: 'ALL',
          watchOBName: ''
        },
        totalData: {
          data: [],
          total: 0,
          pageIndex: 1,
          pageRows: 10
        },
        columns: [
          {
            field: 'watch_ob_type_name',
            align: 'center',
            label: '监控对象类型',
            width: '100'
          }, {
            field: 'watch_ob_id',
            align: 'center',
            label: '监控标识',
            width: '150'
          }, {
            field: 'watch_ob_name',
            align: 'center',
            label: '监控对象名称',
            width: '100'
          }, {
            field: 'watch_ob_desc',
            align: 'center',
            label: '监控对象描述',
            width: '100'
          }, {
            field: 'watch_ob_id',
            align: 'center',
            label: '操作',
            width: '150',
            template: Operating,
            buttonList: [
              {
                label: '批量部署',
                func: this.handlerClickAdd
              }
            ]
          }
        ],
        watchOBTypeOptions: [],
        dialogVisible: false,
        dialogData: [],
        dialogRuleCode: [],
        dialogColumns: {
          1: [
            {
              field: 'parameter_name',
              align: 'center',
              label: '参数名称'
            }, {
              field: 'parameter_defaul_value',
              align: 'center',
              label: '参数默认值'
            }, {
              field: 'parameter_upper_value',
              align: 'center',
              label: '规则参数上限'
            }, {
              field: 'parameter_lower_value',
              align: 'center',
              label: '规则参数上限'
            }, {
              field: 'parameter_unit',
              align: 'center',
              label: '参数单位'
            }
          ],
          2: [
            {
              field: 'limitation_name',
              align: 'center',
              label: '规则阀值名称'
            }, {
              field: 'limitation_default_value',
              align: 'center',
              label: '默认阀值'
            }, {
              field: 'limitation_upper_value',
              align: 'center',
              label: '门限上限'
            }, {
              field: 'limitation_lower_value',
              align: 'center',
              label: '门限下限'
            }, {
              field: 'limitation_unit',
              align: 'center',
              label: '门限单位'
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
        isLoading2: false
      }
    },
    computed: {},
    watch: {},
    created () {
      this.ajaxGetNoTag1MetaData()
      this.ajaxSearchWatchobjectBycondition()
      this.ajaxSolidModelQuery()
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      select () {
        this.$refs['selectParams'].validate(valid => {
          if (valid) {
            this.ajaxSearchWatchobjectBycondition()
          }
        })
      },
      reset () {
        this.$refs['selectParams'].resetFields()
      },
      ajaxGetNoTag1MetaData () {
        getNoTag1MetaData('monitorObject', 'sysSetting').then(res => {
          this.watchOBTypeOptions = res
          let All = {
            value: 'ALL',
            text: '全选'
          }
          this.watchOBTypeOptions.unshift(All)
        })
      },
      ajaxSearchWatchobjectBycondition () {
        let params = {
          'pageIndex': this.totalData.pageIndex,
          'pageRows': this.totalData.pageRows,
          'watchOBType': this.selectParams.watchOBType, // 监控对象类型
          'watchOBName': this.selectParams.watchOBName // 监控对象名称
        }
        this.isLoading = true
        searchWatchobjectBycondition(JSON.stringify(params)).then(res => {
          this.isLoading = false
          let {totalNum, buzidata} = res
          this.totalData.data = buzidata
          this.totalData.total = totalNum
        })
      },
      getPageination (pageinationVal) {
        this.totalData.pageRows = pageinationVal.pageSizeNumber
        this.totalData.pageIndex = pageinationVal.currentPage
        this.ajaxSearchWatchobjectBycondition()
      },
      handleDownload () {
        console.log('导出')
        // let params = this.selectParams
        // params.exportType = val
        // let [...columns] = this.columns
        // columns = columns.slice(0, columns.length - 1)
        // params.tableColumns = [
        //   {
        //     sheetName: '固化监控对象',
        //     fileColumns: columns
        //   }
        // ]
        // console.log(JSON.stringify(params))
        // this.gfnExportFileWithForm(alarmCaseExport(), params)
      },
      handlerClickAdd (pms) {
        this.pms = pms
        this.dialogRuleCode = []
        this.dialogVisible = true
      },
      ajaxSolidModelQuery () {
        solidModelQuery().then(res => {
          this.dialogData = res.bizData.metaData
        })
      },
      ajaxBatchDeployAlarmCase () {
        let params = {
          watch_ob_id: this.pms,
          alarmRules: []
        }
        for (let key of this.dialogRuleCode) {
          let index = this.dialogData.findIndex(item => {
            return item.rule_id == key
          })
          if (index != -1) {
            params.alarmRules.push({
              rule_id: this.dialogData[index].rule_id,
              rule_code: this.dialogData[index].rule_code
            })
          }
        }
        params.alarmRules = JSON.stringify(params.alarmRules)
        batchDeployAlarmCase(params).then(res => {
          this.dialogVisible = false
          this.$message.success('部署成功')
        })
      },
      handlerChange (val) {
        if (val != '' && this.lastVal != val) {
          this.lastVal = val
          this.isLoading2 = true
          Promise.all([this.ajaxGetRuleParam(val), this.ajaxGetRuleLimit(val)]).then(res => {
            this.isLoading2 = false
            for (let i = 0; i < res.length; i++) {
              this.dialogTotalData[i + 1].data = res[i].bizData.metaData
            }
          })
        }
      },
      ajaxGetRuleParam (rule_id) {
        return getRuleParam({ruleId: rule_id})
      },
      ajaxGetRuleLimit (rule_id) {
        return getRuleLimit({ruleId: rule_id})
      }
    }
  }
</script>

<style lang="less">
    .index {
        .early-warning-dialog {
            .el-dialog__body {
                padding: 0;
            }
        }
    }
</style>