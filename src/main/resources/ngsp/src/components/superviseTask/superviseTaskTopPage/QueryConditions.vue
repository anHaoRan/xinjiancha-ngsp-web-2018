<template>
  <div class="query-conditions">
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="info"
          size="small"
          @click="clearAllData">清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="select">查询
        </el-button>
      </div>
      <el-form :model="selectParams" ref="selectParams" label-position="left" label-width="100px"
               style="margin-top: 20px;">
        <el-row>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="业务类型">
              <el-select v-model="selectParams.businessType" size="small" @change="changeStatus">
                <el-option
                  v-for="item in isbusinessType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="当前状态">
              <el-select v-model="selectParams.localStatus" size="small">
                <el-option
                  v-for="item in isstatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="起止时间" prop="selectTradeDate">
              <el-date-picker v-model="selectParams.selectTradeDate"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                              size="small"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'query-conditions',
    props: [],
    components: {},
    mixins: [],
    data() {
      return {
        selectParams: {
          businessType: '',
          localStatus: '',
          selectTradeDate: []
        },
        isbusinessType: [
          {
            value: '',
            label: '全部',
            type: [1, 2, 3, 4, 5, 6, 7, 8]
          },
          {
            value: 'ngsp_sls_flow',
            label: '自律监管',
            type: [1, 2, 3, 4, 5, 6, 7, 8]
          },
          {
            value: 'ngsp_obd_flow',
            label: '调取资料',
            type: [1, 2, 3, 4, 5, 6, 7, 8]
          },
          {
            value: 'ngsp_uns_send_flow',
            label: '联合监管发函',
            type: [1, 2, 3, 9, 10, 5, 11]
          }, {
            value: 'ngsp_uns_check_flow',
            label: '联合监管复函',
            type: [1, 12, 13, 14, 15, 3, 9, 10, 5, 11]
          }, {
            value: 'ngsp_dig_flow',
            label: '数据协查',
            type: [1, 4, 14, 15, 3, 9, 10, 5, 11]
          }, {
            value: 'ngsp_poa_flow',
            label: '舆情分析',
            type: [1, 2, 16, 4, 14, 15, 3, 9, 10, 11]
          }, {
            value: 'ngsp_spw_flow',
            label: '专项工作',
            type: [1, 2, 18, 19, 11]
          }, {
            value: 'ngsp_tc_flow',
            label: '临时计算',
            type: [1, 2, 3, 17, 15, 10, 11]
          }, {
            value: 'ngsp_rfp_flow',
            label: '权限申请',
            type: [1, 2, 3, 17, 15, 10, 11]
          }, {
            value: 'ngsp_dmg_flow',
            label: '需求管理',
            type: [1, 2, 3, 17, 15, 10, 11]
          }, {
            value: 'ngsp_ltb_flow',
            label: '函件借阅',
            type: [1, 2, 20, 21, 10, 11]
          }, {
            value: 'ngsp_ltl_flow',
            label: '函件传阅',
            type: [1, 2, 20, 35, 10, 11]
          }, {
            value: 'ngsp_msc_flow',
            label: '重点监控证券',
            type: [1, 2, 9, 10, 11]
          }, {
            value: 'ngsp_mag_flow',
            label: '重点监控账户组',
            type: [1, 2, 9, 10, 11]
          },
          {
            value: 'ngsp_crp_flow',
            label: '线索报告',
            // type: [1, 2, 20, 21, 10, 11]
            type: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 11]
          },
          {
            value: 'ngsp_mka_flow',
            label: '市场分析',
            // type: [1, 2, 20, 21, 10, 11]
            type: [4, 14, 15, 20, 9, 32, 10, 5, 11]
          },
          {
            value: 'ngsp_lad_flow',
            label: '日志审计',
            // type: [1, 2, 20, 21, 10, 11]
            type: [2, 33, 34, 9, 11]
          }
        ],
        isstatusMap: {
          1: {
            value: '',
            label: '全部'
          },
          2: {
            value: '创建中',
            label: '创建中'
          },
          3: {
            value: '审核中',
            label: '审核中'
          },
          4: {
            value: '分配中',
            label: '分配中'
          },
          5: {
            value: '待发函',
            label: '待发函'
          },
          6: {
            value: '待回函',
            label: '待回函'
          },
          7: {
            value: '待归档',
            label: '待归档'
          },
          8: {
            value: '已归档',
            label: '已归档'
          },
          9: {
            value: '审批中',
            label: '审批中'
          },
          10: {
            value: '确认中',
            label: '确认中'
          },
          11: {
            value: '办结',
            label: '办结'
          },
          12: {
            value: '负责人分配中',
            label: '负责人分配中'
          },
          13: {
            value: '组长分配中',
            label: '组长分配中'
          },
          14: {
            value: '拟稿中',
            label: '拟稿中'
          },
          15: {
            value: '复核中',
            label: '复核中'
          },
          16: {
            value: '判断中',
            label: '判断中'
          },
          17: {
            value: '计算中',
            label: '计算中'
          },
          18: {
            value: '组员拟稿',
            label: '组员拟稿'
          },
          19: {
            value: '组长审核',
            label: '组长审核'
          },
          20: {
            value: '组长审核中',
            label: '组长审核中'
          },
          21: {
            value: '函件组长审核中',
            label: '函件组长审核中'
          },
          22: {
            value: '创建',
            label: '创建'
          },
          23: {
            value: '实时组长审核',
            label: '实时组长审核'
          },
          24: {
            value: '分配',
            label: '分配'
          },
          25: {
            value: '拟稿',
            label: '拟稿'
          },
          26: {
            value: '复核',
            label: '复核'
          },
          27: {
            value: '线索组长审核',
            label: '线索组长审核'
          },
          28: {
            value: '部门审批',
            label: '部门审批'
          },
          29: {
            value: '所领导审批',
            label: '所领导审批'
          },
          30: {
            value: '拟稿人确认',
            label: '拟稿人确认'
          },
          31: {
            value: '发函',
            label: '发函'
          },
          32: {
            value: '领导审核中',
            label: '领导审核中'
          },
          33: {
            value: '审计中',
            label: '审计中'
          },
          34: {
            value: '汇总审计中',
            label: '汇总审计中'
          },
          35: {
            value: '被传阅人组长审核中',
            label: '被传阅人组长审核中'
          }
        }
      }
    },
    computed: {
      isstatus() {
        let index = this.isbusinessType.findIndex(item => item.value === this.selectParams.businessType),
          arr = []
        for (let key of this.isbusinessType[index].type) {
          arr.push(this.isstatusMap[key])
        }
        return arr
      }
    },
    watch: {},
    methods: {
      changeStatus(val) {
        if (val === 'ngsp_dmg_flow' || val === 'ngsp_ltb_flow') {
          this.selectParams.localStatus = ''
        } else {
          this.selectParams.localStatus = ''
        }
      },
      select() {
        this.$refs['selectParams'].validate(valid => {
          if (valid) {
            this.$emit('select', this.selectParams)
          }
        })
      },
      clearAllData() {
        this.selectParams.businessType = ''
        this.selectParams.localStatus = ''
        this.selectParams.selectTradeDate = []
      }
    },
    created() {
    },
    mounted() {
    },
    beforeDestroy() {
    }
  }
</script>

<style lang="less" scoped>
  .query-conditions {
  }
</style>
