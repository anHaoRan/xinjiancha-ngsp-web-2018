<template>
  <el-card class="ngspRegulatoryHistoryTable">
    <div slot="header">账户历史监管信息</div>
    <margin-table
      v-loading="loading"
      :columns="columns"
      :height="200"
      :isPageination="false"
      :data="{
        data: tableData
      }"
      @handlerChange="handleSlotComponentEvent"
    >
      <el-table-column
        slot="tableColumnsUnshift"
        type="index"
        width="60px"
        align="center"
        label="序号"
        show-overflow-tooltip>
      </el-table-column>
    </margin-table>
    <div v-if="showAnalyResult">
      <h4>分析结果：</h4>
      <el-checkbox-group class="self-checkbox-group" v-model="analyResult" @change="updateAnalyResult">
        <!--:disabled="String(handleStatus) === '1' || String(processStatus)!=='0'"-->
        <el-checkbox v-for="(item, index) in analyResultOptions" :key="index" :label="String(index)" disabled>{{item}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </el-card>
</template>
<script>
  import MarginTable from '@/components/base/MarginTable'
  export default {
    components: {MarginTable},
    props: {
      tableData: {
        type: Array,
        default() {
          return []
        }
      },
      loading: {
        type: Boolean,
        default: false
      },
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      analyResultProps: {
        type: Array,
        default() {
          return []
        }
      },
      showAnalyResult: {
        type: Boolean,
        default: false
      },
      processStatus: {
        type: [Number, String],
        default: '0'
      },
      handleStatus: {
        type: [Number, String],
        default: ''
      }
    },
    watch: {
      analyResultProps(newValue) {
        this.analyResult = newValue
      }
    },
    data() {
      return {
        analyResult: [],
        analyResultOptions: ['两年内两次执行纪律处分', '处于重点账户监控期内', '监控期内达到3次以上异常交易行为', '最近3个月内被本所实施过2次警示（口头/书面）', '最近6个月内被本所实施过2次盘中暂停', '专业机构近一个月内采取2次及以上监管措施']
      }
    },
    methods: {
      handleSlotComponentEvent ({type, scope, item}) {
        if (type === 'tableColumnCanClickComponent') {
          window.open(`#/selfSupervisionFormPage?operate=1&warningNo=${scope.row.wh}&instanceId=${scope.row.infoId}&isNewTab=true`)
        }
      },
      updateAnalyResult(val) {
        this.$emit('updateAnalyResult', val)
      }
    }

  }
</script>
<style lang="less" scoped>
  .ngspRegulatoryHistoryTable {
    /deep/.el-loading-mask {
      background: rgba(0,0,0,0.3) !important;
    }
    .self-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
      >label {
        width: 30%;
        margin-left: 20px;
        padding: 10px;
      }
    }
  }
</style>
