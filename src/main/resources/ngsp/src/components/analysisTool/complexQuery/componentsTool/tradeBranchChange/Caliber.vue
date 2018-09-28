<template>
  <div class="trade-branch-change-caliber">
    <p class="trade-branch-title">
      1、	数据仓库现有Stat_Seat_Code及PBU与营业部对应关系数据情况说明：
    </p>
    <el-table
      :data="tableData"
      :span-method="spanMethods"
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
    <p>请监察部用户在使用本应用时参考以上表格中描述的数据准确性信息。
      因为2001年之前的Stat_Seat_Code及PBU与营业部对应关系数据缺失，所以本应用只能提供自2001年初起至今的数据。
    </p>
    <p class="trade-branch-title">
      2、	“账户交易营业部变更情况”的结果数据按照以下算法规则生成：下面以股东账户“A000000001”为例，多个股东账户的情况可以依此类推。
    </p>
    <ul>
      <li>
        <p>(1)	先取出该股东账户自2001-01-02至今所有的“成交明细数据”，不含大宗交易数据。</p>
      </li>
      <li>
        <p>(2)	依次按照“成交日期”、“成交时间”、“成交编号”排序，生成该账户由早期至近期的成交时间序列。假设整个序列共有10条记录，那么“成交时间序列”中的第1条记录简称“序列记录1”，第2条记录简称“序列记录2”……第10条记录简称“序列记录10”</p>
      </li>
      <li>
        <p>(3)	根据“序列记录1”，生成一条查询结果记录。此时，查询结果各条记录各个字段的值如下：</p>
        <div>
          <el-table
            :data="tableData1"
            border
            size="small"
            style="width: 100%;">
            <el-table-column
              v-for="(item, index) in columns1"
              align="center"
              :key="index"
              :label="item.label"
              :prop="item.field">
            </el-table-column>
          </el-table>
        </div>
      </li>
      <li>
        <p>(4)	假设“序列记录2”的“Stat_Seat_Code”对应的“会员代码”和“营业部代码”与“序列记录1” 的“Stat_Seat_Code”对应的“会员代码”和“营业部代码”完全相同。所以认为它们的“交易营业部”完全一致，不生成新的结果记录。</p>
      </li>
      <li>
        <p>
          (5)	假设“序列记录3”的“Stat_Seat_Code”对应的“会员代码”和“营业部代码”与“序列记录1” 的“Stat_Seat_Code”对应的“会员代码”和“营业部代码”不相同（可能是“会员代码”不同、“营业部代码”相同，或者“会员代码”相同、“营业部代码”不同，或者“会员代码”和“营业部代码”都不同）。所以认为它们的“交易营业部”不一致，账户“A000000001”的交易营业部发生了变更，需要生成一条新的结果记录。此时，查询结果各条记录各个字段的值如下：
        </p>
        <div>
          <el-table
            :data="tableData2"
            border
            size="small"
            style="width: 100%;">
            <el-table-column
              v-for="(item, index) in columns2"
              align="center"
              :key="index"
              :label="item.label"
              :prop="item.field">
            </el-table-column>
          </el-table>
        </div>
      </li>
      <li>
        <p>(6)	假设“序列记录4”、“序列记录5”的“Stat_Seat_Code”对应的“会员代码”和“营业部代码”与“序列记录3” 的完全相同。所以认为它们的“交易营业部”完全一致，不生成新的结果记录。</p>
      </li>
      <li>
        <p>
          (7)	假设“序列记录6”的“Stat_Seat_Code”对应的“会员代码”和“营业部代码”与“序列记录3” 的不同。所以认为它们的“交易营业部”不一致，账户“A000000001”的交易营业部发生了变更，需要生成一条新的结果记录。此时，查询结果各条记录各个字段的值如下：
        </p>
        <div>
          <el-table
            :data="tableData3"
            border
            size="small"
            style="width: 100%;">
            <el-table-column
              v-for="(item, index) in columns3"
              align="center"
              :key="index"
              :label="item.label"
              :prop="item.field">
            </el-table-column>
          </el-table>
        </div>
      </li>
      <li>
        <p>
          (8)	假设“序列记录7”、“序列记录8”、“序列记录9”、“序列记录10”的“Stat_Seat_Code”对应的“会员代码”和“营业部代码”与“序列记录6” 的完全相同。所以认为它们的“交易营业部”完全一致，但因为“序列记录10”是最后一条记录，所以需要更新结果记录中的最后一条记录。此时，查询结果各条记录各个字段的值如下：
        </p>
        <div>
          <el-table
            :data="tableData3"
            border
            size="small"
            style="width: 100%;">
            <el-table-column
              v-for="(item, index) in columns3"
              align="center"
              :key="index"
              :label="item.label"
              :prop="item.field">
            </el-table-column>
          </el-table>
        </div>
      </li>
      <li>
        <p>以上表格就是最终展现给用户的结果数据</p>
      </li>
    </ul>
    <p class="trade-branch-title">
      3、	“账户指定交易变动情况”的结果数据按照以下算法规则生成：下面以股东账户“A000000001”为例，多个股东账户的情况可以依此类推。
    </p>
    <ul>
      <li>
        <p>(1)	先取出该股东账户自2001-01-02至今所有的“指定交易变动数据”，新交易系统上线前取“证券代码”为799999和799998的记录，新交易系统上线后取“业务代码”为DT和DC的记录。</p>
      </li>
      <li>
        <p>(2)	在新交易系统上线前（2009-11-20及以前），以“指定交易变动数据”中每条记录的“证券代码”为依据，来判断该账户的变动类型。在新交易系统上线后（2009-11-23及以后），以“指定交易变动数据”中每条记录的“业务代码”为依据，来判断该账户的变动类型。</p>
        <div class="table-data4">
          <el-table
            :data="tableData4"
            border
            size="small"
            style="width: 100%;">
            <el-table-column
              v-for="(item, index) in columns4"
              align="center"
              :key="index"
              :label="item.label"
              :prop="item.field">
            </el-table-column>
          </el-table>
        </div>
      </li>
      <li>
        <p>(3)	查询结果数据中的“对应PBU”是指“指定交易变动数据” 中每条记录的“PBU代码”（或者“席位代码”），“对应营业部”是指根据“对应PBU”获取得到的“会员营业部名称”。</p>
      </li>
      <li>
        <p>(4)	结果数据中，“变动类型”为“指定”的记录，其“对应PBU”和“对应营业部”为变动后的状态。“变动类型”为“撤销”的记录，其“对应PBU”和“对应营业部”为变动前的状态。</p>
      </li>
    </ul>
    <p class="trade-branch-title">
      4、	根据“Stat_Seat_Code”或者“PBU代码”获取得到的会员营业部信息包含基金及非会员（基金、非会员都不还原为出租PBU的会员）。这与市场监察部当前使用的“席位与会员营业部对应关系数据”的口径一致。    </p>
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
          col1: '无数据仓库时期',
          col2: '自建所以来',
          col3: '2001-01-01',
          col4: '×',
          col5: '×',
          col6: '无数据'
        },
        {
          col1: '无数据仓库时期',
          col2: '2001-01-02',
          col3: '2003-01-15',
          col4: '×',
          col5: '√',
          col6: '数据从历史光盘、磁带中恢复，有些不一定不准确'
        },
        {
          col1: '数据仓库建成，开始每日加载',
          col2: '2003-01-16',
          col3: '2004-05-09',
          col4: '×',
          col5: '√',
          col6: '数据准确'
        },
        {
          col1: '数据仓库建成，开始每日加载',
          col2: '2004-05-10',
          col3: '至今',
          col4: '√',
          col5: '√',
          col6: '数据准确'
        }
      ],
      columns: [
        {id: 'caliber1', label: '阶段', field: 'col1'},
        {id: 'caliber2', label: '起始日期', field: 'col2'},
        {id: 'caliber3', label: '结束日期', field: 'col3'},
        {id: 'caliber4', label: 'Stat_Seat_Code与营业部对应关系', field: 'col4'},
        {id: 'caliber5', label: 'PBU与营业部对应关系', field: 'col5'},
        {id: 'caliber6', label: '备注', field: 'col6'}
      ],
      tableData1: [
        {
          aCol1: 'A000000001',
          aCol2: '序列记录1的“成交日期”',
          aCol3: '序列记录1的“Stat_Seat_Code”对应的会员营业部名称',
          aCol4: '序列记录1的“成交PBU”',
          aCol5: '不填',
          aCol6: '不填',
          aCol7: '不填'
        }
      ],
      columns1: [
        {id: 'aCaliber1', label: '股东账户', field: 'aCol1'},
        {id: 'aCaliber2', label: '交易营业部变更日', field: 'aCol2'},
        {id: 'aCaliber3', label: '自该变更日起账户交易营业部', field: 'aCol3'},
        {id: 'aCaliber4', label: '自该变更日起账户交易PBU', field: 'aCol4'},
        {id: 'aCaliber5', label: '账户最近交易日', field: 'aCol5'},
        {id: 'aCaliber6', label: '账户最近交易营业部', field: 'aCol6'},
        {id: 'aCaliber7', label: '账户最近交易PBU', field: 'aCol7'}
      ],
      tableData2: [
        {
          aBol1: 'A000000001',
          aBol2: '序列记录1的“成交日期”',
          aBol3: '序列记录1的“Stat_Seat_Code”对应的会员营业部名称',
          aBol4: '序列记录1的“成交PBU”',
          aBol5: '不填',
          aBol6: '不填',
          aBol7: '不填'
        },
        {
          aBol1: 'A000000001',
          aBol2: '序列记录3的“成交日期”',
          aBol3: '序列记录3的“Stat_Seat_Code”对应的会员营业部名称',
          aBol4: '序列记录3的“成交PBU”',
          aBol5: '不填',
          aBol6: '不填',
          aBol7: '不填'
        }
      ],
      columns2: [
        {id: 'aCaliber1', label: '股东账户', field: 'aBol1'},
        {id: 'aCaliber2', label: '交易营业部变更日', field: 'aBol2'},
        {id: 'aCaliber3', label: '自该变更日起账户交易营业部', field: 'aBol3'},
        {id: 'aCaliber4', label: '自该变更日起账户交易PBU', field: 'aBol4'},
        {id: 'aCaliber5', label: '账户最近交易日', field: 'aBol5'},
        {id: 'aCaliber6', label: '账户最近交易营业部', field: 'aBol6'},
        {id: 'aCaliber7', label: '账户最近交易PBU', field: 'aBol7'}
      ],
      tableData3: [
        {
          aCol1: 'A000000001',
          aCol2: '序列记录1的“成交日期”',
          aCol3: '序列记录1的“Stat_Seat_Code”对应的会员营业部名称',
          aCol4: '序列记录1的“成交PBU”',
          aCol5: '不填',
          aCol6: '不填',
          aCol7: '不填'
        },
        {
          aCol1: 'A000000001',
          aCol2: '序列记录3的“成交日期”',
          aCol3: '序列记录3的“Stat_Seat_Code”对应的会员营业部名称',
          aCol4: '序列记录3的“成交PBU”',
          aCol5: '不填',
          aCol6: '不填',
          aCol7: '不填'
        },
        {
          aCol1: 'A000000001',
          aCol2: '序列记录6的“成交日期”',
          aCol3: '序列记录6的“Stat_Seat_Code”对应的会员营业部名称',
          aCol4: '序列记录6的“成交PBU”',
          aCol5: '不填',
          aCol6: '不填',
          aCol7: '不填'
        }
      ],
      columns3: [
        {id: 'aCaliber1', label: '股东账户', field: 'aCol1'},
        {id: 'aCaliber2', label: '交易营业部变更日', field: 'aCol2'},
        {id: 'aCaliber3', label: '自该变更日起账户交易营业部', field: 'aCol3'},
        {id: 'aCaliber4', label: '自该变更日起账户交易PBU', field: 'aCol4'},
        {id: 'aCaliber5', label: '账户最近交易日', field: 'aCol5'},
        {id: 'aCaliber6', label: '账户最近交易营业部', field: 'aCol6'},
        {id: 'aCaliber7', label: '账户最近交易PBU', field: 'aCol7'}
      ],
      tableData4: [
        {
          aDol1: '799999',
          aDol2: 'DT',
          aDol3: '指定'
        },
        {
          aDol1: '799998',
          aDol2: 'DC',
          aDol3: '撤销'
        }
      ],
      columns4: [
        {id: 'aCaliber1', label: '2009-11-20及以前证券代码', field: 'aDol1'},
        {id: 'aCaliber2', label: '2009-11-23及以后业务代码', field: 'aDol2'},
        {id: 'aCaliber3', label: '对应指定交易变动类型', field: 'aDol3'}
      ]
    }
  },
  methods: {
    rowMethods({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 2) {
        if (rowIndex === 0 || rowIndex === 3) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
    },
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
  .trade-branch-change-caliber {
    p {
      font-size: 16px;
      line-height: 30px;
      margin: 4px 0;
    }
    .trade-branch-title {
      margin: 0;
      padding-left: 20px;
    }
  }
</style>
