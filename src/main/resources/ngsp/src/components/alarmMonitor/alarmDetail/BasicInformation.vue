<!--基本信息 -->
<template>
    <div class="basicinformation">
        <!--tep-->
        <el-card>
            <div slot="header" class="clearfix">
                <span>预警基本信息</span>
            </div>
            <el-form ref="basicinformation" style="margin-top: 10px;" :model="basicinformation" label-width="120px"
                     label-position="left">
                <el-row>
                    <el-col :span="12">
                        <el-col :span="22">
                            <el-form-item label="标题">
                                <el-input v-model="basicinformation.title" size="small" disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="12">
                        <el-col :span="22">
                            <el-form-item label="编号">{{basicinformation.alarm_id}}</el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-col :span="22">
                            <el-form-item label="证券代码">
                                <el-button size="small" type="text" @click="handlerClickCode">
                                    {{basicinformation.securities_code}}
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="12">
                        <el-col :span="22">
                            <el-form-item label="证券名称">
                                <el-input v-model="basicinformation.securities_name" size="small"
                                          disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-col :span="22">
                            <el-form-item label="调查事项">
                                <el-select v-model="investigateMatters" placeholder="请选择" size="small" disabled>
                                    <el-option v-for="item in INVESTIGATE_MATTERS" :key="item.value" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="12">
                        <el-col :span="22">
                            <el-form-item label="异常行为">
                                <el-select v-model="abnormalBehavior" placeholder="请选择" size="small" disabled>
                                    <el-option v-for="item in abnormalBehaviorSelect" :key="item.value"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-col :span="22">
                            <el-form-item label="日志记录">
                                <el-input type="textarea" :rows="3" v-model="basicinformation.log_record" resize="none"
                                          disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="12">
                        <el-col :span="22">
                            <el-form-item label="发函描述">
                                <el-input type="textarea" :rows="3" v-model="basicinformation.alarm_remark"
                                          resize="none"
                                          disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-col :span="22">
                            <el-form-item label="预警描述">
                                <el-input type="textarea" :rows="3" v-model="basicinformation.alarm_desc" resize="none"
                                          disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="12">
                        <el-col :span="22">
                            <el-form-item label="差异化标准">
                                <el-select v-model="differentiation" placeholder="请选择" size="small" disabled>
                                    <el-option v-for="item in differentiationSelect" :key="item.value"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="附件">
                            <el-upload class="upload-demo" action="#" :on-preview="handlePreview"
                                       :on-remove="handleRemove"
                                       :before-remove="beforeRemove" multiple
                                       :file-list="fileList">
                                <el-button size="small" type="text">上传</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label=" 账户（待分析）">
                            <el-table
                                    border
                                    ref="basicinformationAccount"
                                    :data="acctList"
                                    max-height="240"
                                    tooltip-effect="dark"
                                    style="width: 100%; overflow:visible">
                                <el-table-column prop="invacctno" label="账户代码" min-width="10%"
                                                 align="center"></el-table-column>
                                <el-table-column prop="invacctname" label="账户名称" min-width="10%"
                                                 align="center"></el-table-column>
                                <el-table-column prop="membername" label="会员名称" min-width="10%"
                                                 align="center"></el-table-column>
                                <el-table-column prop="branchname" label="营业部名称" min-width="10%"
                                                 align="center"></el-table-column>
                                <el-table-column prop="ymtid" label="一码通" min-width="10%"
                                                 align="center"></el-table-column>
                                <el-table-column prop="acctype" label="账户分类" min-width="10%"
                                                 align="center"></el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>
<script>
  import { INVESTIGATE_MATTERS, DIFFERENTIATION } from './SelectOptions'

  export default {
    //  接收父组件数据
    props: {
      basicinformation: {
        type: Object,
        default: function () {
          return {}
        }
      },
      acctList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    // 组件注册
    components: {},
    data () {
      return {
        INVESTIGATE_MATTERS: INVESTIGATE_MATTERS,
        abnormalBehaviorSelect: [],
        investigateMatters: 1,
        abnormalBehavior: 1,
        investigateMattersName: '',
        abnormalBehaviorName: '',
        differentiation: 1,
        differentiationName: '',
        differentiationSelect: DIFFERENTIATION,
        fileList: []
      }
    },
    watch: {
      //  调查事项下拉框发生改变触发
      investigateMatters: {
        handler: function () {
          for (let key of this.INVESTIGATE_MATTERS) {
            if (key.value === this.investigateMatters) {
              this.investigateMattersName = key.label
              this.abnormalBehaviorSelect = key.children
              return
            }
          }
        },
        immediate: true
      },
      abnormalBehavior: {
        handler: function () {
          for (let key of this.abnormalBehaviorSelect) {
            if (key.value === this.abnormalBehavior) {
              this.abnormalBehaviorName = key.label
              return
            }
          }
        },
        immediate: true
      },
      differentiation: {
        handler: function () {
          for (let key of this.differentiationSelect) {
            if (key.value === this.differentiation) {
              this.differentiationName = key.label
              return
            }
          }
        },
        immediate: true
      }
    },
    methods: {
      handlePreview (file) {
        console.log(file)
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      beforeRemove (file, fileList) {
        return this.$confirm(`确定移除${file.name}?`)
      },
      handlerClickCode () {
        this.$router.push({name: `productQuery`, params: {stockCode: this.basicinformation.securities_code}})
      }
    },
    created () {
    },
    // 发起请求，拿回数据，配合路由钩子做一些事情
    mounted () {
    }
  }
</script>
<style lang="less" scoped>
    .basicinformation {
        .el-select {
            width: 100%;
        }
    }
</style>
