<!--基本资料 - 订单详情  orderParticulars -->
<template>
  <div class="orderParticulars">
    <el-card>
      <el-row>
        <el-col>
          <el-table
            border
            width="100%"
            ref="accountRerf"
            :data="accountDatas"
            show-overflow-tooltip
            @row-click="columnDate"
            style="width:100%;">
            <el-table-column
              prop="ordrno"
              sortable
              label="订单编码"
              align="left">
            </el-table-column>
            <el-table-column
              prop="datelstupddat"
              sortable
              label="前更新日期"
              align="left">
            </el-table-column>
            <el-table-column
              prop="account"
              sortable
              label="账户代码"
              align="left">
            </el-table-column>
            <el-table-column
              prop="source_pbuid"
              sortable
              label="源PBU"
              align="left">
            </el-table-column>
            <el-table-column
              prop="tg_pbuid"
              sortable
              label="目标PBU"
              align="left">
            </el-table-column>
            <el-table-column
              prop="trandat"
              sortable
              label="日期"
              align="left">
            </el-table-column>
            <el-table-column
              prop="trantim"
              sortable
              label="时间"
              align="left">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="margin-bottom: 0;">
          <el-pagination
            @size-change="handleSizeChangeO"
            @current-change="handleCurrentChangeO"
            :current-page="currentPageO"
            :page-sizes="pageSizesO"
            :page-size="pageSizeO"
            layout="total, sizes, prev, pager, next, jumper"
            :total="resultNumO"
            size="mini">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import {
    posOrderParticulars // 参与者查询-账户基本资料-账户指定交易历史详情
  } from '../../../service/analysisTool/participatorType/index'

  export default {
    data () {
      return {
        accountDatas: [],
        currentPageO: 1,
        pageSizesO: [10, 20, 50, 100],
        pageSizeO: 10,
        resultNumO: 0
      }
    },
    methods: {
      handleSizeChangeO (val) {
        this.pageSizeO = val
        let params = {
          accountId: this.$route.params.accountId,
          pageIndex: this.currentPageO,
          pageRows: this.pageSizeO
        }
        posOrderParticulars(params).then((resp) => {
          this.accountDatas = resp.bizData.metaData
          this.resultNumO = resp.bizData.totalRows
        })
      },
      handleCurrentChangeO (val) {
        this.currentPageO = val
        let params = {
          accountId: this.$route.params.accountId,
          pageIndex: this.currentPageO,
          pageRows: this.pageSizeO
        }
        posOrderParticulars(params).then((resp) => {
          this.accountDatas = resp.bizData.metaData
          this.resultNumO = resp.bizData.totalRows
        })
      },
      columnDate () {},
      fnOrderParticulars () {
        let params = {
          accountId: this.$route.params.accountId,
          // accountId:'D890777661',
          pageIndex: this.$route.params.pageIndex,
          pageRows: this.$route.params.pageRows
        }
        posOrderParticulars(params).then((resp) => {
          this.accountDatas = resp.bizData.metaData
          this.resultNumO = resp.bizData.totalRows
        })
      }
    },
    mounted () {
      this.fnOrderParticulars()
    }

  }
</script>
<style lang="less">
  .orderParticulars {

  }

</style>
