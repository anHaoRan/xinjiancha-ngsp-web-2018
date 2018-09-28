<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <el-form :inline="true" ref="formData" :model="formData" :rules="formRules" label-width="80px">
        <el-form-item label="选中日期" prop="dateRange">
          <el-date-picker
            v-model="formData.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            :picker-options="pickerOption"
            value-format="yyyyMMdd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交易日向前推" label-width="110px" prop="frontDay">
          <el-input v-model="formData.frontDay" class="frontDay" @change="getDateRange" maxlength="2" type="text" size="small"></el-input>
          天
        </el-form-item>
        <el-form-item label="起始维度" class="radio-div2">
          <el-radio-group v-model="formData.startDimension" size="small" class="col2">
            <el-radio :label="0">行业</el-radio>
            <el-radio :label="2">投资者</el-radio>
            <el-radio :label="1">证券</el-radio>
            <el-radio :label="3">个人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="画图选项" class="radio-div1">
          <el-radio-group v-model="formData.drawingOptions" size="small">
            <el-radio :label="0">净成交额</el-radio>
            <el-radio :label="1">累计净成交额</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="汇总频率" class="radio-div1">
          <el-radio-group v-model="formData.summaryFrequency" size="small">
            <el-radio :label="0">按日汇总</el-radio>
            <el-radio :label="1">按月汇总</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标数据" class="radio-div2">
          <el-radio-group v-model="formData.targetData" size="small" class="col2">
            <el-radio :class="(formData.startDimension === 2 || formData.startDimension === 3)? '' : 'targetAll'" :label="0">总成交额</el-radio>
            <el-radio v-if="formData.startDimension === 2 || formData.startDimension === 3" :label="2">卖出成交额</el-radio>
            <el-radio v-if="formData.startDimension === 2 || formData.startDimension === 3" :label="1">净成交额</el-radio>
            <el-radio v-if="formData.startDimension === 2 || formData.startDimension === 3" :label="3">买入成交额</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button @click="search" :loading="isLoading" type="primary" size="small">查询</el-button>
      </el-form>
    </el-card>
    <double-per-dou-psw @isPass="getPassInfo" @isShow="isShowDialog" :dialogFormVisble="dialogShow"></double-per-dou-psw>
    <dimension-card @removeData="removeData" :dimensionData="industryData"></dimension-card>
    <dimension-card @removeData="removeData" :dimensionData="securityData" @loadMore="loadMore"></dimension-card>
    <dimension-card @removeData="removeData" :dimensionData="investorData"></dimension-card>
    <dimension-card @removeData="removeData" :dimensionData="personalData"></dimension-card>
  </div>
</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import moment from 'moment'
  import {
    getCurTradeDate,
    getRelativeBaseDate
  } from '@/service/common/commonFunc'
  import { cusMulQuery } from '@/service/marketSupervise/classifiedInvestorMonitoring'
  import DimensionCard from './dimensionCard/DimensionCard'
  import DoublePerDouPsw from '../../common/DoublePerDouPsw'

  export default {
    components: {
      Breadcrumb,
      DimensionCard,
      DoublePerDouPsw
    },
    name: 'custom-multidimensional-query',
    data () {
      let selfDisabledDate = 0
      let isSelectStartDate = true
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '市场运行监测'
          }, {
            router: '/customMultidimensionalQuery',
            label: '多维度查询'
          }
        ],
        validate: false,
        dialogShow: false,
        isLoading: false,
        industryData: {},
        securityData: {},
        securityParams: {},
        securityPageIndex: 1,
        securityPageRows: 20,
        investorData: {},
        personalData: {},
        tDate: '',
        formData: {
          dateRange: ['', ''],
          frontDay: 5,
          startDimension: 0,
          drawingOptions: 0,
          summaryFrequency: 0,
          targetData: 0
        },
        pickerOption: {
          disabledDate: (time) => {
            if (isSelectStartDate) {
              return time.getTime() >= new Date(moment(this.tDate, 'YYYYMMDD').format('YYYY,MM,DD')).getTime()
            }
            return time.getTime() < selfDisabledDate || time.getTime() > new Date(moment(this.tDate, 'YYYYMMDD').format('YYYY,MM,DD')).getTime()
          },
          onPick: ({maxDate, minDate}) => {
            if (!maxDate) {
              isSelectStartDate = false
              selfDisabledDate = new Date(minDate).getTime()
            } else {
              isSelectStartDate = true
            }
          }
        },
        formRules: {
          dateRange: [
            {required: true, message: '时间范围为必选', trigger: 'change'}
          ],
          frontDay: [
            {required: true, message: '请输入正整数', pattern: /^[1-9]\d*$/, trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      startDimension: function (val) {
        if (val === 0 || val === 1) {
          this.formData.targetData = 0
        }
      }
    },
    methods: {
      getPassInfo (val) {
        this.validate = val
        if (val) {
          this.search()
        }
      },
      isShowDialog (val) {
        this.dialogShow = val
      },
      search () {
        this.$refs.formData.validate((valid) => {// eslint-disable-line
          if (this.formData.startDimension === 3 && !this.validate) {
            this.dialogShow = true
          } else if (valid) {
            this.isLoading = true
            let dimCode = ''
            let dimIndicCode = ''
            let title = ''
            let dateGroupFlag = ''
            let indicCodeGross = ''
            let indicCode = ''
            let sortType = ''
            let targetTitle = ''
            switch (this.formData.startDimension) {
              case 0:
                dimCode = 'dim.industry.indusType'
                dimIndicCode = 'indic.industry.'
                title = '行业'
                break
              case 1:
                dimCode = 'dim.security.secType'
                dimIndicCode = 'indic.security.'
                title = '证券'
                break
              case 2:
                dimCode = 'dim.investor.investorType'
                dimIndicCode = 'indic.investor.'
                title = '分类投资者'
                break
              case 3:
                dimCode = 'dim.personal.account.topN'
                dimIndicCode = 'indic.personal.'
                title = '个人'
                break
            }
            switch (this.formData.targetData) {
              case 0:
                indicCodeGross = 'trdamtPlusSum'
                indicCode = 'trdamtPlus'
                sortType = 'PLUS'
                targetTitle = '总成交额'
                break
              case 1:
                indicCodeGross = 'trdamtNetGross'
                indicCode = 'trdamtNet'
                sortType = 'NETB'
                targetTitle = '净成交额'
                break
              case 2:
                indicCodeGross = 'trdamtSaleGross'
                indicCode = 'trdamtSale'
                sortType = 'S'
                targetTitle = '卖出成交额'
                break
              case 3:
                indicCodeGross = 'trdamtBuyGross'
                indicCode = 'trdamtBuy'
                sortType = 'B'
                targetTitle = '买入成交额'
                break
            }
            switch (this.formData.summaryFrequency) {
              case 0:
                dateGroupFlag = 'day'
                break
              case 1:
                dateGroupFlag = 'mon'
                break
            }

            let params = {
              dim: {
                dimCode: dimCode
              },
              indic: [
                {
                  indicCode: dimIndicCode + indicCodeGross,
                  params: {tradeDateBegin: this.formData.dateRange[0], tradeDateEnd: this.formData.dateRange[1]}
                },
                {
                  indicCode: dimIndicCode + indicCode,
                  params: {tradeDateBegin: this.formData.dateRange[0], tradeDateEnd: this.formData.dateRange[1], dateGroupFlag: dateGroupFlag}
                }
              ]
            }
            if (this.formData.startDimension === 1) {
              this.securityPageIndex = 1
              this.securityPageRows = 20
              params.dim.params = {pageIndex: this.securityPageIndex, pageRows: this.securityPageRows}
            }
            if (this.formData.startDimension === 3) {
              params.dim.params = {tradeDateBegin: this.formData.dateRange[0], tradeDateEnd: this.formData.dateRange[1], sortType: sortType}
            }
            if (this.formData.startDimension === 1) {
              this.securityParams = params
            }
            cusMulQuery(JSON.stringify(params)).then(resp => {
              let tableColumns = []
              let codes = resp.columns.code
              let titles = resp.columns.title
              let unitName = resp.columns.unitName
              let unitDevide = resp.columns.unitDevide
              codes.forEach((code, index) => {
                let column = {}
                column.field = code
                if (unitName[index] !== '') {
                  column.label = titles[index] + '(' + unitName[index] + ')'
                  if (Number(unitDevide[index]) === 100000000) {
                    column.formatter = this.gfnElColFormatDecThouYi
                  } else if (Number(unitDevide[index]) === 10000) {
                    column.formatter = this.gfnElColFormatDecThouWan
                  }
                } else {
                  column.label = titles[index]
                }
                tableColumns.push(column)
              })
              let dimensionData = {}
              dimensionData.dimensionID = this.formData.startDimension
              dimensionData.title = title
              dimensionData.loadingMore = false
              dimensionData.tableData = resp.rows
              dimensionData.tableColumns = tableColumns
              dimensionData.targetTitle = targetTitle
              dimensionData.drawingOptions = this.formData.drawingOptions
              switch (this.formData.startDimension) {
                case 0:
                  this.industryData = dimensionData
                  break
                case 1:
                  if (resp.rows.length === this.securityPageRows) {
                    dimensionData.loadingMore = true
                  }
                  this.securityData = dimensionData
                  break
                case 2:
                  this.investorData = dimensionData
                  break
                case 3:
                  this.personalData = dimensionData
                  break
              }
              this.isLoading = false
            })
          } else {
            this.$message.error('输入条件不正确!')
          }
        })
      },
      getDateRange () {
        let reg = /^[1-9]\d*$/
        if (reg.test(this.formData.frontDay)) {
          getRelativeBaseDate(-this.formData.frontDay, this.formData.dateRange[1]).then(relTradeDate => {
            this.formData.dateRange = [relTradeDate, this.formData.dateRange[1]]
          })
        }
      },
      removeData (id) {
        switch (id) {
          case 0:
            this.industryData = {}
            break
          case 1:
            this.securityData = {}
            break
          case 2:
            this.investorData = {}
            break
          case 3:
            this.personalData = {}
            break
        }
      },
      loadMore () {
        this.isLoading = true
        this.securityPageIndex++
        this.securityParams.dim.params.pageIndex = this.securityPageIndex
        cusMulQuery(JSON.stringify(this.securityParams)).then(resp => {
          this.securityData.tableData = this.securityData.tableData.concat(resp.rows)
          if (resp.rows.length < this.securityPageRows) {
            this.securityData.loadingMore = false
          }
          this.isLoading = false
        })
      }
    },
    mounted () {
      getCurTradeDate().then(curTradeDate => {
        this.tDate = curTradeDate
        this.formData.dateRange[1] = curTradeDate
        this.getDateRange()
      })
    }
  }
</script>

<style scoped lang="less">
  /deep/ .el-card__body {
    padding: 0 !important;
    .el-form {
      margin: 10px 0;
      .el-form-item:nth-of-type(1),
      .el-form-item:nth-of-type(2) {
        margin-top: 14px;
      }
      .el-button {
        margin: 18px 40px;
      }
      .el-form-item {
        margin: 0 0 0 20px;
        .frontDay {
          width: 48px;
          margin-right: 8px;
        }
        .el-radio-group {
          .el-radio {
            float: left;
            width: 100%;
            margin-left: 0;
            margin-bottom: 6px;
          }
        }
        .el-radio-group.col2 {
          .targetAll {
            width: 200px !important;
            margin-top: -20px;
          }
          .el-radio {
            width: 50%;
          }
        }
      }

      .radio-div1,
      .radio-div2 {
        width: 200px;
        padding: 0 10px;
        border: 1px solid #7b8fb9;
        min-height: 64px;
        /deep/ .el-form-item__label {
          padding: 0 12px;
          margin-top: -20px;
          z-index: 2;
          background-color: #1b2b4e;
        }
        /deep/ .el-form-item__content {
          margin-left: 0 !important;
        }
      }

      .radio-div1 {
        width: 130px;
      }
    }
  }
</style>
