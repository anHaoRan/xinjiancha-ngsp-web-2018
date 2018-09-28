<template>
  <div class="securities">
    <composite-index ref="composite" :is-show="isShow" :select-date="selectDate"></composite-index>
    <el-row>
      <el-col>
        <el-time-picker
          size="small"
          is-range
          v-model="timePicker"
          value-format="HH-mm-ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
        <el-button
          type="primary"
          size="small"
          @click="selectAccountBsTop">查询
        </el-button>
      </el-col>
    </el-row>
    <el-card>
      <div slot="header" class="clearfix">
        <span>账户买入居前</span>
      </div>
      <el-table
        border
        :data="buyTop50"
        max-height="600"
        tooltip-effect="dark"
        style="width: 100%; overflow:visible">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          show-overflow-tooltip
          label="账户代码"
          min-width="7%">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row,'jmr')">{{scope.row.invacctno}}</el-button>
          </template>
        </el-table-column>
        <s-table-columns v-for="(item,index) in column1"
                         :key="index"
                         :item="item"
                         v-if="item.isActive===undefined||item.isActive"/>
      </el-table>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>账户卖出居前</span>
      </div>
      <el-table
        border
        :data="soldTop50"
        max-height="600"
        tooltip-effect="dark"
        style="width: 100%; overflow:visible">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          show-overflow-tooltip
          label="账户代码"
          min-width="7%">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row,'jmc')">{{scope.row.invacctno}}</el-button>
          </template>
        </el-table-column>
        <s-table-columns v-for="(item,index) in column2"
                         :key="index"
                         :item="item"
                         v-if="item.isActive===undefined||item.isActive"/>
      </el-table>
    </el-card>
  </div>
</template>
<script>
  // 请求接口引入
  import { getAccountBsTop } from '@/service/marketStability'
  //  指数涨跌幅
  import CompositeIndex from '../component/CompositeIndex.vue'

  window.document.title = '交易情况'
  export default {
    // 组件注册CNSH06000283
    components: {
      STableColumns: () => import('@/components/base/STableColumns'), // 表格列
      CompositeIndex
    },
    data () {
      return {
        column1: [
          {
            field: 'investor_account_name',
            label: '账户名称',
            width: '5%',
            align: 'left',
            sortable: true
          },
          {
            field: 'brname',
            label: '营业部',
            width: '5%',
            align: 'left',
            sortable: true
          },
          {
            field: 'ymtno',
            label: '一码通',
            width: '5%',
            align: 'left',
            sortable: true
          },
          {
            field: 'orgname',
            label: '所属机构',
            width: '5%',
            align: 'left',
            sortable: true
          },
          {
            field: 'orgflg',
            label: '投资者分类',
            width: '5%',
            align: 'left',
            sortable: true
          },
          {
            field: 'position_amount',
            label: '前持（万股）',
            width: '5%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_amount')
          },
          {
            field: 'trdqty',
            label: '买成交量（万股）',
            width: '5%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty')
          },
          {
            field: 'trdamt',
            label: '买成交金额（万元）',
            width: '5%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt')
          },
          {
            field: 'trdqty_per',
            label: '占比',
            width: '5%',
            align: 'right',
            tooltip: '占比 = (买成交量/指定时间段内证券成交量)*100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_per')
          }
        ],
        column2: [
          {
            field: 'investor_account_name',
            label: '账户名称',
            width: '5%',
            align: 'left',
            sortable: true
          },
          {
            field: 'brname',
            label: '营业部',
            width: '5%',
            align: 'left',
            sortable: true
          },
          {
            field: 'ymtno',
            label: '一码通',
            width: '5%',
            align: 'left',
            sortable: true
          },
          {
            field: 'orgname',
            label: '所属机构',
            width: '5%',
            align: 'left',
            sortable: true
          },
          {
            field: 'orgflg',
            label: '投资者分类',
            width: '5%',
            align: 'left',
            sortable: true
          },
          {
            field: 'position_amount',
            label: '前持（万股）',
            width: '5%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_amount')
          },
          {
            field: 'trdqty',
            label: '卖成交量（万股）',
            width: '5%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty')
          },
          {
            field: 'trdamt',
            label: '卖成交金额（万元）',
            width: '5%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt')
          },
          {
            field: 'trdqty_per',
            label: '占比',
            width: '5%',
            align: 'right',
            tooltip: '占比 = (买成交量/指定时间段内证券成交量)*100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_per')
          }
        ],
        timePicker: ['09-00-00', '15-00-00'],
        buyTop50: [],
        soldTop50: [],
        isShow: false,
        selectDate: ''
      }
    },
    watch: {
      '$route': 'init'
    },
    methods: {
      init () {
        this.isShow = true
        this.selectDate = this.$route.params.tradedate
        this.timePicker = this.$route.params.timePicker.split(':')
        let param = {
          tradeDate: this.selectDate,
          startTime: this.timePicker[0].replace(/-/g, ''),
          endTime: this.timePicker[1].replace(/-/g, ''),
          isinCode: this.$route.params.isincode
        }
        getAccountBsTop(param).then((res) => {
          this.buyTop50 = res.buyTop50
          this.soldTop50 = res.soldTop50
        })
      },
      selectAccountBsTop () {
        let param = {
          tradeDate: this.selectDate,
          startTime: this.timePicker[0].replace(/-/g, ''),
          endTime: this.timePicker[1].replace(/-/g, ''),
          isinCode: this.$route.params.isincode
        }
        getAccountBsTop(param).then((res) => {
          this.buyTop50 = res.buyTop50
          this.soldTop50 = res.soldTop50
        })
        this.$refs.composite.drawLineChart(this.timePicker)
      },
      toNewOpen (url, name, height = 800, width = 1200) {
        window.open(url, `securities_new_open_detail_${name}`, `height=${height}, width=${width}, toobar=no, location=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`)
      },
      toDetail (row, type) {
        let param = {
          acctno: row.invacctno,
          acctname: row.investor_account_name,
          brnname: row.brname,
          acctymtno: row.ymtno
        }
        this.toNewOpen(`#/accountDetail/${row.invacctno}/${this.$route.params.tradedate}/zh/${type}/${JSON.stringify(param)}`, row.invacctno)
      }
    },
    // 发起请求，拿回数据，配合路由钩子做一些事情
    mounted () {
      this.init()
    }
  }
</script>
<style lang="less" scoped>
</style>
