<template>
  <div>
  	<breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card style="height:57px">
    	<el-tabs v-model="activename"  @tab-click="handleClick">
        <el-tab-pane label="按会员查询" name="one">
        </el-tab-pane>
        <el-tab-pane label="按账户查询" name="two">
        </el-tab-pane> 
      </el-tabs>
    </el-card>
    <memberInquire v-if="tabdispaly=='one'"></memberInquire>
    <accountInquire v-if="tabdispaly=='two'"></accountInquire>
  </div>
</template>
<script>
	import Breadcrumb from '../../common/Breadcrumb';
  import accountInquire from './accountInquire'
  import memberInquire from './memberInquire'
  export default {
		components: {
			Breadcrumb,
      accountInquire,
      memberInquire,
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
          label: '自律监管历史信息'
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