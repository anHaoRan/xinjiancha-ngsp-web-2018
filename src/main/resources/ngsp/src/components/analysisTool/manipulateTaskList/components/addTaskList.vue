<template>
  <div class="addTaskBox">
    <!--新建操纵任务-按钮-->
    <el-button type="primary" size="small" @click=" isAddTaskDialog = true ">新建操纵分析任务</el-button>
    <!--新建操纵任务-弹框-->
    <el-dialog title="新建操纵分析任务" :visible.sync="isAddTaskDialog">
      <el-form :model="selectParams" :rules="rules" ref="ruleForm" size="small" label-width="200px">
        <el-form-item label="证券代码：" prop="secCode">
          <stock-code-query :commonData="submitData" ref="StockCodeQuery" :clearable='false' style="display: inline-flex"
          @getStockCode="getStockCode"/>
        </el-form-item>
        <el-form-item label="创建类型：" prop="dataType">
            <el-select v-model="selectParams.dataType" size="small" style="width: 120px">
              <el-option label="手工创建" value="1"/>
            </el-select>
        </el-form-item>
        <el-form-item label="反馈单位：" prop="replyComp">
            <el-select v-model="selectParams.replyComp" size="small" style="width: 120px">
              <el-option label="稽查局" value="1"/>
            </el-select>
        </el-form-item>
        <el-form-item label="案件类型：" prop="caseType">
            <el-select v-model="selectParams.caseType" size="small" style="width: 120px">
              <el-option label="跨期操纵" value="1"/>
              <el-option label="短线操纵" value="2"/>
            </el-select>
          </el-form-item>
          
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addTaskList('ruleForm')">确定</el-button>
        <el-button type="info" @click=" isAddTaskDialog = false ">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  export default {
    name: 'add-task-list',
    props: {
      
    },
    components: {
      StockCodeQuery: () => import('@/components/common/StockCodeQuery')
      
    },
    mixins: [],
    data () {
      return {
        isAddTaskDialog: false,
        selectParams: { // 查询条件表单
          secCode: '',
          secName: '',
          dataType: '1',
          replyComp: '1',
          caseType: '1'

        },
        rules: { // 查询条件表单验证
          secCode: [
            {required: true, message: '请输入证券代码', trigger: 'blur'}
          ],
          dataType: [
            {required: true, message: '请选择创建类型', trigger: 'change'}
          ],
          replyComp: [
            {required: true, message: '请选择反馈单位', trigger: 'change'}
          ],
          caseType: [
            {required: true, message: '请选择案件类型', trigger: 'change'}
          ],
        },
        submitData: {disabled: false, secSubTypecode: 'ASH', stockCode: ''},
        
          
      }
    },
    computed: {
      
    },
    watch: {
      
    },
    methods: {
      getStockCode(stockCodeData) {
        if (stockCodeData) {
          let [indexCode, indexName] = stockCodeData.split(' ')
          this.selectParams.secCode = indexCode
          this.selectParams.secName = indexName
        }
      },
      addTaskList(formName){ // 新增
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.isAddTaskDialog = false
            this.$emit('addTaskList', this.selectParams)
          }
        })
         
      },
      
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style scoped>
  .addTaskBox{
    position:absolute;
    top: 5px;
    right:15px;
  }  
  .dialog-footer{
    height:40px;
  }

</style>
