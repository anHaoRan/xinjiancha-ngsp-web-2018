<template>
  <div class="cleaningRulesBox">
    <!--清洗规则按钮-->
    <el-button type="primary" size="small" :disabled="disabled"
      @click=" isRulesBox = true ">清洗规则
    </el-button>
    <!--清洗规则弹框-->
    <el-dialog title="清洗规则" :visible.sync="isRulesBox">
      <div class="padLeft10">
        <!--ip过滤规则-->
        <el-row>
          <el-col :span="5">
            IP过滤规则
          </el-col>
          <el-col :span="19" class="scrollY">
            <p v-for="(item,index) in ipRules"> {{ item }} <i @click="deleteRule(index,ipRules)" class="el-icon-error"></i> </p>
          </el-col>
        </el-row>
        <!--MAC过滤规则-->
        <el-row>
          <el-col :span="5">
            MAC过滤规则
          </el-col>
          <el-col :span="19" class="scrollY">
            <p v-for="(item,index) in macRules"> {{ item }} <i @click="deleteRule(index,macRules)" class="el-icon-error"></i> </p>
          </el-col>
        </el-row>
        <!--添加过滤规则-->
        <el-row>
          <el-col :span="5">
            添加过滤规则
          </el-col>
          <el-col :span="19" class="ipRuleBox">            
            <!--选择添加 IP 或 MAC-->
            <el-radio v-model="ruleType" label="ip">IP</el-radio>
            <el-radio v-model="ruleType" label="mac">MAC</el-radio>
            <!-- 添加规则按钮 -->
            <el-button type="primary" size="small" @click="addRule" class="addruleBtn">添加</el-button><br>
            <!--输入ip过滤规则-->
            <div v-if=" ruleType == 'ip' ">
              <el-input v-model="ipRule.startIP" size="small" placeholder="起始IP" clearable></el-input>
              <span> ~ </span>
              <el-input v-model="ipRule.endIP" size="small" placeholder="结束IP" clearable></el-input><br>
              <p>（注意：“起始IP”和“结束IP”如果输入同样的值，默认取一个值）</p>
            </div>
            <!--输入mac过滤规则-->
            <el-input v-if=" ruleType == 'mac' " v-model="macRule" size="small" placeholder="请输入MAC过滤规则" clearable></el-input>            
          </el-col>
        </el-row>
      
      </div>
      <!--确认取消按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click=" isRulesBox = false ">取消</el-button>
        <el-button type="primary" @click="saveRules">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  export default {
    name: 'cleaning-rules-box',
    props: ['disabled'],
    components: {},
    data() {
      return {
        isRulesBox: false,
        ruleType: 'ip',
        macRule: '',
        ipRule:{
          startIP: '',
          endIP: '',
        },
        ipRules: ['192.168.0.0~192.168.255.255','10.0.0.0~10.255.255.255','0.0.0.0','123.0.0.1','172.16.0.0~172.31.255.255'],
        macRules: ['00-00-00-00-00-00','FF-FF-FF-FF-FF-FF','0C-5B-8F-27-9A-64','02-1E-10-1F-00-00','00-1E-10-1F-00-00'],

      }
    },
    computed: {
    },
    watch: {
    },
    methods: {
      deleteRule(index,arr){ // 删除规则
        arr.splice(index,1)
      },
      addRule(){ // 添加规则
        if(this.ruleType == 'ip'){ // 添加IP规则
          if(this.ipRule.startIP != '' && this.ipRule.endIP != ''){
            if(this.ipRule.startIP == this.ipRule.endIP){
              this.ipRules.unshift(this.ipRule.startIP)
            }else{
              this.ipRules.unshift(this.ipRule.startIP+'~'+this.ipRule.endIP)
            }
            this.$message.success('添加IP过滤规则成功！')
          }else{
            this.$message.error('IP过滤规则不能为空！')
          }
          
        }else{ // 添加mac规则
          if(this.macRule == ''){
            this.$message.error('MAC过滤规则不能为空！')
          }else{
            this.macRules.unshift(this.macRule)
            this.$message.success('添加MAC过滤规则成功！')
          }
        }

      },
      saveRules(){ // 保存过滤规则
        this.isRulesBox = false
        let rules = {
          ipRules: this.ipRules,
          macRules: this.macRules
        }
        this.$emit('rules',rules)
      },

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
  .cleaningRulesBox{
    p{
      margin-top:0px;
      margin-bottom:0px;
    }
    .el-radio{
      margin-bottom:10px;
    }
    .ipRuleBox{
      .el-input{
        width:200px;
        display:inline-block;
        
      }
    }
    .addruleBtn{
      margin-left: 30px;
    }
  }
  .padLeft10{
    padding-left:10%;
  }
  .scrollY{
    overflow-y: scroll;
    height: 200px;
    i{
      margin-left: 10px;
      cursor: pointer;
    }
  }

</style>
