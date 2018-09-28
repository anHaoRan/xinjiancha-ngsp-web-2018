<template>
  <div>
  	<breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card style="height:57px">
    	<el-tabs v-model="activename"  @tab-click="handleClick">
        <el-tab-pane label="按处罚单查询" name="one">
        </el-tab-pane>
        <el-tab-pane label="按账户查询" name="two">
        </el-tab-pane> 
      </el-tabs>
    </el-card>
    <punishmentInquire v-if="tabdispaly=='one'"></punishmentInquire>
    <accountInquire v-if="tabdispaly=='two'"></accountInquire>
  </div>
</template>
<script>
	import Breadcrumb from '../../common/Breadcrumb';
  import accountInquire from './accountInquire'
  import punishmentInquire from './punishmentInquire'
  export default {
		components: {
			Breadcrumb,
      accountInquire,
      punishmentInquire,
		},
    data() {
	    return {
	      	breadcrumbItems: [{
	        router: '',
	        label: '监管知识库'
	      },{
	        router: '',
	        label: '历史监管库'
	      },{
          router: '',
          label: '异常行为历史信息'
        }],
        activename:'one',
        tabdispaly:'one',
      }
    },
    methods:{
      handleClick(tab,event){
        if(tab.name=="one"){
          this.tabdispaly='one'
        }else{
          this.tabdispaly='two'
        }
      },
    }
 }
</script>
<style>
  
</style>