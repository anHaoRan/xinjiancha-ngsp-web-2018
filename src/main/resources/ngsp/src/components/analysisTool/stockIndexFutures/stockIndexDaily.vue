<template>
    <div class="stockIndexDaily">
        <el-card>
            <div slot="header">
                查询条件
                <el-button size="small" type="primary" @click="getDataQuery">查询</el-button>
            </div>
            <el-row style="margin-top: 20px">
                <el-col :span="7" style="margin-left: 20px;">
                    <el-col :span="3" class="name">
                        <span class="icon">*</span>
                        日期：
                    </el-col>
                    <el-col :span="8" class="name">
                        <el-date-picker
                                v-model="beginDate"
                                type="date"
                                placeholder="请选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                :picker-options="beginPickerData"
                                size="small"
                                style="width:100%">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="2" style="text-align: center" class="name">至</el-col>
                    <el-col :span="8" class="name">
                        <el-date-picker
                                v-model="endDate"
                                type="date"
                                placeholder="请选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                :picker-options="endPickerData"
                                size="small"
                                style="width:100%">
                        </el-date-picker>
                    </el-col>
                </el-col>
                <el-col :span="5">
                    <el-col :span="6" class="name">
                        <span class="icon">*</span>
                        统计方式：
                    </el-col>
                    <el-col :span="12" class="name">
                        <el-select v-model="statisticsMethod" size="small">
                            <el-option
                                    v-for="item in statisticsOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col :span="5" class="name">
                        <span class="icon">*</span>
                        产品类型：
                    </el-col>
                    <el-col :span="18" class="name">
                        <el-select v-model="productType" multiple placeholder="请选择" size="small" collapse-tags>
                            <el-option
                                    v-for="item in productOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="4" style="float: right">
                    <div style="float: right;margin-right: 20px;">

                    </div>

                </el-col>
            </el-row>
        </el-card>

        <el-card class="el-card-table" v-if="isShowRes">
            <div slot="header">
                查询结果
                <el-button size="small" type="info" @click="exportExcel" v-if="stockIndexData.length!==0">导出</el-button>
            </div>
            <el-table
                    :data="stockIndexData"
                    border
                    tooltip-effect="dark"
                    size="small"
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    style="width: 100%"
                    v-loading="queryResLoad"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="数据加载中，请耐心等待..."
                    element-loading-background="rgba(0,0,0,0.3)">
                <el-table-column
                        v-for="column in dailyColumns"
                        :key=column.field
                        :align=column.align
                        :prop=column.field
                        :label=column.label
                        :sortable="column.sortable == null ? false : column.sortable"
                        :sort-method="column.sortMethod"
                        :min-width=column.minWidth
                        :formatter="column.formatter">
                </el-table-column>
            </el-table>

        </el-card>
    </div>

</template>

<script>
  import { postStockIndexDaily } from '../../../service/analysisTool/stockIndexFutures/index'
  import { getCurTradeDate } from '../../../service/common/commonFunc'
  import moment from 'moment'

  export default {
    name: 'stock-index-daily',
    data () {
      return {
        statisticsMethod: '1',
        productType: ['IF'],

        statisticsOptions: [
          {value: '1', label: '按日统计'},
          {value: '2', label: '多日合计'}
        ],
        productOptions: [
          {value: 'IF', label: '沪深300'},
          {value: 'IH', label: '上证50'},
          {value: 'IC', label: '中证500'},
          {value: 'TF', label: '5年期国债'},
          {value: 'T', label: '10年期国债'}
        ],
        isShowRes: false,
        queryResLoad: false,
        stockIndexData: [],
        dailyColumns: [
          {
            label: '日期',
            field: 'sjrq',
            align: 'left',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sjrq')
          },
          {
            label: '投资者类别',
            field: 'zhlx',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zhlx')
          },
          {
            label: '开仓(多方)',
            field: 'mrkl',
            align: 'right',
            minWidth: '6.5%',
            formatter: this.gfnElColFormatDecThou0,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mrkl')
          },
          {
            label: '平仓(多方)',
            field: 'mcpl',
            align: 'right',
            minWidth: '6.5%',
            formatter: this.gfnElColFormatDecThou0,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mcpl')
          },
          {
            label: '仓差(多方)',
            field: 'mrlc',
            align: 'right',
            minWidth: '6.5%',
            formatter: this.gfnElColFormatDecThou0,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mrlc')
          },
          {
            label: '持仓(多方)',
            field: 'mrcl',
            align: 'right',
            minWidth: '6.5%',
            formatter: this.gfnElColFormatDecThou0,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mrcl')
          },
          {
            label: '开仓(空方)',
            field: 'mckl',
            align: 'right',
            minWidth: '6.5%',
            formatter: this.gfnElColFormatDecThou0,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mckl')
          },
          {
            label: '平仓(空方)',
            field: 'mrpl',
            align: 'right',
            minWidth: '6.5%',
            formatter: this.gfnElColFormatDecThou0,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mrpl')
          },
          {
            label: '仓差(空方)',
            field: 'mclc',
            align: 'right',
            minWidth: '6.5%',
            formatter: this.gfnElColFormatDecThou0,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mclc')
          },
          {
            label: '持仓(空方)',
            field: 'mccl',
            align: 'right',
            minWidth: '6.5%',
            formatter: this.gfnElColFormatDecThou0,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mccl')
          }
        ],
        beginDate: '',
        endDate: '',
        requestParams: {},
        beginPickerData: {
          disabledDate: (time) => {
            return time.getTime() >= new Date(this.endDate).getTime()
          }
        },
        endPickerData: {
          disabledDate: (time) => {
            return time.getTime() <= new Date(this.beginDate).getTime() - 3600 * 1000 * 24
          }
        }
      }
    },
    mounted () {
      getCurTradeDate().then(resp => {
        let resDate = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
        this.beginDate = resDate
        this.endDate = resDate
      })
    },
    methods: {
      handleCurrentChange () {
      },
      exportExcel () {
        let params = this.requestParams
        params['type'] = 'StockFuture'
        params['fileType'] = 'excel'
        params['tableColumns'] = [{
          sheetName: '股指期货查询',
          fileColumns: this.dailyColumns
        }]
        this.gfnExportFileWithForm('/regularqry/stockfutures/v1/export', params)
      },
      getDataQuery () {
        this.requestParams = {
          flag: this.statisticsMethod,
          productType: this.productType.join(','),
          dateStart: this.beginDate,
          dateEnd: this.endDate
        }
        if (this.statisticsMethod == 2) {
          this.dailyColumns = [
            {
              label: '投资者类别',
              field: 'zhlx',
              align: 'left',
              minWidth: '6.5%',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'zhlx')
            },
            {
              label: '开仓(多方)',
              field: 'mrkl',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mrkl')
            },
            {
              label: '平仓(多方)',
              field: 'mcpl',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mcpl')
            },
            {
              label: '仓差(多方)',
              field: 'mrlc',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mrlc')
            },
            {
              label: '持仓(多方)',
              field: 'mrcl',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mrcl')
            },
            {
              label: '开仓(空方)',
              field: 'mckl',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mckl')
            },
            {
              label: '平仓(空方)',
              field: 'mrpl',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mrpl')
            },
            {
              label: '仓差(空方)',
              field: 'mclc',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mclc')
            },
            {
              label: '持仓(空方)',
              field: 'mccl',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mccl')
            }
          ]
        } else {
          this.dailyColumns = [
            {
              label: '日期',
              field: 'sjrq',
              align: 'left',
              minWidth: '5%',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sjrq')
            },
            {
              label: '投资者类别',
              field: 'zhlx',
              align: 'left',
              minWidth: '6.5%',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'zhlx')
            },
            {
              label: '开仓(多方)',
              field: 'mrkl',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mrkl')
            },
            {
              label: '平仓(多方)',
              field: 'mcpl',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mcpl')
            },
            {
              label: '仓差(多方)',
              field: 'mrlc',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mrlc')
            },
            {
              label: '持仓(多方)',
              field: 'mrcl',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mrcl')
            },
            {
              label: '开仓(空方)',
              field: 'mckl',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mckl')
            },
            {
              label: '平仓(空方)',
              field: 'mrpl',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mrpl')
            },
            {
              label: '仓差(空方)',
              field: 'mclc',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mclc')
            },
            {
              label: '持仓(空方)',
              field: 'mccl',
              align: 'right',
              minWidth: '6.5%',
              formatter: this.gfnElColFormatDecThou0,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mccl')
            }
          ]
        }
        if (!this.requestParams.dateStart) {
          this.$message.warning('请输入开始日期')
        } else if (!this.requestParams.dateEnd) {
          this.$message.warning('请输入结束日期')
        } else if (!this.requestParams.productType) {
          this.$message.warning('请选择产品类型')
        } else {
          this.queryResLoad = true
          this.isShowRes = true
          postStockIndexDaily(this.requestParams).then((resp) => {
            this.stockIndexData = resp.bizData.metaData
            this.queryResLoad = false
          })
        }
      }
    }
  }
</script>

<style lang='less'>
    .stockIndexDaily {
        .name {
            height: 32px;
            line-height: 32px;
        }
        .block {
            margin-top: 5px;
        }
        .icon {
            color: red;
            position: relative;
            top: 2px;
        }
    }

</style>
