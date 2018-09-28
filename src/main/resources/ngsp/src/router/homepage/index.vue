<template>
  <div class="homePage">
    <grid-layout
      :layout="layout"
      :col-num="12"
      :row-height="32"
      :is-draggable="isDrag"
      :is-resizable="isZoom"
      :vertical-compact="true"
      :margin="[20, 20]"
      :use-css-transforms="true"
      :auto-size="true">
      <grid-item v-for="(item,index) in layout"
                 :id="item.i"
                 :key="index"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :minW="item.minW == null ? 3 : item.minW"
                 :minH="item.minH == null ? 3 : item.minH"
                 @resized="resizedEvent"
                 @moved="movedEvent">
        <ProcessedRate v-if="item.i == 'processed-rate'"></ProcessedRate>
        <processedDaily v-if="item.i == 'processed-daily'"></processedDaily>
        <bpm-performance :height="map[item.i]" v-if="item.i == 'bpm-performance'"></bpm-performance>
        <alarm-trend :height="map[item.i]" v-if="item.i == 'alarm-trend'"></alarm-trend>
        <fluct-alarm-statis :height="map[item.i]" v-if="item.i == 'fluct-alarm-statis'"></fluct-alarm-statis>
        <el-card class="small-card" v-if="item.i == 'fluct-wave-info'">
          <div slot="header" class="clearfix">
            <span class="title">市场异常波动信息</span>
          </div>
          <WaveInfo></WaveInfo>
        </el-card>
        <el-card class="small-card" v-if="item.i == 'region-activity-map'">
          <div slot="header" class="clearfix">
            <span class="title">市场交易3分钟热点区域分布图</span>
          </div>
          <RegionActivityMap></RegionActivityMap>
        </el-card>
        <el-card class="small-card" v-if="item.i == 'index-market'">
          <div slot="header" class="clearfix">
            <span class="title">指数行情</span>
          </div>
          <SecurityCommonCharts></SecurityCommonCharts>
        </el-card>
        <supervise-task-top-page :height="map[item.i]" :setTime="true" v-if="item.i == 'supervise-task-top-page'"/>
      </grid-item>
    </grid-layout>
    <el-popover
      ref="homeSetPopover"
      placement="bottom"
      width="400"
      trigger="click">
      <el-row :gutter="20" class="marginBot10">
        <el-col :span="6">
          <el-switch v-model="isDrag" active-text="拖动"></el-switch>
        </el-col>
        <el-col :span="6">
          <el-switch v-model="isZoom" active-text="缩放"></el-switch>
        </el-col>
        <el-col :span="12" class="alignRight">
          <!--<el-button type="primary" class="customBtn" @click="addCustom()"><i class="el-icon-success"></i>生成</el-button>-->
        </el-col>
      </el-row>
      <el-tabs type="border-card">
        <el-tab-pane class="customTab" v-bind:class="{ hide:isCustomHide }">
          <span slot="label"><i class="el-icon-menu"></i></span>
          <el-row :gutter="10">
            <el-col :span="12" v-for="(item, index) in customData" :key="index">
              <div class="customItem" @click="chooseModuleItem(item.moduleCode)">
                <img :src="item.moduleSketch"/>
                <div v-show="item.isActive" class="itemActive"><i class="el-icon-circle-check-outline"></i></div>
              </div>
              <h5>{{ item.moduleName }}</h5>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-tickets"></i></span>
          暂无
        </el-tab-pane>
      </el-tabs>
      <!--<div class="popBackground" @click=""></div>-->
    </el-popover>
    <div class="homepage-setting" v-popover:homeSetPopover @click="handleSubscribeStatus()">
      <i class="el-icon-setting"></i>
    </div>
  </div>
</template>
<script>
  import VueGridLayout from 'vue-grid-layout'

  import {
    updateCustomSubscribes,
    customSubscribe,
    customCancel,
    getSubscribeStatus,
    getSubscribedModules
  } from '../../service/homepage/index'

  export default {
    components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      ProcessedRate: () => import('@/components/homePage/processedRate'),
      ProcessedDaily: () => import('@/components/homePage/processedDaily'),
      BpmPerformance: () => import('@/components/homePage/bpmPerformance'),
      FluctAlarmStatis: () => import('@/components/homePage/FluctAlarmStatis'),
      AlarmTrend: () => import('@/components/homePage/alarmTrend'),
      WaveInfo: () => import('@/components/marketSupervise/waveMonitor/waveInfo'),
      RegionActivityMap: () => import('@/components/marketSupervise/regionActivityMap'),
      SecurityCommonCharts: () => import('@/components/common/securityCommonCharts'),
      SuperviseTaskTopPage: () => import('@/components/superviseTask/superviseTaskTopPage/superviseTaskTopPage')
    },
    data () {
      return {
        layout: [
          {'x': 0, 'y': 0, 'w': 2, 'h': 2, 'i': '', 'minW': 3, 'minH': 3}
        ],
        newLayout: [],
        isDrag: true,
        isZoom: true,
        customData: [
          {
            moduleCode: '',
            moduleSketch: '',
            moduleName: '',
            isActive: false
          }],
        isCustomHide: true,
        map: {
          'supervise-task-top-page': '480',
          'alarm-trend': '200',
          'fluct-alarm-statis': '200',
          'bpm-performance': '200'
        }
      }
    },
    methods: {
      resizeEvent (i, w, h) {

      },
      resizedEvent (i, newH, newW, newHPx, newWPx) {
        this.handleLayoutChange()
        this.gfnVueGridLayoutResize(i, newHPx, newWPx)
        this.map[i] = newHPx
      },
      moveEvent () {

      },
      movedEvent (i, newX, newY) {
        this.handleLayoutChange()
      },
      handleLayoutChange () {
        let params = {
          'pageCode': 'home',
          'layouts': this.layout
        }
        updateCustomSubscribes(JSON.stringify(params)).then(resp => {
          if (resp.length != 0) {
            this.$message({
              message: '更新模块布局成功！',
              type: 'success'
            })
          }
        })
      },

      //  加载用户模块订阅情况
      handleSubscribeStatus () {
        let params = '?pageCode=home'
        getSubscribeStatus(params).then(resp => {
          if (resp.length != 0) {
            this.isCustomHide = false
            //  处理订阅列表
            this.customData = resp
            for (var i = 0; i < this.customData.length; i++) {
              console.log('this.customData:', this.customData[i].moduleCode, '+', this.customData[i].moduleName)
              if (this.customData[i].subscribed == 1) {
                this.customData[i].isActive = true
              } else {
                this.customData[i].isActive = false
              }
            }
          } else {
            this.isCustomHide = true
          }
        })
      },
      //  模块订阅配置中，触发选中
      chooseModuleItem (i) {
        this.newLayout = this.layout
        for (var x in this.customData) {
          if (this.customData[x].moduleCode == i) {
            if (this.customData[x].isActive == false) {
              // console.log("订阅");
              this.customData[x].isActive = true
              if (this.customData[x].moduleStyle == null) {
                this.customData[x].moduleStyle = {'x': 0, 'y': 0, 'w': 3, 'h': 3, 'i': i}
              }
              this.newLayout.push(this.customData[x].moduleStyle)
              //  订阅模块
              let customData = this.customData[x]
              let params = {
                'pageCode': 'home',
                'module': {
                  'moduleCode': customData.moduleCode,
                  'moduleStyle': {
                    'x': customData.moduleStyle.x,
                    'y': customData.moduleStyle.y,
                    'w': customData.moduleStyle.w,
                    'h': customData.moduleStyle.h,
                    'i': customData.moduleStyle.i
                  },
                  'orderNum': customData.orderNum
                }
              }
              customSubscribe(JSON.stringify(params)).then(resp => {
                this.$message({
                  message: '订阅成功！',
                  type: 'success'
                })
                this.dealWithLayout([customData.moduleStyle])
              })
            } else {
              // console.log("取消");
              this.customData[x].isActive = false
              for (var y in this.newLayout) {
                if (this.newLayout[y].i == this.customData[x].moduleCode) {
                  this.newLayout.splice(y, 1)
                  //  取消订阅模块
                  let moduleCode = this.customData[x].moduleCode
                  let params = {
                    'pageCode': 'home',
                    'moduleCode': moduleCode
                  }
                  customCancel(JSON.stringify(params)).then(resp => {
                    this.$message({
                      message: '取消订阅成功！',
                      type: 'success'
                    })
                  })
                }
              }
            }
            this.layout = this.newLayout
          }
        }
      },
      //  获取用户页面订阅的模块
      getSubscribedModules () {
        let params = '?pageCode=home'
        getSubscribedModules(params).then(resp => {
          if (resp.length != 0) {
            //  处理订阅页面模块
            this.layout = []
            for (var i = 0; i < resp.length; i++) {
              this.layout.push(resp[i].moduleStyle)
            }
            this.dealWithLayout(this.layout)
          } else {
            this.$message({
              message: '首页未订阅模块！',
              type: 'success'
            })
          }
        })
      },
      dealWithLayout (data) {
        this.$nextTick(function () {
          for (let key1 of data) {
            let children = this.$el.children[0].children
            for (let key of children) {
              if (key.id === key1.i) {
                this.map[key.id] = key.offsetHeight
              }
            }
          }
        })
      }
    },
    mounted () {
      //  首页图表展示
      this.getSubscribedModules()
    }
  }
</script>

<style scoped lang="less">
  .homePage {
    .el-card {
      padding: 0 10px;
    }

  }

  .alignRight {
    text-align: right;
  }

  .marginBot10 {
    margin-bottom: 10px;
  }

  .homepage-setting {
    width: 40px;
    height: 40px;
    line-height: 46px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
    text-align: center;
    position: fixed;
    right: 6px;
    top: 74px;
    z-index: 1;
    cursor: pointer;
    i {
      width: 40px;
      height: 40px;
      font-size: 22px;
      color: #fff;
    }
  }

  .homepage-setting:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  .popBackground {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 2;
    background: rgba(0, 0, 0, 0.3);
  }

  .customBtn {
    padding: 5px 18px;
  }

  .customBtn i {
    margin-right: 10px;
  }

  .customTab {
    height: 370px;
    overflow-y: scroll;
    padding: 0 10px;
  }

  .customTab h5 {
    text-align: center;
    margin: 0 0 10px 0;
  }

  .customItem {
    border: 1px solid #eee;
    margin-bottom: 6px;
    position: relative;
  }

  .customItem img {
    width: 100%;
    height: 158px;
    display: block;
  }

  .itemActive {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 3;
    background: rgba(0, 0, 0, .5);
    text-align: center;
    line-height: 180px;
  }

  .itemActive i {
    color: #fff;
    font-size: 40px;
  }

  .hide {
    display: none;
  }

</style>
