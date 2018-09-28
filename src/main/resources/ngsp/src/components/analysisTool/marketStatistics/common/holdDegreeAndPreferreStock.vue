<template>
  <div class="hold-degree-and-preferre-stock">
    <el-card>
      <div slot="header">
        查询条件
        <el-dropdown @command="handleCommnd" v-if="tableData.length!==0">
          <el-button type="info" size="small">
            导出<i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="csv">
              <i class="el-icon-document"></i>导出为CSV
            </el-dropdown-item>
            <el-dropdown-item command="excel">
              <i class="el-icon-document"></i>导出为EXCEL
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button
          type="primary"
          size="small"
          @click="fnGetQueryRes">
          查询
        </el-button>
      </div>
      <el-form :inline="true" label-width="100px" style="margin-top: 20px;">
        <el-row>
          <el-col :xl="6" :md="6" :sm="24">
            <el-form-item label="查询类型：">
              <el-select
                size="small"
                v-model="queryType">
                <el-option
                  v-for="item in queryTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :md="6" :sm="24">
            <el-form-item>
              <el-select
                size="small"
                v-model="topNHold">
                <el-option
                  v-for="item in topNHoldOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :md="6" :sm="24">
            <el-form-item label="前N名：" required>
              <el-input size="small" v-model="topNNum" style="width: 100px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :md="6" :sm="24">
            <el-form-item>
              <el-checkbox v-model="includeOrg">包含专业机构账户</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div v-if="isShowRes">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="el-card-table">
            <el-table
              :data="tableData"
              border
              tooltip-effect="dark"
              size="small"
              highlight-current-row
              style="width: 100%"
              max-height="500"
              v-loading="queryResLoad"
              element-loading-spinner="el-icon-loading"
              element-loading-text="数据加载中，请耐心等待..."
              element-loading-background="rgba(0,0,0,0.3)">
              <el-table-column
                v-for="column in tableOptionsAsc"
                :show-overflow-tooltip="true"
                :key="column.field"
                :label="column.label"
                :prop="column.field"
                :width="column.width"
                min-width="130"
                :sortable="column.sortable == null ? false : column.sortable"
                :sort-method="column.sortMethod"
                :align="column.align == null ? 'center' : column.align"
                :formatter="column.formatter">
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="el-card-table">
            <el-table
              :data="tableData"
              border
              tooltip-effect="dark"
              size="small"
              highlight-current-row
              style="width: 100%"
              max-height="500"
              v-loading="queryResLoad"
              element-loading-spinner="el-icon-loading"
              element-loading-text="数据加载中，请耐心等待..."
              element-loading-background="rgba(0,0,0,0.3)">
              <el-table-column
                v-for="column in tableOptionsDesc"
                :show-overflow-tooltip="true"
                :key="column.field"
                :label="column.label"
                :prop="column.field"
                :width="column.width"
                min-width="130"
                :sortable="column.sortable == null ? false : column.sortable"
                :sort-method="column.sortMethod"
                :align="column.align == null ? 'center' : column.align"
                :formatter="column.formatter">
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { getHoldDegreeData } from '../../../../service/analysisTool/marketStatistics'

  export default {
    name: 'hold-degree-and-preferre-stock',
    props: ['componentsType'],
    data () {
      return {
        //  msg: '持股集中度统计和优先股集中度公共组件',
        topNHold: '100',
        topNHoldOption: [
          {value: '50', label: '前50账户持有'},
          {value: '100', label: '前100账户持有'},
          {value: '200', label: '前200账户持有'}
        ],
        // 复选框
        includeOrg: false,
        queryType: 'A',
        queryTypeOption: [
          {value: 'A', label: '昨日持有比重'},
          {value: 'B', label: '前1周持有比重增减'},
          {value: 'C', label: '前2周持有比重增减'},
          {value: 'D', label: '前1月持有比重增减'},
          {value: 'E', label: '前3月持有比重增减'}
        ],
        topNNum: '30',
        requestParams: {},
        isShowRes: false,
        // 升序
        tableData: [],
        tableOptionsAsc: [],
        tableOptionsDesc: [],
        queryResLoad: false,
        tableClumnOption: {
          yesterdayOptionAsc: [
            {field: 'rn', label: '序号', align: 'right'},
            {field: 'instrument_id_asc', label: '证券代码', align: 'left'},
            {field: 'instrument_name_asc', label: '证券名称', align: 'left'},
            {field: 'stake_ratio_asc', label: '昨日持有比重', align: 'right', formatter: this.gfnElColFormatDec3},
            {field: 'market_float_asc', label: '自由流通量', align: 'right', formatter: this.gfnElColFormatDecThou3}
          ],
          lastWeekOrMonthAsc: [
            {field: 'rn', label: '序号', align: 'right'},
            {field: 'instrument_id_asc', label: '证券代码', align: 'left'},
            {field: 'instrument_name_asc', label: '证券名称', align: 'left'},
            {field: 'zj_asc', label: '', align: 'right', formatter: this.gfnElColFormatDec3},
            {field: 's_ratio_asc', label: '期初比重', align: 'right', formatter: this.gfnElColFormatDec3},
            {field: 'e_ratio_asc', label: '期末比重', align: 'right', formatter: this.gfnElColFormatDec3},
            {field: 's_float_asc', label: '期初自由流通量', align: 'right', formatter: this.gfnElColFormatDecThou0},
            {field: 'e_float_asc', label: '期末自由流通量', align: 'right', formatter: this.gfnElColFormatDecThou0}
          ],
          yesterdayOptionDesc: [
            {field: 'rn', label: '序号', align: 'right'},
            {field: 'instrument_id_desc', label: '证券代码', align: 'left'},
            {field: 'instrument_name_desc', label: '证券名称', align: 'left'},
            {field: 'stake_ratio_desc', label: '昨日持有比重', align: 'right', formatter: this.gfnElColFormatDec3},
            {field: 'market_float_desc', label: '自由流通量', align: 'right', formatter: this.gfnElColFormatDecThou3}
          ],
          lastWeekOrMonthDesc: [
            {field: 'rn', label: '序号', align: 'right'},
            {field: 'instrument_id_desc', label: '证券代码', align: 'left'},
            {field: 'instrument_name_desc', label: '证券名称', align: 'left'},
            {field: 'zj_desc', label: '', align: 'right', formatter: this.gfnElColFormatDec3},
            {field: 's_ratio_desc', label: '期初比重', align: 'right', formatter: this.gfnElColFormatDec3},
            {field: 'e_ratio_desc', label: '期末比重', align: 'right', formatter: this.gfnElColFormatDec3},
            {field: 's_float_desc', label: '期初自由流通量', align: 'right', formatter: this.gfnElColFormatDecThou0},
            {field: 'e_float_desc', label: '期末自由流通量', align: 'right', formatter: this.gfnElColFormatDecThou0}
          ]
        }
      }
    },
    mounted () {

    },
    methods: {
      fnGetQueryRes () {
        this.tableData = []
        if (!this.topNNum || !this.gfnIntNum(this.topNNum)) {
          this.$message.warning('前N名不能为空且需为整数')
          return
        }
        this.isShowRes = true
        this.queryResLoad = true
        this.requestParams = {
          type: this.topNHold,
          includeOrg: this.includeOrg === true ? '1' : '0',
          statType: this.queryType,
          mark: this.componentsType === 'holdDegree' ? '1' : '0',
          index: '1',
          rank: this.topNNum
        }
        getHoldDegreeData(this.requestParams).then(resp => {
          if (this.queryType === 'A') {
            this.tableOptionsAsc = this.tableClumnOption.yesterdayOptionAsc
            this.tableOptionsDesc = this.tableClumnOption.yesterdayOptionDesc
          } else {
            this.changeColumnLabel(this.tableClumnOption.lastWeekOrMonthAsc, 'zj_asc')
            this.changeColumnLabel(this.tableClumnOption.lastWeekOrMonthDesc, 'zj_desc')
            this.tableOptionsAsc = this.tableClumnOption.lastWeekOrMonthAsc
            this.tableOptionsDesc = this.tableClumnOption.lastWeekOrMonthDesc
          }
          this.queryResLoad = false
          this.tableData = resp.bizData.metaData
        })
      },
      changeColumnLabel (arr, params) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].field === params) {
            switch (this.queryType) {
              case 'B':
                arr[i].label = '前1周持有比重增减'
                break
              case 'C':
                arr[i].label = '前2周持有比重增减'
                break
              case 'D':
                arr[i].label = '前1月持有比重增减'
                break
              case 'E':
                arr[i].label = '前3月持有比重增减'
                break
            }
            return
          }
        }
      },
      // 导出
      handleCommnd (val) {
        let params = this.requestParams
        params['tableColumns'] = [{
          sheetName: this.componentsType === 'holdDegree' ? '持股集中度统计' : '优先股集中度统计',
          fileColumns: this.tableOptionsAsc.concat([{field: '', label: ''}].concat(this.tableOptionsDesc))
        }]
        params['markType'] = 'shareHold'
        params['fileMark'] = val
        console.log(params)
        this.gfnExportFileWithForm('/regularqry/general/v1/exports', params)
      }
    }
  }
</script>

<style lang='less' scoped>
  .hold-degree-and-preferre-stock {

  }
</style>
