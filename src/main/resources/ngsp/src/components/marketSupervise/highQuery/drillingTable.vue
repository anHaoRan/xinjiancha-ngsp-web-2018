<template>
  <div class='drillingTable'>
    <el-row :gutter='40' style='margin-top: 20px'>
      <el-col :span='12'>
        <table-one></table-one>
      </el-col>
      <div class='icon' v-if='tableOneStatus'>
        <i class='el-icon-arrow-right'></i>
      </div>
      <el-col :span='12'>
        <table-two v-if='tableOneStatus'></table-two>
      </el-col>
    </el-row>
    <el-row :gutter='40' v-if='tableTwoStatus'>
      <el-col :span='12' style='height: 50px'></el-col>
      <el-col :span='12' style='padding: 10px 20px;text-align: center'>
        <i class='el-icon-arrow-down' style='font-size: 30px'></i>
      </el-col>
    </el-row>
    <el-row :gutter='40'>
      <el-col :span='12' style='min-height: 1px'>
        <table-four v-if='tableThreeStatus'></table-four>
      </el-col>
      <div class='icon' v-if='tableThreeStatus'>
        <i class='el-icon-arrow-left'></i>
      </div>
      <el-col :span='12'>
        <table-three v-if='tableTwoStatus'></table-three>
      </el-col>
    </el-row>
    <el-row :gutter='40' v-if='tableFourStatus'>
      <el-col :span='12' style='padding: 10px 20px;text-align: center'>
        <i class='el-icon-arrow-down' style='font-size: 30px'></i>
      </el-col>
      <el-col :span='12' style='height: 50px'></el-col>
    </el-row>
    <el-row :gutter='40'>
      <el-col :span='12' style='min-height: 1px'>
        <table-five v-if='tableFourStatus'></table-five>
      </el-col>
      <div class='icon' v-if='tableFiveStatus'>
        <i class='el-icon-arrow-right'></i>
      </div>
      <el-col :span='12'>
        <table-six v-if='tableFiveStatus'></table-six>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  import TableOne from './drillingTable/tableOne'
  import TableTwo from './drillingTable/tableTwo'
  import TableThree from './drillingTable/tableThree'
  import TableFour from './drillingTable/tableFour'
  import TableFive from './drillingTable/tableFive'
  import TableSix from './drillingTable/tableSix'

  export default {
    components: {
      TableOne,
      TableTwo,
      TableThree,
      TableFour,
      TableFive,
      TableSix
    },
    data() {
      return {}
    },
    mounted() {
    },
    computed: {
      brushTimeParams() {
        return this.$store.state.highQuery.brushTime
      },
      tableOneStatus() {
        return this.$store.state.highQuery.tableOne.status
      },
      tableTwoStatus() {
        return this.$store.state.highQuery.tableTwo.status
      },
      tableThreeStatus() {
        return this.$store.state.highQuery.tableThree.status
      },
      tableFourStatus() {
        return this.$store.state.highQuery.tableFour.status
      },
      tableFiveStatus() {
        return this.$store.state.highQuery.tableFive.status
      }
    },
    methods: {}
  }
</script>

<style lang='less'>
  .drillingTable {
    .el-card {
      margin-top: 0px !important;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__nav-wrap {
      padding: 0px !important;
    }
    .el-tabs__nav-scroll {
      padding-left: 0px !important;
      .el-tabs__nav {
        border: none !important;
        .el-tabs__item.is-active {
          border: none !important;
          background-color: rgba(0, 0, 0, 0.3);
        }
        .el-tabs__item {
          margin-bottom: 2px;
          font-size: 14px !important;
          height: 50px !important;
          line-height: 50px !important;
          border: none !important;
          background-color: rgba(0, 0, 0, 0.09);
          text-align: center;
        }
      }
    }
    .el-table {
      th {
        border-right: 1px solid #1b2b4e !important;
      }
    }
    .el-tabs__nav {
      .is-disabled {
        background-color: rgba(255, 255, 255, 0.09) !important;
        cursor: not-allowed
      }
    }
    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      i {
        font-size: 30px;
      }
    }
    .up {
      color: #ff402b;
    }
    .down {
      color: #12bba5;
    }
    .dealCount {
      color: #3a8ce9 !important;
    }
    .dealMoney {
      color: #c93 !important;
    }
  }
</style>
