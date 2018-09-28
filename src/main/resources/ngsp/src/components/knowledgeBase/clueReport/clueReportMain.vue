<template>
  <div>
  	<breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card style="height:57px">
    	<el-tabs v-model="activename"  @tab-click="handleClick">
        <el-tab-pane label="按报告查询" name="one">
        </el-tab-pane>
        <el-tab-pane label="按账户查询" name="two">
        </el-tab-pane> 
      </el-tabs>
    </el-card>
    <reportInquire v-if="tabdispaly=='one'"></reportInquire>
    <accountInquire v-if="tabdispaly=='two'"></accountInquire>
  </div>
</template>
<script>
	import Breadcrumb from '../../common/Breadcrumb';
  import reportInquire from './reportInquire'
  import accountInquire from './accountInquire'
  export default {
		components: {
			Breadcrumb,
      reportInquire,
      accountInquire,
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
          label: '线索报告历史信息'
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