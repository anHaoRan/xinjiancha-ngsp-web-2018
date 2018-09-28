<template>
  <div class="sec-account-trade-caliber">
    <p class="sec-title">
      概述
    </p>
    <ul>
      <li>
        <p>
          按选定的条件，查询某些股东账户在某段时间范围指定证券的交易情况
        </p>
      </li>
      <li>
        <p>
          并且可以支持 日期，股东账户，证券代码的向上钻取操作
        </p>
      </li>
      <li>
        <p>
          选择日期向上钻取，结果显示为按股东账户、证券代码，对买卖的合计
        </p>
      </li>
      <li>
        <p>
          选择股东账户向上钻取，结果显示为按日期、证券代码，对买卖的合计
        </p>
      </li>
      <li>
        <p>
          选择证券代码向上钻取，结果显示为按日期、股东账户，对买卖的合计
        </p>
      </li>
      <li>
        <p>
          查询范围包括竞价交易和大宗交易。
        </p>
      </li>
    </ul>
    <p class="sec-title">
      说明
    </p>
    <ul>
      <li>
        <p>
          1.	股东姓名：如果某股东账户在查询的日期范围内做了姓名修改，则在按日期上钻汇总的时候，显示的股东姓名为日期范围内最新的姓名
        </p>
      </li>
      <li>
        <p>
          2.	交易营业部:该股东账户所指定席位所在的营业部，如果某股东账户在查询的日期范围内做了转指定，则在按日期上钻汇总的时候，显示交易营业部为股东账户为日期范围内最后所在的营业部
        </p>
      </li>
      <li>
        <p>
          3.  买入均价：SUM(买入金额) / SUM(买入数量)
        </p>
      </li>
      <li>
        <p>
          4.  买入数量：单位（股）
        </p>
      </li>
      <li>
        <p>
          5.  买入金额：单位（元）
        </p>
      </li>
      <li>
        <p>
          6.  卖出均价：SUM(卖出金额) / SUM(卖出数量)
        </p>
      </li>
      <li>
        <p>
          7.  卖出数量：单位（股）
        </p>

      </li>
      <li>
        <p>
          8.  卖出金额：单位（元）
        </p>
      </li>
      <li>
        <p>
          9.  买成交数量占比 = 当日该账户对该证券买成交数量/当日该证券成交数量合计。计算该指标时不考虑会员营业部维度。
        </p>
      </li>
      <li>
        <p>
          10. 卖成交数量占比 = 当日该账户对该证券卖成交数量/当日该证券成交数量合计。计算该指标时不考虑会员营业部维度。
        </p>
      </li>
    </ul>
    <h2>非交易过户明细表</h2>
    <ul>
      <li>
        <p>
          1、	数据源只采用为中登公司提供给数据仓库的非交易过户数据。
        </p>
      </li>
      <li>
        <p>
          2、	结果展示时，所涉及的“过户类型”、“股本类型”、“流通类型”不做转化，按原始数据输出。
        </p>
      </li>
      <li>
        <p>
          3、	原始中提出需要“成交方向”字段，但经核实中登公司提供的数据中没有“成交方向”或类似的、含义相近的字段。所以在本应用结果集中不展示“成交方向”字段。
        </p>
      </li>
      <li>
        <p>
          4、	原始需求中部分字段与中登公司接口描述不一致，建议按照中登的字段展示
        </p>
        <div>
          <el-table
            :data="tableData"
            border
            size="small"
            style="width: 100%;">
            <el-table-column
              v-for="(item, index) in columns"
              align="center"
              :key="index"
              :label="item.label"
              :prop="item.field">
            </el-table-column>
          </el-table>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      tableData: [
        {
          aDol1: '过户类型',
          aDol2: '变动类型',
          aDol3: '变动类型'
        },
        {
          aDol1: '股本类型',
          aDol2: '证券类型',
          aDol3: '证券类型'
        }
      ],
      columns: [
        {id: 'aCaliber1', label: '原始需求结果字段', field: 'aDol1'},
        {id: 'aCaliber2', label: '对应中登接口字段', field: 'aDol2'},
        {id: 'aCaliber3', label: '本应用展示字段', field: 'aDol3'}
      ]
    }
  },
  methods: {
    spanMethods({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .sec-account-trade-caliber {
    p {
      font-size: 16px;
      line-height: 30px;
      margin: 4px 0;
    }
    .sec-title {
      margin: 0;
      padding-left: 20px;
    }
    h2 {
      margin: 5px 0;
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>
