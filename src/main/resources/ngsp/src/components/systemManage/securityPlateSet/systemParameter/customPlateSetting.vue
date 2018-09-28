
<!-- 自定义板块设置 customPlateSetting-->
<template>
  <el-card class="customPlateSetting">
    <el-row :gutter="20">
      <el-col :span="8">
        <slider-custom-list
          :loadingProps="loading"
          @reqUserdefinedBoardList="reqUserdefinedBoardList"
          @reqStockListByBoardCode="reqStockListByBoardCode"
          :sliderListProps="sliderList"
          :currentDialogName="`customPlateSetting`"
        ></slider-custom-list>
      </el-col>
      <el-col :span="16" class="rightBox">
        <right-selected-tags-component
          :sliderList="sliderList"
          @reqStockListByBoardCode="reqStockListByBoardCode"
          :loadingProps = 'loading'
          :currentDialogName="`customPlateSetting`"
          :tagsProps="stockCodeTagsProps"
        ></right-selected-tags-component>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import {mapGetters} from 'vuex'
import sliderCustomList from './component/SliderCustomList'
import rightSelectedTagsComponent from './component/RightSelectedTagsComponent'
import {
  getUserdefinedBoardList,
  getStockListByBoardCode
} from '@/service/systemManage/securityPlateSet'
export default {
  name: 'customPlateSetting',
  components: {
    sliderCustomList,
    rightSelectedTagsComponent
  },
  computed: {
    ...mapGetters(['getcurrentBoardCode'])
  },
  data() {
    return {
      stockCodeTagsProps: [],
      loading: false,
      sliderList: [] // 模板列表
    }
  },
  methods: {
    reqUserdefinedBoardList() {
      getUserdefinedBoardList({
        bizType: ''
      }).then(resp => {
        if (resp) {
          resp.forEach(v => {
            v.showIcons = false
          })
          this.sliderList = resp.map(v => {
            return {
              showIcons: v.showIcons,
              boardCode: v.board_code,
              boardName: v.board_name,
              bizType: v.biz_type,
              boardDescr: v.board_descr
            }
          })
        } else {
          this.sliderList = []
        }
      })
      /* 重置stockList或accountList */
      if (!this.getcurrentBoardCode) {
        this.stockCodeTagsProps = []
      }
    },
    // 通过板块code获取已关联stockList
    reqStockListByBoardCode(item) {
      let params = {
        rowStart: 1, // Integer!
        rowNum: 3000, // Integer
        orderBy: 'instrument_id', // String instrument_id 或instrument_chn_short_name
        orderType: 'DESC', // 或ASC
        boardCode: item ? item.boardCode : this.getcurrentBoardCode
      }
      this.loading = true
      getStockListByBoardCode(params).then(resp => {
        this.loading = false
        if (resp) {
          this.stockCodeTagsProps = resp
        } else {
          this.stockCodeTagsProps = []
        }
      })
    }
  },
  created() {
    this.$store.commit('updateCurrentBoardCode', '')
    this.reqUserdefinedBoardList()
  },
  mounted() {

  }
}
</script>
<style lang="less" scoped>
  .customPlateSetting {
    padding: 20px;
  }
</style>
