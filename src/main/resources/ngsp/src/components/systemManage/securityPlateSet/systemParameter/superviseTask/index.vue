<template>
  <div>
    <el-card>
      <el-tabs v-model="activeTab" type="card" class="self-tabs-class">
        <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item" :name="String(index)"></el-tab-pane>
      </el-tabs>
      <div v-if="activeTab === '0'">
        <system-letter-send-setting :propsParamsList="systemLetterSendParams" @updateParams="getParams"></system-letter-send-setting>
      </div>
    </el-card>
  </div>
</template>
<script>
  import SystemLetterSendSetting from './component/SystemLetterSendSetting'
  import {getKindData} from '@/service/systemManage'
  export default {
    components: {SystemLetterSendSetting},
    data() {
      return {
        tabs: ['系统发函参数设置'],
        activeTab: '0',
        systemLetterSendParams: [],
        getParamsByActiveTabMapParams: [ // 入参
          {
            appCode: 'bpm', moduleCode: 'bpm_switch'
          }
        ]
      }
    },
    watch: {
      activeTab() {
        this.getParams()
      }
    },
    methods: {
      getParams() {
        getKindData(JSON.stringify(this.getParamsByActiveTabMapParams[this.activeTab])).then(resp => {
          this.systemLetterSendParams = resp
        })
      }
    },
    mounted() {
      this.getParams()
    }
  }
</script>