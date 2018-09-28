<template>
    <div class="macro-analysis-res">
        <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
        <div v-loading="loading"
             element-loading-spinner="el-icon-loading"
             element-loading-text="数据加载中，请耐心等待..."
             element-loading-background="rgba(0,0,0,0.3)">
            <el-card style="margin-top:20px;" class="product-query-tabs">
                <el-tabs v-model="activeName" @tab-click="handleClick">

                    <el-tab-pane label="公司股价及交易量走势图" name="transactionStream">
                    </el-tab-pane>

                    <el-tab-pane label="公司基本信息及公告事项" name="basicInfo">
                    </el-tab-pane>

                    <el-tab-pane label="持股集中度趋势图" name="holdDegree">
                    </el-tab-pane>

                    <el-tab-pane label="持股单一账户变化图" name="singleAccountChange">
                    </el-tab-pane>

                    <el-tab-pane label="公司控股股东历史变更情况" name="stockholderHistoryChange" disabled>
                    </el-tab-pane>

                </el-tabs>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="研报及舆情" name="newspaperAndPublicOpinion" disabled>
                    </el-tab-pane>

                    <el-tab-pane label="历史监管记录" name="historyRegulatory" disabled>
                    </el-tab-pane>

                    <el-tab-pane label="公司大宗交易情况" name="blockTradeInfo">
                    </el-tab-pane>

                    <el-tab-pane label="期末持股前100名账户列表" name="listOfTopHundred">
                    </el-tab-pane>

                    <el-tab-pane label="内幕知情人交易情况" name="insiderDetailInfo">
                    </el-tab-pane>
                </el-tabs>
            </el-card>
            <div>
                <transaction-stream
                        v-show="'transactionStream' ==  momentPath"
                        ref="transactionStream"/>
                <basic-info
                        v-show="'basicInfo'==  momentPath"
                        ref="basicInfo"/>
                <hold-degree
                        v-show="'holdDegree'==  momentPath"
                        ref="holdDegree"/>
                <single-account-change
                        v-show="'singleAccountChange'==  momentPath"
                        ref="singleAccountChange"/>
                <stockholder-history-change
                        v-show="'stockholderHistoryChange'==  momentPath"
                        ref="stockholderHistoryChange"/>
                <newspaper-and-public-opinion
                        v-show="'newspaperAndPublicOpinion'==  momentPath"
                        ref="newspaperAndPublicOpinion"/>
                <history-regulatory
                        v-show="'historyRegulatory'==  momentPath"
                        ref="historyRegulatory"/>
                <block-trade-info
                        v-show="'blockTradeInfo'==  momentPath"
                        ref="blockTradeInfo"/>
                <list-of-top-hundred
                        v-show="'listOfTopHundred'==  momentPath"
                        ref="listOfTopHundred"/>
                <insider-detail-info
                        v-show="'insiderDetailInfo'==  momentPath"
                        ref="insiderDetailInfo"/>
            </div>
            <div style="margin: 10px auto ;text-align: center">
                <el-button size="small" type="text" @click="downloadTabsDialog = true" v-if="false">内容导出</el-button>
                <el-button size="small" type="primary" @click="finishAnaly">完成宏观分析</el-button>
                <el-button v-if="operatorType=='analysiser'&&!operateType.includes('6')" size="small" type="text"
                           @click="stopTaskDialog = true">终止分析
                </el-button>
                <el-button size="small" type="text" @click="goBackStep">返回上一步</el-button>
            </div>
            <el-dialog title="内容导出" :visible.sync="downloadTabsDialog">
                <span>导出内容：</span>
                <div style="margin-left: 70px;" class="clearfix">
                    <el-checkbox-group v-model="downloadTabsList"
                                       v-for="item in tabsList"
                                       :key="item.value"
                                       style="width: 50%;float: left">
                        <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" type="primary" @click="download">导出</el-button>
                    <el-button size="small" type="text" @click="cancelDownload">取消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="请根据宏观分析选择或填写结论" :visible.sync="finishTaskDialog" v-if="operatorType!=='finish'">
                <div class="submit-params">
                    <span><i class="mustInput">*</i>上市公司最近一期报告中是否有盈利同比增加/扭亏为盈/亏损同比减少等利好？</span>
                    <el-radio-group v-model="radioList.radio1" :disabled="operatorType==='checker'">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </div>
                <div class="submit-params">
                    <span><i class="mustInput">*</i>除本次核查事项外，上市公司分析期间有过其他重大利好事项？</span>
                    <el-radio-group v-model="radioList.radio2" :disabled="operatorType==='checker'">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </div>
                <div class="submit-params">
                    <span><i class="mustInput">*</i>除本次核查事项外，上市公司分析期间有过其他重大利空事项？</span>
                    <el-radio-group v-model="radioList.radio3" :disabled="operatorType==='checker'">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </div>
                <div class="submit-params">
                    <span><i class="mustInput">*</i>上市公司分析期间是否发布过股价异常波动公告</span>
                    <el-radio-group v-model="radioList.radio4" :disabled="operatorType==='checker'">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </div>
                <div>
                    <span style="display: inline-block;margin-bottom: 10px">备注：</span>
                    <div>
                        <el-input
                                type="textarea"
                                v-model="remarkInfo"
                                row="3"
                                style="margin-left: 50px; width: 600px"
                                :disabled="operatorType==='checker'">
                        </el-input>
                    </div>
                </div>
                <div v-if="operatorType==='checker'">
                    <span style="display: inline-block;margin: 10px 0">复核人员结论：</span>
                    <div>
                        <el-input
                                type="textarea"
                                v-model="checkerConclusion"
                                row="3"
                                style="margin-left: 50px; width: 600px">
                        </el-input>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" type="primary" @click="submitRes">提交</el-button>
                    <el-button size="small" type="text" @click="cancelSubmit">取消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="终止确认" :visible.sync="stopTaskDialog">
                <div>终止后无法恢复，确认终止？</div>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" type="primary" @click="sureStop">确定</el-button>
                    <el-button size="small" type="text" @click="cancleStop">取消</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
  //  面包屑组件
  import breadcrumb from '../../../components/common/Breadcrumb'
  //  引入子组件
  import TransactionStream from './macroAnalysisRes/transactionStream'
  import BasicInfo from './macroAnalysisRes/basicInfo'
  import HoldDegree from './macroAnalysisRes/holdDegree'
  import SingleAccountChange from './macroAnalysisRes/singleAccountChange'
  import StockholderHistoryChange from './macroAnalysisRes/stockholderHistoryChange'
  import NewspaperAndPublicOpinion from './macroAnalysisRes/newspaperAndPublicOpinion'
  import HistoryRegulatory from './macroAnalysisRes/historyRegulatory'
  import BlockTradeInfo from './macroAnalysisRes/blockTradeInfo'
  import ListOfTopHundred from './macroAnalysisRes/listOfTopHundred'
  import InsiderDetailInfo from './macroAnalysisRes/insiderDetailInfo'
  // 停止任务
  import {
    changeTaskstatus,
    finishTask,
    getAnalyserConclusion
  } from '../../../service/analysisTool/insiderTradAccountAnalysis'

  export default {
    components: {
      //  面包屑组件
      breadcrumb,
      // 公司股价及交易量走势图
      TransactionStream,
      // 公司基本信息及公告事项
      BasicInfo,
      // 持股集中度趋势图
      HoldDegree,
      // 持股单一账户变化图
      SingleAccountChange,
      // 公司控股股东历史变更情况
      StockholderHistoryChange,
      // 研报及舆情
      NewspaperAndPublicOpinion,
      // 历史监管记录
      HistoryRegulatory,
      // 公司大宗交易情况
      BlockTradeInfo,
      // 期末持股前100名账户列表
      ListOfTopHundred,
      // 内幕知情人交易情况
      InsiderDetailInfo
    },
    name: 'macro-analysis-res',
    msg: '宏观分析结果',
    computed:{
      macroAnalyRequestCount: function () {
        return  this.$store.state.insiderTradAnalysis.macroAnalyRequestCount
      }
    },
    watch: {
      macroAnalyRequestCount: function (newVal, OldVal) {
        if (newVal === 7) {
          this.$store.commit('changeMacroAnalyRequestCount', 0)
          this.loading=false
        }
      }
    },
    data () {
      return {
        //  面包屑
        breadcrumbItems: [
          {
            router: '/insiderTradAnalysis',
            label: '分析工具'
          }, {
            router: '/insiderTradAnalysis',
            label: '特定工具'
          }, {
            router: '/insiderTradAnalysis',
            label: '内幕交易分析'
          }
        ],
        activeName: 'transactionStream',
        momentPath: 'transactionStream',
        // 导出内容弹出框
        downloadTabsDialog: false,
        // 完成任务弹出框
        finishTaskDialog: false,
        // 停止任务弹出框
        stopTaskDialog: false,
        downloadTabsList: [],
        tabsList: [
          {label: '公司股价和交易量走势图', value: 1},
          {label: '公司基本信息及重大事项', value: 2},
          {label: '持股集中度趋势图', value: 3},
          {label: '持股单一账户变化图', value: 4},
          {label: '公司控股股东历史变更情况', value: 5},
          {label: '研究报告及舆情', value: 6},
          {label: '历史监管记录', value: 7},
          {label: '公司大宗交易情况', value: 8},
          {label: '期末持股前100名账户列表', value: 9},
          {label: '内幕知情人交易情况', value: 10}
        ],
        radioList: {
          radio1: '',
          radio2: '',
          radio3: '',
          radio4: ''
        },
        remarkInfo: '',
        checkerConclusion: '',
        // 当前任务类型
        operatorType: '',
        // 当前人员权限
        operateType: [],
        // 当前任务Id
        taskId: '',
        loading:null
      }
    },
    methods: {
      getAllTabsData(){
        this.$store.commit('changeMacroAnalyRequestCount', 0)
        this.$refs.transactionStream.getResultData()
        // this.$refs.basicInfo.getResultData()
        this.$refs.holdDegree.getResultData()
        this.$refs.singleAccountChange.getResultData()
        // this.$refs.stockholderHistoryChange.getResultData()
        // this.$refs.newspaperAndPublicOpinion.getResultData()
        // this.$refs.historyRegulatory.getResultData()
        // this.$refs.blockTradeInfo.getResultData()
        this.$refs.listOfTopHundred.getResultData()
        this.$refs.insiderDetailInfo.getResultData()
      },
      handleClick (tab, envent) {
        var tabArr = ['tab-transactionStream', 'tab-basicInfo', 'tab-holdDegree', 'tab-singleAccountChange', 'tab-stockholderHistoryChange', 'tab-newspaperAndPublicOpinion', 'tab-historyRegulatory', 'tab-blockTradeInfo', 'tab-listOfTopHundred', 'tab-insiderDetailInfo']
        for (let i = 0; i < tabArr.length; i++) {
          if (event.target.id == tabArr[i]) {
            this.momentPath = tabArr[i].split('-')[1]
          }
        }
        switch (this.activeName) {
        //   case 'transactionStream' :
        //     this.$refs.transactionStream.getResultData()
        //     break
          case 'basicInfo' :
            this.$refs.basicInfo.getResultData()
            break
        //   case 'holdDegree' :
        //     this.$refs.holdDegree.getResultData()
        //     break
        //   case 'singleAccountChange' :
        //     this.$refs.singleAccountChange.getResultData()
        //     break
        //   case 'stockholderHistoryChange' :
        //     this.$refs.stockholderHistoryChange.getResultData()
        //     break
        //   case 'newspaperAndPublicOpinion' :
        //     this.$refs.newspaperAndPublicOpinion.getResultData()
        //     break
        //   case 'historyRegulatory' :
        //     this.$refs.historyRegulatory.getResultData()
        //     break
          case 'blockTradeInfo' :
            this.$refs.blockTradeInfo.getResultData()
            break
        //   case 'listOfTopHundred' :
        //     this.$refs.listOfTopHundred.getResultData()
        //     break
        //   case 'insiderDetailInfo' :
        //     this.$refs.insiderDetailInfo.getResultData()
        //     break
        }
      },
      // 导出任务
      download () {
        this.downloadTabsDialog = false
      },
      cancelDownload () {
        this.downloadTabsDialog = false
      },
      // 完成宏观分析按钮点击事件
      finishAnaly () {
        this.finishTaskDialog = true
        switch (this.operatorType) {
          case 'analysiser':
            break
          case 'checker':
            getAnalyserConclusion(this.taskId).then(resp => {
              if (resp) {
                this.radioList.radio1 = resp.radio1 - 0
                this.radioList.radio2 = resp.radio2 - 0
                this.radioList.radio3 = resp.radio3 - 0
                this.radioList.radio4 = resp.radio4 - 0
                this.remarkInfo = resp.remarks
              }
            })
            break
          case 'finish':
            this.$router.push({name: 'insiderTradAccountAnalysis', path: '/insiderTradAccountAnalysis'})
            break
        }
      },
      // 提交完成任务
      submitRes () {
        let arr = []
        for (var k in this.radioList) {
          if (this.radioList[k] === '') {
            this.$message.error('请选择宏观分析结论')
            return
          } else {
            arr.push(this.radioList[k])
          }
        }
        let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
        let params = {
          taskId: taskId,
          groupDetailId: arr.join(','),
          remarks: this.remarkInfo,
          createUserType: '',
          result: this.checkerConclusion
        }
        if (this.operatorType === 'analysiser') {
          params.createUserType = 1
        } else {
          params.createUserType = 2
        }
        finishTask(params).then(resp => {
          if (resp) {
            this.$message.success('提交成功')
            this.$router.push({name: 'insiderTradAccountAnalysis', path: '/insiderTradAccountAnalysis'})
            this.finishTaskDialog = false
          } else {
            this.$message.error('提交失败')
          }
        })
      },
      cancelSubmit () {
        this.finishTaskDialog = false
      },
      // 终止任务
      sureStop () {
        this.stopTaskDialog = false
        let processId = this.$store.state.insiderTradAnalysis.currentTaskData.processId,
        taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
        let params = {
          processId: processId,
          taskId: taskId,
          stopStatus: '1'
        }
        let taskStatus = this.$store.state.insiderTradAnalysis.taskStatus
        if (taskStatus === '2' || taskStatus === '4') {
          changeTaskstatus(params).then(resp => {
            if (resp) {
              this.$message.success('终止成功')
              this.$router.push({name: 'insiderTradAnalysis'})
            } else {
              this.$message.error('终止失败')
            }
          })
        }
      },
      cancleStop () {
        this.stopTaskDialog = false
      },
      // 返回上一步
      goBackStep () {
        this.$store.commit('changeBackStatus', true)
        this.$router.go(-1)
      },
      goTaskListPage () {
        this.$router.push({path: '/insiderTradAnalysis'})
      }
    },
    mounted () {
      this.loading = true
      this.operatorType = this.$store.state.insiderTradAnalysis.currentTaskData.operatorType // 分析复核类型
      this.operateType = this.$store.state.insiderTradAnalysis.currentTaskData.operateType // 操作类型
      this.taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      // this.$refs.transactionStream.getResultData()
      this.getAllTabsData()
    }
  }
</script>

<style lang='less'>
    .macro-analysis-res {
        .el-dialog {
            width: 720px;
            .el-dialog__body {
                padding-left: 35px;
                span {
                    color: #7b8fb9;
                }
            }
            .dialog-footer {
                text-align: center;
                margin-bottom: 15px;
            }
            .submit-params {
                & > span {
                    margin-top: 5px;
                    margin-bottom: 5px;
                    display: inline-block;
                    width: 530px;
                }
            }
        }
        .el-tabs {
            .el-tabs__item {
                width: 220px;
                text-align: center;
            }
        }
    }
</style>
