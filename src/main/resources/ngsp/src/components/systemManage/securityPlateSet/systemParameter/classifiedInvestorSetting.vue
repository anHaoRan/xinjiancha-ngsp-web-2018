
<!-- 自定义分类投资者设置 classifiedInvestorSetting-->
<template>
  <el-card class="classifiedInvestorSetting">
    <el-row :gutter="20">
      <el-col :span="8">
        <slider-custom-list
          :loadingProps="loading"
          @reqClassifyinvestorList="reqClassifyinvestorList"
          @reqConnectinvestoraccounts="reqConnectinvestoraccounts"
          :sliderListProps="sliderList"
          :currentDialogName="`classifiedInvestorSetting`"
          ></slider-custom-list>
      </el-col>
      <el-col :span="16" class="rightBox">
        <right-selected-tags-component
          ref="rightSelectedTagsComponentRef"
          :loadingProps="loading"
          :totalNumProps.sync="totalNum"
          :currentDialogName="`classifiedInvestorSetting`"
          @reqConnectinvestoraccounts="reqConnectinvestoraccounts"
          :tagsProps="investorTagsProps"
        ></right-selected-tags-component>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import {G_C_NOTE_LAZY_LOAD} from '@/utils/constants'
import sliderCustomList from './component/SliderCustomList'
import rightSelectedTagsComponent from './component/RightSelectedTagsComponent'
import {
  getClassifyinvestorList,
  getConnectinvestoraccounts
} from '@/service/systemManage/securityPlateSet'
import {mapGetters} from 'vuex'
export default {
  name: 'classifiedInvestorSetting',
  components: {
    sliderCustomList,
    rightSelectedTagsComponent
  },
  data() {
    return {
      totalNum: 0,
      loading: false,
      sliderList: [],
      investorTagsProps: [] // 通过接口返回全量的tag list
    }
  },
  computed: {
    ...mapGetters(['getcurrentOrgCode'])
  },
  methods: {
    // 通过所选投资者获取已关联tableData
    reqConnectinvestoraccounts(item) {
      let params = {
        pageRows: item ? item.pageRows : 10,
        pageIndex: item ? item.pageIndex : 1,
        orgcode: this.getcurrentOrgCode
      }
      this.loading = true
      getConnectinvestoraccounts(params).then(resp => {
        this.loading = false
        if (resp) {
          const {buzidata, totalNum} = resp
          if (buzidata.length) {
            this.totalNum = totalNum
          } else {
            this.totalNum = 0
          }
          if (params.pageIndex === 1) {
            this.investorTagsProps = buzidata
            setTimeout(() => {
              this.$refs['rightSelectedTagsComponentRef'].$refs['selfTableRef'].pageIndex = 1
              this.$refs['rightSelectedTagsComponentRef'].$refs['selfTableRef'].loadingMore = false
            })
          } else {
            this.investorTagsProps = this.investorTagsProps.concat(buzidata)
          }
          if (buzidata.length < 10) {
            setTimeout(() => {
              this.$refs['rightSelectedTagsComponentRef'].$refs['selfTableRef'].loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
            })
          } else {
            setTimeout(() => {
              this.$refs['rightSelectedTagsComponentRef'].$refs['selfTableRef'].loadingMore = false
            })
          }
        } else {
          setTimeout(() => {
            this.$refs['rightSelectedTagsComponentRef'].$refs['selfTableRef'].loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
          })
        }
      })
    },
    reqClassifyinvestorList() {
      this.loading = true
      getClassifyinvestorList().then(resp => {
        this.loading = false
        if (resp) {
          const {buzidata} = resp
          buzidata.forEach(v => {
            v.showIcons = false
          })
          this.sliderList = buzidata.map(v => {
            return {
              showIcons: v.showIcons,
              orgcode: v.org_code,
              orgname: v.org_name
            }
          })
        }
      })
      /* 重置stockList或accountList */
      if (!this.getcurrentOrgCode) {
        this.investorTagsProps = []
      }
    }
  },
  created() {
    this.$store.commit('updateCurrentOrgCode', '')
    this.reqClassifyinvestorList()
  },
  mounted() {

  }
}
</script>
<style lang="less" scoped>
  .classifiedInvestorSetting{
    padding-top: 20px;
  }
</style>
