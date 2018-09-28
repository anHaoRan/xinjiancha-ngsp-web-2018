<template>
    <div class="content-header">
        <el-card>
            <div slot="header" class="clearfix">
                <span>查询条件</span>
                <el-button
                        type="primary"
                        size="small"
                        @click="select">查询
                </el-button>
            </div>
            <el-form class="form" v-if="activeName!='list1'" :inline="true">
                <el-form-item label="">
                    <el-input placeholder="搜索关键词" v-model="keyWorld" size="small">
                    </el-input>
                </el-form-item>
            </el-form>
            <div v-else class="display-list1">
                <el-radio-group v-model="publicSentimentType" size="small" class="el-radio-group">
                    <el-radio-button label="">全部（{{classifiedCount.totalCount}}）</el-radio-button>
                    <el-radio-button label="3">宏观市场（{{classifiedCount.indivCount}}）</el-radio-button>
                    <el-radio-button label="1">个股资讯（{{classifiedCount.viewCount}}）</el-radio-button>
                </el-radio-group>
                <el-form class="form" :inline="true" style="margin-top: 20px;">
                    <el-row>
                        <el-col :xl="8" :md="12" :sm="24">
                            <el-form-item label="">
                                <div style="display: flex">
                                    <el-select v-model="keyWorldType" placeholder="请选择" size="small"
                                               style="width: 100px">
                                        <el-option :label="item.label" :value="item.value"
                                                   v-for="(item,index) of keyTypeList"
                                                   :key="index"></el-option>
                                    </el-select>
                                    <el-input placeholder="搜索关键词" v-model="keyWorld" size="small">
                                    </el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :xl="8" :md="12" :sm="24">
                            <el-form-item label="媒体类型：">
                                <el-select v-model="mediaType" placeholder="请选择" size="small">
                                    <el-option :label="item.label" :value="item.value"
                                               v-for="(item,index) of mediaTypeList"
                                               :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!--<el-col :xl="8" :md="12" :sm="24">-->
                        <!--<el-form-item label="分组：">-->
                        <!--<el-select v-model="grouping" placeholder="请选择" size="small">-->
                        <!--<el-option :label="item.label" :value="item.value"-->
                        <!--v-for="(item,index) of groupingList"-->
                        <!--:key="index"></el-option>-->
                        <!--</el-select>-->
                        <!--</el-form-item>-->
                        <!--</el-col>-->
                        <el-col :xl="8" :md="12" :sm="24">
                            <el-form-item label="证券：">
                                <div @click="stockSelect">
                                    <el-input type="text" readonly="true" placeholder="请选择"
                                              :value="securityCode + securityName"
                                              size="small">
                                        {{securityCode + securityName}}
                                    </el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :xl="8" :md="12" :sm="24">
                            <el-form-item label="日期：">
                                <s-date-picker v-model="datePicker" is-range></s-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :xl="8" :md="12" :sm="24">
                            <el-form-item label="情感倾向：">
                                <el-select v-model="sentimentType" placeholder="请选择" size="small">
                                    <el-option :label="item.label" :value="item.value"
                                               v-for="(item,index) of sentimentTypeList"
                                               :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div style="display: flex">
                    排序：
                    <label :class="{'label-color':item.isActive}" v-for="(item,index) in orderField" :key="index"
                           @click="handlerSort(index)">
                        {{item.label}}<i :class="`el-icon-sort-${item.sortClass}`"></i>
                    </label>
                </div>
            </div>
        </el-card>
        <select-code-box
                v-show="stockShow"
                @getCode="getCode"
                style="position: absolute;top: 0px;z-index: 10;">
        </select-code-box>
    </div>
</template>

<script>
  import { getClassifiedCount } from '@/service/sensation/index'
  import moment from 'moment'

  export default {
    name: 'content-header',
    props: ['activeName'],
    components: {
      SDatePicker: () => import('@/components/base/SDatePicker'),
      SelectCodeBox: () => import('@/components/common/selectCodeBox')
    },
    mixins: [],
    data () {
      return {
        stockShow: false,
        securityCode: '',
        securityName: '',
        keyWorld: '',
        publicSentimentType: '',
        keyWorldType: '1',
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
        mediaType: '',
        mediaTypeList: [
          {
            label: '微信',
            value: 'weixin'
          },
          {
            label: '新闻',
            value: 'news'
          }, {
            label: '论坛',
            value: 'luntan'
          }, {
            label: '微博',
            value: 'weibo'
          }, {
            label: 'app',
            value: 'app'
          }
        ],
        grouping: '',
        groupingList: [
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
        datePicker: [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
        sentimentType: [],
        sentimentTypeList: [
          {
            label: '负面',
            value: '-1'
          },
          {
            label: '中性',
            value: '0'
          }, {
            label: '正面',
            value: '1'
          }
        ],
        orderField: [
          {
            label: '时间',
            value: 'publishTime',
            sortClass: 'down',
            isActive: true
          },
          {
            label: '转发',
            value: 'transmitNum',
            sortClass: 'down',
            isActive: false
          },
          {
            label: '媒体',
            value: 'transmitMediaNum',
            sortClass: 'down',
            isActive: false
          },
          {
            label: '评论',
            value: 'commentNum',
            sortClass: 'down',
            isActive: false
          },
          // {
          //   label: '热度',
          //   value:'transmitNum',
          //   sortClass: 'down',
          //   isActive: false
          // }
        ],
        classifiedCount: {}
      }
    },
    computed: {},
    watch: {
      activeName: {
        handler () {
          if (this.activeName == 'list1') {
            this.ajaxGetClassifiedCount()
          }
          this.reset()
        },
        immediate: true
      }
    },
    created () {
    },
    mounted () {
      this.select()
    },
    beforeDestroy () {
    },
    methods: {
      ajaxGetClassifiedCount () {
        getClassifiedCount().then(res => {
          this.classifiedCount = res
        })
      },
      select () {
        this.$emit('select', this.$data)
      },
      stockSelect () {
        this.stockShow = true
      },
      getCode (code, name) {
        this.securityName = ' ' + name
        this.securityCode = code
        this.stockShow = false
      },
      reset () {
        this.stockShow = false
        this.securityCode = ''
        this.securityName = ''
        this.keyWorld = ''
        this.publicSentimentType = ''
        this.keyWorldType = '1'
        this.mediaType = ''
        this.grouping = ''
        this.datePicker = [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')]
        this.sentimentType = []
        this.orderField = [
          {
            label: '时间',
            value: 'publishTime',
            sortClass: 'down',
            isActive: true
          },
          {
            label: '转发',
            value: 'transmitNum',
            sortClass: 'down',
            isActive: false
          },
          {
            label: '媒体',
            value: 'transmitMediaNum',
            sortClass: 'down',
            isActive: false
          },
          {
            label: '评论',
            value: 'commentNum',
            sortClass: 'down',
            isActive: false
          },
          // {
          //   label: '热度',
          //   value:'transmitNum',
          //   sortClass: 'down',
          //   isActive: false
          // }
        ]
        this.classifiedCount = {}
      },
      handlerSort (index) {
        for (let key of this.orderField) {
          if (key.label != this.orderField[index].label) {
            key.sortClass = 'down'
            key.isActive = false
          }
        }
        if (this.orderField[index].isActive) {
          this.orderField[index].sortClass = this.orderField[index].sortClass == 'up' ? 'down' : 'up'
        }
        this.orderField[index].isActive = true
      }
    }
  }
</script>

<style lang="less" scoped>
    .content-header {
        position: relative;
        .form {
            margin-top: 20px;
        }
        .display-list1 {
            margin-top: 20px;
            label {
                cursor: pointer;
                padding: 0 10px;
                i {
                    margin-left: 5px;
                }
            }
            .label-color {
                color: #1b5eed;
            }
        }
    }
</style>