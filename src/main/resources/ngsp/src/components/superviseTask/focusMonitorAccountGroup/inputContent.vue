<template>
  <div style="display: flex;align-items:center;" class="inputContent">
    <el-input v-model="scope.row[item.field]" :class="scope.row.readonly?'borderNone':''" size="small"
              :readonly="scope.row.readonly" @blur="getAccountInfoData"/>
  </div>
</template>

<script>
  import {getAccountInfo} from '../../../service/superviseTask/focusAccountGroup/index'

  export default {
    name: 'reason',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data() {
      return {
        isActive: true,
        accountCode: ''
      }
    },
    computed: {},
    watch: {},
    methods: {
      getAccountInfoData() {
        if (this.item.field == 'accountId') {
          this.accountCode = this.scope.row[this.item.field]
          getAccountInfo(this.accountCode).then(resp => {
            let result = resp.bizData.metaData[0]
            this.scope.row.accountName = result.accountPeople
            this.scope.row.memberName = result.member
            this.scope.row.ymtAccountId = result.oneword
          })
        }
      }
    },
    created() {
    },
    mounted() {
      if (this.item.field == 'accountId') {
        this.accountCode = this.scope.row[this.item.field]
        if (this.accountCode) {
          getAccountInfo(this.accountCode).then(resp => {
            let result = resp.bizData.metaData[0]
            this.scope.row.accountName = result.accountPeople
            this.scope.row.memberName = result.member
            this.scope.row.ymtAccountId = result.oneword
          })
        }
      }
    },
    beforeDestroy() {
    }
  }
</script>

<style lang="less">
  .inputContent {
    input {
      text-align: center;
    }
    .borderNone {
      input {
        border: none !important;
      }
    }
  }
</style>
