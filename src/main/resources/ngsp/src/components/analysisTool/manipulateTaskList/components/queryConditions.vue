<template>
  <div class="queryConditionsBox">
    <el-card>
      <!--查询操作-->
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="info" size="small"
          @click="resetForm('selectParams')">清空
        </el-button>
        <el-button type="primary" size="small"
          @click="select('selectParams')">查询
        </el-button>
      </div>
      <!--查询表单-->
      <el-form ref="selectParams" :inline="true" label-width="100px"  :model="selectParams">

        <el-row>
          <el-col :span="5">
          <el-form-item label="证券代码：">
            <stock-code-query ref="StockCodeQuery" :clearable='true' style="display: inline-flex"
              :commonData="submitData"
              @getStockCode="getStockCode"/>
          </el-form-item>
          </el-col>
          <el-col :span="5">
          <el-form-item label="关键字：">
            <el-input v-model="selectParams.secName" size="small" placeholder="请输入关键字" clearable></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="5">
          <el-form-item label="创建类型：">
            <el-select v-model="selectParams.dataType" size="small" style="width: 120px">
              <el-option label="手工创建" value="1"/>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="5">
          <el-form-item label="反馈单位：">
            <el-select v-model="selectParams.replyComp" size="small" style="width: 120px">
              <el-option label="稽查局" value="1"/>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="4">
          <el-form-item label="状态：">
            <el-select v-model="selectParams.taskStatus" size="small" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="分析中" value="x1"/>
              <el-option label="复核中" value="x5"/>
              <el-option label="被退回" value="x6"/>
              <el-option label="已复核" value="x9"/>
            </el-select>
          </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">
          <el-form-item label="创建人：">
            <el-select v-model="selectParams.createUser" size="small" style="width: 160px">
              <el-option-group
                v-for="group in reanalUserList"
                :key="group.label"
                :label="group.label">                
                <el-option v-for="item in group.options" :label="item.fullName" :value="item.userName"/>
              </el-option-group>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="5">
          <el-form-item label="在办人：">
            <el-select v-model="selectParams.reanalUser" size="small" style="width: 160px">
              <el-option-group
                v-for="group in reanalUserList"
                :key="group.label"
                :label="group.label">                
                <el-option v-for="item in group.options" :label="item.fullName" :value="item.userName"/>
              </el-option-group>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="5">
          <el-form-item label="创建日期：">
            <el-date-picker v-model="selectParams.createTime"
                            type="date"
                            placeholder="选择日期"
                            format="yyyyMMdd" value-format="yyyyMMdd"
                            size="small"
            ></el-date-picker>
          </el-form-item>
          </el-col>
          <el-col :span="5">
          <el-form-item label="案件类型：">
            <el-select v-model="selectParams.caseType" size="small" style="width: 120px">
              <el-option label="全部" value=""/>
              <el-option label="跨期操纵" value="1"/>
              <el-option label="短线操纵" value="2"/>
            </el-select>
          </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { getReanalUser } from '@/service/analysisTool/manipulateTaskList/index'

  export default {
    name: 'query-conditions',
    props: {},
    components: {
      StockCodeQuery: () => import('@/components/common/StockCodeQuery') // 证券代码模糊查询
    },
    mixins: [],
    data() {
      return {
        //  查询条件
        selectParams: {
          secCode: '', 
          secName:'',
          dataType: '1',
          replyComp: '1',
          taskStatus: '',
          createUser: '',
          reanalUser: '',
          createTime: '',
          caseType: ''
        },
        submitData: {disabled: false, secSubTypecode: 'ASH', stockCode: ''},
        reanalUserList: [],
        
      }
    },
    computed: {},
    watch: {},
    methods: {      
      getStockCode(stockCodeData) { // 证券代码模糊查询
        if (stockCodeData) {
          let [indexCode, indexName] = stockCodeData.split(' ')
          this.selectParams.secCode = indexCode
          // this.selectParams.indexName = indexName
        }
      },
      resetForm(formName) { // 清空
        this.$refs[formName].resetFields()
        this.selectParams = {
          secCode: '',
          secName:'',
          dataType: '1',
          replyComp: '1',
          taskStatus: '',
          createUser: '',
          reanalUser: '',
          createTime: '',
          caseType: ''
        }
        this.submitData = {disabled: false, secSubTypecode: 'ASH', stockCode: ''}
      },
      select(formName) { // 查询
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$emit('queryConditions', this.selectParams)
          }
        })
      },
      getReanalUser(){
        getReanalUser().then(resp => {
          this.reanalUserList = [ // 获取在办人创建人列表
            {
              label:'全部',
              options: [{
                fullName:'全部',
                userName:''
              }]
            },
            {
              label:resp[0].fullName,
              options: resp[0].userList
            },
            {
              label:resp[1].fullName,
              options: resp[1].userList
            },
          ]
        })

      },



    },
    created() {
      
    },
    mounted() {
      this.getReanalUser() // 初始加载在办人创建人列表


    },
    beforeDestroy() {
    }
  }
</script>

<style lang="less" scoped>
  .queryConditionsBox{
    .el-form{
      margin-top:20px;
    }
  }
  
</style>
