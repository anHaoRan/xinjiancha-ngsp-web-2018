<template>
  <div class="insider-trad-analysis-params">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card v-if="typeOfAnalysis" class="first-card">
      <div slot="header">
        <span>分析参数</span>
        <el-button
          type="text"
          size="small"
          style="float:right;"
          :disabled="clickManyTimes"
          @click="resetAll">清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          style="float:right; "
          :disabled="clickManyTimes"
          @click="settings">设置
        </el-button>
      </div>
      <el-row style="margin-top: 20px;">
        <el-col :span="6" :offset="1">
          <el-col :span="5" style="line-height: 32px;"><span class="mustInput">*</span>
            证券代码：
          </el-col>
          <el-col :span="12">
            <el-input size="small" v-model="this.$store.state.insiderTradAnalysis.currentTaskData.stockCode" disabled
                      style="width:350px">
            </el-input>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="8" style="line-height: 32px;"><span class="mustInput">*</span>上市公司重大事项：</el-col>
          <el-col :span="12">
            <el-popover ref="popover"
                        :disabled="clickManyTimes"
                        placement="bottom"
                        width="230"
                        trigger="click">
              <el-tree :data="treeData"
                       ref="tree"
                       show-checkbox
                       hightlight-current
                       node-key="id"
                       :default-expanded-keys="['01','02','02','03','04','05','06','07']"
                       :default-checked-key="defaultTreeData"
                       :props="defaultProps"
                       @check-change="getCheckedKeys">
              </el-tree>
            </el-popover>
            <el-input size="small " v-popover:popover style="width: 250px;" class="show-ellipsis"
                      v-model="companyImportantThings" :disabled="clickManyTimes"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="6" :offset="1">
          <el-col :span="5" style="line-height: 32px;"><span class="mustInput">*</span>核查日期：</el-col>
          <el-col :span="6">
            <el-date-picker v-model="checkDate"
                            type="daterange"
                            :disabled="clickManyTimes"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            unlink-panels
                            size="small"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            @change="checkDateChange">
            </el-date-picker>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="8" style="line-height: 32px;"><span class="mustInput">*</span>复牌日期：</el-col>
          <el-col :span="10">
            <el-date-picker v-model="resumptionDate"
                            type="date"
                            :disabled="clickManyTimes"
                            size="small"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width: 250px"
                            placehoder="请选择日期">
            </el-date-picker>
          </el-col>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-col :span="11" style="line-height: 32px;"><span class="mustInput">*</span>相关重大事项披露前最后一个交易日：</el-col>
          <el-col :span="8">
            <el-date-picker v-model="lastTradDate"
                            type="date"
                            :disabled="clickManyTimes"
                            @change="getCurrentTradDate"
                            size="small"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placehoder="请选择日期">
            </el-date-picker>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="6" :offset="1">
          <el-col :span="5" style="line-height: 32px;"><span class="mustInput">*</span>公告日期：</el-col>
          <el-col :span="6">
            <el-date-picker v-model="noticeDate"
                            type="daterange"
                            :disabled="clickManyTimes"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            size="small"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            @change="noticeDateChange">
            </el-date-picker>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="8" style="line-height: 32px;"><span class="mustInput">*</span>分析类型：</el-col>

          <el-select size="small" v-model="analysType" :disabled="clickManyTimes" @change="changeAnalyType"
                     style="width:250px">
            <el-option v-for="item in analysTypeOption"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="2" :offset="1" style="line-height: 32px;"><span class="mustInput">*</span>内部知情人信息：</el-col>
        <el-col :span="21">
          <el-radio-group v-model="insiderInfoRadio" @change="isUpload" :disabled="clickManyTimes">
            <el-radio :label="1" :disabled="hasInsiderData==0">已从流程自动导入内幕知情人信息</el-radio>
            <el-radio :label="2" :disabled="hasInsiderData==1">未发现内幕知情人信息，将上市公司董监高作为内幕知情人</el-radio>
            <el-radio :label="3">本地文件上传内幕交易知情人信息</el-radio>
          </el-radio-group>
          <el-upload
            :disabled="upload"
            ref="upload"
            :action="gfnGetUploadFlatReturnBasicUrl()"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :limit="1"
            :on-exceed="maxFileNum"
            :auto-upload="true"
            :data="uploadParams"
            name="uploadFile"
            :file-list="uploadFileList"
            style="display: inline-block;margin-left: 10px;">
            <el-button slot="trigger"
                       type="text"
                       size="small"
                       :disabled="upload">上传
            </el-button>
          </el-upload>
        </el-col>
      </el-row>
    </el-card>
    <div v-loading="checkQueryResLoad"
         element-loading-spinner="el-icon-loading"
         element-loading-text="数据加载中，请耐心等待..."
         element-loading-background="rgba(0,0,0,0.3)">
      <el-card v-if="typeOfChecked">
        <div slot="header">
          <span>设置参数</span>
        </div>
        <el-row style="margin-top: 20px;">
          <el-col :span="6" class="text-con" :offset="1">
            证券代码： {{checkedData.stockCode}}
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;margin-bottom: 10px;">
          <el-col :offset="1">
            上市公司重大事项： {{checkedData.importantThing}}
          </el-col>

        </el-row>
        <el-row style="margin-top: 10px;margin-bottom: 10px;">
          <el-col :span="7" class="text-con" :offset="1">
            相关事项披露前最后一个交易日： {{checkedData.lastTradDate}}
          </el-col>
          <el-col :span="6" class="text-con" :offset="1">
            复牌日期： {{checkedData.resumptionDate}}
          </el-col>
          <el-col :span="6" class="text-con">
            分析类型： {{checkedData.analysType}}
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px;">
          <el-col :span="6" class="text-con" :offset="1">
            核查日期： {{checkedData.checkStartDate+'至'+checkedData.checkEndDate}}
          </el-col>
          <el-col :span="6" class="text-con" :offset="2">
            公告日期： {{checkedData.noticeStartDate+'至'+checkedData.noticeEndDate}}
          </el-col>
        </el-row>

      </el-card>
      <div v-show="showTableMap"
           v-loading="queryResLoad"
           element-loading-spinner="el-icon-loading"
           element-loading-text="数据加载中，请耐心等待..."
           element-loading-background="rgba(0,0,0,0.3)">
        <el-row style="min-width: 1520px">
          <el-col :span="15" style="padding: 0">
            <el-card style="height: 600px;margin-right: 15px;">

              <div slot="header">
                <span>内部知情人地区分布图</span>
              </div>
              <div style="min-width: 600px">
                <div class="map-charts"
                     style="width: 600px;margin-left: -5px; height: 500px;float: left"></div>
                <div class="pie-charts"
                     style="width: 300px;margin-left: -5px; height: 500px;float: left"></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="9" style="padding: 0">
            <el-card style="height: 600px;">
              <div slot="header">
                <span>内部知情人列表</span>
              </div>
              <el-table :data="IDinfoData"
                        style="width:100%"
                        max-height="500"
              >
                <el-table-column prop="id_card"
                                 label="身份证号">
                </el-table-column>
                <el-table-column prop="id_card_area"
                                 label="身份证所属地区">
                </el-table-column>
              </el-table>
              <el-pagination
                max-width="100%"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="resultNum">
              </el-pagination>
            </el-card>
          </el-col>
        </el-row>
        <el-card>
          <span class="title">关注地区:</span>
          <div style="margin-left: 60px;" v-if="typeOfAnalysis">
            <el-checkbox-group v-model="selectCitiesList"
                               v-for="item in citiesList"
                               :key="item.value"
                               @change="getAttentionData"
                               style="display: inline-block;margin:0px 20px 15px 0;">
              <el-checkbox :label="item.value"
                           style="display: inline-block;margin-top: 15px;">
                {{item.label+':'+item.persent+'%'}}
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <div v-if="typeOfChecked">
            <div style="margin-left: 60px;">
              <span v-for="item in citiesList" :key="item.label" style="display: inline-block;margin:15px 20px 15px 0;">{{item.label+' : '+item.persent+'%'}}</span>
            </div>
          </div>
        </el-card>

        <el-row style="margin: 35px auto; text-align: center" v-if="btnShow">
          <router-link to="/macroAnalysisResBig">
            <el-button size="small" type="primary" style="margin-right: 20px;" @click="doMacroAnalysis">进行宏观分析
            </el-button>
          </router-link>
          <router-link to="/insiderTradAnalysisBig">
            <el-button size="small" type="text" style="margin:0  20px;">返回任务列表</el-button>
          </router-link>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
  import { requestPrefix } from '@/utils/constants'
  // 获取指定日期偏移交易日
  import { getRelativeBaseDate } from '@/service/common/commonFunc'
  // 页面所需接口
  import {
    getCheckedTaskData,
    getCompanyImportantThing,
    getTableChartData,
    macroAnalysis,
    getTableData,
    getDefaultResumptionDate
  } from '@/service/analysisTool/insiderTradAccountAnalysisBig/index'
  import echarts from 'echarts'
  import 'echarts/map/js/china.js'
  import moment from 'moment'
  // 面包屑
  import breadcrumb from '@/components/common/Breadcrumb'

  export default {
    name: `insider-trad-analysis-params`,
    components: {breadcrumb},
    msg: '内幕交易分析',
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/insiderTradAnalysisBig',
            label: '分析工具'
          }, {
            router: '/insiderTradAnalysisBig',
            label: '特定工具'
          }, {
            router: '/insiderTradAnalysisBig',
            label: '内幕交易分析(大数据)'
          }
        ],
        stockCode: '',
        treeData: [],
        defaultTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        // 上市公司重大事项输入框绑定值
        companyImportantThings: '',
        companyImportantThingsVal: [],
        companyImportantThingsName: [],
        comImpThingsArr: [],
        analysType: '',
        analysTypeOption: [
          {
            label: '利空型',
            value: 'lk'
          },
          {
            label: '利好型',
            value: 'lh'
          }
        ],
        // 表格接口入参
        tableParams: {},
        // 地图表格显隐
        showTableMap: false,
        // loading蒙版
        queryResLoad: false,
        // 核查loading蒙版
        checkQueryResLoad: false,
        mapData: [],
        // 公告日期
        noticeDate: [],
        // 核查日期
        checkDate: [],
        checkDateStart: '',
        checkDateEnd: '',
        // 相关重大事项披露前最后一个交易日
        lastTradDate: '',
        //  calculateIndex: '',
        // 复牌日期
        resumptionDate: '',
        // 内幕知情人信息
        insiderInfoRadio: '',
        insiderInfo: '',
        // 内幕交易知情人信息是否来自流程自带
        hasInsiderData: '',
        clickManyTimes: false,
        // 获取省市信息
        proviceList: '',
        // 身份证表格数据
        IDinfoData: [],
        // 上市公司所在地
        locationOfCompany: {
          provence: '',
          city: ''
        },
        // 分页
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        resultNum: 0,
        activeName: 'topFive',
        // 关注城市列表
        selectCitiesList: [],
        // 地图提示信息显示
        showTooltip: true,
        citiesList: [],
        topFiveCities: [],
        attentionCityList: [],
        upload: true,
        prefix: requestPrefix,
        uploadParams: {
          'parseRule': JSON.stringify(
            {
              'delimiter': ','
            }
          )
        },
        uploadFileList: [],
        typeOfAnalysis: true,
        typeOfChecked: false,
        btnShow: false,
        checkedData: {
          stockCode: '',
          importantThing: '',
          noticeStartDate: '',
          noticeEndDate: '',
          resumptionDate: '',
          lastTradDate: '',
          checkStartDate: '',
          checkEndDate: '',
          analysType: ''

        }
      }
    },
    computed: {
      //  ...mapState(['stockCode','aaa','bbb']),
    },
    methods: {
      changeAnalyType (val) {

      },

      handleClick () {

      },
      resetAll () {
        this.companyImportantThings = ''
        this.companyImportantThingsVal = []
        this.companyImportantThingsName = []
        this.comImpThingsArr = []
        this.analysType = ''
        this.noticeDate = []
        this.checkDate = []
        this.lastTradDate = []
        this.resumptionDate = []
        this.$refs.tree.setCheckedKeys([])
      },
      getCurrentTradDate (val) {
        let baseDate = moment(val, 'YYYY-MM-DD').format('YYYYMMDD')
        getRelativeBaseDate(0, baseDate).then(resp => {
          this.lastTradDate = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
        })
      },
      // 表格数据获取
      getInsiderTableData (params) {
        getTableData(params).then((resp) => {
          this.upload = false
          this.clickManyTimes = false
          if (resp.success) {
            this.resultNum = (resp.rowsCount - 0)
            // 获取内幕知情人列表中展示数据
            this.IDinfoData = resp.insiderInfoList
            let params = {
              taskId: this.$store.state.insiderTradAnalysis.currentTaskData.taskId,
              // 上市公司重大事项选项值
              companyMatters: this.companyImportantThingsVal,
              // 披露前最后一个交易日
              lasttrdDate: this.lastTradDate,
              // 复牌日期
              resumptionDate: this.resumptionDate,
              // 分析类型
              analType: this.analysType,
              // 核查开始日期
              checkStartDate: this.checkDate[0],
              // 核查结束日期
              checkEndDate: this.checkDate[1],
              // 公告开始日期
              afficheStartDate: this.noticeDate[0],
              // 公告结束日期
              afficheEndDate: this.noticeDate[1],
              stockCode: this.$store.state.insiderTradAnalysis.currentTaskData.stockCode,
              insiderInfoFlag: this.insiderInfoRadio
            }
            this.getLocationMapData(params)
          } else {
            this.$message.error('设置失败')
          }
        })
      },
      /* eslint-disable */
      // 地图数据获取
      getLocationMapData (params) {
        getTableChartData(params).then((resp) => {
          let that = this
          // 获取上市公司所在地信息
          this.locationOfCompany.provence = resp.prov_desc
          this.locationOfCompany.city = resp.district_desc
          // 存储饼图信息
          this.proviceList = resp.proviceList
          this.mapData = resp.proviceList.map(function (item) {
            return {name: item.acct_provice, value: item.acct_cnt}
          })// 获取地图所需数据
          this.drawMap(this.mapData)
          let citiesArr = resp.topTwentyAreaList.map(function (item) {
            return {
              value: item.rank_all,
              label: item.acct_area,
              persent: item.acct_persent,
              provence: item.acct_provice
            }
          })
          //   获取关注地区数据
          this.citiesList = citiesArr
          // 关注地区前五名
          if (citiesArr.length >= 5) {
            this.selectCitiesList = []
            this.attentionCityList = []
            citiesArr.forEach(function (item, index) {
              if (index < 5) {
                that.selectCitiesList.push(item.value)
                that.attentionCityList.push({acct_provice: item.provence, acct_area: item.label})
              } else {
                return false
              }
            })
          } else {
            citiesArr.forEach(function (item) {
              that.selectCitiesList.push(item.value)
              that.attentionCityList.push({acct_provice: item.provence, acct_area: item.label})
            })
          }

          let saveInsiderAnalyParam = {
            currentPage: this.currentPage,
            resultNum: this.resultNum,
            pageSize: this.pageSize,
            IDinfoData: this.IDinfoData,
            lastTradDate: this.lastTradDate,
            resumptionDate: this.resumptionDate,
            noticeDate: this.noticeDate,
            checkDate: this.checkDate,
            citiesList: this.citiesList,
            uploadFileList: this.uploadFileList,
            insiderInfoRadio: this.insiderInfoRadio,
            insiderInfo: this.tableParams.insiderInfo,
            locationOfCompany: this.locationOfCompany,
            proviceList: this.proviceList,
            analysType: this.analysType,
            companyImportantThingsVal: this.companyImportantThingsVal.split(','),
            companyImportantThings: this.companyImportantThings,
            treeData: this.treeData,
            mapData: this.mapData,
            back: false
          }
          this.$store.commit('saveInsiderTradAnalyParams', saveInsiderAnalyParam)
          // 地图及表格展示
          this.clickManyTimes = false
          this.upload = true
          this.upload = false
          this.queryResLoad = false
          this.btnShow = true
        })
      },
      // 设置触发函数
      settings () {
        let isEmptyObj = {
          companyImportantThings: this.companyImportantThings,
          analysType: this.analysType,
          resumptionDate: this.resumptionDate,
          lastTradDate: this.lastTradDate,
          insiderInfoRadio: this.insiderInfoRadio
        }
        for (let k in isEmptyObj) {
          if (isEmptyObj[k] === '') {
            this.$message.error('分析参数设置不完整，请完善')
            return
          }
        }
        if ($.isEmptyObject(this.noticeDate) || $.isEmptyObject(this.checkDate)) {
          this.$message.error('分析参数设置不完整，请完善')
          return
        }
        if (this.insiderInfoRadio == 3 && this.insiderInfo == '') {
          this.$message.error('分析参数设置不完整，请完善')
          return
        }
        this.showTableMap = true
        this.queryResLoad = true
        this.clickManyTimes = true
        this.upload = true
        this.tableParams = {
          taskId: this.$store.state.insiderTradAnalysis.currentTaskData.taskId,
          pageIdx: this.currentPage,
          pageRw: this.pageSize,
          // 内幕交易知情人信息
          insiderInfoFlag: this.insiderInfoRadio,
          insiderInfo: this.insiderInfo,
          setFlag: '1',
          // 核查开始日期
          checkStartDate: this.checkDate[0],
          // 核查结束日期
          checkEndDate: this.checkDate[1]
        }
        console.log(this.tableParams.taskId)
        this.getInsiderTableData(this.tableParams)
        switch (this.analysType) {
          case 'lk':
            this.$store.commit('changeAnalysisType', 'ZHLK')
            break
          case 'lh':
            this.$store.commit('changeAnalysisType', 'ZHLH')
            break
        }
      },
      //  分页
      handleSizeChange (val) {
        let params = {
          taskId: this.$store.state.insiderTradAnalysis.currentTaskData.taskId,
          setFlag: '0',
          pageRw: val,
          pageIdx: this.currentPage
        }
        getTableData(params).then((resp) => {
          this.resultNum = (resp.rowsCount - 0)// 总条数
          this.IDinfoData = resp.insiderInfoList// 获取内幕知情人列表中展示数据
        })
      },
      handleCurrentChange (val) {
        let params = {
          taskId: this.$store.state.insiderTradAnalysis.currentTaskData.taskId,
          setFlag: '0',
          pageRw: this.pageSize,
          pageIdx: val
        }
        getTableData(params).then((resp) => {
          // 总条数
          this.resultNum = (resp.rowsCount - 0)
          // 获取内幕知情人列表中展示数据
          this.IDinfoData = resp.insiderInfoList
        })
      },
      // 绘制地图
      drawMap (data) {
        let mychart = echarts.init($('.map-charts')[0], this.gfnGetTheme())
        let option = {}
        let that = this
        mychart.setOption(option = {
          title: {
            x: '40px',
            y: '20px',
            subtext: '上市公司所在地 ：' + this.locationOfCompany.provence + '省' + this.locationOfCompany.city,

            subtextStyle: {
              marginLeft: '20px',
              marginTop: '20px'

            }
          },
          tooltip: {
            show: that.showTooltip,
            trigger: 'item',
            formatter: function (data) {
              if (data.data == undefined) {
                that.showTooltip = false
              } else {
                that.showTooltip = true
                return data.name + data.seriesName + '  ： ' + data.value + '人'
              }
            }
          },
          visualMap: {
            min: 0,
            max: 20,
            left: 'left',
            top: 'bottom',
            selectMode: 'single',
            color: ['rgba(40,208,255,1)', 'rgba(40,208,255,0.3)'],
            text: ['多', '少'],
            textStyle: {
              color: '#aec0e6'
            },
            calculable: true
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            right: '4%',
            top: 'middle',
            itemGap: 20,
            feature: {
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          grid: {
            top: '0 ',
            left: '5%'

          },
          series: [
            {
              type: 'map',
              name: '内幕知情人数量',
              mapType: 'china',
              roam: false,
              zoom: 1.1,
              itemStyle: {
                normal: {
                  show: true,
                  areaColor: 'rgba(40,208,255,0)',
                  borderColor: 'rgba(0,144,255,1)',
                  borderWidth: '1'
                },
                emphasis: {
                  show: true,
                  areaColor: 'rgba(40,208,255,1)'
                }

              },
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    color: 'rgba(174, 192, 230, 0.65)'
                  }
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    color: 'rgba(255, 255, 255, 0.85)'
                  }
                }
              },
              data: data
            }
          ]
        }, true)
        mychart.on('click', function (params) {
          if (params.dataIndex == -1) {
            return false
          } else {
            let proviceList = that.proviceList
            let areaDataList = [], areaList = [], cityName = ''

            for (let i = 0; i < proviceList.length; i++) {
              if (proviceList[i].acct_provice == params.name) {
                cityName = proviceList[i].acct_provice
                areaList = proviceList[i].areaList.map(function (item) {
                  return item.acct_area
                })
                areaDataList = proviceList[i].areaList.map(function (item) {
                  return {name: item.acct_area, value: item.acct_cnt, prop: item.acct_persent}
                })
                let pieData = {
                  cityName: cityName,
                  areaList: areaList,
                  areaDataList: areaDataList
                }
                that.drawPieChart(pieData)
              } else {
                continue
              }
            }
          }
        })
      },
      //  绘制饼图
      drawPieChart (pieList) {
        let businesspie = echarts.init(document.getElementsByClassName('pie-charts')[0], this.gfnGetTheme())
        businesspie.clear()
        window.onresize = businesspie.resize
        businesspie.setOption({
          title: {
            text: pieList.cityName + '省内幕知情人分布地级市前 ' + pieList.areaDataList.length + ' 名',
            left: 'center',
            top: 50,
            textStyle: {
              fontSize: 14,
              fontWeight: 400
            }
          },
          legend: {
            orient: 'vertical',
            left: 'center',
            bottom: '20',
            data: pieList.areaList,
            textStyle: {
              color: '#798fb8'
            },
            formatter: function (name) {
              let prop = '', count = '', value = ''

              pieList.areaDataList.forEach((parms, index) => {
                if (parms.name == name) {
                  count = pieList.areaDataList[index].value
                  prop = pieList.areaDataList[index].prop
                  value = pieList.areaDataList[index].value
                }
              })
              return name + ' : ' + value + '人   占比 ：' + prop + '%'
            }
          },
          toolbox: {
            right: '6%',
            top: 'middle',
            feature: {
              saveAsImage: {}
            }
          },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: function (params) {
              return params.data.name + '内幕知情人数量：' + params.data.value + '人 <br>   占比： ' + params.data.prop + '%'
            }
          },
          series: [{
            type: 'pie',
            radius: '50%',
            center: ['50%', '40%'],
            selectedOffset: 10,
            itemStyle: {
              normal: {
                borderColor: '#1b2b4e',
                borderWidth: 2,
                label: {
                  show: false,
                  formatter: '{d}%',
                  position: 'outer'
                }
              }
            },
            data: pieList.areaDataList
          }]
        })
      },
      // 关注地区change事件
      getAttentionData (val) {
        let selectArr = val, attentionArr = []
        for (let i = 0; i < selectArr.length; i++) {
          attentionArr.push({
            'acct_provice': this.citiesList[(selectArr[i] - 1)].provence,
            'acct_area': this.citiesList[(selectArr[i] - 1)].label
          })
        }
        this.attentionCityList = attentionArr
        console.log(this.attentionCityList)
      },
      // 公告日期
      noticeDateChange () {

      },
      // 核查日期
      checkDateChange (val) {
        let [checkDateStart, checkDateEnd] = val
        checkDateStart = moment(checkDateStart, 'YYYY-MM-DD').format('YYYYMMDD')
        checkDateEnd = moment(checkDateEnd, 'YYYY-MM-DD').format('YYYYMMDD')
        let datestart, dateend
        // 此处需要同步调用接口
        getRelativeBaseDate(0, checkDateStart).then(resp => {
          datestart = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
          console.log(datestart)
        }).then(() => {
          getRelativeBaseDate(0, checkDateEnd).then(resp => {
            dateend = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
            console.log(dateend)
          }).then(() => {
            this.checkDate = [datestart, dateend]
          }).then(() => {
            let params = {
              checkStartDate: datestart,
              checkEndDate: dateend,
              stockCode: this.$store.state.insiderTradAnalysis.currentTaskData.stockCode.split(' ')[0]
            }
            getDefaultResumptionDate(params).then(resp => {
              if (resp) {
                this.resumptionDate = resp.resumptionDate
              }
            })
          })
        })

      },

      // 获取上市公司重大事项下拉内容
      getCompanyOptions () {
        getCompanyImportantThing().then((resp) => {
          this.treeData = resp.zdsxData
        })
      },
      //  获取上市公司重大事项选择内容
      getCheckedKeys () {
        let comImpThingsArr = this.$refs.tree.getCheckedNodes()
        //  this.comImpThingsArr = comImpThingsArr;
        for (let i = 0; i < comImpThingsArr.length; i++) {
          if (comImpThingsArr[i].children != undefined) {
            comImpThingsArr.splice(i, 1)
          }
        }
        let companyImportantThingsVal = [], companyImportantThingsName = []
        for (let i = 0; i < comImpThingsArr.length; i++) {
          companyImportantThingsVal.push(comImpThingsArr[i].id)
          companyImportantThingsName.push(comImpThingsArr[i].label)
        }
        this.companyImportantThingsVal = companyImportantThingsVal.join(',')
        this.companyImportantThings = companyImportantThingsName.join(',')
      },
      // 上传控件是否可用
      isUpload (val) {
        this.insiderInfoRadio == 3 ? this.upload = false : this.upload = true
        if (val != '3') {
          this.tableParams.insiderInfo = ''
          this.uploadFileList = []
        } else {
          this.tableParams.insiderInfo = this.insiderInfo
        }
      },
      handleUploadSuccess (resp, file) {
        if (resp.success) {
          this.insiderInfo = resp.value.data.join(',')
          this.beforeUpload(file)
          this.uploadFileList = [{name: file.name, url: file.url}]
          this.$message.success('上传成功')
        } else {
          this.$message.error('上传失败')
        }
      },
      beforeUpload (file) {
        let nameArr = file.name.split('.')
        let fileType = nameArr[nameArr.length - 1]
        if (fileType != 'txt') {
          this.$message.error('只支持TXT文件的上传')
          return false
        }
      },
      maxFileNum () {
        this.$message.error('上传文件数量最大为1')
        return
      },
      // 进行宏观分析点击事件
      doMacroAnalysis () {
        let operatorType = this.$store.state.insiderTradAnalysis.currentTaskData.operatorType
        if (operatorType === 'checker' || operatorType === 'finish') {
          return
        } else {
          this.$store.commit('saveSelectCitiesList', this.selectCitiesList)
          let params = {
            'taskId': this.$store.state.insiderTradAnalysis.currentTaskData.taskId,
            'follow': this.attentionCityList
          }
          params = JSON.stringify(params)
          console.log(params)
          macroAnalysis(params).then((resp) => {
            if (resp) {
              return
            }
          })
        }
      }
    },
    mounted () {
      // 当前页面加载时，首先判断页面是否包含股票代码，若没有，提示用户返回上层重新选择任务，然后判断当前分析任务状态是分析还是复核，若是分析，再进行是否是回退操作判断，若是回退操作，将之前保存的页面数据显示在页面中，不是回退操作则进行参数设置；若是复核，则发送接口获取当前任务对应数据展示在页面中,
      let stockCode = this.$store.state.insiderTradAnalysis.currentTaskData.stockCode
      if (stockCode === undefined) {
        this.$message.error('获取任务信息失败，请重新获取')
        this.clickManyTimes = true
        return
      } else {
        this.clickManyTimes = false
        let setParams = this.$store.state.insiderTradAnalysis.insiderTradAnalyParam
        let taskStatus = this.$store.state.insiderTradAnalysis.currentTaskData.operatorType
        if (taskStatus == 'checker' || taskStatus == 'finish') {
          this.checkQueryResLoad = true
          this.typeOfAnalysis = false
          this.typeOfChecked = true
          this.showTableMap = true
          let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
          let stockCode = this.$store.state.insiderTradAnalysis.currentTaskData.stockCode
          let tableParams = {
            insiderInfo: '',
            taskId: taskId,
            pageIdx: this.currentPage,
            pageRw: this.pageSize,
            insiderInfoFlag: '',
            setFlag: '0'
          }
          getTableData(tableParams).then(resp => {
            this.resultNum = (resp.rowsCount - 0)
            this.IDinfoData = resp.insiderInfoList// 获取内幕知情人列表中展示数据
          })
          getCheckedTaskData(taskId, stockCode).then(resp => {
            let resParams = resp.params
            this.checkedData = {
              stockCode: resParams.sec_code,
              importantThing: resParams.group_detail_id,
              noticeStartDate: resParams.affiche_startdate,
              noticeEndDate: resParams.affiche_enddate,
              checkStartDate: resParams.check_startdate,
              checkEndDate: resParams.check_enddate,
              analysType: resParams.anal_type_name,
              resumptionDate: resParams.resumption_date,
              lastTradDate: resParams.lasttrd_date
            }
            this.$store.commit('saveCheckedData', this.checkedData)
            //存储分析类型
            switch (this.checkedData.analysType) {
              case '利空型':
                this.$store.commit('changeAnalysisType', 'ZHLK')
                break
              case '利好型':
                this.$store.commit('changeAnalysisType', 'ZHLH')
                break
            }
            // 获取上市公司所在地信息
            this.locationOfCompany.provence = resp.prov_desc
            this.locationOfCompany.city = resp.district_desc
            // 存储饼图信息
            this.proviceList = resp.proviceList
            this.mapData = resp.proviceList.map(function (item) {
              return {name: item.acct_provice, value: item.acct_cnt}
            })// 获取地图所需数据
            // 画图
            this.drawMap(this.mapData)
            //   获取关注地区数据
            this.citiesList = resp.topTwentyAreaList.map(function (item) {
              return {
                value: item.rank_all,
                label: item.acct_area,
                persent: item.acct_persent,
                provence: item.acct_provice
              }
            })
            this.checkQueryResLoad = false
            this.btnShow = true
          })
        } else {
          this.typeOfAnalysis = true
          this.typeOfChecked = false
          let back = setParams.back
          if (back) {
            this.btnShow = true
            this.upload = false
            this.showTableMap = true
            this.treeData = setParams.treeData
            //  this.defaultTreeData = setParams.companyImportantThingsVal;
            this.lastTradDate = setParams.lastTradDate
            this.noticeDate = setParams.noticeDate
            this.analysType = setParams.analysType
            this.checkDate = setParams.checkDate
            this.resumptionDate = setParams.resumptionDate
            this.citiesList = setParams.citiesList
            this.uploadFileList = setParams.uploadFileList
            this.insiderInfoRadio = setParams.insiderInfoRadio
            this.insiderInfo = setParams.insiderInfo
            this.locationOfCompany = setParams.locationOfCompany
            this.proviceList = setParams.proviceList
            this.IDinfoData = setParams.IDinfoData
            this.currentPage = setParams.currentPage
            this.pageSize = setParams.pageSize
            this.resultNum = setParams.resultNum
            this.companyImportantThingsVal = setParams.companyImportantThingsVal
            this.companyImportantThings = setParams.companyImportantThings
            this.selectCitiesList = this.$store.state.insiderTradAnalysis.selectCitiesList
            let mapData = setParams.mapData
            this.drawMap(mapData)
            this.$refs.tree.setCheckedKeys(setParams.companyImportantThingsVal)
          } else {
            this.getCompanyOptions()
            this.hasInsiderData = this.$store.state.insiderTradAnalysis.currentTaskData.hasInsiderData
            if (this.hasInsiderData == '1') {
              this.insiderInfoRadio = 1
            } else {
              this.insiderInfoRadio = 2
            }
            //  this.stockCode = this.$route.params.stockCode;
          }
        }
      }
    }
  }
</script>

<style lang='less'>
  .insider-trad-analysis-params {
    .show-ellipsis {
      .el-input__inner {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .text-con {
      line-height: 32px;
    }
    .title {
      display: block;
      font-size: 16px;
      color: white;
      margin-top: 20px;
    }
    .el-card__header {
      margin-left: 15px;
      margin-right: 15px;
      margin-top: 15px;
    }
    .first-card {
      .el-card__body {
        margin-bottom: 20px !important;
      }
    }
    .el-upload-list {
      margin-left: 15px;
      display: inline-block;
      vertical-align: top;
      li {
        margin-top: 0;
      }
    }
    .el-pagination {
      margin-top: 10px;
      button {
        padding: 0;
        min-width: 25px;
      }
      .el-pagination__sizes {
        margin-right: 0;
      }
      .el-pagination__jump {
        margin-left: 0;
      }
      ul.el-pager {
        li {
          min-width: 15px;
        }
      }
      .el-icon-more {
        color: #7b8fb9
      }
    }
  }
</style>
