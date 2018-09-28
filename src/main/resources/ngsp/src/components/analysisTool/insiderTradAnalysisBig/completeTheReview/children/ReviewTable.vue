<!--表格-->
<template>
  <el-card class="el-card-table">
    <div slot="header" class="clearfix">
      <span>上报账户列表</span>
    </div>
    <el-table
      max-height="400"
      ref="completeTheReviewList"
      :data="completeTheReviewList"
      @current-change="handleCurrentChange">
      <el-table-column
        :fixed="item.fixed"
        align="center"
        :show-overflow-tooltip="true"
        :key="item.field"
        :prop="item.field"
        :label="item.label"
        :width="item.width"
        :formatter="item.formatter"
        v-for="item in columns"
      ></el-table-column>
    </el-table>
    <el-row>
      <el-col :span="12">
        <pageination style="float: left" :pageTotal="pageTotal" @getPageination="getPageination"></pageination>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
  // 分页组件引入
  import Pageination from '@/components/common/pageination'
  import {
    qryIndicsAccount
  } from '@/service/analysisTool/insiderTradAccountAnalysisBig/completeTheReview/index'

  export default {
    components: {
      Pageination
    },
    name: 'review-table',
    props: {
      type: '',
      dynamicTableHead: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        completeTheReviewList: [],
        columns: [
          {field: 'acct_id', width: '100', label: '账户代码', fixed: true},
          {field: 'acct_name', width: '100', label: '账户名称'},
          {field: 'score_total', width: '100', label: '综合得分'},
          {field: 'ymt_acct_id', width: '175', label: '账户一码通编码'},
          {field: 'credent_number', width: '150', label: '账户证件号码'},
          {field: 'acct_area', width: '175', label: '身份证所属地区'},
          {field: 'branch_name', width: '125', label: '交易营业部'},
          {field: 'branch_rank', width: '150', label: '营业部净买入排名'},
          {field: 'branch_area', width: '175', label: '营业部地区名称'},
          {field: 'had_report', width: '175', label: '历史是否上报过'},
          {field: 'anal_result', width: '150', label: '分析人员判断结论'},
          {field: 'reanal_result', width: '150', label: '复核人员判断结论'},
          {field: 'final_result', width: '150', label: '最终判断结果', formatter: this.formatterFinalResult},
          {
            field: 'is_trans_type_changed',
            width: '150',
            label: '交易品种是否有明显变化',
            formatter: this.formatterIsTransTypeChanged
          },
          {
            field: 'is_trans_style_changed',
            width: '150',
            label: '交易风格是否有明显变化',
            formatter: this.formatterIsTransStyleChanged
          },
          {
            field: 'is_hold_habit_changed',
            width: '150',
            label: '持股习惯是否有明显变化',
            formatter: this.formatterIsHoldHabitChanged
          },
          {field: 'acct_type', width: '150', label: '账户类别'}
          // {field: "zhlh0000", width: '125', label: "期间买入量"},
          // {field: "zhlh0001", width: '125', label: "期间买入金额"},
          // {field: "zhlh0002", width: '125', label: "期间卖出量"},
          // {field: "zhlh0003", width: '150', label: "期间卖出金额"},
          // {field: "zhlh0004", width: '150', label: "期间净买入量"},
          // {field: "zhlh0005", width: '100', label: "期末持股"},
          // {field: "zhlh0006", width: '150', label: "期间该股买入金额/期间总买入金额(%)"},
          // {field: "zhlh0007", width: '150', label: "加分指标1（关键特征-交易异常）"},
          // {field: "zhlh0008", width: '150', label: "期末市值/期末总持股市值(%)"},
          // {field: "zhlh0009", width: '150', label: "加分指标2（关键特征-持股异常）"},
          // {field: "zhlh0010", width: '150', label: "近一年首次买入日期-停牌前1周内/1个月"},
          // {field: "zhlh0011", width: '150', label: "加分指标3（强辅助特征1）"},
          // {field: "zhlh0012", width: '150', label: "复牌后5日内账户净卖出量/停牌前前日账户持有量(%)"},
          // {field: "zhlh0013", width: '150', label: "复牌后10日内账户净卖出量/停牌前前日账户持有量(%)"},
          // {field: "zhlh0014", width: '150', label: "加分指标4（强辅助特征2）"},
          // {field: "zhlh0015", width: '150', label: "停牌前一年该股买入金额"},
          // {field: "zhlh0016", width: '150', label: "买入金额/近一年其他股票最大买入金额"},
          // {field: "zhlh0017", width: '150', label: "买入金额/近一年其他股票最大持股市值"},
          // {field: "zhlh0018", width: '150', label: "加分指标5（强辅助特征3）"},
          // {field: "zhlh0019", width: '150', label: "账户停牌前一年内交易股票只数"},
          // {field: "zhlh0020", width: '150', label: "该股持股天数/其他股票平均持股天数"},
          // {field: "zhlh0021", width: '150', label: "加分指标6（强辅助特征4）"},
          // {field: "zhlh0022", width: '150', label: "主动买入占比(%)"},
          // {field: "zhlh0023", width: '150', label: "加分指标7（强辅助特征5）"},
          // {field: "zhlh0024", width: '150', label: "加分指标8（强辅助特征6）"},
          // {field: "zhlh0025", width: '150', label: "账户是否空置3个月以上"},
          // {field: "zhlh0026", width: '150', label: "加分指标9（弱辅助特征2）"},
          // {field: "zhlh0027", width: '150', label: "前三个月交易股票支数/期间内交易股票支数"},
          // {field: "zhlh0028", width: '150', label: "加分指标10（弱辅助特征3）"},
          // {field: "zhlh0029", width: '150', label: "首次买入该股当日该股买入金额/前2日其他股票净卖出金额(%)"},
          // {field: "zhlh0030", width: '150', label: "加分指标11(弱辅助特征4)"},
          // {field: "a", width: '150', label: "该股净买入金额/排名第二的机构账户净买入额"},
          // {field: "a", width: '150', label: "净买入金额/机构账户平均净买入额"},
          // {field: "a", width: '150', label: "加分指标12（弱辅助特征5）"},
          // {field: "a", width: '150', label: "营业部地址与关注地区是否一致"},
          // {field: "a", width: '150', label: "账户与知情人地址是否一致"},
          // {field: "a", width: '150', label: "加分指标13（关联特征）"},
          // {field: "zhlh0034", width: '150', label: "期间卖出量/买入量(%)"},
          // {field: "zhlh0035", width: '150', label: "减分指标1（降低疑似度特征1）"},
          // {field: "zhlh0036", width: '150', label: "该股买入金额/买入股票总金额(%)"},
          // {field: "zhlh0037", width: '150', label: "减分指标2（降低疑似度特征2）"},
          // {field: "zhlh0038", width: '150', label: "期间卖出量/期间买入量(%)"},
          // {field: "zhlh0039", width: '150', label: "减分指标3（降低疑似度特征3）"},
          // {field: "zhlh0040", width: '150', label: "首次买入该股当日买入金额/前2日其他股票净卖出金额(%)"},
          // {field: "zhlh0041", width: '150', label: "账户净买入该股金额/近一年内沪深最大持股市值"},
          // {field: "zhlh0042", width: '150', label: "减分指标4（降低疑似度特征4）"},
          // {field: "zhlh0043", width: '150', label: "净买入量排名"},
          // {field: "zhlh0044", width: '150', label: "净买入金额"},
          // {field: "zhlh0045", width: '150', label: "减分指标5（降低疑似度特征5）"},
          // {field: "zhlh0046", width: '150', label: "复牌后5日净买入量/期间净买入量(%)"},
          // {field: "zhlh0047", width: '150', label: "减分指标6（降低疑似度特征6）"},
          // {field: "a", width: '150', label: "实际盈利"},
          // {field: "a", width: '150', label: "账面盈利"},
          // {field: "a", width: '150', label: "(假设)总盈利"},
          // {field: "a", width: '150', label: "减分指标7（降低疑似度特征7）"},
          // {field: "zhlh0048", width: '150', label: "近一年内首次买入时间"},
          // {field: "zhlh0049", width: '150', label: "减分指标8（降低疑似度特征8）"},
          // {field: "zhlh0050", width: '150', label: "(公告后其他股票买入金额-目标股卖出金额)/买入该股金额(%)"},
          // {field: "zhlh0051", width: '150', label: "减分指标9（降低疑似度特征9）"},
          // {field: "zhlh0052", width: '150', label: "公告后五个交易日股价最高涨幅(%)"},
          // {field: "zhlh0053", width: '150', label: "减分指标10(降低疑似度特征10)"},
          // {field: "zhlh0054", width: '150', label: "利好公告后净买入金额占分析期间比例(%)"},
          // {field: "zhlh0055", width: '150', label: "减分指标11（降低疑似度特征11）"},
          // {field: "zhlh0056", width: '150', label: "沪深最大持股市值"},
          // {field: "zhlh0057", width: '150', label: "最大持股日期"},
          // {field: "zhlh0058", width: '150', label: "账户买入金额/沪深最大持股市值"}
        ],
        pageTotal: null,
        pageIndex: 1,
        pageRows: 10
      }
    },
    watch: {
      dynamicTableHead: {
        handler: function () {
          for (let key of this.dynamicTableHead) {
            this.columns.push({field: key.index_id, width: '150', label: key.index_desc})
          }
        },
        deep: true
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.ajaxQryIndicsAccount()
      })
    },
    methods: {
      handleCurrentChange (val) {
        this.$emit('listensCurrentRow', val)
      },
      //  利空
      ajaxQryIndicsAccount () {
        qryIndicsAccount({
          taskID: this.$route.params.taskId,
          pageIdx: this.pageIndex,
          pageRw: this.pageRows
        }).then((res) => {
          this.completeTheReviewList = res.acctsRes
          this.pageTotal = Number(res.pageTotal)
          this.$refs.completeTheReviewList.setCurrentRow(this.completeTheReviewList[0])
        })
      },
      //  分页方法
      getPageination (pageinationVal) {
        this.pageRows = pageinationVal.pageSizeNumber
        this.pageIndex = pageinationVal.currentPage
        this.ajaxQryIndicsAccount()
      },
      formatterFinalResult (row, column) {
        let str = ''
        switch (row.final_result) {
          case '0':
            str = '无异常'
            break
          case '1':
            str = '进一步关注'
            break
          case '2':
            str = '进一步调查'
            break
        }
        return str
      },
      formatterIsTransTypeChanged (row, column) {
        let str = ''
        switch (row.is_trans_type_changed) {
          case '0':
            str = '是'
            break
          case '1':
            str = '否'
            break
        }
        return str
      },
      formatterIsTransStyleChanged (row, column) {
        let str = ''
        switch (row.is_trans_style_changed) {
          case '0':
            str = '是'
            break
          case '1':
            str = '否'
            break
        }
        return str
      },
      formatterIsHoldHabitChanged (row, column) {
        let str = ''
        switch (row.is_hold_habit_changed) {
          case '0':
            str = '是'
            break
          case '1':
            str = '否'
            break
        }
        return str
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
