<template>
    <div class="threshold-table">
        <el-popover
                @show="handlerShowPopover"
                popper-class=""
                placement="right"
                width="150"
                trigger="hover">
            <div>
                <!--<div v-for="(items,index) in scope.row[item.field].children" :key="index">-->
                <!--{{items}}-->
                <!--</div>-->
            </div>
            <span slot="reference">{{scope.row[item.field]}}</span>
        </el-popover>
    </div>
</template>

<script>
  import { getRuleParamLimit } from '@/service/earlyWarning'

  export default {
    name: 'threshold-table',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {
        data: []
      }
    },
    computed: {},
    watch: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      handlerShowPopover () {
        this.ajaxGetRuleParamLimit()
      },
      ajaxGetRuleParamLimit () {
        getRuleParamLimit({ruleCode: this.scope.row[this.item.field]}).then(res => {
          this.data = res.bizData.metaData
        })
      }
    }
  }
</script>

<style lang="less" scoped>
    .threshold-table {
    }
</style>