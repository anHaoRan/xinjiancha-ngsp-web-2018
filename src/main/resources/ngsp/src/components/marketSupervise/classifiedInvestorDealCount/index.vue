<template>
  <div class="classifiedInvestorDealCount">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div class='detection-wrap'>
      <div>
        <el-card class='select el-card-table' style='overflow: visible'>
          <el-form :inline='true' :model='formParams' ref='formParams' class='formInfo'>
            <el-row :gutter='20'>
              <el-col :md='6' :sm='24'>
                <el-form-item label='证券'>
                  <div @click='stockSelect' style='display: inline-block;'>
                    <el-input type='text' placeholder='请选择' :value='formParams.securityCode + formParams.securityName'
                              size='small'></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :md='6' :sm='24'>
                <el-form-item label='分类投资者'>
                  <down-more-select v-model='formParams.investor' ref='downMoreSelect1' :optionData='creditTypeOption'
                                    :size='size' :clearFlag='clearFlag' :placeholder="placeholder"></down-more-select>
                </el-form-item>
              </el-col>
              <el-col :md='6' :sm='24'>
                <el-form-item label='图像类型'>
                  <el-select v-model='formParams.pictureValue' placeholder='请选择' size='small' :clearable='true'
                             style='outline:none'>
                    <el-option v-for='item in options' :key='item.value' :label='item.label'
                               :value='item.value'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md='6' :sm='24'>
                <el-form-item>
                  <el-button @click='personSet()' type='primary' :disabled='selectData.length == 0' size='small'>确定
                  </el-button>
                  <el-button @click='restore()' type='info' size='small'>恢复默认
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <div style='position: relative'>
          <select-code-box
            @refreshIsShow='refreshIsShowBox'
            @refreshAddItems='refreshAddItemList'
            class='addItemBox'
            v-show='stockShow'
            @getCode='getFormCode'
            @selectCode='selectFormCode'
            @unSelectCode='unSelectFromCode'
            @closeSelect="closeSelect"
            style='position: absolute;z-index: 100'
          ></select-code-box>
        </div>
        <div class='chart-wrap'>
          <el-row :gutter='30'>
            <el-col :span='12' v-for='(item,index) in chartList' :key='index'>
              <el-card class='el-card-table'>
                <div slot='header'>
                  <el-checkbox-group v-model='selectData' @change='getPicLoc' style='display: inline-block'
                                     class='selectStatus'>
                    <el-checkbox :label='item.chartLoc'></el-checkbox>
                  </el-checkbox-group>
                  <span>&nbsp{{item.chartType}}</span>
                  <el-button icon='el-icon-close' type='text' size='middle' @click='remove(item.chartLoc)'
                             style='margin-right: 0px'></el-button>
                </div>
                <div :id='index' style='width:100%;height:400px'></div>
              </el-card>
            </el-col>
            <el-col :span='12' v-if='(chartList.length >= 8)?false:true'>
              <el-card class='addSymbol el-card-table'>
                <el-button type='text' @click='dialogFormVisible = true' class='addbtn'>
                  <i class='el-icon-plus avatar-uploader-icon'></i>
                </el-button>
              </el-card>
            </el-col>
            <el-dialog title='新增走势图' :visible.sync='dialogFormVisible'>
              <el-form :inline='true' :model='addSelectParams' ref='addSelectParams' class='formInfo'>
                <el-row :gutter='20'>
                  <el-col :md='12' :sm='24'>
                    <el-form-item label='证券'>
                      <div @click='selectCode'>
                        <el-input type='text' placeholder='请选择'
                                  :value='addSelectParams.dialogStockCode + addSelectParams.dialogStockName'
                                  size='small'
                                  style='width: 200px'></el-input>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :md='12' :sm='24'>
                    <el-form-item label='分类投资者'>
                      <down-more-select v-model='addSelectParams.investorName' ref='downMoreSelect1'
                                        :optionData='creditTypeOption' :size='size'
                                        :clearFlag='clearFlag' :placeholder="placeholder"></down-more-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xl='24' style='padding: 50px 10px'>
                    <el-form-item label='图像类型'>
                      <div style='display: flex;'>
                        <el-checkbox :indeterminate='picIndeterminate' v-model='addSelectParams.picAll'
                                     @change='handlePicAllChange'>全选
                        </el-checkbox>
                        <div style='margin: 15px 0'></div>
                        <el-checkbox-group v-model='addSelectParams.checkedPicType' @change='handleCheckedPicChange'>
                          <el-checkbox v-for='item in PicType' :label='item' :key='item'>{{item}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </el-form-item>
                  </el-col>
                  <div style='text-align: center'>
                    <el-button @click.stop='submit' type='primary'>确定</el-button>
                    <el-button @click.stop='cancel' type='info'>取消</el-button>
                  </div>
                </el-row>
              </el-form>
              <div style='position: relative'>
                <select-code-box
                  @refreshIsShow='refreshIsShowBox'
                  @refreshAddItems='refreshAddItemList'
                  class='addItemBox'
                  v-show='isSelect'
                  @getCode='getCode'
                  @selectCode='selectCode'
                  @unSelectCode='unSelectCode'
                  @closeSelect="dialogClose"
                  style='position: absolute;z-index: 100;top:-195px'>
                </select-code-box>
              </div>
            </el-dialog>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import SelectCodeBox from '../../common/selectCodeBox'
  import DownMoreSelect from '../../common/downMoreSelect'
  import moment from 'moment'
  import {
    getInvestorTypeData,
    getCondition,
    postPictureData,
    postUserPersonSet,
    postAddPersonSet,
    postDeletePicture,
    getDefaultSet
  } from '@/service/marketSupervise/investorDealCount/index'

  let echarts = require('echarts')

  export default {
    name: 'classifiedInvestorTransactionStatistics',
    components: {
      Breadcrumb,
      SelectCodeBox,
      DownMoreSelect
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '市场运行监测'
          }, {
            router: '/classifiedInvestorDealCount',
            label: '分类投资者成交统计'
          }
        ],
        placeholder: '请选择',
        timer: null,
        timeInterval: 60 * 1000,
        dialogFormVisible: false,
        PicType: ['累计净成交', '分时净成交', '累计主动净成交', '分时主动净成交'],
        isSelect: false,
        stockShow: false, // 证券选择框
        location: [], // 图片位置
        creditTypeOption: [], // 传递给子组件的账户类型数据
        formParams: {
          securityCode: '',
          securityName: '',
          investor: '',
          pictureValue: ''
        },
        addSelectParams: {
          dialogStockCode: '',
          dialogStockName: '',
          investorName: [],
          picAll: false,
          checkedPicType: []
        },
        size: 'small',
        securityName: '', // 证券选择框显示内容
        securityCode: '', // 证券选择框
        investor: '', // 投资者类别
        value: '', // 图像类别
        chartList: [], // 图形dom循环
        selectData: [], // 图表选择状态
        picIndeterminate: true,
        options: [
          {
            value: '1',
            label: '累计净成交'
          },
          {
            value: '2',
            label: '分时净成交'
          },
          {
            value: '3',
            label: '累计主动净成交'
          },
          {
            value: '4',
            label: '分时主动净成交'
          }
        ],
        conditionArr: [], // 图像条件数组存储
        clearFlag: 1
      }
    },
    mounted() {
      // 获取投资者类型
      getInvestorTypeData('investorType', 'all').then(resp => {
        resp.forEach((el) => {
          this.creditTypeOption.push({value: el.value, label: el.text})
        })
      })
      this.getALLPicCondition()
    },
    // 切换页面时清除定时器
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      // 获取所有图片的条件信息
      getALLPicCondition() {
        getCondition().then(resp => {
          if (resp.warnMsg) {
            this.$message.success(resp.warnMsg)
          }
          let res = resp.chartSetups
          this.conditionParams(res)
        }).then(() => {
          this.getAllPicData()
        }).then(() => {
          this.refelshCharts()
        })
        // this.timer = setTimeout(() => {
        //   this.getALLPicCondition()
        // }, this.timeInterval)
      },
      refelshCharts() {
        getCondition().then(resp => {
          if (resp.warnMsg) {
            this.$message.success(resp.warnMsg)
          }
          let res = resp.chartSetups
          this.conditionParams(res)
        }).then(() => {
          this.conditionArr.forEach((el, index) => {
            postPictureData(JSON.stringify(el)).then(resp => {
              let res = resp
              let timeArr = []
              res.sdata.forEach((el) => {
                let arr = []
                let time = []
                el.data.forEach((p) => {
                  time.push(moment(p.time, 'Hmm').format('HH:mm'))
                  if (!p.value && p.value !== 0) {
                    arr.push('')
                  } else {
                    arr.push((p.value / 100000000).toFixed(2))
                  }
                })
                el.data = arr
                timeArr = time
              })
              res.category.push('全部')
              res.sdata.push({
                data: [],
                name: '全部',
                symbol: 'none',
                type: 'line'
              })
              return {
                category: res.category,
                chartCode: res.chartCode,
                chartMold: res.chartMold,
                chartName: res.chartName,
                sdata: res.sdata,
                chartLoc: el.chartLoc,
                time: timeArr,
                domId: index
              }
            }).then((result) => {
              let myLine = document.getElementById(result.domId)
              let echart = echarts.init(myLine)
              let option = echart.getOption()
              option.series = result.sdata
              option.xAxis = [{
                axisLabel: {
                  color: '#506798',
                  interval: 29 // 横坐标间隔时间
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#455579'
                  }
                },
                type: 'category',
                boundaryGap: false,
                data: result.time
              }]
              option.yAxis = {
                name: '(亿元)',
                axisLabel: {
                  color: '#506798'
                },
                splitLine: {
                  lineStyle: {
                    color: '#273757'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#455579'
                  }
                },
                type: 'value'
              }
              echart.setOption(option)
            })
          })
        })
        this.timer = setTimeout(() => {
          this.refelshCharts()
        }, this.timeInterval)
      },
      // 请求所有图片数据
      getAllPicData() {
        this.conditionArr.forEach((el, index) => {
          postPictureData(JSON.stringify(el)).then(resp => {
            let res = resp
            let timeArr = []
            res.sdata.forEach((el) => {
              let arr = []
              let time = []
              el.data.forEach((p) => {
                time.push(moment(p.time, 'Hmm').format('HH:mm'))
                if (!p.value && p.value !== 0) {
                  arr.push('')
                } else {
                  arr.push((p.value / 100000000).toFixed(2))
                }
              })
              el.data = arr
              timeArr = time
            })
            res.category.push('全部')
            res.sdata.push({
              data: [],
              name: '全部',
              symbol: 'none',
              type: 'line'
            })
            return {
              category: res.category,
              chartCode: res.chartCode,
              chartMold: res.chartMold,
              chartName: res.chartName,
              sdata: res.sdata,
              chartLoc: el.chartLoc,
              time: timeArr,
              domId: index
            }
          }).then((result) => {
            this.render(result)
          })
        })
      },
      // 图像渲染
      render(arr) {
        let _this = this
        let myLine = document.getElementById(arr.domId)
        let echart = echarts.init(myLine, _this.gfnGetTheme())
        echart.clear()
        window.onresize = echart.resize
        echart.setOption({
          color: ['#3f5efd', '#F2AEB3', '#0ac7a3', '#7140fe', '#ff4c4c', '#ff7836', '#ffcd36', '#92e41d', '#af0e0e', '#0b4b78', '#6b0668', '#69623f', '#27562d', '#654428', '#09ad21', '#d043c5', '#AF5206', '#2AD7F2'],
          // backgroundColor: '#1b2b4e',
          title: {
            subtext: arr.chartCode + ' ' + arr.chartName + '(' + arr.chartMold + ')',
            subtextStyle: {
              color: '#fff',
              fontSize: 14
            },
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            position: function (pos, params, dom, rect, size) {
              if (pos[0] < size.viewSize[0] / 2) {
                return [pos[0] + 20, '16']
              }
              return [pos[0] - 220, '16']
            },
            formatter: function (params) {
              let texts = params[0].name + '<br/>'
              params.forEach((el) => {
                texts += el.marker + el.seriesName + ':' + el.value + '亿元<br/>'
              })
              return texts
            }
          },
          legend: {
            selected: {},
            inactiveColor: '#455579',
            orient: 'vertical',
            right: '1%',
            top: 'middle',
            data: arr.category,
            textStyle: {
              color: '#506798'
            }
          },
          grid: {
            left: '2%',
            right: '23%',
            bottom: '3%',
            containLabel: true,
            position: ['50%', '50%']
          },
          toolbox: {
            x: '93%',
            y: 'top',
            itemSize: 20,
            feature: {
              saveAsImage: {
                name: arr.chartMold + '(' + arr.chartCode + ' ' + arr.chartName + ')'
              }
            }
          },
          xAxis: [{
            axisLabel: {
              color: '#506798',
              interval: 29 // 横坐标间隔时间
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#455579'
              }
            },
            type: 'category',
            boundaryGap: false,
            data: arr.time
          }],
          yAxis: {
            name: '(亿元)',
            axisLabel: {
              color: '#506798'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#273757'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#455579'
              }
            },
            type: 'value'
          },
          series: arr.sdata
        }, true)
        echart.on('legendselectchanged', function (val) {
          if (val.name == '全部') {
            if (val.selected['全部']) {
              for (let k in val.selected) {
                val.selected[k] = true
              }
            } else {
              for (let k in val.selected) {
                val.selected[k] = false
              }
            }
            let option = echart.getOption()
            option.legend[0].selected = val.selected
            option.xAxis[0].axisLabel = {
              color: '#506798'
            }
            option.yAxis[0].axisLabel = {
              color: '#506798'
            }
            echart.setOption(option)
          }
        })
      },
      // 图片位置
      getPicLoc(val) {
        this.location = val
      },
      // 股票选择框显示
      stockSelect() {
        this.stockShow = !this.stockShow
      },
      // 模态框图像类别多选
      handlePicAllChange(val) {
        this.addSelectParams.checkedPicType = val ? this.PicType : []
        this.picIndeterminate = false
      },
      handleCheckedPicChange(value) {
        let checkedCount = value.length
        this.addSelectParams.picAll = checkedCount === this.PicType.length
        this.picIndeterminate = checkedCount > 0 && checkedCount < this.PicType.length
      },
      // 模态框确定(增加设置)
      submit() {
        if (!this.addSelectParams.dialogStockCode || !this.addSelectParams.checkedPicType.length || !this.addSelectParams.investorName.length) {
          this.$message.warning('请选择3个条件进行新增')
        } else {
          let invstClasses = this.addSelectParams.investorName.join(',')
          let checkedPicTypeArr = []
          this.addSelectParams.checkedPicType.forEach((el) => {
            if (el === '累计净成交') {
              checkedPicTypeArr.push('1')
            } else if (el === '分时净成交') {
              checkedPicTypeArr.push('2')
            } else if (el === '累计主动净成交') {
              checkedPicTypeArr.push('3')
            } else {
              checkedPicTypeArr.push('4')
            }
          })
          let chartTypes = checkedPicTypeArr.join(',')
          let paramsArr = [{
            'code': this.addSelectParams.dialogStockCode,
            'invstClasses': invstClasses,
            'chartTypes': chartTypes
          }]
          let params = {chartList: paramsArr}
          postAddPersonSet(JSON.stringify(params)).then(resp => {
            if (resp.setUpsExistedNum) {
              this.$message.warning('增加的统计图已经存在！')
            }
            if (resp.warnMsg) {
              this.$message.success(resp.warnMsg)
            }
            clearTimeout(this.timer)
          }).then(() => {
            this.addSelectParams.dialogStockCode = ''
            this.addSelectParams.investorName = []
            this.addSelectParams.dialogStockName = ''
            this.addSelectParams.picAll = false
            this.addSelectParams.checkedPicType = []
            this.dialogFormVisible = false
            this.clearFlag++ // 清空分类投资者类型显示框
            this.getALLPicCondition()
          })
        }
      },
      // 模态框取消
      cancel() {
        this.dialogFormVisible = false
      },
      // 删除图表
      remove(index) {
        let params = {chartLoc: index}
        postDeletePicture(params).then(resp => {
          if (resp.warnMsg) {
            this.$message.success(resp.warnMsg)
          }
          clearTimeout(this.timer)
        }).then(() => {
          this.getALLPicCondition()
        })
      },
      // 个性化设置
      personSet() {
        let invstClasses = !this.formParams.investor ? '' : this.formParams.investor.join(',')
        let paramsObj = {
          'code': this.formParams.securityCode,
          'invstClasses': invstClasses,
          'chartTypes': this.formParams.pictureValue
        }
        let paramsArr = []
        this.location.forEach((el) => {
          paramsArr.push({
            code: paramsObj.code,
            invstClasses: paramsObj.invstClasses,
            chartTypes: paramsObj.chartTypes,
            chartLoc: el
          })
        })
        let params = {chartList: paramsArr}
        postUserPersonSet(JSON.stringify(params)).then(resp => {
          if (resp.setUpsExistedNum) {
            this.$message.warning('修改的统计图已经存在！')
          }
          clearTimeout(this.timer)
        }).then(() => {
          this.location = []
          this.selectData = []
          for (let k in this.formParams) {
            this.formParams[k] = ''
          }
          this.clearFlag++ // 清空分类投资者类型显示框
          this.dialogFormVisible = false
          this.getALLPicCondition()
        })
      },
      // 恢复默认
      restore() {
        getDefaultSet().then(resp => {
          if (resp.warnMsg) {
            this.$message.success(resp.warnMsg)
          }
          //  let res = resp.chartSetups
          //  this.conditionParams(res)
        }).then(() => {
          // this.getALLPicCondition()
          getCondition().then(resp => {
            if (resp.warnMsg) {
              this.$message.success(resp.warnMsg)
            }
            let res = resp.chartSetups
            this.conditionParams(res)
          }).then(() => {
            this.getAllPicData()
          }).then(() => {
            getCondition().then(resp => {
              if (resp.warnMsg) {
                this.$message.success(resp.warnMsg)
              }
              let res = resp.chartSetups
              this.conditionParams(res)
            }).then(() => {
              this.conditionArr.forEach((el, index) => {
                postPictureData(JSON.stringify(el)).then(resp => {
                  let res = resp
                  let timeArr = []
                  res.sdata.forEach((el) => {
                    let arr = []
                    let time = []
                    el.data.forEach((p) => {
                      time.push(moment(p.time, 'Hmm').format('HH:mm'))
                      if (!p.value && p.value !== 0) {
                        arr.push('')
                      } else {
                        arr.push((p.value / 100000000).toFixed(2))
                      }
                    })
                    el.data = arr
                    timeArr = time
                  })
                  res.category.push('全部')
                  res.sdata.push({
                    data: [],
                    name: '全部',
                    symbol: 'none',
                    type: 'line'
                  })
                  return {
                    category: res.category,
                    chartCode: res.chartCode,
                    chartMold: res.chartMold,
                    chartName: res.chartName,
                    sdata: res.sdata,
                    chartLoc: el.chartLoc,
                    time: timeArr,
                    domId: index
                  }
                }).then((result) => {
                  let myLine = document.getElementById(result.domId)
                  let echart = echarts.init(myLine)
                  let option = echart.getOption()
                  option.series = result.sdata
                  option.xAxis = [{
                    axisLabel: {
                      color: '#506798',
                      interval: 29 // 横坐标间隔时间
                    },
                    axisLine: {
                      show: false,
                      lineStyle: {
                        color: '#455579'
                      }
                    },
                    type: 'category',
                    boundaryGap: false,
                    data: result.time
                  }]
                  option.yAxis = {
                    name: '(亿元)',
                    axisLabel: {
                      color: '#506798'
                    },
                    splitLine: {
                      lineStyle: {
                        color: '#273757'
                      }
                    },
                    axisLine: {
                      lineStyle: {
                        color: '#455579'
                      }
                    },
                    type: 'value'
                  }
                  echart.setOption(option)
                })
              })
            })
          })
        })
      },
      // 条件数据处理
      conditionParams(res) {
        this.chartList = []
        this.conditionArr = []
        res.forEach((el) => {
          this.conditionArr.push({
            'code': el.code,
            'invstClass': el.invstClass,
            'chartType': el.chartType,
            'chartLoc': el.chartLoc
          })
          this.chartList.push(el)
        })
        this.chartList.forEach((el, index) => {
          if (el.chartType === '1') {
            this.chartList[index].chartType = '累计净成交'
          } else if (el.chartType === '2') {
            this.chartList[index].chartType = '分时净成交'
          } else if (el.chartType === '3') {
            this.chartList[index].chartType = '累计主动净成交'
          } else {
            this.chartList[index].chartType = '分时主动净成交'
          }
        })
      },
      refreshIsShowBox(state) {
      },
      refreshAddItemList(list, obj) {
      },
      closeSelect() {
        this.stockShow = false
      },
      dialogClose() {
        this.isSelect = false
      },
      getCode(code, name) {
        this.addSelectParams.dialogStockName = name
        this.addSelectParams.dialogStockCode = code + ' '
        this.isSelect = false
      },
      selectCode(val) {
        this.isSelect = !this.isSelect
      },
      unSelectCode(val) {
        this.isSelect = val
        this.addSelectParams.dialogStockName = ''
        this.addSelectParams.dialogStockCode = ''
      },
      // form表单证券代码选择
      getFormCode(code, name) {
        this.formParams.securityName = name
        this.formParams.securityCode = code + ' '
        this.stockShow = false
      },
      selectFormCode(val) {
        this.stockShow = val
      },
      unSelectFromCode(val) {
        this.stockShow = val
        this.formParams.securityName = ''
        this.formParams.securityCode = ''
      }
    }
  }
</script>

<style lang="less">
  .classifiedInvestorDealCount {
    .el-tabs {
      .el-tabs__content {
        overflow: visible !important;
      }
    }

    .detection-wrap .chart-wrap {
      min-height: 400px;
    }

    .detection-wrap {
      .el-form {
        padding: 10px 20px;
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }

    .detection-wrap .selectStatus {
      .el-checkbox__label {
        display: none;
      }
    }

    .detection-wrap .el-card__body {
      position: relative;
    }

    /*+号图标样式*/
    .detection-wrap .addSymbol {
      .el-card__body {
        height: 440px;
        .addbtn {
          border: none;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        i {
          color: #506798
        }
      }
    }

    .detection-wrap .addbtn:hover {
      background-color: transparent;
    }

    .detection-wrap .selectCodeBox .submitBtnBox {
      display: none;
    }

    .detection-wrap .avatar-uploader-icon {
      font-size: 50px;
      color: #fff;
      text-align: center;
      line-height: 2;
    }

    /*模态弹出框样式*/
    .detection-wrap .el-dialog {
      min-height: 550px;
      .el-form-item__content {
        .el-checkbox {
          margin-left: 20px;
        }
      }
      p {
        font-size: 14px;
      }
    }
  }
</style>
