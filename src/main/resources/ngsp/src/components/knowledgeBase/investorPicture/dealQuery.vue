<template>
  <div class="dealQuery"
       v-loading="loading"
       element-loading-text="正在加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0,0,0,0.8)"
  >
    <el-card>
      <div slot="header">
        虚假申报类特征
      </div>
      <el-form :inline='true' :model='stockForm' ref='stockForm'>
        <el-row :gutter='20'>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label='统计日期：'>
              <el-date-picker
                v-model='stockForm.beginDate'
                type='date'
                placeholder='请选择开始日期'
                value-format='yyyy-MM-dd'
                size='small'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item>
              <el-button type="primary" size="small" @click="query">查询</el-button>
              <el-button type="info" size="small" @click="downLoad">下载</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="8" v-for="(item,index) in falseDeclaim" :key="index">
        <el-card>
          <div slot="header">
            {{item.code + item.name}}
          </div>
          <div class="topStyle">
            <div>
              平均单笔申报额
            </div>
            <div class="wordStyle">{{(item.avgOrderAmt/10000).toFixed(3)}}万元</div>
          </div>
          <div class="topStyle">
            <div>
              最小单笔申报量
            </div>
            <div class="wordStyle">{{(item.minOrderVol/10000).toFixed(3)}}万股</div>
          </div>
          <div class="topStyle">
            <div>
              最大单笔申报额占日总申报
            </div>
            <div class="wordStyle">{{(item.perMaxOrderVol*100).toFixed(5)}}%</div>
          </div>
          <div class="topStyle">
            <div>
              分钟申报量占市场比例最大值
            </div>
            <div class="wordStyle">{{(item.maxPerTimeOrderVol*100).toFixed(5)}}%</div>
          </div>
          <div class="topStyle">
            <div>
              分钟撤单量占市场比例最大值
            </div>
            <div class="wordStyle">{{(item.maxPerTimeWithdrawVol*100).toFixed(5)}}%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" v-if="falseDeclaim.length<1?true:false">
        <el-card>
          <div slot="header">
          </div>
          <div class="topStyle">
            <div>
              平均单笔申报额
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              最小单笔申报量
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              最大单笔申报额占日总申报
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              分钟申报量占市场比例最大值
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              分钟撤单量占市场比例最大值
            </div>
            <div class="wordStyle">--</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" v-if="falseDeclaim.length<2?true:false">
        <el-card>
          <div slot="header">
          </div>
          <div class="topStyle">
            <div>
              平均单笔申报额
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              最小单笔申报量
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              最大单笔申报额占日总申报
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              分钟申报量占市场比例最大值
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              分钟撤单量占市场比例最大值
            </div>
            <div class="wordStyle">--</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" v-if="falseDeclaim.length<3?true:false">
        <el-card>
          <div slot="header">
          </div>
          <div class="topStyle">
            <div>
              平均单笔申报额
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              最小单笔申报量
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              最大单笔申报额占日总申报
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              分钟申报量占市场比例最大值
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              分钟撤单量占市场比例最大值
            </div>
            <div class="wordStyle">--</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="lataiStyle">
      <div slot="header">
        拉抬打压类特征
      </div>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="8" v-for="(item,index) in liftDown" :key="index">
        <el-card>
          <div slot="header">
            {{item.code + item.name}}
          </div>
          <div class="topStyle">
            <div>
              申报价偏离前一笔市场成交价最大值
            </div>
            <div class="wordStyle">{{item.maxOrderPreTradePriceDiff}}</div>
          </div>
          <div class="topStyle">
            <div>
              申报价偏离前一笔市场成交价均值
            </div>
            <div class="wordStyle">{{item.avgOrderPreTradePriceDiff}}</div>
          </div>
          <div class="topStyle">
            <div>
              日总申报量
            </div>
            <div class="wordStyle">{{(item.vsorderOrderVol/10000).toFixed(3)}}万股</div>
          </div>
          <div class="topStyle">
            <div>
              平均单笔成交量
            </div>
            <div class="wordStyle">{{(item.avgTradeVol/10000).toFixed(3)}}万股</div>
          </div>
          <div class="topStyle">
            <div>
              最大一分钟内成交量
            </div>
            <div class="wordStyle">{{(item.maxTimeTradeVol/10000).toFixed(3)}}万股</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" v-if="falseDeclaim.length<1?true:false">
        <el-card>
          <div slot="header">
          </div>
          <div class="topStyle">
            <div>
              平均单笔申报额
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              最小单笔申报量
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              最大单笔申报额占日总申报
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              分钟申报量占市场比例最大值
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              分钟撤单量占市场比例最大值
            </div>
            <div class="wordStyle">--</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" v-if="falseDeclaim.length<2?true:false">
        <el-card>
          <div slot="header">
          </div>
          <div class="topStyle">
            <div>
              平均单笔申报额
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              最小单笔申报量
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              最大单笔申报额占日总申报
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              分钟申报量占市场比例最大值
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              分钟撤单量占市场比例最大值
            </div>
            <div class="wordStyle">--</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" v-if="liftDown.length<3?true:false">
        <el-card>
          <div slot="header">
          </div>
          <div class="topStyle">
            <div>
              申报价偏离前一笔市场成交价最大值
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              申报价偏离前一笔市场成交价均值
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              日总申报量
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              平均单笔成交量
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle">
            <div>
              最大一分钟内成交量
            </div>
            <div class="wordStyle">--</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {postIntestorPic} from '../../../service/knowledgeBase/investorPicture/index'
  import moment from 'moment'

  export default {
    components: {},
    data() {
      return {
        stockForm: {
          beginDate: ''
        },
        falseDeclaim: [], // 虚假申报
        liftDown: [], // 拉抬打压
        loading: true
      }
    },
    props: ['accountId', 'clickTime', 'resultData'],
    watch: {
      accountId: function (param1, param2) {
        this.query()
      },
      clickTime: function (param1, param2) {
        this.stockForm.beginDate = param1
      },
      resultData: {
        handler: function (param1, param2) {
          this.initData()
        },
        deep: true
      }
    },
    mounted() {
      // this.query()
    },
    methods: {
      initData() {
        this.loading = true
        if (JSON.stringify(this.resultData) != '{}') {
          this.loading = false
          let res = this.resultData.features
          if (res.features_falsedeclaim) {
            this.falseDeclaim = res.features_falsedeclaim
          } else {
            this.falseDeclaim = []
          }
          if (res.features_liftdown) {
            this.liftDown = res.features_liftdown
          } else {
            this.liftDown = []
          }
        } else {
          this.falseDeclaim = []
          this.liftDown = []
        }
      },
      query() {
        this.loading = true
        let params = {
          key: JSON.stringify({
            accountId: this.accountId,
            tradeDate: !this.stockForm.beginDate ? '' : moment(this.stockForm.beginDate, 'YYYY-MM-DD').format('YYYYMMDD')
          }),
          method: 'hbaseQuery'
        }
        postIntestorPic(params).then(resp => {
          this.loading = false
          let res = resp.features
          if (res.features_falsedeclaim) {
            this.falseDeclaim = res.features_falsedeclaim
          } else {
            this.falseDeclaim = []
          }
          if (res.features_liftdown) {
            this.liftDown = res.features_liftdown
          } else {
            this.liftDown = []
          }
        })
      },
      downLoad() {
        let tradeDate = !this.stockForm.beginDate ? '' : moment(this.stockForm.beginDate, 'YYYY-MM-DD').format('YYYYMMDD')
        this.gfnExportFileSimple('/iptr/download?accountId=' + this.accountId + '&tradeDate=' + tradeDate)
      }
    }
  }
</script>

<style lang="less">
  .dealQuery {
    .topStyle {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      align-items: center;
      padding: 15px;
    }
    .wordStyle {
      font-size: 16px;
    }
    .lataiStyle {
      .el-card__body {
        padding: 0px;
      }
    }
  }

</style>
