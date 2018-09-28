<template>
  <div>
    <div v-if="hide" class="moreCheck">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
      </el-checkbox>
      <div style="margin: 15px 0"></div>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
  const itemList = ['公募基金', '基金专户', '社保基金', 'QFII', 'RQEII', '保险机构', '信托与私募', '企业年金', '券商自营', '券商集合理财', '沪股通', '其它机构',
    '超大户(1000万元以上)', '大户(300-1000万元)', '中户(50-300万元)', '小户(10-50万元)', '散户(10万元以下)']

  const compare = [{A: '公募基金'}, {C: '基金专户'}, {D: '社保基金'}, {E: 'QFII'}, {M: 'RQEII'}, {F: '保险机构'}, {I: '信托与私募'}, {J: '企业年金'}, {G: '券商自营'},
    {H: '券商集合理财'}, {O: '沪股通'}, {Z: '其它机构'}, {1: '超大户(1000万元以上)'}, {2: '大户(300-1000万元)'}, {3: '中户(50-300万元)'}, {4: '小户(10-50万元)'},
    {5: '散户(10万元以下)'}]

  const compared = ['A', 'C', 'D', 'E', 'M', 'F', 'I', 'J', 'G', 'H', 'O', 'Z', '1', '2', '3', '4', '5']

  // itemList，compare，compared 需要从父组件中获取
  export default {
    props: ['itemList', 'compare', 'compared'],
    data () {
      return {
        hide: false,
        isIndeterminate: true,
        checkedCities: [],
        cities: itemList,
        investor: '', // 输入框要显示的投资者类别
        invstClasses: '' // 向后台传递的分类投资者数据
      }
    },
    methods: {
      handleCheckAllChange (val) {
        if (val) {
          this.investor = this.cities.join(',')
          this.invstClasses = compared.join(',')
        } else {
          this.investor = ''
          this.invstClasses = ''
        }
        this.checkedCities = val ? cityOptions : []
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange (value) {
        let str = []
        this.invstClasses = value
        this.invstClasses.forEach((el) => {
          compare.forEach((obj) => {
            for (var k in obj) {
              if (obj[k] == el) {
                el = k
              }
            }
          })
          str.push(el)
        })
        // 传递给后台的分类投资者
        this.invstClasses = str.join(',')
        // 输入框显示的投资者(字符串形式)
        this.investor = value.join(',')
        let checkedCount = value.length
        this.checkAll = (checkedCount === this.cities.length)
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
      }
    }
  }
</script>

<style scoped lang="less">
  .moreCheck {
    background-color: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #ccc;
    position: absolute;
    width: 72%;
    left: 90px;
    top: 35px;
    z-index: 1000;
    color: #000;
    .el-checkbox {
      margin-left: 15px;
    }
    .el-checkbox-group {
      .el-checkbox {
        margin-left: 15px;
      }
    }
    span {
      color: #5a5e66;
    }
  }

  .moreCheck .el-checkbox__inner::after {
    border: 1px solid #999;
    border-left: 0;
    border-top: 0
  }
</style>
