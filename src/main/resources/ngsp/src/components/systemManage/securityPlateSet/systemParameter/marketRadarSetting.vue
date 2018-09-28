<!-- 市场情绪雷达设置 marketRadarSetting-->
<template>
  <div class="marketRadarSetting">
    <!--<h1>市场情绪雷</h1>-->
    <el-card class="el-card-table">
      <el-row>
        <el-col :span="20" :offset="3">
          <el-tabs v-model="activeName">
            <el-tab-pane label="昨日强势今日表现" name="Strong">
            </el-tab-pane>
            <el-tab-pane label="当日涨停家数" name="DailyLimit">
            </el-tab-pane>
            <el-tab-pane label="近10日强势股表现" name="WhichPerformed">
            </el-tab-pane>
            <el-tab-pane label="前50成交额占比" name="Accounting">
            </el-tab-pane>
            <el-tab-pane :label="`${String(paramCode) === '1' ? '中位数' : '平均数'}涨跌幅`" name="Median">
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="16" :offset="3"  style="margin-top: 20px;">
        <div class="market-sentiment">
          {{(activeName==="Strong"||activeName==="Median"||activeName==="WhichPerformed")?"涨跌幅":(activeName==="DailyLimit"?"涨跌停家数":"成交额占比")}}
          <div class="market-sentiment-body">
            <div class="fraction">
              <div v-for="item in [5,4,3,2,1,0]" style="line-height: 50px;">{{item}}分</div>
            </div>
            <div v-for="(item,index) in systemParam[itemCode].fraction" :key="index"
                 style="text-align: center;margin-bottom: 20px;">
              <el-input v-model.number.trim="item.value" type="Number" size="small" style="width: 150px;"></el-input>
             {{activeName==="DailyLimit"?"家":"%"}}
            </div>
          </div>
          <div v-if="activeName==='Median'">
            计算法:
            <el-radio-group v-model="paramCode" @change="handleRadioChange">
              <el-radio label="0">平均数</el-radio>
              <el-radio label="1">中位数</el-radio>
            </el-radio-group>
          </div>
        </div>
        <el-col :span="24" class="butSta">
          <el-button type="primary" size="small" @click="ajaxUpdateParamData">确定</el-button>
          <el-button type="primary" size="small" @click="handleCancel">取消</el-button>
        </el-col>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
// import {getFluctradargraph} from '@/service/marketSupervise'
import {getKindData, updateParamData} from '@/service/systemManage'
export default {
  name: 'systemParameterSetting',
  components: {

  },
  data() {
    return {
      activeName: 'Strong', // 默认昨日强势今日股 tap
      paramCode: '0', // 计算法
      itemCode: '',
      systemParam: {
        median: {},
        avgzdf: {},
        tenzdf: {},
        tradamt: {},
        fivezdf: {},
        sumzdf: {},
        avg_median: {}
      },
      echart: null,
      options: null,
      echartData: null

    }
  },
  methods: {
    handleRadioChange(val) {
      Number(val) > 0 ? this.itemCode = this.itemCode = 'median' : this.itemCode = 'avgzdf'
    },
    handleCancel() {
      this.ajaxGetKindData()
    },
    // 根据一个或多个条件查询系统参数
    ajaxGetKindData() {
      let param = {
        appCode: 'fluct',
        moduleCode: 'radar'
      }
      getKindData(JSON.stringify(param)).then((res) => {
        // console.log(res);
        let index = res.findIndex((item) => {
          return item.itemCode === 'avg_median'
        })
        this.paramCode = res[index].paramValue
        for (let key of res) {
          key.fraction = []
          for (let key2 of key.paramValue.split(',')) {
            key.fraction.push({value: Number(key2).toFixed(2)})
          }
        }
        for (let key in this.systemParam) {
          this.systemParam[key] = res[res.findIndex((item) => {
            return item.itemCode === key
          })]
        }
      })
    },
    // 批量更新系统参数
    ajaxUpdateParamData() {
      let filterItem = this.systemParam[this.itemCode]
      let avgMedianItem = this.systemParam['avg_median']
      const {id, fraction} = filterItem
      let param = [{
        id: id,
        paramValue: fraction.map(v => {
          return v.value
        }).join(',')
      }]
      let avgMedianParam = [{
        id: avgMedianItem.id,
        paramValue: Number(this.paramCode)
      }]
      if (this.activeName === 'Median') {
        param = [...param, ...avgMedianParam]
      }
      /* for (let val in this.systemParam) {
        let key = this.systemParam[val]
        if (key.itemCode == "avg_median") {
          if (key.paramValue != this.paramCode) {
            flag = false
            param.push({id: key.id, paramValue: this.paramCode})
          }
          continue
        }
        let paramValue = [],
          i = 0
        for (let key2 of key.fraction) {
          paramValue.push(key2.value)
        }
        for (let key2 of paramValue) {
          if (key2 != key.paramValue.split(",")[i]) {
            flag = false
            param.push({id: key.id, paramValue: paramValue.join(",")})
            break
          }
          i++
        }
      }
      console.log(param)
      if (flag) {
        this.$message.error('请修改参数后保存')
        return
      } */
      /* 校验表单 */
      const zRex = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/ /* 非负数，保留两位小数 */
      const sRex = /(^-?[1-9](\d+)?(\.\d{1,2})?$)|(^-?(0){1}$)|(^-?\d\.\d{1,2}?$)/ /* 实数，保留两位小数 */
      let valueArray = param[0].paramValue.split(',')
      let isValidate = true
      if ((this.activeName === 'DailyLimit' || this.activeName === 'Accounting')) {
        valueArray.forEach(val => {
          if (!zRex.test(val)) {
            this.$message.error('只能输入大于0的数，保留两位小数')
            isValidate = false
          }
        })
      } else {
        valueArray.forEach(val => {
          if (!sRex.test(val)) {
            this.$message.error('只能输入正负数，保留两位小数')
            isValidate = false
          }
        })
      }
      if (isValidate) {
        updateParamData(JSON.stringify(param)).then((res) => {
          if (res) {
            this.$message.success('参数保存成功')
            this.ajaxGetKindData()
          }
        })
      }
    }
  },
  watch:{
    activeName: {
      handler: function (val) {
        switch (val) {
          case 'Strong':
            this.itemCode = 'tenzdf'
            break
          case 'DailyLimit':
            this.itemCode = 'sumzdf'
            break
          case 'WhichPerformed':
            this.itemCode = 'fivezdf'
            break
          case 'Accounting':
            this.itemCode = 'tradamt'
            break
          case 'Median':
            if (this.paramCode > 0) {
              this.itemCode = 'median'
            } else {
              this.itemCode = 'avgzdf'
            }
            break
        }
      },
      immediate: true
    }
  },
  created() {

  },
  mounted() {
    this.ajaxGetKindData()
  }
}
</script>
<style lang="less">
  .marketRadarSetting{
    .market-sentiment-body {
      margin-top: 20px;
      position: relative;
        .fraction {
          position: absolute;
          top: -32px;
          left: 32%;
          /*left: 20%;*/
        }
    }
  .market-sentiment{
      color: #ffffff;
      font-size: 16px;
  }
  .butSta{
    text-align: right;
  }
  }
</style>
