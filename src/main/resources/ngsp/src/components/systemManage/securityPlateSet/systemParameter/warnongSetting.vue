
<!-- 市场运行监测预警指标设置 warnongSetting-->
<template>
  <div class='warnongSetting'>
    <self-form-item-component
      :nameProps='`alarm_threshold_manage`'
      :originDataProps='originDataProps'
      :formProps='form'></self-form-item-component>
  </div>
</template>
<script>
import selfFormItemComponent from './component/SelfFormItemComponent'
import {getKindData} from '@/service/systemManage'
export default {
  name: 'warnongSetting',
  components: {
    selfFormItemComponent
  },
  data() {
    return {
      originDataProps: [],
      form: {
        'SZZZ01': '',
        'BIAS01_UP': '',
        'BIAS01_DOWN': '',
        'OBV_A_UP': '',
        'OBV_A_DOWN': '',
        'OBV_E_UP': '',
        'OBV_E_DOWN': '',
        'OBV_I_UP': '',
        'OBV_I_DOWN': '',
        'OBV_M_UP': '',
        'OBV_M_DOWN': '',
        'OBV_O_UP': '',
        'OBV_O_DOWN': '',
        'OBV_1_UP': '',
        'OBV_1_DOWN': '',
        'OBV_F_UP': '',
        'OBV_F_DOWN': ''
      }
    }
  },
  methods: {
    ajaxGetKindData() {
      let param = {
        appCode: 'fluct',
        moduleCode: 'alarm_threshold_manage'
      }
      getKindData(JSON.stringify(param)).then((res) => {
        if (res) {
          this.originDataProps = res
        }
      })
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.ajaxGetKindData()
  }
}
</script>
<style lang='less' scoped>
  .warnongSetting{

  }
</style>
