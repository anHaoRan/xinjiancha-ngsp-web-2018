<template>
  <div class="topFiveQuery"
       v-loading="loading"
       element-loading-text="正在加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0,0,0,0.8)"
  >
    <el-card>
      <div slot="header">
        查询
      </div>
      <el-form :inline='true' :model='queryTopFiveForm' ref='queryTopFiveForm'>
        <el-row :gutter='20'>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label='统计日期：'>
              <el-date-picker
                v-model='queryTopFiveForm.beginDate'
                type='date'
                placeholder='请选择开始日期'
                value-format='yyyy-MM-dd'
                size='small'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item>
              <el-button type="primary" size="small" @click="queryTop">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="8" v-for="(item,index) in dataList" :key="index">
        <el-card>
          <div slot="header">
            {{item.title}}
            <span class="subtitleStyle"> {{item.subtitle}}</span>
          </div>
          <div class="topStyle" v-for="(option,index) in item.topSeq" :key="index">
            <div>
              <p>{{option.name}}</p>
              <p>{{option.code}}</p>
            </div>
            <div class="wordStyle">{{option.ratio}}</div>
          </div>
          <div class="topStyle" v-if="item.topSeq.length<1?true:false">
            <div>
              <p>--</p>
              <p>--</p>
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle" v-if="item.topSeq.length<2?true:false">
            <div>
              <p>--</p>
              <p>--</p>
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle" v-if="item.topSeq.length<3?true:false">
            <div>
              <p>--</p>
              <p>--</p>
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle" v-if="item.topSeq.length<4?true:false">
            <div>
              <p>--</p>
              <p>--</p>
            </div>
            <div class="wordStyle">--</div>
          </div>
          <div class="topStyle" v-if="item.topSeq.length<5?true:false">
            <div>
              <p>--</p>
              <p>--</p>
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
        queryTopFiveForm: {
          beginDate: ''
        },
        dataList: [],
        loading: true
      }
    },
    props: ['accountId','resultData'],
    watch: {
      // accountId: function (param1, param2) {
      //   this.initData()
      // },
      resultData: {
        handler: function (param1, param2) {
          this.initData()
        },
        deep: true
      }
    },
    mounted() {
      // this.queryTop()
    },
    methods: {
      initData() {
        this.loading = true
        if (JSON.stringify(this.resultData) != '{}') {
          this.loading = false
          let res = this.resultData.topSet
          let overlayCode = []
          this.dataList = []
          if (res.acctHoldDetail) {
            res.acctHoldDetail.topSeq.forEach((el) => {
              overlayCode.push({value: el.code, label: el.code + el.name})
            })
            this.$emit('getOverlayCode', overlayCode)
            for (let k in res) {
              this.dataList.push(res[k])
            }
            for (let k in this.dataList) {
              this.dataList[k].topSeq.forEach((el, index) => {
                if (!el.code) {
                  this.dataList[k].topSeq[index].code = '--'
                }
                if (!el.name) {
                  this.dataList[k].topSeq[index].name = '--'
                }
                if (!el.ratio) {
                  this.dataList[k].topSeq[index].ratio = '--'
                }
              })
            }
          } else {
            for (let k = 0; k < 3; k++) {
              this.dataList.push({
                title: '',
                subtitle: '',
                topSeq: []
              })
            }
          }
        } else {
          for (let k = 0; k < 3; k++) {
            this.dataList.push({
              title: '',
              subtitle: '',
              topSeq: []
            })
          }
        }
      },
      queryTop() {
        this.loading = true
        let params = {
          key: JSON.stringify({
            accountId: this.accountId,
            tradeDate: !this.queryTopFiveForm.beginDate ? '' : moment(this.queryTopFiveForm.beginDate, 'YYYY-MM-DD').format('YYYYMMDD')
          }),
          method: 'hbaseQuery'
        }
        postIntestorPic(params).then(resp => {
          this.loading = false
          let res = resp.topSet
          let overlayCode = []
          this.dataList = []
          if (res.acctHoldDetail) {
            res.acctHoldDetail.topSeq.forEach((el) => {
              overlayCode.push({value: el.code, label: el.code + el.name})
            })
            this.$emit('getOverlayCode', overlayCode)
            for (let k in res) {
              this.dataList.push(res[k])
            }
            for (let k in this.dataList) {
              this.dataList[k].topSeq.forEach((el, index) => {
                if (!el.code) {
                  this.dataList[k].topSeq[index].code = '--'
                }
                if (!el.name) {
                  this.dataList[k].topSeq[index].name = '--'
                }
                if (!el.ratio) {
                  this.dataList[k].topSeq[index].ratio = '--'
                }
              })
            }
          } else {
            for (let k = 0; k < 3; k++) {
              this.dataList.push({
                title: '',
                subtitle: '',
                topSeq: []
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .topFiveQuery {
    .topStyle {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      align-items: center;
      p {
        margin: 10px 0px
      }
    }
    .subtitleStyle {
      margin-right: 10px;
      font-size: 14px;
      float: right;
    }
    .wordStyle {
      font-size: 16px;
    }
  }
</style>
