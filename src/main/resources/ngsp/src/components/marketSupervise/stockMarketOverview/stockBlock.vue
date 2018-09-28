<template>
  <el-card class="mainCard el-card-table">
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="行业板块" name="industryBlock">
        <industry-block ref="industryBlock"></industry-block>
      </el-tab-pane>
      <el-tab-pane label="概念板块" name="conceptBlock">
        <concept-block ref="conceptBlock"></concept-block>
      </el-tab-pane>
      <el-tab-pane label="自定义板块" name="customBlock">
        <custom-block ref="customBlock"></custom-block>
      </el-tab-pane>
    </el-tabs>
    <div class="data-download-btn">
      <el-button type="primary" icon="el-icon-download" size="small" @click="downloadBlockExcel"></el-button>
    </div>
  </el-card>
</template>

<script>
  import * as types from '../../../store/mutation-types'
  import IndustryBlock from './stockBlock/industryBlock'
  import CustomBlock from './stockBlock/customBlock'
  import ConceptBlock from './stockBlock/conceptBlock'

  export default {
    components: {
      ConceptBlock,
      CustomBlock,
      IndustryBlock
    },
    data () {
      return {
        activeName: 'industryBlock',
        blockTimeOut: null
      }
    },
    computed: {
      currentIndexCode () {
        return this.$store.getters.getCurrentIndexCode
      }
    },
    watch: {
      currentIndexCode: function () {
        this.getBlockData()
      }
    },
    methods: {
      handleTabsClick (tab) {
        let boardType = ''
        if (tab.name === 'industryBlock') {
          boardType = 'board-sw'
        } else if (tab.name === 'conceptBlock') {
          boardType = 'board-wd'
        } else if (tab.name === 'customBlock') {
          boardType = 'board-cus'
        }
        this.$store.commit(types.O_BOARD_TYPE, boardType)
        this.getBlockData()
      },
      downloadBlockExcel () {
        let tableColumns = [
          {'sheetName': '行业板块', 'fileColumns': this.$refs.industryBlock.columns},
          {'sheetName': '概念板块', 'fileColumns': this.$refs.conceptBlock.columns},
          {'sheetName': '自定义板块', 'fileColumns': this.$refs.customBlock.columns}
        ]
        let params = JSON.parse(JSON.stringify(this.$store.getters.getBoardParams))
        params.tableColumns = tableColumns
        this.gfnExportFileWithForm('/fluct/quotation/v1/export', params)
      },
      getBlockData () {
        clearTimeout(this.blockTimeOut)
        if (this.activeName === 'industryBlock') {
          this.$refs.industryBlock.getIndustryData()
        } else if (this.activeName === 'conceptBlock') {
          this.$refs.conceptBlock.getConceptData()
        } else {
          this.$refs.customBlock.getCustomData()
        }
        this.blockTimeOut = setTimeout(this.getBlockData, 30000)
      }
    },
    mounted () {
      this.getBlockData()
    },
    beforeDestroy () {
      // 离开页面时销毁轮询时间
      if (this.blockTimeOut != null) {
        clearTimeout(this.blockTimeOut)
      }
    }
  }
</script>
