<template>
    <div class="query-conditions">
        <el-card>
            <div slot="header" class="clearfix">
                <span>查询条件</span>
                <el-button
                        type="primary"
                        size="small"
                        @click="select()">查询
                </el-button>
            </div>
            <el-form :model="selectParams" ref="selectParams" label-position="left" label-width="100px"
                     style="margin-top: 20px;">
                <el-row>
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="券商">
                            <el-select v-model="selectParams.memberId"
                                       style="width: 350px;"
                                       filterable
                                       multiple
                                       collapse-tags
                                       size="small">
                                <el-option v-for="(item,index) in memberIdOption"
                                           :key="index"
                                           :label="item.name"
                                           :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="账户">
                            <el-input v-model="selectParams.accountId" class="el-form-input" size="small"></el-input>
                            <text-upload style="display: inline-block;" :uploadOption="uploadOption"
                                         @getTxtCon="getTxtData1"></text-upload>
                            <el-checkbox v-model="selectParams.isHistory">历史</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="8" :md="12" :sm="24">
                        <el-form-item label="开户日期">
                            <el-date-picker v-model="selectParams.selectTradeDate"
                                            type="date"
                                            placeholder="选择日期"
                                            format="yyyyMMdd" value-format="yyyyMMdd"
                                            size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>

<script>
  import { memberDropDown } from '@/service/analysisTool/MarginTrading/Index'

  export default {
    name: 'query-conditions',
    props: [],
    components: {
      TextUpload: () => import('@/components/common/textUpload')
    },
    mixins: [],
    data () {
      return {
        selectParams: {
          memberId: [],
          accountId: '',
          isHistory: false,
          selectTradeDate: ''
        },
        memberIdOption: [],
        uploadOption: {
          name: '导入', size: 'small'
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      getTxtData1 (val) {
        this.selectParams.accountId = val.join(',')
      },
      ajaxMemberDropDown () {
        memberDropDown().then(res => {
          let {bizData: {metaData}} = res
          this.memberIdOption = metaData
        })
      },
      select () {
        this.$refs['selectParams'].validate(valid => {
          if (valid) {
            this.$emit('select', this.selectParams)
          }
        })
      }
    },
    created () {
      this.ajaxMemberDropDown()
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
</style>
