<!-- 测试tab-table-page组件 -->
<template>
  <div class=''>
    <tab-table-pagination
      :columnsList='columnsList'
      :tableDataList='tableDataList'
      :pageList='pageList'
      :tabList.sync='tabList'
      :slotList='slotList'
      @getTabTablePage='tabTablePage'>
      <div slot='special1'>
        <ul>
          <li>asdsafsdfas</li>
        </ul>
      </div>
      <div slot='special2'>
        <div id='myChart' style='height: 400px; width: 400px;'></div>
      </div>
      <div slot='special4'>
        33333333333333333
      </div>
    </tab-table-pagination>
  </div>
</template>

<script>
import TabTablePagination from './componentsTool/TabTablePagination'
import echarts from 'echarts'
import {getOrderGearIndexQuery} from '../../../service/analysisTool/complexQuery/index';

export default {
  components: {
    TabTablePagination,
    DimensionMeasureChoice: () => import('./componentsTool/DimensionMeasureChoice')
  },
  data() {
    return {
      queryData: {
        pageIndex: 1,
        pageRows: 10
      },
      slotList: [ // index是tab标签的索引
        {index: 0, name: 'special1'},
        {index: 1, name: 'special2', rewrite: true},
        {index: 3, name: 'special4'}
      ],
      indexTab: 0,
      tabList: [
        {name: '0000000', mark: '0'},
        {name: '1111111', mark: '1'},
        {name: '2222222', mark: '2'},
        {name: '3333333', mark: '3'}
      ],
      columnsList: [
        [ // 逐日
          {id: '331', show: true, label: '1111111股东账户', field: 'acct_id', align: 'left', sortable: false},
          {id: '332', show: true, label: '1111111股东名称', field: 'acct_name', align: 'left', sortable: false},
          {id: '333', show: true, label: '1111111一码通代码', field: '', align: 'left', sortable: false}
        ],
        [],
        [ // 逐笔
          {id: '3321', label: '333333交易日期', field: 'trade_date', align: 'left', sortable: false},
          {id: '3322', label: '333333股东账户', field: 'acct_id', align: 'left', sortable: false},
          {id: '3323', label: '333333股东名称', field: 'acct_name', align: 'left', sortable: false},
          {id: '3330', label: '333333流通类型', field: '', align: 'left', sortable: false}
        ],
        [ // 逐笔
          {id: '3321', label: '444444交易日期', field: 'trade_date', align: 'left', sortable: false},
          {id: '3322', label: '444444股东账户', field: 'acct_id', align: 'left', sortable: false},
          {id: '3323', label: '444444股东名称', field: 'acct_name', align: 'left', sortable: false},
          {id: '3324', label: '444444证券代码', field: 'sec_code', align: 'left', sortable: false},
          {id: '3325', label: '444444证券简称', field: 'sec_name', align: 'left', sortable: false}
        ]
      ],
      pageList: [
        {
          page: 1,
          size: 10,
          count: 120 // 页面总页数
        },
        {},
        {
          page: 1,
          size: 10,
          count: 180 // 页面总页数
        },
        {
          page: 1,
          size: 10,
          count: 180 // 页面总页数
        }
      ],
      tableDataList: [
        [
          {
            'trade_date': '2009-11-10',
            'acct_id': 'f11111',
            'pbu_id': '10953',
            'mem_code': '1CH1JSST77822',
            'mem_name': '1镇膊腔透',
            'acct_name': '1镇膊腔透',
            'trade_sell_amt_ratio': '.29408',
            'trade_sell_vol': 984.0,
            'trade_sell_vol_ratio': '4.48230',
            'net_buy_amt': '85.00',
            'trade_buy_amt_ratio': '2.72153',
            'order_buy_vol_ratio': '.95164',
            'net_buy_vol': 0.0,
            'order_buy_vol': 184.0,
            'ngsp_create_date': '2018-04-18 00:00:00',
            'order_sell_vol_ratio': '4.58613',
            'trade_acct_cnt': 0,
            'order_sell_amt': '1502.00',
            'order_buy_amt_ratio': '2.57024',
            'branch_code': 'SHGDTGD-00129165',
            'ngsp_uid': '1c6da2e3-f38c-4121-a871-be686b7a4c8c         ',
            'trade_buy_amt': '1590.00',
            'trade_sell_amt': '1505.00',
            'order_sell_vol': 984.0,
            'trade_buy_vol_ratio': '8.10477',
            'order_sell_amt_ratio': '.25002',
            'mem_branch_name': '江门台山桥湖路证券营业部',
            'order_buy_amt': '3156.00',
            'trade_buy_vol': 984.0
          },
          {
            'trade_date': '2009-11-11',
            'acct_id': 'f22222',
            'pbu_id': '20953',
            'mem_code': '2CH1JSST77822',
            'mem_name': '2镇膊腔透',
            'acct_name': '2镇膊腔透',
            'trade_sell_amt_ratio': '82.69001',
            'trade_sell_vol': 13697.0,
            'trade_sell_vol_ratio': '62.39238',
            'net_buy_amt': '-404376.00',
            'trade_buy_amt_ratio': '32.18767',
            'order_buy_vol_ratio': '51.60590',
            'net_buy_vol': -3719.0,
            'order_buy_vol': 9978.0,
            'ngsp_create_date': '2018-04-18 00:00:00',
            'order_sell_vol_ratio': '79.21793',
            'trade_acct_cnt': 0,
            'order_sell_amt': '459491.00',
            'order_buy_amt_ratio': '15.31558',
            'branch_code': 'SHSZTTJ-00700048',
            'ngsp_uid': '1c6da2e3-f38c-4121-a871-be686b7a4c8c         ',
            'trade_buy_amt': '18805.00',
            'trade_sell_amt': '423181.00',
            'order_sell_vol': 16997.0,
            'trade_buy_vol_ratio': '82.18433',
            'order_sell_amt_ratio': '76.48584',
            'mem_branch_name': '天津尖山路证券营业部',
            'order_buy_amt': '18806.00',
            'trade_buy_vol': 9978.0
          },
          {
            'trade_date': '2009-11-12',
            'acct_id': 'f33333',
            'pbu_id': '30953',
            'mem_code': '3CH1JSST77822',
            'mem_name': '3镇膊腔透',
            'acct_name': '3镇膊腔透',
            'trade_sell_amt_ratio': '17.01591',
            'trade_sell_vol': 7272.0,
            'trade_sell_vol_ratio': '33.12531',
            'net_buy_amt': '-49054.00',
            'trade_buy_amt_ratio': '65.09080',
            'order_buy_vol_ratio': '47.44246',
            'net_buy_vol': -6093.0,
            'order_buy_vol': 9173.0,
            'ngsp_create_date': '2018-04-18 00:00:00',
            'order_sell_vol_ratio': '16.19594',
            'trade_acct_cnt': 0,
            'order_sell_amt': '139760.00',
            'order_buy_amt_ratio': '82.11418',
            'branch_code': 'SHSZTBJ-00655003',
            'ngsp_uid': '1c6da2e3-f38c-4121-a871-be686b7a4c8c         ',
            'trade_buy_amt': '38028.00',
            'trade_sell_amt': '87082.00',
            'order_sell_vol': 3475.0,
            'trade_buy_vol_ratio': '9.71090',
            'order_sell_amt_ratio': '23.26414',
            'mem_branch_name': '绽小链蝎北京复兴路证券营业部',
            'order_buy_amt': '100828.00',
            'trade_buy_vol': 1179.0
          }
        ],
        [],
        [
          {
            'trade_date': '1111-11-10',
            'acct_id': 'f11111',
            'pbu_id': '10953',
            'mem_code': '1CH1JSST77822',
            'mem_name': '1镇膊腔透',
            'acct_name': '1镇膊腔透'
          },
          {
            'trade_date': '1111-11-11',
            'acct_id': 'f22222',
            'pbu_id': '20953',
            'mem_code': '2CH1JSST77822',
            'mem_name': '2镇膊腔透',
            'acct_name': '2镇膊腔透',
            'trade_sell_amt_ratio': '82.69001',
            'trade_sell_vol': 13697.0,
            'trade_sell_vol_ratio': '62.39238',
            'net_buy_amt': '-404376.00',
            'trade_buy_amt_ratio': '32.18767',
            'order_buy_vol_ratio': '51.60590',
            'net_buy_vol': -3719.0,
            'order_buy_vol': 9978.0,
            'ngsp_create_date': '2018-04-18 00:00:00',
            'order_sell_vol_ratio': '79.21793',
            'trade_acct_cnt': 0,
            'order_sell_amt': '459491.00',
            'order_buy_amt_ratio': '15.31558',
            'branch_code': 'SHSZTTJ-00700048',
            'ngsp_uid': '1c6da2e3-f38c-4121-a871-be686b7a4c8c         ',
            'trade_buy_amt': '18805.00',
            'trade_sell_amt': '423181.00',
            'order_sell_vol': 16997.0,
            'trade_buy_vol_ratio': '82.18433',
            'order_sell_amt_ratio': '76.48584',
            'mem_branch_name': '天津尖山路证券营业部',
            'order_buy_amt': '18806.00',
            'trade_buy_vol': 9978.0
          },
          {
            'trade_date': '1111-11-12',
            'acct_id': 'f33333',
            'pbu_id': '30953',
            'mem_code': '3CH1JSST77822',
            'mem_name': '3镇膊腔透',
            'acct_name': '3镇膊腔透'
          }
        ],
        [
          {
            'trade_date': '1111-11-10',
            'acct_id': 'f11111',
            'pbu_id': '10953',
            'mem_code': '1CH1JSST77822',
            'mem_name': '1镇膊腔透',
            'acct_name': '1镇膊腔透'
          },
          {
            'trade_date': '1111-11-11',
            'acct_id': 'f22222',
            'pbu_id': '20953',
            'mem_code': '2CH1JSST77822',
            'mem_name': '2镇膊腔透',
            'acct_name': '2镇膊腔透',
            'trade_sell_amt_ratio': '82.69001',
            'trade_sell_vol': 13697.0,
            'trade_sell_vol_ratio': '62.39238',
            'net_buy_amt': '-404376.00',
            'trade_buy_amt_ratio': '32.18767',
            'order_buy_vol_ratio': '51.60590',
            'net_buy_vol': -3719.0,
            'order_buy_vol': 9978.0,
            'ngsp_create_date': '2018-04-18 00:00:00',
            'order_sell_vol_ratio': '79.21793',
            'trade_acct_cnt': 0,
            'order_sell_amt': '459491.00',
            'order_buy_amt_ratio': '15.31558',
            'branch_code': 'SHSZTTJ-00700048',
            'ngsp_uid': '1c6da2e3-f38c-4121-a871-be686b7a4c8c         ',
            'trade_buy_amt': '18805.00',
            'trade_sell_amt': '423181.00',
            'order_sell_vol': 16997.0,
            'trade_buy_vol_ratio': '82.18433',
            'order_sell_amt_ratio': '76.48584',
            'mem_branch_name': '天津尖山路证券营业部',
            'order_buy_amt': '18806.00',
            'trade_buy_vol': 9978.0
          },
          {
            'trade_date': '1111-11-12',
            'acct_id': 'f33333',
            'pbu_id': '30953',
            'mem_code': '3CH1JSST77822',
            'mem_name': '3镇膊腔透',
            'acct_name': '3镇膊腔透'
          }
        ]
      ]
    }
  },
  methods: {
    tabTablePage(tabIndex, page) {
      if (tabIndex) {
        this.indexTab = tabIndex
      }
      if (page) {
        this.pageList[this.indexTab].page = page.currentPage
        this.pageList[this.indexTab].size = page.pageSizeNumber
        let params = {}
        this.pageList.map((item, i) => {
          if (item.page) {
            params['pageIndex' + (i + 1)] = item.page
            params['pageRows' + (i + 1)] = item.size
          }
        })
        params = Object.assign(params, this.queryData)
        getOrderGearIndexQuery(params).then(resp => {
        })
      }
    },
    drawImg() {
      let myCharts = echarts.init(document.getElementById('myChart'))
      console.log(myCharts, '3333333')
      let opt = {
        color: ['white', 'lightblue'],
        legend: {
          data: ['直接访问', '邮件营销']
        },
        grid: {
          left: '3%',
          right: '4%'
        },
        xAxis: [
          {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            data: [100, 300, 105, 30, 40]
          },
          {
            name: '邮件营销',
            type: 'bar',
            data: [180, 100, 145, 300, 440]
          }
        ]
      }
      myCharts.setOption(opt)
    }
  },
  mounted() {
    this.drawImg()
  }
}
</script>

<style lang='less' scoped>

</style>
