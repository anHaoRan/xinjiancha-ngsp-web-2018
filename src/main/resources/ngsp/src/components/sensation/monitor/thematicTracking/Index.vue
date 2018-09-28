<template>
    <div class="index">
        <s-table ref="announcementTable2" headerTitle="专题列表" :columns="columns" :data="totalData"
                 @getPageination="getPageination">
            <el-button type="info" size="small" slot="elCardHeader">
                新增专题
            </el-button>
            <div slot="tableHeader">
                <el-form class="form" ref="selectParams" :rules="rules" :model="selectParams" :inline="true">
                    <el-row>
                        <el-col :xl="6" :lg="8" :md="12" :sm="24">
                            <el-form-item label="">
                                <el-form-item prop="keyWorldType" style="margin-right: 0">
                                    <el-select v-model="selectParams.keyWorldType" placeholder="请选择" size="small"
                                               style="width: 100px;">
                                        <el-option :label="item.label" :value="item.value"
                                                   v-for="(item,index) of keyTypeList"
                                                   :key="index"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="keyWorld">
                                    <el-input placeholder="搜索关键词" v-model="selectParams.keyWorld" size="small">
                                    </el-input>
                                </el-form-item>
                            </el-form-item>
                        </el-col>
                        <el-col :xl="6" :lg="8" :md="12" :sm="24">
                            <el-form-item label="日期" prop="date">
                                <s-date-picker v-model="selectParams.date" is-range></s-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :xl="6" :lg="8" :md="12" :sm="24">
                            <el-form-item>
                                <el-button type="primary" size="small" @click="">查询</el-button>
                                <el-button type="info" size="small" @click="resetFrom">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </s-table>

    </div>
</template>

<script>
  import Operating from '@/components/base/Operating'
  import TendencyImg from './components/TendencyImg'

  export default {
    name: 'index',
    props: [],
    components: {
      STable: () => import('@/components/base/STable'),
      SDatePicker: () => import('@/components/base/SDatePicker')
    },
    mixins: [],
    data () {
      return {
        selectParams: {
          keyWorldType: '1',
          keyWorld: '',
          date: ['2018-07-08', '2018-07-08']
        },
        rules: {},
        keyTypeList: [
          {
            label: '标题',
            value: '1'
          },
          {
            label: '正文',
            value: '2'
          }, {
            label: '标题+正文',
            value: '3'
          }
        ],
        columns: [
          {
            field: 'a',
            align: 'left',
            width: '100',
            label: '更新时间'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '专题名称'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '主题数'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '文章总数'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '评论总数'
          }, {
            field: 'a',
            align: 'center',
            width: '100',
            label: '情感倾向',
            template: TendencyImg
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '涉及媒体数'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '截止时间'
          }, {
            field: 'a',
            align: 'left',
            width: '100',
            label: '创建人'
          }, {
            field: 'a',
            align: 'center',
            label: '操作',
            width: '200',
            template: Operating,
            buttonList: [
              {
                label: '查看',
                func: this.handlerLook
              }, {
                label: '编辑',
                func: this.handlerEdit
              }, {
                label: '分享',
                func: this.handlerShare
              }, {
                label: '删除',
                func: this.handlerDel
              }
            ]
          }
        ],
        totalData: {
          data: [
            {a: 0},
            {a: 1},
            {a: -1}
          ],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        }
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
      getPageination (pagination) {

      },
      handlerLook (pms) {
        this.$router.push({path: '/thematicTrackingDetail'})
      },
      handlerEdit (pms) {

      },
      handlerShare (pms) {

      },
      handlerDel (pms) {

      },
      resetFrom () {
        this.$refs.selectParams.resetFields()
        this.$nextTick(function () {
          this.$refs.selectParams.clearValidate()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
    .index {
        .form {
            padding: 0 20px;
        }
    }
</style>