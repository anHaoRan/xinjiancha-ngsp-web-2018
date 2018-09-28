<!--参与者查询-->
<!--基本资料 basiceInformation -->
<!--申报详情 declareDetails -->
<!--持仓统计 positionStatistice -->
<!--申报统计 reportingStatistice -->
<!--成交详情 transactionDetails -->
<!--成交统计 transactionStatistice -->
<template>
  <div class="participatorType">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div>
      <el-card class="el-card-table">
        <el-row>
          <el-col :span="24">
            <el-form>
              <el-row>
                <!--参与者查询账户类型-->
                <el-col :span="5">
                  <el-col class="name">
                    <el-form-item
                            prop="profitType"
                            label="类型 :"
                            style="margin-left: 17px;">
                      <el-col :span="16">
                        <el-col>
                          <el-select
                                  v-model="commonData.participateType"
                                  placeholder="请选择类型"
                                  @change="participateTypeChange"
                                  size="small"
                                  style="width: 100%;">
                            <el-option
                                    v-for="item in informationOptions"
                                    :disabled="item.value=='member'||item.value=='pbu'||item.value=='accountArr'"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                          </el-select>
                        </el-col>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-col>
                <!--代码-->
                <el-col :span="7">
                  <el-col :span="1" class="name"><span class="mustInput name">*</span></el-col>
                  <el-form-item prop="participateCode" label="代码：">
                    <div v-if="commonData.participateType==='account'||commonData.participateType==='uniteCode'||commonData.participateType==='accountArr'">
                      <el-col :span="16">
                        <el-input
                                clearable
                                v-model="commonData.uploadCode"
                                placeholder="请输入代码"
                                @change="participateCodeChange"
                                size="small"
                                :disabled="stockCodeDisabled">
                        </el-input>
                      </el-col>
                      <!--上传-->
                      <el-col :span="3" :offset="1">
                        <text-upload @getTxtCon="getTxtDataZj" :uploadOption="uploadOption"
                                     style="display: inline;"></text-upload>
                      </el-col>
                    </div>
                    <!--// 营业部证券代码-->
                    <div v-else>
                      <el-col :span="20">
                        <select-lazy-multiple ref="selectLazyMultipleSalePart" :selectParams="selectParams"
                                              @getSelectRes="getSelectRes" @getCurrentSelectList="getCurrentSelectList"
                                              :disabled="stockCodeDisabled"></select-lazy-multiple>
                      </el-col>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="margin-top: 6px;" :offset="1">
                  <!--双人双密功能-->
                  <el-col :span="4" :offset="1">
                    <el-button
                            type="primary"
                            size="small"
                            @click="dialogFormVisble=true">
                      双人双密
                    </el-button>
                    <!--双人双密弹出框-->
                    <el-dialog
                            title="双人双密"
                            :visible.sync="dialogFormVisble"
                            centen
                            width="700px">
                      <el-form :model="doubleDoubleColse">
                        <el-form-item
                                label="本机用户密码："
                                :label-width="formLabelPS">
                          <el-input
                                  type="password"
                                  v-model="doubleDoubleColse.password1"
                                  auto-complete="off">
                          </el-input>
                        </el-form-item>
                        <el-form-item
                                label="第二用户名称："
                                :label-width="formLabelPS">
                          <el-input
                                  v-model="doubleDoubleColse.username2"
                                  auto-complere="off"></el-input>
                        </el-form-item>
                        <el-form-item
                                label="第二用户密码：" :label-width="formLabelPS">
                          <el-input
                                  type="password"
                                  v-model="doubleDoubleColse.password2"
                                  auto-complete="off">
                          </el-input>
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary" size="small" @click="veryfy">确认</el-button>
                        <el-button type="text" size="small" @click="cancleVeryfy">取消</el-button>
                      </div>
                    </el-dialog>
                  </el-col>
                </el-col>
                <!--时间选择-->
                <el-col :span="8" :offset="1">
                  <el-col class="name">
                    <el-form-item prop="startTime" label="开始时间 :">
                      <el-col :span="10">
                        <el-date-picker
                                v-model="participateTime"
                                type="datetimerange"
                                :picker-options="participateTimeOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right"
                                size="small"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :default-time="['09:00:00','17:00:00']"
                                @change="changeStartDate">
                        </el-date-picker>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-button type="primary" size="small" @click="typeConfirm"
                           style="float: right;margin-right: 10px;margin-top: 3px;">
                  确定
                </el-button>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!--双人双密验证成功后展示内容-->
    <div v-show="informationShowTab">
      <el-card class="el-card-table">
        <el-row>
          <el-col :span="24">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane
                      :label="informationCodeType+'基本资料'" name="basiceInformation">
              </el-tab-pane>

              <el-tab-pane
                      v-if="position"
                      :label="informationCodeType+'持仓统计'" name="positionStatistice">
              </el-tab-pane>

              <el-tab-pane
                      :label="informationCodeType+'申报详情'" name="declareDetails">
              </el-tab-pane>

              <el-tab-pane
                      :label="informationCodeType+'申报统计'" name="reportingStatistice">
              </el-tab-pane>

              <el-tab-pane
                      :label="informationCodeType+'成交详情'" name="transactionDetails">
              </el-tab-pane>

              <el-tab-pane
                      :label="informationCodeType+'成交统计'" name="transactionStatistice">
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-card>
      <!--tab标签页对应的页面组件-->
      <basice-information
              :commonData="commonData"
              :currentSelectData="currentSelectData"
              :salePartListVAL="salePartListVAL"
              :informationCodeType="informationCodeType"
              v-show="'basiceInformation'== test.path"
              ref="gitBasiceInformation">
      </basice-information>

      <position-statistice
              :commonData="commonData"
              :informationCodeType="informationCodeType"
              v-show="'positionStatistice'== test.path"
              ref="gitPositionStatistice">
      </position-statistice>

      <declare-details
              :commonData="commonData"
              :informationCodeType="informationCodeType"
              :currentSelectData="currentSelectData"
              v-show="'declareDetails'== test.path "
              ref="gitDeclareDetails">
      </declare-details>

      <reporting-statistice
              :commonData="commonData"
              :informationCodeType="informationCodeType"
              :currentSelectData="currentSelectData"
              v-show="'reportingStatistice'== test.path "
              ref="gitReportingStatistice">
      </reporting-statistice>

      <transaction-details
              :commonData="commonData"
              :informationCodeType="informationCodeType"
              :currentSelectData="currentSelectData"
              v-show="'transactionDetails'== test.path"
              ref="gitTransactionDetails">
      </transaction-details>

      <transaction-statistice
              :commonData="commonData"
              :currentSelectData="currentSelectData"
              :salePartListVAL="salePartListVAL"
              :informationCodeType="informationCodeType"
              v-show="'transactionStatistice'== test.path "
              ref="gitTransactionStatistice">
      </transaction-statistice>

    </div>

    <s-participant-type
      v-if="secondDevData.status"
      :secondDevData="secondDevData"
      :classification="secondTypeList"></s-participant-type>
  </div>
</template>
<script>
  import moment from 'moment'
  import { encryptByDES } from '../../utils/api'
  import {
    getQueryType,         // 参与者查询 -- 账户类型（账户、一码通、营业部） 公共接口
    getCommonSelect,      // 营业部证券代码  公共接口
    twoPersonTwoPsw,      // 双人双密接口
  } from '../../service/analysisTool/participatorType'
  import { getCurTradeDate } from '../../service/common/commonFunc'
  import breadcrumb from '../../components/common/Breadcrumb'
  import TextUpload from '../common/textUpload.vue'

  import BasiceInformation from '../../components/analysisTool/participatorType/basiceInformation'        // 基本资料
  import PositionStatistice from '../../components/analysisTool/participatorType/positionStatistice'      // 持仓统计
  import DeclareDetails from '../../components/analysisTool/participatorType/declareDetails'              // 申报详情
  import ReportingStatistice from '../../components/analysisTool/participatorType/reportingStatistice'    // 申报统计
  import TransactionDetails from '../../components/analysisTool/participatorType/transactionDetails'      // 成交详情
  import TransactionStatistice from '../../components/analysisTool/participatorType/transactionStatistice' // 成交统计
  export default {
    // 注册组件
    components: {
      breadcrumb,             // 面包屑组件
      TextUpload,            // 上传账号组件
      BasiceInformation,      // 基本资料
      DeclareDetails,         // 申报详情
      PositionStatistice,     // 持仓统计
      ReportingStatistice,    // 申报统计
      TransactionDetails,     // 成交详情
      TransactionStatistice,  // 成交统计
      SelectLazyMultiple: () => import('../common/SelectLazyMultiple'),
      SParticipantType: () => import('../../components/analysisTool/participatorType/second/SParticipantType'),
    },
    // 初始数据
    data () {
      return {
        secondTypeList: {
          plat: [
            {
              id: '竞价',
              name: '竞价'
            },
            {
              id: '固定收益',
              name: '固定收益'
            },
            {
              id: '大宗',
              name: '大宗'
            }
          ],
          trade: [
            [
              {
                id: '场内交易',
                name: '场内交易'
              },
              {
                id: '场内交易1',
                name: '场内交易1'
              }
            ],
            [
              {
                id: '全部交易',
                name: '全部交易'
              },
              {
                id: '确定成交价',
                name: '确定成交价'
              }
            ]
          ],
          product: [
            {
              id: 'pA',
              name: 'A股'
            },
            {
              id: 'pStock',
              name: '证券代码'
            }
          ],
          order: [
            {
              id: '全选',
              name: '全选'
            },
            {
              id: '全选1',
              name: '全选1'
            },
            {
              id: '全选2',
              name: '全选2'
            }
          ],
          credit: [
            {
              id: '全选',
              name: '全选'
            },
            {
              id: '信用1',
              name: '信用1'
            },
            {
              id: '信用2',
              name: '信用2'
            }
          ],
        },
        secondDevData: { // 账户组、券商、PBU保存参数
          text: '',
          code: '',
          sDate: '',
          eDate: '',
          status: false // 是否选中账户组、券商、PBU
        },
        selectParams: {
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: ''
        },
        breadcrumbItems: [
          {
            router: '/participatorType',
            label: '分析工具'
          }, {
            router: '/participatorType',
            label: '常规查询'
          }, {
            router: '/participatorType',
            label: '参与者查询'
          }, {
            router: '/participatorType',
            label: '持仓统计'
          }
        ],
        // 账户类型 value
        accountType: 'account',

        //  参与者查询账户类型
        informationOptions: [
          {value:'account',text:'账户'},
          {value:'uniteCode',text:'一码通'},
          {value:'salePart',text:'营业部'},
          {value:'accountArr',text:'账户组'},
          {value:'member',text:'券商'},
          {value:'pbu',text:'pbu'}
        ],
        // typeCodeList: [],
        // typeSelect: [],

        // 时间输入框绑定值
        participateTime: [],
        // 时间范围选择
        participateTimeOptions: {
          shortcuts: [
            {
              text: '今日',
              onClick (picker) {
                const end = moment()
                const start = moment()
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '前5分钟',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 300 * 1000)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '前1周',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '前2周',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 2)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '前1个月',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '前2个月',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '前3个月',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              },
            }
          ]
        },

        // 上传账号
        uploadOption: {
          name: '上传',
          size: 'small',
          disabledflag: true
        },
        //当前标签页
        activeName: 'basiceInformation',
        // activeName: 'positionStatistice',
        stockCodeDisabled: true,   //证券代码输入框是否禁用
        // stockCodeDisabled: false,   //证券代码输入框是否禁用
        // 营业部证券代码
        salePartRestaurnts: [],
        titmeout: null,
        salePartOptions: [
          {
            value: 'All',
            label: '全选'
          }
        ],

        salePartCodeList: [],
        salePartQueryRes: [],
        //双人双密弹出框
        dialogFormVisble: false,
        //双人双密参数
        // doubleDoubleColse: {
        //   password1: '',
        //   username2: '',
        //   password2: '',
        // },
        //双人双密参数
        doubleDoubleColse: {
          password1: '',//111111
          username2: '',//ghe
          password2: '',//111111
        },
        // 双人双密弹框宽度
        formLabelPS: '120px',
        // 点击显示tab 页码内容
        informationShowTab: false,

        //默认面包屑最后一级
        test: {
          name: '基本资料',
          path: 'basiceInformation',
        },
        salePartCode: [],
        salePartValue: [],
        salePartLoading: true,
        //父传子的值
        commonData: {
          participateText: 'account',
          participateType: 'account',    // 参与者类型
          uploadCode: '',    // 代码 A411396060  A305043933 A127984268
          dateTimeStart: '',        // 开始时间
          dateTimeEnd: '',         // 结束时间
          singleDay: true,
          notSingleDay: false
        },
        currentSelectList: [],
        currentSelectData: [],
        salePartListVAL: '',
        // 账户类型（账户、一码通、营业部）
        informationCodeType: '账户',
        //单日/多日  成交统计
        queryCondition: {
          notSingleDay: false,
          singleDay: true
        },
        position: true,        // 选择营业部类型不显示持仓统计 tab
      }
    },
    watch: {
      commonData: {
        handler: function () {
          let index = this.informationOptions.findIndex((item) => {
            return item.value == this.commonData.participateType
          })
          if (index != -1)
            this.commonData.participateType = this.informationOptions[index].value
        },
        deep: true
      }
    },

    // 渲染页面
    methods: {
      getSelectRes (checkBoxValue) {
        this.salePartCode = checkBoxValue
      },
      fnChange (val) {

      },
      // 选择营业部类型 不支持上传功能
      participateTypeChange (val) {
        this.commonData.uploadCode = ''
        this.salePartCode = []
        this.selectParams.selectStockCodeVal = []
        this.selectParams.selectCheckboxValue = []
        this.selectParams.particLevelType = val
        this.informationShowTab = false
      },
      // 参与者查询类型数据
      convergenceType () {
        // getQueryType('particiLevel', 'statis').then(resp => {
        //   this.informationOptions = resp
        //   // 默认选择账户类型
        //   this.accountType = this.informationOptions[0].value
        //   this.commonData.participateType = this.informationOptions[0].value
        // })
      },
      // 营业部状态下选择的证券代码数据
      getCurrentSelectList (currentSelectList) {
        this.currentSelectList = currentSelectList
        this.currentSelectData = currentSelectList
        // 选定的营业部证券代码
        let salePartOBJ = this.currentSelectList
        let salePartVAL = ''
        salePartOBJ.forEach((el) => {
          let salePartlABEL = el.label + ','
          salePartVAL += salePartlABEL
        })
        this.salePartListVAL = salePartVAL.substr(0, salePartVAL.length - 1)
        let objSalePart = {
          salePartListVAL: this.salePartListVAL
        }
        this.$store.commit('salePartStatus', objSalePart)
      },
      // 账户和一码通证券代码
      participateCodeChange (uploadCode) {
        this.commonData.uploadCode = uploadCode
      },
      // 获取上传代码
      getTxtDataZj (TxtData) {
        this.commonData.uploadCode = TxtData.join(',')
      },

      //双人双密验证确认
      veryfy () {
        let userPsw = encryptByDES(this.doubleDoubleColse.password1)
        let selfPsw = encryptByDES(this.doubleDoubleColse.password2)
        //验证请求参数
        const doublePsw = {
          password1: userPsw,
          password2: selfPsw,
          username2: this.doubleDoubleColse.username2
        }
        let currentUser = this.gfnGetUsername()
        if (doublePsw.username2 === currentUser) {
          this.$message.error('当前用户名称与第二用户名称重复，请重新输入')
          return
        }
        //去除输入内容前后空格并验证是否为空
        if (this.doubleDoubleColse.password1.trim() == '' || this.doubleDoubleColse.username2.trim() == '' || this.doubleDoubleColse.password2.trim() == '') {
          this.$message({
            showClose: true,
            message: '密码或用户名不能为空',
            duration: 1000,
            type: 'error'
          })
        } else {
          // 发送验证请求
          twoPersonTwoPsw(doublePsw).then((resp) => {
            //请求通过
            if (resp) {
              this.uploadOption.disabledflag = false
              this.stockCodeDisabled = false
              this.dialogFormVisble = false
              this.doubleDoubleColse.password1 = ''
              this.doubleDoubleColse.username2 = ''
              this.doubleDoubleColse.password2 = ''
            } else {//请求失败
              this.$message({
                showClose: true,
                message: '用户/密码输入错误或用户被停用',
                duration: 1000,
                type: 'error'
              })
              this.dialogFormVisble = true
            }
          })
        }
      },
      //取消双人双密后弹出框内容清空
      cancleVeryfy () {
        this.doubleDoubleColse.password1 = ''
        this.doubleDoubleColse.username2 = ''
        this.doubleDoubleColse.password2 = ''
        this.dialogFormVisble = false
      },

      //点击确定按钮触发事件
      typeConfirm () {
        // 账户组、券商、pbu
        if (this.commonData.participateType == 'accountArr' || this.commonData.participateType == 'member' || this.commonData.participateType == 'pbu') {
          if ((this.commonData.uploadCode == '' && this.commonData.participateType == 'accountArr') ||
            ((this.commonData.participateType == 'member' || this.commonData.participateType == 'pbu') && this.salePartCode == '')) {
            this.$message.error('必选项不能为空，请重新输入')
            return
          } else {
            this.uploadOption.disabledflag = true
            this.stockCodeDisabled = true
            this.secondDevData.text = this.commonData.participateType
            if (this.commonData.participateType == 'accountArr') {
              this.secondDevData.code = this.commonData.uploadCode
            } else {
              this.secondDevData.code = this.salePartCode
            }
            this.secondDevData.sDate = this.commonData.dateTimeStart
            this.secondDevData.eDate = this.commonData.dateTimeEnd
            this.secondDevData.status = true
            return
          }
        } else {
          this.secondDevData.status = false
          this.uploadOption.disabledflag = false
          this.stockCodeDisabled = false
        }

        this.stockCodeDisabled = true
        this.uploadOption.disabledflag = true
        //判别类型
        switch (this.commonData.participateType) {
          case 'account' :
            this.informationCodeType = '账户'
            this.position = true
            break
          case 'uniteCode':
            this.informationCodeType = '一码通'
            this.position = true
            break
          case 'salePart':
            this.informationCodeType = '营业部'
            this.position = false
            break
        }
        this.$refs.gitBasiceInformation.getParticipateType()   // 基本资料
        this.$refs.gitPositionStatistice.getPositionStatisticeType()   // 基本资料
        this.$refs.gitTransactionStatistice.getTransactionType()  // 成交统计
        if (this.commonData.participateType === 'account' || this.commonData.participateType === 'uniteCode') {
          if (this.commonData.uploadCode == '' || ($.isEmptyObject(this.participateTime))) {
            this.$message({
              showClose: true,
              message: '必选项不能为空，请重新输入',
              duration: 1000,
              type: 'error'
            })
          } else {
            // 营业部
            if (this.commonData.participateType != 'salePart') {
              // 单双日判断
              let start = this.commonData.dateTimeStart.split(' ')[0]
              let end = this.commonData.dateTimeEnd.split(' ')[0]
              start = moment(start, 'YYYY-MM-DD').format('YYYYMMDD')
              end = moment(end, 'YYYY-MM-DD').format('YYYYMMDD')
              if (start == end) {
                this.commonData.singleDay = true
                this.commonData.notSingleDay = false
                this.$refs.gitTransactionStatistice.getTransactionType()
                this.$refs.gitTransactionStatistice.getTransactionType()
              } else {
                this.$refs.gitTransactionStatistice.getTransactionType()
                this.$refs.gitTransactionStatistice.getTransactionType()
                // 日期基本校验
                if ((start - 0) < (end - 0)) {
                  this.commonData.singleDay = false
                  this.commonData.notSingleDay = true
                } else if ((start - 0) > (end - 0)) {
                  this.$message({
                    showClose: true,
                    message: '起始日期不能大于结束日期',
                    duration: 1500,
                    type: 'error'
                  })
                  return
                }
              }
            } else {
              // 单双日判断
              let start = this.commonData.dateTimeStart.split(' ')[0]
              let end = this.commonData.dateTimeEnd.split(' ')[0]
              start = moment(start, 'YYYY-MM-DD').format('YYYYMMDD')
              end = moment(end, 'YYYY-MM-DD').format('YYYYMMDD')
              if (start == end) {
                this.commonData.singleDay = true
                this.commonData.notSingleDay = false
                this.$refs.gitTransactionStatistice.getTransactionType()
                this.$refs.gitTransactionStatistice.getTransactionType()
              } else {
                this.$refs.gitTransactionStatistice.getTransactionType()
                this.$refs.gitTransactionStatistice.getTransactionType()
                // 日期基本校验
                if ((start - 0) < (end - 0)) {
                  this.commonData.singleDay = true
                  this.commonData.notSingleDay = false
                } else if ((start - 0) > (end - 0)) {
                  this.$message({
                    showClose: true,
                    message: '起始日期不能大于结束日期',
                    duration: 1500,
                    type: 'error'
                  })
                  return
                }
              }
            }
            this.uploadOption.disabledflag = true
            this.stockCodeDisabled = true
            this.informationShowTab = true

            //点击确定按钮动态添加面包屑最后一层
            if (this.breadcrumbItems.length == 4) {
              return
            } else {
              let obj = {router: '', label: ''}
              this.breadcrumbItems.push(obj)
              this.breadcrumbItems[3].router = 'participatorType'
              this.breadcrumbItems[3].label = this.informationCodeType + this.test.name
            }
            this.commonData.dateTimeStart = this.participateTime[0]
            this.commonData.dateTimeEnd =this.participateTime[1]
          }
        } else {
          if (this.salePartCode == '' || ($.isEmptyObject(this.participateTime))) {
            this.$message({
              showClose: true,
              message: '必选项不能为空，请重新输入',
              duration: 1000,
              type: 'error'
            })
          } else {
            // 营业部证券代码
            if (this.commonData.participateType != 'salePart') {
              // 单双日判断
              let start = this.commonData.dateTimeStart.split(' ')[0]
              let end = this.commonData.dateTimeEnd.split(' ')[0]
              start = moment(start, 'YYYY-MM-DD').format('YYYYMMDD')
              end = moment(end, 'YYYY-MM-DD').format('YYYYMMDD')
              if (start == end) {
                this.commonData.singleDay = true
                this.commonData.notSingleDay = false
                this.$refs.gitTransactionStatistice.getTransactionType()
                this.$refs.gitTransactionStatistice.getTransactionType()
              } else {
                this.$refs.gitTransactionStatistice.getTransactionType()
                this.$refs.gitTransactionStatistice.getTransactionType()
                // 日期基本校验
                if ((start - 0) < (end - 0)) {
                  this.commonData.singleDay = false
                  this.commonData.notSingleDay = true
                } else if ((start - 0) > (end - 0)) {
                  this.$message({
                    showClose: true,
                    message: '起始日期不能大于结束日期',
                    duration: 1500,
                    type: 'error'
                  })
                  return
                }
              }
            } else {
              // 单双日判断
              let start = this.commonData.dateTimeStart.split(' ')[0]
              let end = this.commonData.dateTimeEnd.split(' ')[0]
              start = moment(start, 'YYYY-MM-DD').format('YYYYMMDD')
              end = moment(end, 'YYYY-MM-DD').format('YYYYMMDD')
              if (start == end) {
                this.commonData.singleDay = true
                this.commonData.notSingleDay = false
                this.$refs.gitTransactionStatistice.getTransactionType()
                this.$refs.gitTransactionStatistice.getTransactionType()
              } else {
                this.$refs.gitTransactionStatistice.getTransactionType()
                this.$refs.gitTransactionStatistice.getTransactionType()
                // 日期基本校验
                if ((start - 0) < (end - 0)) {
                  this.commonData.singleDay = true
                  this.commonData.notSingleDay = false
                } else if ((start - 0) > (end - 0)) {
                  this.$message({
                    showClose: true,
                    message: '起始日期不能大于结束日期',
                    duration: 1500,
                    type: 'error'
                  })
                  return
                }
              }
            }
            this.uploadOption.disabledflag = true
            this.stockCodeDisabled = true
            this.informationShowTab = true

            //点击确定按钮动态添加面包屑最后一层
            if (this.breadcrumbItems.length == 4) {
              return
            } else {
              let obj = {router: '', label: ''}
              this.breadcrumbItems.push(obj)
              this.breadcrumbItems[3].router = 'participatorType'
              this.breadcrumbItems[3].label = this.informationCodeType + this.test.name
            }
            this.commonData.dateTimeStart = this.participateTime[0]
            this.commonData.dateTimeEnd = this.participateTime[1]
          }
        }
      },
      // 输入日期变化触发
      changeStartDate (val) {
        this.informationShowTab = false
        let [dateStart, timeStart] = val[0].split(' '),
        [dateEnd, timeEnd] = val[1].split(' ')
        if (timeStart === '00:00:00') {
          this.participateTime[0] = dateStart + ' 09:00:00'
        }
        if (timeEnd === '00:00:00') {
          let nowDate = moment(new Date()).format('YYYY-MM-DD')
          if (nowDate === dateEnd) {
            this.participateTime[1] = dateEnd + ' ' + moment(new Date()).format('HH:mm:ss')
          } else {
            this.participateTime[1] = dateEnd + ' 17:00:00'
          }
        }
        this.commonData.dateTimeStart = this.participateTime[0]
        this.commonData.dateTimeEnd = this.participateTime[1]
      },

      //切换tab页触发
      handleClick (tab, event) {
        let tabArr = [
          {
            name: '申报详情',
            path: 'tab-declareDetails',
          },
          {
            name: '持仓统计',
            path: 'tab-positionStatistice',
          },
          {
            name: '申报统计',
            path: 'tab-reportingStatistice',
          },
          {
            name: '成交详情',
            path: 'tab-transactionDetails',
          },
          {
            name: '成交统计',
            path: 'tab-transactionStatistice',
          },
          {
            name: '基本资料',
            path: 'tab-basiceInformation',
          },
        ]
        for (let i = 0; i < tabArr.length; i++) {
          if (event.target.id == tabArr[i].path) {
            this.test.path = tabArr[i].path.split('-')[1]
            this.test.name = this.informationCodeType + tabArr[i].name
            this.breadcrumbItems[3].router = 'participatorType'
            this.breadcrumbItems[3].label = this.test.name
          }
        }
      },
    },

    // 渲染到页面
    mounted() {
      this.stockCodeOptions = this.stockCodeList
      // 删除面包屑最后一级，动态添加
      this.breadcrumbItems.pop()
      //从后台获取当前交易日期
      getCurTradeDate().then(resp => {
        let date = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
        this.participateTime = [date + ' 09:00:00', date + ' 17:00:00']
      })
      // 参与者查询类型初始化
      // this.convergenceType()
    },
  }


</script>
<style lang="less">
  .participatorType {
    /*.el-tabs__nav-scroll {*/
      /*padding-left: 0 !important;*/
    /*}*/
    /*.el-tabs__nav-wrap {*/
      /*padding: 10px 20px 20px 20px !important;*/
    /*}*/
    .el-row {
      margin-top: 10px !important;
    }
    /*.el-tabs--card > .el-tabs__header {*/
      /*margin-bottom: 0;*/
      /*border: none;*/
      /*.el-tabs__nav-wrap {*/
        /*padding: 20px 20px 0;*/
        /*.el-tabs__nav {*/
          /*border: none;*/
          /*.el-tabs__item.is-active {*/
            /*background-color: #12bba5;*/
            /*border: 1px solid #12bba5;*/
          /*}*/
          /*> div {*/
            /*height: 30px;*/
            /*line-height: 30px;*/
            /*border: 1px solid #7b8fb9;*/
            /*box-sizing: border-box;*/
            /*margin-right: 20px;*/
            /*border-radius: 4px;*/
            /*font-size: 14px;*/
          /*}*/
        /*}*/
      /*}*/
    /*}*/
    .el-card .el-card__header .el-button {
      margin-top: 5px;
    }
    .el-card__header {
      border-radius: 4px;
    }

    .el-button--primary {
      background-color: #1b5eed;
    }

    .el-pagination {
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .mustInput {
      font-size: 14px;
      color: #ff402b;
      position: relative;
      right: 3px;
      top: 3px;
    }

    span.el-range-separator {
      color: #7b8fb9;
    }

    .el-tag, .el-tag__close {
      background-color: #2c3f68 !important;
    }

    .el-select__tags-text {
      color: #fff;
    }
    .product-query-tabs {
      .el-card__body {
        padding-bottom: 0;
      }

    }
    .name {
      line-height: 40px;
    }

    .commonFilter {
      padding-top: 20px;
    }

    .el-dialog {
      width: 700px;
      top: 10px;
      .el-dialog__body {
        text-align: center;
        padding-bottom: 0;
        .el-form {
          width: 466px;
          margin: 10px auto 20px;
          padding-top: 0;
        }
        .el-form-item__label {
          font-family: MicrosoftYaHei;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 40px;
          letter-spacing: 0px;
        }
        .el-input {
          text-align: left;
          .el-input__inner {
            width: 300px;
            height: 30px;
            border-radius: 4px;
          }
        }
      }
      .el-dialog__header {
        padding-top: 20px;
        padding-bottom: 20px;
        /*background-color: #203052;*/
        text-align: left;
        padding-left: 20px;

        .el-dialog__title {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 16px;
          letter-spacing: 0px;
          /*color: #ffffff;*/
        }

      }
      .el-dialog__footer {
        padding-top: 0;

        .el-button {
          border-radius: 4px;
          text-align: center;
          margin: 20px;

          span {
            font-family: MicrosoftYaHei;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 16px;
            letter-spacing: 0px;
            /*color: #fff;*/
          }

        }
      }
    }
    .dialog-footer {
      text-align: center;
    }

    .el-select .el-tag {
      margin: 3px 0 3px 3px !important;
    }
  }
</style>
