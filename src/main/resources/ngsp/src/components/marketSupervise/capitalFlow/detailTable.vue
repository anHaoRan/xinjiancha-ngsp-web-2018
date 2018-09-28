<template>
  <div class="detailTable">
    <el-card class="el-card-table condition" style="overflow: visible">
      <div slot='header'>
        TOP1
      </div>
      <div class="conditionWrap">
        <el-form :inline="true" :model="selectParams">
          <el-form-item label="筛选">
            <down-more-select v-model="selectParams.intervalType" @input="getIntervalType"
                              :optionData="orderTypeOption" ref="cancelOrdrtypcod"></down-more-select>
          </el-form-item>
        </el-form>
        <div>
          <span>
            <i class="el-icon-info" style="color: #c28d28"></i>
            行业流向
            <i style="color: #0a4bd6">__<i style="position: relative;left: -2px">↑</i></i>
            &nbsp&nbsp
          </span>
          <span>纵向行业：流入&nbsp&nbsp</span>
          <span>横向行业：流出</span>
        </div>
      </div>
    </el-card>
    <el-card class="el-card-table tableContent">
      <s-table :columns="reportColumns"
               :data="reportData"
               :cell-class-name='tableColumnClassName'
               :isHeader="false"
               :isPageination="false"
               height="890">
        <el-table-column
          slot="tableColumnsUnshift"
          header-align='center'
          align='center'
          label="序号"
          width="50"
          type='index'>
        </el-table-column>
        <el-table-column
          slot="tableColumnsUnshift"
          label="名称/涨跌幅"
          align="center">
          <template slot-scope="scope">
            <span style="color: #b27824">{{scope.row.name}}&nbsp</span>
            <span :class="scope.row.prop>0?'up':'down'">({{scope.row.prop}}%)</span>
          </template>
        </el-table-column>
      </s-table>
    </el-card>
  </div>
</template>

<script>
  import DownMoreSelect from '../../common/downMoreSelect'
  import {getInvestorTypeData} from '@/service/capitalFlow/index'

  export default {
    components: {
      DownMoreSelect,
      STable: () => import('@/components/base/STable')
    },
    data() {
      return {
        selectParams: {
          intervalType: ''
        },
        orderTypeOption: [], // 传递给子组件的投资者类型数据
        reportData: {
          data: [
            {
              name: '银行',
              prop: '-2.19',
              fileName: '2111',
              fileType: '2111',
              auto: '2111',
              updateTime: '2111',
              updateTime1: '2111',
              updateTime2: '2800',
              updateTime3: '2111',
              updateTime4: '2111',
              updateTime5: '2111',
              updateTime6: '2500',
              updateTime7: '2111',
              updateTime8: '2111',
              updateTime9: '2111',
              updateTime10: '2111',
              updateTime11: '2111',
              updateTime12: '2111'
            },
            {
              name: '银行',
              prop: '3.19',
              fileName: '2111',
              fileType: '2111',
              auto: '2111',
              updateTime: '3000',
              updateTime1: '2111',
              updateTime2: '2111',
              updateTime3: '2111',
              updateTime4: '2111',
              updateTime5: '2111',
              updateTime6: '2111',
              updateTime7: '2111',
              updateTime8: '2200',
              updateTime9: '2111',
              updateTime10: '2111',
              updateTime11: '2111',
              updateTime12: '2111'
            },
            {
              name: '银行',
              prop: '1.19',
              fileName: '2111',
              fileType: '2111',
              auto: '2111',
              updateTime: '2111',
              updateTime1: '4000',
              updateTime2: '2111',
              updateTime3: '2111',
              updateTime4: '2111',
              updateTime5: '2111',
              updateTime6: '2111',
              updateTime7: '2111',
              updateTime8: '2111',
              updateTime9: '2111',
              updateTime10: '2111',
              updateTime11: '2111',
              updateTime12: '2111'
            }
          ]
        },
        reportColumns: [
          {label: '银行', field: 'fileName', align: 'center', sortable: true},
          {label: '休闲服务', field: 'fileType', align: 'center', sortable: true},
          {label: '非银金融', field: 'auto', align: 'center', sortable: true},
          {label: '化工', field: 'updateTime', align: 'center', sortable: true},
          {label: '医药生物', field: 'updateTime1', align: 'center', sortable: true},
          {label: '建筑材料', field: 'updateTime2', align: 'center', sortable: true},
          {label: '家用电器', field: 'updateTime3', align: 'center', sortable: true},
          {label: '房地产', field: 'updateTime4', align: 'center', sortable: true},
          {label: '通信', field: 'updateTime5', align: 'center', sortable: true},
          {label: '计算机', field: 'updateTime6', align: 'center', sortable: true},
          {label: '国防军工', field: 'updateTime7', align: 'center', sortable: true},
          {label: '电器设备', field: 'updateTime8', align: 'center', sortable: true},
          {label: '商业贸易', field: 'updateTime9', align: 'center', sortable: true},
          {label: '汽车', field: 'updateTime10', align: 'center', sortable: true},
          {label: '钢铁', field: 'updateTime11', align: 'center', sortable: true},
          {label: '轻工制造', field: 'updateTime12', align: 'center', sortable: true}
        ]
      }
    },
    mounted() {
      // 获取投资者类型
      getInvestorTypeData('investorType', 'all').then(resp => {
        resp.forEach((el) => {
          this.orderTypeOption.push({value: el.value, label: el.text})
        })
      })
    },
    methods: {
      tableColumnClassName({row, column}) {
        let one = {field: 'updateTime', value: 3000, color: 'one'}
        let two = {field: 'updateTime8', value: 2200, color: 'two'}
        let three = {field: 'updateTime2', value: 2800, color: 'three'}
        let four = {field: 'updateTime6', value: 2500, color: 'four'}
        let five = {field: 'updateTime1', value: 4000, color: 'five'}
        let bgcArr = [
          {field: 'updateTime', value: 3000, color: 'one'},
          {field: 'updateTime8', value: 2200, color: 'two'},
          {field: 'updateTime2', value: 2800, color: 'three'},
          {field: 'updateTime6', value: 2500, color: 'four'},
          {field: 'updateTime1', value: 4000, color: 'five'}
        ]
        let text = ''
        if (column.property) {
          bgcArr.forEach((el, i) => {
            if (el.field == column.property) {
              if (bgcArr[i].value == row[column.property]) {
                text = bgcArr[i].color
              }
            }
          })
        }
        return text
        // if (column.property) {
        //   if (column.property == one.field) {
        //     if (row[column.property] == one.value) {
        //       return one.color
        //     }
        //   } else if (column.property == two.field) {
        //     if (row[column.property] == two.value) {
        //       return two.color
        //     }
        //   } else if (column.property == three.field) {
        //     if (row[column.property] == three.value) {
        //       return three.color
        //     }
        //   } else if (column.property == four.field) {
        //     if (row[column.property] == four.value) {
        //       return four.color
        //     }
        //   } else if (column.property == five.field) {
        //     if (row[column.property] == five.value) {
        //       return five.color
        //     }
        //   }
        // }
      },
      getIntervalType(val) {
        console.log(val)
      },
      deleteRow(val1, val2) {
        console.log(val2)
      }
    }
  }
</script>

<style lang="less">
  .detailTable {
    margin: -40px -20px -20px -20px;
    .conditionWrap {
      display: flex;
      justify-content: space-between;
      padding: 0px 20px;
      align-items: center
    }
    .el-form-item {
      margin-bottom: 0px;
    }
    .tableContent {
      margin-top: 0px;
      .el-card {
        margin-top: 0px;
      }
    }
    .condition {
      .el-card__body {
        background-color: rgba(0, 0, 0, 0.25);
      }
      .el-input__inner {
        border: none;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
    .one {
      background-color: #d24c29 !important;
      color: #fff !important;
    }
    .two {
      background-color: #c28d28 !important;
      color: #fff !important;
    }
    .three {
      background-color: #788d32 !important;
      color: #fff !important;
    }
    .four {
      background-color: #1c9286 !important;
      color: #fff !important;
    }
    .five {
      background-color: #55D222 !important;
      color: #fff !important;
    }
  }

</style>