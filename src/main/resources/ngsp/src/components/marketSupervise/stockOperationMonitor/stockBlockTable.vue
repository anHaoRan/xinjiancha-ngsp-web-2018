<template>
  <el-card class="plate-info-area el-card-table">
    <!--全市沪市切换按钮-->
    <el-radio-group v-show="isBlockRadio" v-model="industryRadio" size="mini" class="radioBox">
      <el-radio-button label="全市"></el-radio-button>
      <el-radio-button label="沪市"></el-radio-button>
    </el-radio-group>
    <!--自定义设置-->
    <el-button v-show="isSetUpBtn" class="setUpBtn" type="primary" size="small" @click="handleSetUp">设置</el-button>
    <el-dialog title="设置" :visible.sync="isCustomSetUpBox">
      <customSetUpBox></customSetUpBox>
    </el-dialog>
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="行业板块" name="board-sw">
        <industry-block ref="sw"></industry-block>
      </el-tab-pane>
      <el-tab-pane label="概念板块" name="board-wd">
        <concept-block ref="wd"></concept-block>
      </el-tab-pane>
      <el-tab-pane label="自定义板块" name="board-cus">
        <custom-block ref="cus"></custom-block>
      </el-tab-pane>
    </el-tabs>
    <div class="data-download-btn">
      <el-button type="primary" icon="el-icon-download" size="small" @click="downloadStockExcel"></el-button>
    </div>
  </el-card>
</template>

<script>
  import * as types from '../../../store/mutation-types'
  import customSetUpBox from './commonBlock/customSetUpBox'
  import IndustryBlock from './stockBlockTable/IndustryBlock'
  import ConceptBlock from './stockBlockTable/ConceptBlock'
  import CustomBlock from './stockBlockTable/CustomBlock'
  import editTable from './commonBlock/editTable'

  export default {
    components: {
      customSetUpBox,
      IndustryBlock,
      ConceptBlock,
      CustomBlock,
      editTable
    },
    data () {
      return {
        activeName: 'board-sw',
        industryRadio: '全市',
        isBlockRadio: true,
        isSetUpBtn: false,
        isCustomSetUpBox: false,
        editTableVisible: false,
        SBTimeOut: null
        // customTitle:'版块管理',
      }
    },
    computed: {
      currentIndexCode () {
        return this.$store.state.marketSupervise.currentIndexCode
      },
      stockTimeRange () {
        return this.$store.getters.getStockTimeRange
      },
      tradeDate () {
        return this.$store.getters.getStockTradeDate
      },
      dateRage () {
        return this.$store.getters.getStockDateRange
      }
    },
    watch: {
      currentIndexCode: function () {
        this.getBlockData()
      },
      stockTimeRange: function () {
        this.getBlockData()
      },
      tradeDate: function () {
        this.getBlockData()
      },
      dateRage () {
        this.getBlockData()
      }
    },
    methods: {
      handleTabsClick (tab) {
        this.$store.commit(types.M_CODE_TYPE, tab.name)
        this.getBlockData()
      },
      downloadStockExcel () {
        let tableColumns = [
          {'sheetName': '行业板块', 'fileColumns': this.$refs.sw.columns},
          {'sheetName': '概念板块', 'fileColumns': this.$refs.wd.columns},
          {'sheetName': '自定义板块', 'fileColumns': this.$refs.cus.columns}
        ]
        let params = JSON.parse(JSON.stringify(this.$store.getters.getMonitorBlockParams))
        params.tableColumns = tableColumns
        this.gfnExportFileWithForm('/fluct/quotation/v1/export', params)
      },
      handleSetUp () {
        this.isCustomSetUpBox = true
      },
      getBlockData () {
        clearTimeout(this.SBTimeOut)
        if (this.activeName === 'board-sw') {
          this.$refs.sw.getSwData()
        } else if (this.activeName === 'board-wd') {
          this.$refs.wd.getWdData()
        } else {
          this.$refs.cus.getCusData()
        }
        this.SBTimeOut = setTimeout(this.getBlockData, 30000)
      }
    },
    mounted () {
      this.$store.commit(types.M_CODE_TYPE, 'board-sw')
      this.$store.commit(types.M_BOARD_CODE_LIST, '')
      this.$store.commit(types.M_SECURITY_IDS, '')
      this.getBlockData()
    },
    beforeDestroy () {
      // 离开页面时销毁轮询时间
      if (this.SBTimeOut != null) {
        clearTimeout(this.SBTimeOut)
      }
    }
  }
</script>

<style lang="less">
  .plate-info-area {
    .radioBox {
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: #1853a5;
        border-color: #1853a5;
        color: #fff;
        box-shadow: none;
      }
      .el-radio-button__inner {
        background: #17274b;
        border: 1px solid #17274b;
        color: #7b8fb9;
      }
    }

  }
</style>
