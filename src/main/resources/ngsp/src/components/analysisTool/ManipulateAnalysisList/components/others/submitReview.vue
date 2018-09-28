<template>
  <div class="submitReviewBox">
    <!--提交复核按钮-->
    <el-button type="primary" size="small"
      @click="handleSubmitReview">提交复核
    </el-button>
    <!--提交复核弹框-->
    <el-dialog title="提交复核" :visible.sync="isRulesBox">
      <!-- 选择复核人员 -->
      <el-form ref="form" :model="reviewForm" label-width="200px">
        <el-form-item label="请选择复核人员：">
          <el-select v-model="reviewForm.reviewer" clearable>
            <el-option-group
              v-for="group in reviewerList"
              :key="group.label"
              :label="group.label">                
              <el-option v-for="item in group.options" 
              :key="item.userName" :label="item.fullName" :value="item.userName+' '+item.fullName"/>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <!--确认取消按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click=" isRulesBox = false ">取消</el-button>
        <el-button type="primary" @click="submitReviewSure">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { submitReview } from '@/service/analysisTool/ManipulateAnalysisList/index'

  export default {
    name: 'submit-review',
    props: ['isSave'],
    components: {},
    data() {
      return {
        isRulesBox: false,
        reviewForm:{
          reviewer: '',
        },
        reviewerList:[],

      }
    },
    computed: {
    },
    watch: {
    },
    methods: {
      handleSubmitReview(){
        if(this.isSave == true){
          this.isRulesBox = true
          submitReview().then(resp => {
            this.reviewerList = [ // 获取复核人列表
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
        }else{
          this.$message.warning('请保存账户列表！')
        }
        

      },
      submitReviewSure(){ // 提交复核-确定
        this.isRulesBox = false
        this.$emit('submitReviewSure',this.reviewForm.reviewer)
      }, 

    },
    created() {
    },
    mounted() {
      // 初始化默认复核人员为组长
      submitReview().then(resp => {
        this.reviewForm.reviewer = resp[0].userList[0].userName+' '+resp[0].userList[0].fullName
      })


    },
    beforeDestroy() {
    }
  }
</script>

<style lang="less" scoped>
  .submitReviewBox{
    display: inline-block;
    margin: 0 10px;
    

  }

</style>
