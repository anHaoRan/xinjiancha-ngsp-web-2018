<template>
  <div class="manipulation-analysis-or-abnormal-trading">
    <el-card class="el-card-table">
      <el-tabs v-model="ManipulationAnalysisOrAbnormalTrading">
        <el-tab-pane label="操纵分析结果表" name="ManipulationAnalysis">
          <keep-alive>
            <manipulation-analysis
              v-if="ManipulationAnalysisOrAbnormalTrading=='ManipulationAnalysis'"
              ref="ManipulationAnalysis"
              :optResultList="optResultList" :branchAcctsList="branchAcctsList" @columns="columns"/>
          </keep-alive>
        </el-tab-pane>
        <!--<el-tab-pane label="异常交易行为统计表" name="AbnormalTrading">
          <keep-alive>
            <abnormal-trading v-if="ManipulationAnalysisOrAbnormalTrading=='AbnormalTrading'"
                              ref="AbnormalTrading"
            />
          </keep-alive>
        </el-tab-pane>-->
      </el-tabs>
    </el-card>
    <!-- <div class="prompt el-upload-list__item-name" v-if="ManipulationAnalysisOrAbnormalTrading=='ManipulationAnalysis'">
      注：“
      <i class="fa fa-lightbulb-o active"/>
      ”表示最近一次编辑的结果与系统计算结果不一致，关闭灯泡则恢复为系统计算结果
    </div> -->
    <div class="export">      
      <file-upload
        style="display: inline-block;margin-right:10px"
        :disabled="isLoadingBtn"
        :isShowSuccessMessage="true"
        :limitFileType="['xls', 'xlsx']"
        :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
        :uploadOption="{size: 'small',type: 'primary',name: '上传'}"
        :uploadParams="uploadParams1"
        @getTxtCon="getTxtData"
      ></file-upload>
      <el-dropdown @command="handleDownload">
        <el-button type="info" size="small">
          导出<i class="el-icon-arrow-down el-icon-right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="excel">
            <i class="el-icon-document"></i>导出为EXCEL
          </el-dropdown-item>
          <!--<el-dropdown-item command="csv">
            <i class="el-icon-tickets"></i>导出为CSV
          </el-dropdown-item>-->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import { optresultExport, unusualExport } from '@/service/analysisTool/ManipulateAnalysisList/index'
  import Mixin from './Mixin'

  export default {
    name: 'manipulation-analysis-or-abnormal-trading',
    props: {
      optResultList: {
        type: Array,
        default () {
          return []
        }
      },
      branchAcctsList: {
        type: Array,
        default () {
          return []
        }
      },
      isLoadingBtn: {
        type: Boolean,
        default () {
          return false
        }
      },
    },
    components: {
      ManipulationAnalysis: () => import('./ManipulationAnalysisOrAbnormalTradingTab/ManipulationAnalysis'),
      AbnormalTrading: () => import('./ManipulationAnalysisOrAbnormalTradingTab/AbnormalTrading'),
      FileUpload: () => import('@/components/common/textUpload'),
    },
    mixins: [Mixin],
    data () {
      return {
        ManipulationAnalysisOrAbnormalTrading: 'ManipulationAnalysis',
        uploadParams1: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1, // 前置忽略项
              fields: ['acct_id', 'acct_name', 'branch_name', 'acct_type', 'acct_remark', 'relate_type', 'trdamt', 'per_trade', 'yl', 'reanal_flag', 'reanal_rmk'] // 读取文件数据并以此格式返回数据
            }
          ])
        },
        columnsArr: [],
        


      }
    },
    computed: {},
    watch: {},
    methods: {
      handleDownload (val) { // 操纵分析-账户列表-分析结果导出
        this.$message.info('正在导出操纵分析结果表，请稍等~')
        let downloadParams = {
          fileType: 'xlsx',
          tableColumns: [
            {
              'sheetName': '操纵分析结果表',
              'fileColumns': this.columnsArr
            }
          ],
          acctResExp: this.optResultList
        }
        console.log('downloadParams:',downloadParams)
        this.gfnExportFileWithForm('/specialqry/operate/v1/analysis-acctres-export',downloadParams)

      },
      getTxtData (val) {
        this.$emit('uploadOptResultList',val.Sheet0)
      },
      columns(columns){
        this.columnsArr = columns
      },


    },
    created () {
    },
    mounted () {
      // 分析中状态上传参数没有复核意见原因
      if(JSON.parse(this.$route.params.params).task_status == 'x1' || JSON.parse(this.$route.params.params).task_status == 'x3'){
        this.uploadParams1 = {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1, // 前置忽略项
              fields: ['acct_id', 'acct_name', 'branch_name', 'acct_type', 'acct_remark', 'relate_type', 'trdamt', 'per_trade', 'yl'] // 读取文件数据并以此格式返回数据
            }
          ])
        }
      }
      

    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less">
  .manipulation-analysis-or-abnormal-trading {
    position: relative;
    .prompt {
      position: absolute;
      left: 400px;
      top: 22px;
    }
    .export {
      position: absolute;
      right: 20px;
      top: 13px;
    }
    .fa-lightbulb-o {
      /*font-size: 22px;*/
      &.active {
        color: #ffcd36;
      }
    }
    .lightbulb-button {
      font-size: 22px;
      margin-left: 5px;
      cursor: pointer;
    }

  }
</style>
