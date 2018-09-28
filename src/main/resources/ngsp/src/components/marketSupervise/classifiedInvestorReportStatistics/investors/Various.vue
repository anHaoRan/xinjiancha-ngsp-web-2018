<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="formData" :rules="formRules" ref="formData" label-width="80px">
        <el-form-item label="产品类型" prop="productionType">
          <el-checkbox v-model="formData.productionType" v-for="(item,index) in checkboxData" :label="item.id" :key="index">{{item.label}}
          </el-checkbox>
        </el-form-item>
        <el-form-item label="时间范围" prop="dateTimeRange">
          <el-date-picker
            v-model="formData.dateTimeRange"
            type="datetimerange"
            range-separator=" - "
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="small"
            value-format="yyyyMMdd HHmmss"
            :default-time="['09:00:00', '15:00:00']">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="不活跃相对数" prop="fallowPoint" label-width="110px">
          <el-input v-model="formData.fallowPoint" size="small"></el-input>
          (万元)
        </el-form-item>
        <el-form-item label="持平相对数" prop="equalityPoint" label-width="100px">
          <el-input v-model="formData.equalityPoint" type="text" size="small"></el-input>
          (万元)
        </el-form-item>
        <el-button type="primary" size="small" @click="dialogFormVisble=true">双人双密</el-button>
        <el-button @click="query" class="fr" :disabled="isDisabled" :loading="isLoading" type="primary" size="small">查询</el-button>
      </el-form>
    </el-card>
    <double-per-dou-psw @isPass="getPassInfo" @isShow="getShowDilog" :dialogFormVisble="dialogFormVisble"></double-per-dou-psw>
    <el-card v-if="reportTable.length > 0" v-for="(report, index) in reportTable" :key="index" class="reportTable">
      <div slot="header" class="clearfix">
        {{report.tableName}}
        <el-button v-if="index === 0" type="primary" size="small" @click="exportAllAccount">导出本页</el-button>
      </div>
      <el-table
        :data="report.reportData"
        ref="reportTable"
        border
        tooltip-effect="dark"
        height="300"
        size="small"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          v-for="column in columns"
          :show-overflow-tooltip="true"
          :key="column.field"
          :label="column.label"
          :prop="column.field"
          :width="column.width"
          :min-width="column.minWidth"
          :class-name="column.className"
          :align="column.align == null ? 'center' : column.align"
          :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
          :sortable="column.sortable == null ? false : column.sortable"
          :formatter="column.formatter"
        ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import DoublePerDouPsw from '@/components/common/DoublePerDouPsw'
  import { getCurTradeDate } from '@/service/common/commonFunc'
  import { variousInvestors } from '@/service/marketSupervise/classifiedInvestorMonitoring'

  export default {
    components: {DoublePerDouPsw},
    name: 'various-investors',
    data () {
      return {
        formData: {
          productionType: [1],
          dateTimeRange: [],
          fallowPoint: '50.000',
          equalityPoint: '50.000'
        },
        checkboxData: [
          {id: 1, label: 'A股'},
          {id: 2, label: '基金'},
          {id: 3, label: '国债(含地方债)'},
          {id: 4, label: '公司债'},
          {id: 10, label: '转债'},
          {id: 21, label: '私募债'},
          {id: 22, label: '低等级债'},
          {id: 11, label: '质押式回购'},
          {id: 5, label: '买断式回购'},
          {id: 6, label: '权证'},
          {id: 9, label: '国际板'},
          {id: 8, label: '沪深300指数成分股'},
          {id: 23, label: '上证50指数成分股'},
          {id: 24, label: '中证500指数成分股'},
          {id: 12, label: '风险警示板'},
          {id: 16, label: '优先股'}
        ],
        isDisabled: true,
        isLoading: false,
        dialogFormVisble: false,
        reportTable: [],
        columns: [
          {label: '投资者类型', field: 'orgtype', align: 'left', isShow: true},
          {label: '申买金额(万元)', field: 'ordramt_b', align: 'right', isShow: true, formatter: this.gfnElColFormatDecThou3},
          {label: '申卖金额(万元)', field: 'ordramt_s', align: 'right', isShow: true, formatter: this.gfnElColFormatDecThou3},
          {label: '净额(万元)', field: 'je', align: 'right', isShow: true, formatter: this.gfnElColFormatDecThou3},
          {label: '申买家数', field: 'mrjs', align: 'right', isShow: true},
          {label: '申卖家数', field: 'mcjs', align: 'right', isShow: true},
          {label: '持平家数', field: 'cpjs', align: 'right', isShow: true},
          {label: '不活跃家数', field: 'bhyjs', align: 'right', isShow: true}
        ],
        params: {},
        formRules: {
          productionType: [
            {required: true, message: '产品类型为必选'}
          ],
          dateTimeRange: [
            {required: true, message: '时间范围为必选'}
          ],
          fallowPoint: [
            {type: 'string', pattern: /^\d+\.?\d{0,3}$/, required: true, message: '请输入正确数字规则', trigger: 'blur'}
          ],
          equalityPoint: [
            {type: 'string', pattern: /^\d+\.?\d{0,3}$/, required: true, message: '请输入正确数字规则', trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      'formData.productionType': function (newValue, oldValue) {
        if (newValue.length < 2) {
          return
        }
        let only = [8, 9, 12, 23, 24]
        let newCode = newValue[newValue.length - 1]
        let containOnly = false
        if (only.includes(newCode)) {
          this.formData.productionType = [newCode]
          containOnly = true
        }
        if (!containOnly && only.includes(this.formData.productionType[0])) {
          this.formData.productionType.splice(0, 1)
        }
      }
    },
    methods: {
      getPassInfo (val) {
        this.isDisabled = !val
      },
      getShowDilog (val) {
        this.dialogFormVisble = val
      },
      query () {
        this.$refs.formData.validate((valid) => {
          if (valid) {
            this.isLoading = true
            this.params = {
              productionTypeStr: this.formData.productionType.join(','),
              equalityPoint: this.formData.equalityPoint,
              fallowPoint: this.formData.fallowPoint,
              start: moment(this.formData.dateTimeRange[0]).format('YYYYMMDD HHmmss'),
              end: moment(this.formData.dateTimeRange[1]).format('YYYYMMDD HHmmss')
            }
            variousInvestors(JSON.stringify(this.params)).then(resp => {
              this.reportTable = []
              this.reportTable.push({
                tableName: resp['All+eAccount'].name,
                reportData: resp['All+eAccount'].data
              })
              this.reportTable.push({
                tableName: resp['eAccount'].name,
                reportData: resp['eAccount'].data
              })
              this.isLoading = false
            })
          } else {
            this.$message.error('输入条件不正确!')
          }
        })
      },
      exportAllAccount () {
        let param = JSON.parse(JSON.stringify(this.params))
        param.tableColumns = [
          {'sheetName': '各类投资者申报普通账户+信用账户统计', 'fileColumns': this.columns},
          {'sheetName': '各类投资者申报统计信用账户', 'fileColumns': this.columns}
        ]
        this.gfnExportFileWithForm('/fluct/investor-classifieds-order/v1/all-account-export', param)
      }
    },
    mounted () {
      getCurTradeDate().then(resp => {
        this.formData.dateTimeRange = [resp + ' 090000', resp + ' 150000']
      })
    }
  }
</script>

<style scoped lang="less">
  .el-checkbox {
    margin-left: 0;
    margin-right: 20px;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .el-button--primary {
    margin: 5px 0;
  }

  /deep/ .el-card__body {
    .el-form-item:first-of-type {
      .el-form-item__content {
        width: 94%;
      }
    }
  }

  .reportTable {
    /deep/ .el-card__body {
      padding: 0;
    }
  }

  .el-form-item {
    /deep/ .el-input {
      width: 80px;
      margin-right: 8px;
    }
  }
</style>
